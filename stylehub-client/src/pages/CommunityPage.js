import React, { useState, useEffect } from 'react';
import PostCard from '../components/PostCard';
import { fetchPosts, createPost, addComment, submitReview } from '../api/communityService';
import { 
    Box, Typography, Button, Grid, Paper, TextField, CircularProgress, AppBar, Toolbar, Avatar, List, ListItem, ListItemText, Modal, Select, MenuItem, InputLabel, FormControl 
} from '@mui/material';
import { pageSx, paperSx, COLOR_PRIMARY_BLUE, COLOR_TEXT_DARK } from '../styles/theme';

const initialPosts = [
  {
    id: 1,
    title: "Critique my magic system: 'The Aetherial Weave'",
    content: "I've designed a hard magic system based on emotional resonance and channeled through specific crystals. Users require intense focus and a proportional emotional cost. Looking for feedback on potential loopholes and balance issues.",
    user: 'u/ArcaneArchitect',
    time: '2 hours ago',
    votes: 452,
    comments: 67,
    flair: { text: 'Magic System', color: '#e9d5ff', text_color: '#5b21b6' },
  },
  {
    id: 2,
    title: 'Need help naming my high-fantasy continent!',
    content: "It's a sprawling landmass split by a massive volcanic mountain range, with tropical jungles to the west and frozen tundras to the east. So far I have 'Aethel' and 'Drakenheim' but neither feels right.",
    user: 'u/MapMakerMike',
    time: '5 hours ago',
    votes: 121,
    comments: 34,
    flair: { text: 'Naming/Geography', color: '#dcfce7', text_color: '#166534' },
  },
];

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

