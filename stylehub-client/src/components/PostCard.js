import React from 'react';
import { Paper, Box, Typography, IconButton, Button, Chip } from '@mui/material';
import { ArrowUpward, ArrowDownward, Comment, RateReview } from '@mui/icons-material';
import { paperSx, COLOR_PRIMARY_BLUE, COLOR_TEXT_DARK } from '../styles/theme';

export default function PostCard({ post, onVote, onToggleComments, onOpenReview }) {
  const handleUp = () => onVote(post.id, 1);
  const handleDown = () => onVote(post.id, -1);

  return (
    <Paper sx={{ ...paperSx, display: 'flex', p: 0, mb: 2 }}>
      {/* Vote Section */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 1, borderRight: '1px solid #ccc' }}>
        <IconButton onClick={handleUp} size="small">
          <ArrowUpward />
        </IconButton>
        <Typography variant="h6" sx={{ fontWeight: 'bold', my: 1 }}>{post.votes}</Typography>
        <IconButton onClick={handleDown} size="small">
          <ArrowDownward />
        </IconButton>
      </Box>

      {/* Content Section */}
      <Box sx={{ p: 2, flex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Posted by {post.user} • {post.time}
          </Typography>
          {post.flair && (
            <Chip label={post.flair.text} size="small" sx={{ ml: 1, backgroundColor: post.flair.color, color: post.flair.text_color }} />
          )}
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, color: COLOR_TEXT_DARK }}>
          {post.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {post.content}
        </Typography>
        <Box>
          <Button startIcon={<Comment />} onClick={() => onToggleComments(post.id)} sx={{ mr: 1, color: COLOR_PRIMARY_BLUE }}>
            {post.comments} Comments
          </Button>
          <Button startIcon={<RateReview />} onClick={() => onOpenReview(post)} sx={{ color: COLOR_PRIMARY_BLUE }}>
            Review
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}