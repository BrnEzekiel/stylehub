// src/pages/PostCommentsPage.js

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { addStyleDIYComment, getStyleDIYPosts, deleteStyleDIYPost } from '../api/styleDIYService';
import { useAuth } from '../context/AuthContext';
import { 
    Box, Typography, Button, Paper, TextField, CircularProgress, Container, Grid, Avatar, List, ListItem, ListItemAvatar, ListItemText, Divider, Alert
} from '@mui/material';
import { Send, Reply, Edit, Delete, Comment } from '@mui/icons-material';
import { pageSx, paperSx, COLOR_PRIMARY_BLUE, COLOR_TEXT_DARK, COLOR_ACCENT_MAGENTA } from '../styles/theme';


function PostCommentsPage() {
  const { id: postId } = useParams();
  const { user, token } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [post, setPost] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState('');
  const [showCommentBox, setShowCommentBox] = useState(false);

  useEffect(() => {
    const loadComments = async () => {
      try {
        setLoading(true);
        const data = await getStyleDIYPosts({ limit: 1, postId });
        if (data && data.posts && data.posts.length > 0) {
          setPost(data.posts[0]);
          setComments(data.posts[0].comments || []);
        } else {
          setError('Post not found.');
        }
      } catch (err) {
        setError(err.message || 'Failed to load comments.');
      } finally {
        setLoading(false);
      }
    };
    loadComments();
  }, [postId]);

  const handleAddComment = async (parentCommentId = null) => {
    if (!token || !user || !user.id) {
      alert('Please login to add a comment with valid user data.');
      return;
    }
    if (!commentText.trim() && !editText.trim()) return;

    const content = editText.trim() || commentText.trim();
    try {
      console.log('Submitting comment with:', { postId, content, parentCommentId });
      await addStyleDIYComment(postId, { content, parentCommentId });
      setCommentText('');
      setEditText('');
      setReplyingTo(null);
      setEditingCommentId(null);

      const data = await getStyleDIYPosts({ limit: 1, postId });
      if (data && data.posts && data.posts.length > 0) {
        setComments(data.posts[0].comments || []);
      }
    } catch (err) {
      alert(`Failed to add comment: ${err.message}`);
    }
  };
  
    const handleReply = (commentId) => {
        setReplyingTo(commentId);
        setEditText('');
        setShowCommentBox(true);
    };

    const handleEdit = (commentId, content) => {
        setEditingCommentId(commentId);
        setCommentText('');
        setEditText(content);
        setShowCommentBox(true);
        setReplyingTo(null);
    };


  const handleDelete = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    try {
      // Assuming a delete API function exists
      // await deleteStyleDIYComment(commentId);
      setComments(comments.filter(c => c.id !== commentId));
    } catch (err) {
      alert(`Failed to delete comment: ${err.message}`);
    }
  };

  if (loading) {
    return (
        <Box sx={{ ...pageSx, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress sx={{ color: COLOR_PRIMARY_BLUE }} />
            <Typography variant="h6" sx={{ ml: 2 }}>Loading comments...</Typography>
        </Box>
    );
  }

  if (error) { return <Box sx={pageSx}><Typography color="error">{error}</Typography></Box>; }

  return (
    <Box sx={pageSx}>
        <Container maxWidth="md" sx={{ pb: '180px' }}> {/* Adjusted padding-bottom to account for fixed comment box and bottom nav */}
            <Paper sx={{...paperSx, p: 3, mb: 3}}>
                 {post && (
                    <Box>
                        <ListItem alignItems="flex-start" disableGutters>
                            <ListItemAvatar>
                                <Avatar sx={{bgcolor: COLOR_PRIMARY_BLUE}}>{post.user?.name?.charAt(0).toUpperCase() || 'U'}</Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={<Typography sx={{fontWeight: 'bold'}}>{post.user?.name || 'Anonymous'}</Typography>}
                                secondary={`Posted on ${new Date(post.createdAt).toLocaleDateString()}`}
                            />
                        </ListItem>
                        <Typography variant="h4" sx={{fontWeight: 'bold', color: COLOR_TEXT_DARK, my: 2}}>{post.title}</Typography>
                        {post.content && <Typography>{post.content}</Typography>}
                    </Box>
                 )}
            </Paper>

            <Paper sx={{...paperSx, p: 3}}>
                <Typography variant="h5" sx={{fontWeight: 'bold', color: COLOR_TEXT_DARK, mb: 2}}>
                    <Comment sx={{verticalAlign: 'middle', mr: 1}}/>
                    Comments ({comments.length})
                </Typography>
                <List>
                    {comments.map((comment) => (
                        <React.Fragment key={comment.id}>
                            <ListItem alignItems="flex-start">
                                <ListItemAvatar>
                                    <Avatar sx={{bgcolor: COLOR_ACCENT_MAGENTA}}>{comment.user?.name?.charAt(0).toUpperCase() || 'U'}</Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={<>
                                        <Typography component="span" sx={{fontWeight: 'bold'}}>{comment.user?.name || 'Anonymous'}</Typography>
                                        <Typography component="span" variant="caption" sx={{ml: 1}}>{new Date(comment.createdAt).toLocaleString()}</Typography>
                                    </>}
                                    secondary={comment.content}
                                />
                            </ListItem>
                            <Box sx={{pl: 9, mb:1}}>
                                <Button size="small" startIcon={<Reply />} onClick={() => handleReply(comment.id)}>Reply</Button>
                                {user && user.id === comment.userId && <>
                                    <Button size="small" startIcon={<Edit />} onClick={() => handleEdit(comment.id, comment.content)}>Edit</Button>
                                    <Button size="small" color="error" startIcon={<Delete />} onClick={() => handleDelete(comment.id)}>Delete</Button>
                                </>}
                            </Box>
                            <Divider variant="inset" component="li" />
                        </React.Fragment>
                    ))}
                </List>
                {!comments.length && <Typography sx={{textAlign: 'center', p: 3}} color="text.secondary">No comments yet. Be the first to comment!</Typography>}
            </Paper>
        </Container>
        {/* Fixed Comment Box */}
        {token && (
            <Box sx={{
                position: 'fixed',
                bottom: '64px', /* Adjusted to sit above bottom navigation */
                left: 0,
                right: 0,
                zIndex: 9999,
                background: 'rgba(255, 255, 255, 0.08)', // Glassmorphism background
                backdropFilter: 'blur(40px)', // Apply blur
                WebkitBackdropFilter: 'blur(40px)', // For Safari
                p: 2, // Padding inside the fixed box
                borderTop: '1px solid',
                borderColor: 'divider',
                boxShadow: 3, // Optional: add a shadow
            }}>
                <Container maxWidth="md">
                    {replyingTo && <Alert severity="info" onClose={() => setReplyingTo(null)} sx={{mb: 2}}>Replying to {comments.find(c => c.id === replyingTo)?.user?.name || 'user'}</Alert>}
                    {editingCommentId && <Alert severity="info" onClose={() => setEditingCommentId(null)} sx={{mb: 2}}>Editing your comment</Alert>}
                    <Box sx={{display: 'flex', gap: 2, alignItems: 'center'}}>
                        <Avatar sx={{bgcolor: COLOR_PRIMARY_BLUE}}>{user?.name?.charAt(0).toUpperCase() || 'U'}</Avatar>
                        <TextField 
                            fullWidth
                            multiline
                            maxRows={4} // Limit max rows for flexibility without infinite growth
                            value={editingCommentId ? editText : commentText}
                            onChange={(e) => editingCommentId ? setEditText(e.target.value) : setCommentText(e.target.value)}
                            placeholder="Share your thoughts..."
                        />
                         <Button variant="contained" endIcon={<Send />} onClick={() => handleAddComment(replyingTo)}>
                            {editingCommentId ? 'Update' : 'Post'}
                         </Button>
                    </Box>
                </Container>
            </Box>
        )}
    </Box>
  );
}

export default PostCommentsPage;
