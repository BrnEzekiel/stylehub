import React from 'react';
import { Link } from 'react-router-dom';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
// Removed theme constants import
// import {
//     COLOR_PRIMARY_BLUE, COLOR_ACCENT_MAGENTA, COLOR_ACCENT_YELLOW, COLOR_TEXT_DARK,
//     COLOR_BACKGROUND_LIGHT, NEU_RAISED_SHADOW, NEU_PRESSED_SHADOW
// } from '../styles/theme';

const StatCard = ({ title, value, icon, linkTo }) => {

    let iconColor = 'var(--color-secondary)';
    let titleColor = 'var(--color-text)';
    let hoverShadow = 'var(--shadow-hover)'; // Use hover shadow variable

    if (title.includes('Revenue') || title.includes('Paid')) {
        iconColor = 'var(--color-primary)';
    } else if (title.includes('Users') || title.includes('Owed')) {
        iconColor = 'var(--color-secondary)';
    } else if (title.includes('Products')) {
        iconColor = 'var(--color-accent)';
    }

    const cardStyles = {
        background: 'var(--color-bg)',
        border: 'none',
        borderRadius: '16px',
        boxShadow: 'var(--shadow-soft)',
        color: titleColor,
        textDecoration: 'none',
        minHeight: { xs: 120, md: 150 },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'var(--transition)', // Use transition variable
        '&:hover': {
            boxShadow: hoverShadow,
            transform: 'none',
        }
    };

    const cardContent = (
        <CardContent sx={{ p: 2.5, flexGrow: 1 }}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 1.5
                }}
            >
                <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 'medium', opacity: 0.7, textTransform: 'uppercase', letterSpacing: 0.5, color: titleColor }}
                >
                    {title}
                </Typography>
                {React.cloneElement(icon, { sx: { fontSize: 36, color: iconColor } })}
            </Box>
            <Typography
                variant="h4"
                component="div"
                sx={{ fontWeight: 'bold', color: 'var(--color-text)' }}
            >
                {value}
            </Typography>
        </CardContent>
    );

    return (
        <Grid item xs={12} sm={6} md={4}>
            {linkTo ? (
                <Card component={Link} to={linkTo} sx={cardStyles}>
                    {cardContent}
                </Card>
            ) : (
                <Card sx={cardStyles}>
                    {cardContent}
                </Card>
            )}
        </Grid>
    );
};

export default StatCard;
