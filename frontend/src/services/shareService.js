import api from './api';

const shareService = {
  /**
   * Track a share event
   * @param {string} eventId - Event ID
   * @param {string} platform - Sharing platform
   * @param {Object} metadata - Additional metadata
   * @returns {Promise<Object>} Track response
   */
  async trackShare(eventId, platform, metadata = {}) {
    try {
      const response = await api.post('/events/share', {
        eventId,
        platform,
        metadata
      });
      return response.data;
    } catch (error) {
      console.error('Error tracking share:', error);
      // Don't throw error for analytics - it shouldn't break the user experience
      return { success: false };
    }
  },

  /**
   * Get share statistics for an event
   * @param {string} eventId - Event ID
   * @returns {Promise<Object>} Share stats response
   */
  async getShareStats(eventId) {
    try {
      const response = await api.get(`/events/${eventId}/shares`);
      return response.data;
    } catch (error) {
      console.error('Error getting share stats:', error);
      throw error;
    }
  },

  /**
   * Generate shareable link with UTM parameters
   * @param {string} eventId - Event ID
   * @param {string} source - Source of the share (e.g., 'homepage', 'event_detail')
   * @returns {string} Shareable URL with UTM parameters
   */
  generateShareableLink(eventId, source = 'direct') {
    const baseUrl = `${window.location.origin}/events/${eventId}`;
    const utmParams = new URLSearchParams({
      utm_source: 'event_aggregator',
      utm_medium: 'social',
      utm_campaign: 'event_sharing',
      utm_content: source
    });
    
    return `${baseUrl}?${utmParams.toString()}`;
  },

  /**
   * Generate social media share text
   * @param {Object} event - Event object
   * @param {string} platform - Social platform
   * @returns {string} Formatted share text
   */
  generateShareText(event, platform = 'general') {
    const hashtags = event.tags ? event.tags.map(tag => `#${tag.replace(/\s+/g, '')}`).join(' ') : '';
    const eventType = event.type.replace('_', ' ').toLowerCase();
    
    const baseText = `Check out this ${eventType}: ${event.title}`;
    
    switch (platform) {
      case 'twitter':
        // Twitter has character limit
        const twitterText = `${baseText} ${hashtags}`.substring(0, 240);
        return twitterText.length < 240 ? twitterText : baseText;
      
      case 'linkedin':
        return `${baseText}\n\n${event.description?.substring(0, 200)}...\n\n${hashtags}`;
      
      case 'facebook':
        return `${baseText}\n\n${event.description?.substring(0, 300)}...\n\n${hashtags}`;
      
      case 'whatsapp':
      case 'telegram':
        return `${baseText}\n\n${event.description}\n\n${hashtags}`;
      
      default:
        return `${baseText}\n\n${event.description}\n\n${hashtags}`;
    }
  },

  /**
   * Check if native sharing is supported
   * @returns {boolean} Whether native sharing is supported
   */
  isNativeShareSupported() {
    return navigator.share && navigator.canShare;
  },

  /**
   * Check if clipboard API is supported
   * @returns {boolean} Whether clipboard API is supported
   */
  isClipboardSupported() {
    return navigator.clipboard && navigator.clipboard.writeText;
  },

  /**
   * Copy text to clipboard with fallback
   * @param {string} text - Text to copy
   * @returns {Promise<boolean>} Whether copy was successful
   */
  async copyToClipboard(text) {
    try {
      if (this.isClipboardSupported()) {
        await navigator.clipboard.writeText(text);
        return true;
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        return successful;
      }
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      return false;
    }
  },

  /**
   * Get social media platform info
   * @param {string} platform - Platform name
   * @returns {Object} Platform information
   */
  getPlatformInfo(platform) {
    const platforms = {
      twitter: {
        name: 'Twitter',
        icon: '𝕏',
        color: 'bg-blue-400',
        url: 'https://twitter.com/intent/tweet'
      },
      linkedin: {
        name: 'LinkedIn',
        icon: 'in',
        color: 'bg-blue-600',
        url: 'https://www.linkedin.com/sharing/share-offsite'
      },
      facebook: {
        name: 'Facebook',
        icon: 'f',
        color: 'bg-blue-600',
        url: 'https://www.facebook.com/sharer/sharer.php'
      },
      whatsapp: {
        name: 'WhatsApp',
        icon: 'W',
        color: 'bg-green-500',
        url: 'https://wa.me'
      },
      telegram: {
        name: 'Telegram',
        icon: 'T',
        color: 'bg-blue-500',
        url: 'https://t.me/share/url'
      }
    };
    
    return platforms[platform] || null;
  }
};

export default shareService;
