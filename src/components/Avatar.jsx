import React from 'react';
import md5 from 'md5';

import { useEffect, useState } from 'react';

const Avatar = ({ user, size = 'medium', className = '' }) => {
  const { avatar, avatar_url, email, name, username } = user || {};

  // Backend sometimes sends avatar field, sometimes avatar_url
  const finalAvatarUrl = avatar_url || avatar;

  // track a cache buster value that updates when the URL itself changes
  const [cacheBuster, setCacheBuster] = useState(Date.now());
  useEffect(() => {
    if (finalAvatarUrl) {
      setCacheBuster(Date.now());
    }
  }, [finalAvatarUrl]);
  
  const sizeMap = {
    small: 'w-8 h-8 text-xs',
    medium: 'w-12 h-12 text-sm',
    large: 'w-24 h-24 text-xl',
    xl: 'w-32 h-32 text-2xl'
  };

  const selectedSizeClass = sizeMap[size] || sizeMap.medium;

  // 1. Uploaded Avatar
  if (finalAvatarUrl && !finalAvatarUrl.includes('gravatar.com')) {
    return (
      <img 
        src={finalAvatarUrl ? `${finalAvatarUrl}${finalAvatarUrl.includes('?') ? '&' : '?'}cb=${cacheBuster}` : ''} 
        alt={name || 'Avatar'} 
        className={`${selectedSizeClass} rounded-full object-cover border-2 border-zinc-700 ${className}`}
        onError={(e) => { 
          // If image fails to load, we can't easily revert to Gravatar here without state
          // but we can at least hide the broken image
          e.target.style.display = 'none';
        }}
      />
    );
  }

  // 2. Gravatar fallback (or explicit Gravatar)
  if (email) {
    const hash = md5(email.trim().toLowerCase());
    const gravatarUrl = `https://www.gravatar.com/avatar/${hash}?d=identicon&s=200`;
    return (
      <img 
        src={gravatarUrl} 
        alt={name || 'Avatar'} 
        className={`${selectedSizeClass} rounded-full border-2 border-zinc-700 ${className}`}
      />
    );
  }

  // 3. Initials
  const displayName = name || username || 'User';
  const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  
  return (
    <div className={`${selectedSizeClass} rounded-full bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center text-white font-bold border-2 border-zinc-700 ${className}`}>
      {initials}
    </div>
  );
};

export default Avatar;
