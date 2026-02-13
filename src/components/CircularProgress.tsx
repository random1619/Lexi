import React from 'react';

interface CircularProgressProps {
    size?: number;
    strokeWidth?: number;
    percentage?: number;
    color?: string;
    trackColor?: string;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
    size = 40,
    strokeWidth = 3,
    percentage = 100,
    color = 'var(--accent)',
    trackColor = 'rgba(255,255,255,0.1)'
}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="transform -rotate-90"
        >
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={trackColor}
                strokeWidth={strokeWidth}
                fill="none"
            />
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={color}
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
            />
        </svg>
    );
};
