// src/components/DIYPostCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Paper, Box, Typography, Button, Avatar, IconButton, Chip } from '@mui/material';
import { Favorite, Comment, Delete, Image, Videocam } from '@mui/icons-material';
import { paperSx, COLOR_PRIMARY_BLUE, COLOR_TEXT_DARK } from '../styles/theme';

const DIYPostCard = ({ post, user, handleLike, handleDeletePost }) => {
  const postDate = new Date(post.createdAt);
  const formattedDate = postDate.toLocaleDateString(
    undefined,
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
  ) + ' ' + postDate.toLocaleTimeString(
    undefined,
    {
      hour: '2-digit',
      minute: '2-digit',
    }
  );

  return (
    <Paper sx={{ ...paperSx, p: 2, mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
        <Avatar sx={{ bgcolor: COLOR_PRIMARY_BLUE, mr: 2 }}>
          {post.user?.name?.charAt(0).toUpperCase() || 'U'}
        </Avatar>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{post.user?.name || 'Anonymous'}</Typography>
          <Typography variant="caption" color="text.secondary">{formattedDate}</Typography>
        </Box>
        {user && post.userId === user.id && (
          <IconButton color="error" onClick={() => handleDeletePost(post.id)}>
            <Delete />
          </IconButton>
        )}
      </Box>
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, color: COLOR_TEXT_DARK }}>{post.title}</Typography>
      {post.topic && <Chip label={post.topic} size="small" sx={{ mb: 1 }} />} {/* Display topic here */}
      {post.content && <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{post.content}</Typography>}
      {post.imageUrl && (
        <Box component="img" src={post.imageUrl} alt={post.title} sx={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 1, mb: 2 }} />
      )}
      {post.videoUrl && (
        <Box component="video" src={post.videoUrl} controls sx={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 1, mb: 2 }} />
      )}
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button size="small" startIcon={<Favorite />} onClick={() => handleLike(post.id)}>{post.likes || 0} Likes</Button>
        <Button size="small" startIcon={<Comment />} component={Link} to={`/posts/${post.id}/comments`}>Comments ({post._count?.comments || 0})</Button>
      </Box>
    </Paper>
  );
};

export default DIYPostCard;
