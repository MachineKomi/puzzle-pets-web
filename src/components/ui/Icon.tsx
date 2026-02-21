import React from 'react';
import { getAssetUrl, AssetKey } from '../../assets';

interface IconProps {
    assetKey: AssetKey | string;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'none';
    className?: string;
    alt?: string;
}

export const Icon = ({ assetKey, size = 'md', className = '', alt = '' }: IconProps) => {
    const sizes = {
        none: '',
        sm: 'w-6 h-6',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
        xl: 'w-16 h-16',
    };

    const src = getAssetUrl(assetKey);

    const displayClass = size === 'none' ? 'block' : 'inline-block';

    return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            src={src}
            alt={alt || String(assetKey)}
            className={`${displayClass} object-contain ${sizes[size]} ${className}`}
            loading="lazy"
        />
    );
};