export default function CommunityPage() {
  const [posts, setPosts] = useState(initialPosts);
  const [openComments, setOpenComments] = useState(null);
  const [showReview, setShowReview] = useState(false);
  const [activePost, setActivePost] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchPosts();
        if (Array.isArray(data)) setPosts(data);
      } catch (err) {
        // fallback to mock data
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleVote = (id, delta) => {
    setPosts((prev) => prev.map(p => p.id === id ? { ...p, votes: p.votes + delta } : p));
  };

  const toggleComments = (id) => {
    setOpenComments(openComments === id ? null : id);
  };

  const openReview = (post) => {
    setActivePost(post);
    setShowReview(true);
  };

    const handleCreatePost = async () => {
        const el = document.getElementById('new-post-input');
        if (!el || !el.value.trim()) return;
        const payload = { title: el.value.slice(0, 200), content: '', flair: null };
        const temp = { id: Date.now(), title: payload.title, content: '', user: 'You', time: 'Just now', votes: 0, comments: 0 };
        setPosts(p => [temp, ...p]);
        el.value = '';
        try {
          const created = await createPost(payload);
          setPosts(prev => prev.map(x => x.id === temp.id ? created : x));
        } catch (err) {
          setPosts(prev => prev.filter(x => x.id !== temp.id));
          alert('Failed to create post');
        }
    }

  const submitComment = (postId) => {
    if (!newComment.trim()) return;
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: p.comments + 1 } : p));
    const body = { content: newComment };
    setNewComment('');
    addComment(postId, body).catch(() => {
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: Math.max(0, p.comments - 1) } : p));
    });
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const rating = form.querySelector('select')?.value || 5;
    const content = form.querySelector('textarea')?.value || '';
    const payload = {
      subjectType: 'post',
      subjectId: activePost.id,
      rating: Number(rating),
      content,
    };
    setPosts(prev => prev.map(p => p.id === activePost.id ? { ...p, comments: p.comments + 1 } : p));
    submitReview(payload).catch(() => {
      setPosts(prev => prev.map(p => p.id === activePost.id ? { ...p, comments: Math.max(0, p.comments - 1) } : p));
    });
    setShowReview(false);
    setActivePost(null);
  };

  return (
    <Box sx={pageSx}>
      <AppBar position="sticky" sx={{...paperSx, background: 'rgba(0, 0, 0, 0.7)', mb: 2}}>
        <Toolbar>
          <Typography variant="h6" sx={{ color: COLOR_PRIMARY_BLUE, fontWeight: 'bold' }}>
            StyleHub Community
          </Typography>
          <Box sx={{ flexGrow: 1, mx: 2 }}>
            <TextField fullWidth variant="outlined" size="small" placeholder="Search community" />
          </Box>
          <Button variant="contained" sx={{backgroundColor: COLOR_PRIMARY_BLUE, mr: 2}}>Create Post</Button>
          <Avatar>JD</Avatar>
        </Toolbar>
      </AppBar>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{...paperSx, p:2, mb: 2}}>
            <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                <Avatar>JD</Avatar>
                <TextField id="new-post-input" fullWidth variant="outlined" placeholder="Create Post" />
                <Button onClick={handleCreatePost}>Post</Button>
            </Box>
          </Paper>

          {loading ? <CircularProgress /> : (
            posts.map(post => (
              <Box key={post.id}>
                <PostCard post={post} onVote={handleVote} onToggleComments={toggleComments} onOpenReview={openReview} />
                {openComments === post.id && (
                  <Paper sx={{...paperSx, p: 2, mb: 2}}>
                     <Typography variant="body2" color="text.secondary">Comments (placeholder)</Typography>
                     <Box sx={{display: 'flex', gap: 1, mt: 1}}>
                        <TextField value={newComment} onChange={(e) => setNewComment(e.target.value)} fullWidth size="small" placeholder="Write a comment" />
                        <Button variant="contained" onClick={() => submitComment(post.id)}>Reply</Button>
                     </Box>
                  </Paper>
                )}
              </Box>
            ))
          )}
        </Grid>
        
        <Grid item xs={12} md={4}>
            <Paper sx={{...paperSx, p: 2, mb: 2}}>
                <Typography variant="h6" sx={{fontWeight: 'bold', color: COLOR_TEXT_DARK, mb: 1}}>About Community</Typography>
                <Typography variant="body2" color="text.secondary" sx={{mb: 2}}>A space to discuss services, products and worldbuilding topics related to StyleHub.</Typography>
                <List dense>
                    <ListItem><ListItemText primary="Members" secondary="452,198" /></ListItem>
                    <ListItem><ListItemText primary="Online Now" secondary="5,823" /></ListItem>
                </List>
                <Button fullWidth variant="contained" sx={{backgroundColor: COLOR_PRIMARY_BLUE, mt: 1}}>Join Community</Button>
            </Paper>
             <Paper sx={{...paperSx, p: 2}}>
                <Typography variant="h6" sx={{fontWeight: 'bold', color: COLOR_TEXT_DARK, mb: 1}}>Trending</Typography>
                <List dense>
                    <ListItem button><ListItemText primary="#MapMonday" /></ListItem>
                    <ListItem button><ListItemText primary="Deep Dive: FTL Travel" /></ListItem>
                    <ListItem button><ListItemText primary="Best Villain Archetypes" /></ListItem>
                </List>
            </Paper>
        </Grid>
      </Grid>

      <Modal open={showReview} onClose={() => setShowReview(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2">Leave a review for: {activePost?.title}</Typography>
          <Box component="form" onSubmit={handleReviewSubmit} sx={{ mt: 2 }}>
            <FormControl fullWidth sx={{mb: 2}}>
                <InputLabel>Rating</InputLabel>
                <Select label="Rating" defaultValue={5}>
                    <MenuItem value={5}>5 Stars</MenuItem>
                    <MenuItem value={4}>4 Stars</MenuItem>
                    <MenuItem value={3}>3 Stars</MenuItem>
                    <MenuItem value={2}>2 Stars</MenuItem>
                    <MenuItem value={1}>1 Star</MenuItem>
                </Select>
            </FormControl>
            <TextField label="Review" multiline rows={4} fullWidth required />
            <Box sx={{mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1}}>
                <Button onClick={() => setShowReview(false)}>Cancel</Button>
                <Button type="submit" variant="contained">Submit</Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
