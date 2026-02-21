import React from 'react';
import { getAssetUrl, AssetKey } from '../../assets';

interface IconProps {
    assetKey: AssetKey | string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
    alt?: string;
}

export const Icon = ({ assetKey, size = 'md', className = '', alt = '' }: IconProps) => {
    const sizes = {
        sm: 'w-6 h-6',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
        xl: 'w-16 h-16',
    };

    const src = getAssetUrl(assetKey);

    return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            src={src}
            alt={alt || String(assetKey)}
            className={`inline-block object-contain ${sizes[size]} ${className}`}
            loading="lazy"
        />
    );
};
