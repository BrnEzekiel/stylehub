import React from 'react';
import { Link } from 'react-router-dom';
import { Paper, Typography, Box } from '@mui/material';
import {
    COLOR_PRIMARY_BLUE, COLOR_TEXT_DARK,
    COLOR_BACKGROUND_LIGHT, NEU_RAISED_SHADOW, NEU_PRESSED_SHADOW
} from '../styles/theme';

const StatCard = ({ title, value, icon, linkTo }) => {

    const content = (
        <Paper sx={{...paperSx, textDecoration: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: 140, cursor: linkTo ? 'pointer' : 'default', transition: 'all 0.2s ease-in-out', '&:hover': {transform: 'none'}}}>
            <Box sx={{fontSize: '3rem', mb: 1}}>
                {icon}
            </Box>
            {value ? (
                <>
                    <Typography variant="body2" color="text.secondary" sx={{mb: 0.5}}>{title}</Typography>
                    <Typography variant="h5" sx={{fontWeight: 'bold', color: COLOR_TEXT_DARK}}>{value}</Typography>
                </>
            ) : (
                <Typography variant="h6" sx={{fontWeight: 'bold', color: COLOR_TEXT_DARK}}>
                    {title}
                </Typography>
            )}
        </Paper>
    );

    return linkTo ? <Link to={linkTo} style={{textDecoration: 'none'}}>{content}</Link> : content;
};

export default StatCard;
