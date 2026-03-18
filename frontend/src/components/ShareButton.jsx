import React, { useState } from 'react';
import { ShareIcon, LinkIcon, ClipboardIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const ShareButton = ({ 
  event, 
  variant = 'button',
  size = 'md',
  showText = true,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const shareData = {
    title: event.title,
    text: `Check out this ${event.type.replace('_', ' ').toLowerCase()}: ${event.title}`,
    url: `${window.location.origin}/events/${event._id}`
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        // Track share
        trackShare('native');
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error sharing:', error);
          toast.error('Failed to share');
        }
      }
    } else {
      setIsOpen(true);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareData.url);
      toast.success('Link copied to clipboard!');
      trackShare('copy');
    } catch (error) {
      console.error('Error copying link:', error);
      toast.error('Failed to copy link');
    }
  };

  const handleSocialShare = (platform) => {
    const encodedUrl = encodeURIComponent(shareData.url);
    const encodedText = encodeURIComponent(shareData.text);
    
    let shareUrl = '';
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
    trackShare(platform);
  };

  const trackShare = async (platform) => {
    try {
      // Track share in analytics
      if (window.gtag) {
        window.gtag('event', 'share', {
          method: platform,
          content_type: 'event',
          item_id: event._id
        });
      }
      
      // You could also send to your backend for analytics
      // await shareService.trackShare(event._id, platform);
    } catch (error) {
      console.error('Error tracking share:', error);
    }
  };

  const getSizeClasses = (size) => {
    switch (size) {
      case 'sm':
        return 'px-2 py-1 text-xs';
      case 'lg':
        return 'px-6 py-3 text-lg';
      default:
        return 'px-4 py-2 text-sm';
    }
  };

  const getVariantClasses = (variant) => {
    switch (variant) {
      case 'outline':
        return 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700';
      case 'ghost':
        return 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700';
      default:
        return 'bg-blue-600 text-white hover:bg-blue-700';
    }
  };

  if (variant === 'icon') {
    return (
      <button
        onClick={handleNativeShare}
        className={`p-2 rounded-lg transition-colors ${getVariantClasses('ghost')} ${className}`}
        title="Share event"
      >
        <ShareIcon className="w-5 h-5" />
      </button>
    );
  }

  return (
    <>
      <button
        onClick={handleNativeShare}
        className={`inline-flex items-center space-x-2 rounded-lg font-medium transition-colors ${getSizeClasses(size)} ${getVariantClasses(variant)} ${className}`}
      >
        <ShareIcon className="w-4 h-4" />
        {showText && <span>Share</span>}
      </button>

      {/* Share Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
              onClick={() => setIsOpen(false)}
            />
            
            <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Share Event
                  </h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-3">
                  {/* Copy Link */}
                  <button
                    onClick={handleCopyLink}
                    className="w-full flex items-center space-x-3 p-3 text-left rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <LinkIcon className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-900 dark:text-white">Copy Link</span>
                  </button>

                  {/* Social Platforms */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleSocialShare('twitter')}
                      className="flex items-center space-x-3 p-3 text-left rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="w-5 h-5 bg-blue-400 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">𝕏</span>
                      </div>
                      <span className="text-gray-900 dark:text-white">Twitter</span>
                    </button>

                    <button
                      onClick={() => handleSocialShare('linkedin')}
                      className="flex items-center space-x-3 p-3 text-left rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">in</span>
                      </div>
                      <span className="text-gray-900 dark:text-white">LinkedIn</span>
                    </button>

                    <button
                      onClick={() => handleSocialShare('facebook')}
                      className="flex items-center space-x-3 p-3 text-left rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">f</span>
                      </div>
                      <span className="text-gray-900 dark:text-white">Facebook</span>
                    </button>

                    <button
                      onClick={() => handleSocialShare('whatsapp')}
                      className="flex items-center space-x-3 p-3 text-left rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="w-5 h-5 bg-green-500 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">W</span>
                      </div>
                      <span className="text-gray-900 dark:text-white">WhatsApp</span>
                    </button>
                  </div>

                  {/* Telegram */}
                  <button
                    onClick={() => handleSocialShare('telegram')}
                    className="w-full flex items-center space-x-3 p-3 text-left rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="w-5 h-5 bg-blue-500 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">T</span>
                    </div>
                    <span className="text-gray-900 dark:text-white">Telegram</span>
                  </button>
                </div>

                {/* Event Preview */}
                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Preview:</div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {event.title}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {shareData.url}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ShareButton;