// src/pages/StyleDIYPage.js

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  getStyleDIYPosts,
  createStyleDIYPost,
  likeStyleDIYPost,
  deleteStyleDIYPost,
} from '../api/styleDIYService';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import {
  Box, Typography, Grid, Paper, TextField, Button, CircularProgress, Container, List, ListItem, ListItemText, ListItemAvatar, Avatar, IconButton, Input, Modal, Chip
} from '@mui/material';
import {
  Favorite, Comment, Share, Delete, Image, ShoppingBag, ThumbsUp, Person, Star, AddCircle, LocalFlorist, Spa, FaceRetouchingNatural, MedicalServices, HelpOutline, Info, Extension, Videocam, Add
} from '@mui/icons-material';
import { pageSx, paperSx, COLOR_PRIMARY_BLUE, COLOR_TEXT_DARK, COLOR_ACCENT_MAGENTA } from '../styles/theme';
import DIYPostCard from '../components/DIYPostCard';

function StyleDIYPage() {
  const { user, token } = useAuth();
  const { socket } = useSocket();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRecommendModal, setShowRecommendModal] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    productId: '',
    serviceId: '',
    image: null,
    video: null,
    topic: '',
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [filterTopic, setFilterTopic] = useState(''); // New state for filtering
  const [openCreatePostForm, setOpenCreatePostForm] = useState(false); // State to control Create Post Form Modal
  const navigate = useNavigate();

  useEffect(() => {
    loadPosts();

    if (socket) {
      socket.on('new_post', (post) => {
        setPosts((prevPosts) => [post, ...prevPosts]);
      });

      socket.on('new_comment', (comment) => {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === comment.postId
              ? { ...post, comments: [...(post.comments || []), comment], _count: { ...post._count, comments: (post._count?.comments || 0) + 1 } }
              : post
          )
        );      
      });

      return () => {
        socket.off('new_post');
        socket.off('new_comment');
      };
    }
  }, [socket]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = await getStyleDIYPosts({ limit: 20 });
      setPosts(data.posts || data || []);
    } catch (err) {
      setError(err.message || 'Failed to load posts.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!token) {
      alert('Please login to create a post.');
      return;
    }

    const title = newPost.title?.trim();
    if (!title) {
      alert('Please enter a title for your post.');
      return;
    }
    
    const topic = newPost.topic?.trim(); // Get topic

    try {
      const postData = {
        title: title,
        content: newPost.content?.trim() || undefined,
        productId: newPost.productId || undefined,
        serviceId: newPost.serviceId || undefined,
        image: newPost.image instanceof File ? newPost.image : undefined,
        video: newPost.video instanceof File ? newPost.video : undefined,
        topic: topic || undefined, // Include topic
      };

      await createStyleDIYPost(postData);
      setNewPost({ title: '', content: '', productId: '', serviceId: '', image: null, video: null, topic: '' }); // Clear topic
      setImagePreview(null);
      setVideoPreview(null);
      loadPosts();
      setOpenCreatePostForm(false); // Close the modal after successful post
      alert('Post created successfully!');
    } catch (err) {
      alert(`Failed to create post: ${err.message}`);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setNewPost({ ...newPost, image: file, video: null });
        setVideoPreview(null);
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
      } else {
        alert('Please select an image file.');
      }
    }
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('video/')) {
        setNewPost({ ...newPost, video: file, image: null });
        setImagePreview(null);
        const reader = new FileReader();
        reader.onloadend = () => setVideoPreview(reader.result);
        reader.readAsDataURL(file);
      } else {
        alert('Please select a video file.');
      }
    }
  };

  const handleLike = async (postId) => {
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      await likeStyleDIYPost(postId);
      loadPosts();
    } catch (err) {
      alert(`Failed to like post: ${err.message}`);
    } finally {
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      await deleteStyleDIYPost(postId);
      loadPosts();
      alert('Post deleted successfully.');
    } catch (err) {
      alert(`Failed to delete post: ${err.message}`);
    } finally {
    }
  };

  const topicHubs = [
    { key: 'skincare', title: 'Skincare & Beauty Tips', desc: 'Everyday routines, product tips, and expert advice', icon: <LocalFlorist /> },
    { key: 'reviews', title: 'Service Reviews', desc: 'Honest experiences with service providers', icon: <Comment /> },
    { key: 'marketplace', title: 'Product Talks', desc: 'Discussions about products on the marketplace', icon: <ShoppingBag /> },
    { key: 'updates', title: 'Glowist Updates', desc: 'Announcements and release notes', icon: <Star /> },
    { key: 'tech', title: 'Tech Corner', desc: 'App help, bug reports, and suggestions', icon: <Extension /> },
    { key: 'offtopic', title: 'Off-Topic Lounge', desc: 'A little space to be human', icon: <Favorite /> },
  ];

  const contributorsMap = posts.reduce((acc, p) => {
    const id = p.user?.id || 'anon';
    if (!acc[id]) acc[id] = { id, name: p.user?.name || p.user?.email || 'Anonymous', count: 0 };
    acc[id].count += 1;
    return acc;
  }, {});
  const contributors = Object.values(contributorsMap).sort((a, b) => b.count - a.count).slice(0, 6);

  if (loading) {
    return (
        <Box sx={{ ...pageSx, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress sx={{ color: COLOR_PRIMARY_BLUE }} />
            <Typography variant="h6" sx={{ ml: 2, color: COLOR_PRIMARY_BLUE }}>Loading posts...</Typography>
        </Box>
    );
  }

  if (error) { return <Box sx={pageSx}><Alert severity="error">{error}</Alert></Box>; }

  return (
    <Box sx={{ ...pageSx, paddingTop: '64px' }}>
      <Container maxWidth="lg"> {/* Reverted padding-bottom */}
        <Grid container spacing={3}>
          {/* Left column: Topic Hubs and Contributors */}
          <Grid item xs={12} md={4}>
            <Paper sx={{...paperSx, p: 2, mb: 3}}>
              <Typography variant="h5" sx={{fontWeight: 'bold', color: COLOR_TEXT_DARK, mb: 2}}>Topic Hubs</Typography>
              <Box sx={{ position: 'relative' }}> {/* Outer container for fade effect */}
                <Box sx={{
                  display: 'flex',
                  overflowX: 'auto', // Enable horizontal scrolling
                  flexWrap: 'nowrap', // Prevent chips from wrapping
                  '&::-webkit-scrollbar': { display: 'auto' }, // Show scrollbar
                  msOverflowStyle: 'auto', // IE and Edge
                  scrollbarWidth: 'auto', // Firefox
                  gap: 1, // Space between chips
                  pb: 1 // Padding at bottom for scroll visibility if needed
                }}>
                  {topicHubs.map((hub) => (
                    <Chip
                      key={hub.key}
                      label={hub.title}
                      icon={hub.icon}
                      onClick={() => setFilterTopic(hub.title)} // Filter by topic on click
                      color={filterTopic === hub.title ? "primary" : "default"} // Highlight selected
                      clickable
                    />
                  ))}
                </Box>
                {/* Left Fade */}
                <Box sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  bottom: 0,
                  width: '20px', // Width of the fade effect
                  background: 'linear-gradient(to right, rgba(255,255,255,1), rgba(255,255,255,0))',
                  pointerEvents: 'none', // Allow clicks to pass through
                  zIndex: 1,
                }} />
                {/* Right Fade */}
                <Box sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  bottom: 0,
                  width: '20px', // Width of the fade effect
                  background: 'linear-gradient(to left, rgba(255,255,255,1), rgba(255,255,255,0))',
                  pointerEvents: 'none', // Allow clicks to pass through
                  zIndex: 1,
                }} />
              </Box>
            </Paper>

            <Paper sx={{...paperSx, p: 2}}>
              <Typography variant="h5" sx={{fontWeight: 'bold', color: COLOR_TEXT_DARK, mb: 2}}>Top Members</Typography>
              <List disablePadding>
                {contributors.map((contributor) => (
                  <ListItem key={contributor.id}>
                    <ListItemAvatar><Avatar sx={{bgcolor: COLOR_ACCENT_MAGENTA}}>{contributor.name.charAt(0)}</Avatar></ListItemAvatar>
                    <ListItemText primary={contributor.name} secondary={`${contributor.count} posts`} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* Right column: Posts list */}
          <Grid item xs={12} md={8}>
            {token && ( // Conditional rendering for the Add Post Button
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <IconButton color="primary" onClick={() => setOpenCreatePostForm(true)} size="large">
                  <Add fontSize="large" />
                </IconButton>
              </Box>
            )}
            {/* Posts List */}
            <Box sx={{mb: 2}}>
              <TextField
                fullWidth
                label="Filter by Topic"
                value={filterTopic}
                onChange={(e) => setFilterTopic(e.target.value)}
                sx={{ mb: 2 }}
              />
            </Box>
            <Box>
              {posts
                .filter((post) =>
                  post.topic?.toLowerCase().includes(filterTopic.toLowerCase()) || filterTopic === ''
                )
                .map((post) => (
                <DIYPostCard
                  key={post.id}
                  post={post}
                  user={user}
                  handleLike={handleLike}
                  handleDeletePost={handleDeletePost}
                />
              ))}
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Create Post Modal */}
      {token && (
        <Modal
          open={openCreatePostForm}
          onClose={() => setOpenCreatePostForm(false)}
          aria-labelledby="create-post-modal-title"
          aria-describedby="create-post-modal-description"
        >
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
            ...paperSx, // Apply existing paper styles for consistency
          }}>
            <Typography variant="h5" id="create-post-modal-title" sx={{fontWeight: 'bold', color: COLOR_TEXT_DARK, mb: 2}}>Create a Post</Typography>
            <Box component="form" onSubmit={handleCreatePost} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                label="Title"
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                required
              />
              <TextField
                fullWidth
                label="Content"
                multiline
                rows={4}
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
              />
              <TextField // New TextField for topic
                fullWidth
                label="Topic"
                value={newPost.topic}
                onChange={(e) => setNewPost({ ...newPost, topic: e.target.value })}
                placeholder="e.g., Skincare, Haircare, Fashion"
              />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button variant="outlined" component="label" startIcon={<Image />}>
                  Upload Image
                  <Input type="file" accept="image/*" onChange={handleImageChange} sx={{ display: 'none' }} />
                </Button>
                <Button variant="outlined" component="label" startIcon={<Videocam />}>
                  Upload Video
                  <Input type="file" accept="video/*" onChange={handleVideoChange} sx={{ display: 'none' }} />
                </Button>
              </Box>
              {imagePreview && <Box component="img" src={imagePreview} sx={{maxWidth: '100%', height: 100, objectFit: 'cover'}}/>}
              {videoPreview && <Box component="video" src={videoPreview} controls sx={{maxWidth: '100%', height: 100, objectFit: 'cover'}}/>}
              <Button type="submit" variant="contained" sx={{ backgroundColor: COLOR_PRIMARY_BLUE }}>Post</Button>
            </Box>
          </Box>
        </Modal>
      )}
    </Box>
  );
}

export default StyleDIYPage;
