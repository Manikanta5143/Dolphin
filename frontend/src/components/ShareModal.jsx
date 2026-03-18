import React, { useState } from 'react';
import { FaTimes, FaTwitter, FaFacebook, FaLinkedin, FaWhatsapp, FaEnvelope, FaLink, FaCopy } from 'react-icons/fa';
import { useShare } from '../context/ShareContext';
import toast from 'react-hot-toast';

const ShareModal = ({ eventId, eventTitle, eventUrl, onClose }) => {
  const [customMessage, setCustomMessage] = useState(`Check out this event: ${eventTitle}`);
  const [hashtags, setHashtags] = useState([]);
  const [mentions, setMentions] = useState([]);
  const [shareableLink, setShareableLink] = useState('');
  const { shareEvent, generateShareableLink } = useShare();

  React.useEffect(() => {
    const generateLink = async () => {
      try {
        const shareData = await generateShareableLink(eventId);
        setShareableLink(shareData.shareableLink);
      } catch (error) {
        console.error('Error generating shareable link:', error);
      }
    };
    generateLink();
  }, [eventId, generateShareableLink]);

  const shareOptions = [
    {
      platform: 'twitter',
      icon: <FaTwitter className="h-5 w-5" />,
      label: 'Twitter',
      color: 'text-blue-400',
      bgColor: 'hover:bg-blue-50'
    },
    {
      platform: 'facebook',
      icon: <FaFacebook className="h-5 w-5" />,
      label: 'Facebook',
      color: 'text-blue-600',
      bgColor: 'hover:bg-blue-50'
    },
    {
      platform: 'linkedin',
      icon: <FaLinkedin className="h-5 w-5" />,
      label: 'LinkedIn',
      color: 'text-blue-700',
      bgColor: 'hover:bg-blue-50'
    },
    {
      platform: 'whatsapp',
      icon: <FaWhatsapp className="h-5 w-5" />,
      label: 'WhatsApp',
      color: 'text-green-500',
      bgColor: 'hover:bg-green-50'
    },
    {
      platform: 'email',
      icon: <FaEnvelope className="h-5 w-5" />,
      label: 'Email',
      color: 'text-gray-600',
      bgColor: 'hover:bg-gray-50'
    }
  ];

  const handleShare = async (platform) => {
    try {
      await shareEvent({
        eventId,
        platform,
        customMessage,
        hashtags,
        mentions
      });

      // Generate platform-specific share URL
      const encodedUrl = encodeURIComponent(shareableLink);
      const encodedMessage = encodeURIComponent(customMessage);

      let shareUrl;
      switch (platform) {
        case 'twitter':
          shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedMessage}`;
          break;
        case 'facebook':
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
          break;
        case 'linkedin':
          shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
          break;
        case 'whatsapp':
          shareUrl = `https://wa.me/?text=${encodedMessage}%20${encodedUrl}`;
          break;
        case 'email':
          shareUrl = `mailto:?subject=${encodeURIComponent(eventTitle)}&body=${encodedMessage}%20${encodedUrl}`;
          break;
        default:
          shareUrl = shareableLink;
      }

      if (platform === 'email') {
        window.location.href = shareUrl;
      } else {
        window.open(shareUrl, '_blank', 'width=600,height=400');
      }

      toast.success(`Shared on ${shareOptions.find(opt => opt.platform === platform)?.label}!`);
      onClose();
    } catch (error) {
      console.error('Error sharing:', error);
      toast.error('Failed to share event');
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareableLink);
      toast.success('Link copied to clipboard!');
    } catch (error) {
      console.error('Error copying link:', error);
      toast.error('Failed to copy link');
    }
  };

  const addHashtag = (tag) => {
    const hashtag = tag.startsWith('#') ? tag : `#${tag}`;
    if (!hashtags.includes(hashtag)) {
      setHashtags([...hashtags, hashtag]);
    }
  };

  const removeHashtag = (tag) => {
    setHashtags(hashtags.filter(t => t !== tag));
  };

  const addMention = (mention) => {
    const mentionText = mention.startsWith('@') ? mention : `@${mention}`;
    if (!mentions.includes(mentionText)) {
      setMentions([...mentions, mentionText]);
    }
  };

  const removeMention = (mention) => {
    setMentions(mentions.filter(m => m !== mention));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Share Event</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <FaTimes className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Event Info */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900">{eventTitle}</h4>
            <p className="text-sm text-gray-600 mt-1">Share this event with your network</p>
          </div>

          {/* Custom Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom message (optional)
            </label>
            <textarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              rows={3}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Add a custom message..."
            />
          </div>

          {/* Hashtags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hashtags (optional)
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {hashtags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {tag}
                  <button
                    onClick={() => removeHashtag(tag)}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              placeholder="Add hashtag (press Enter)"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addHashtag(e.target.value.trim());
                  e.target.value = '';
                }
              }}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Mentions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mentions (optional)
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {mentions.map((mention) => (
                <span
                  key={mention}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                >
                  {mention}
                  <button
                    onClick={() => removeMention(mention)}
                    className="ml-1 text-green-600 hover:text-green-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              placeholder="Add mention (press Enter)"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addMention(e.target.value.trim());
                  e.target.value = '';
                }
              }}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Share Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Share on
            </label>
            <div className="grid grid-cols-2 gap-3">
              {shareOptions.map((option) => (
                <button
                  key={option.platform}
                  onClick={() => handleShare(option.platform)}
                  className={`flex items-center justify-center space-x-2 p-3 border border-gray-200 rounded-lg transition-colors duration-200 ${option.bgColor}`}
                >
                  <span className={option.color}>{option.icon}</span>
                  <span className="text-sm font-medium text-gray-700">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Copy Link */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Shareable link
            </label>
            <div className="flex">
              <input
                type="text"
                value={shareableLink}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50 text-sm"
              />
              <button
                onClick={handleCopyLink}
                className="px-3 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition-colors duration-200"
                title="Copy link"
              >
                <FaCopy className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;

