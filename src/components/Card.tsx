import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    variant?: 'glass' | 'solid';
    hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
    children,
    className = '',
    onClick,
    variant = 'glass',
    hover = true
}) => {
    const baseClass = variant === 'glass' ? 'glass-card' : 'solid-card';

    return (
        <motion.div
            whileHover={hover ? { y: -4 } : {}}
            onClick={onClick}
            className={`${baseClass} ${onClick ? 'cursor-pointer' : ''} ${className}`}
        >
            {children}
        </motion.div>
    );
};
