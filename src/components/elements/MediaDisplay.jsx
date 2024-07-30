import React from 'react';

export const MediaDisplay = ({ mediaLink}) => {
  const getContentType = (url) => {
    const extension = url.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
      return 'image';
    } else if (['mp4', 'webm', 'ogg'].includes(extension)) {
      return 'video';
    } else if (['mp3', 'wav', 'ogg'].includes(extension)) {
      return 'audio';
    } else {
      return 'unknown';
    }
  };

  const contentType = getContentType(mediaLink);

  const renderMedia = () => {
    switch (contentType) {
      case 'image':
        return <img src={mediaLink} alt="Media" />;
      case 'video':
        return (
          <video controls width="400">
            <source src={mediaLink} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        );
      case 'audio':
        return (
          <audio controls>
            <source src={mediaLink} type="audio/mp3" />
            Your browser does not support the audio tag.
          </audio>
        );
      default:
        return <p>Unsupported media type</p>;
    }
  };

  return <div>{renderMedia()}</div>;
};
