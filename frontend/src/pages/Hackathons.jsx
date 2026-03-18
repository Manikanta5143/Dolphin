import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  BookmarkIcon,
  ClockIcon,
  MapPinIcon,
  GlobeAltIcon,
  BuildingOfficeIcon,
  ComputerDesktopIcon,
  CalendarIcon,
  TagIcon,
  StarIcon,
  TrophyIcon,
  FireIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import LoadingSkeleton, { EventCardSkeleton } from '../components/LoadingSkeleton';

const Hackathons = () => {
  const { user } = useAuth();
  const [hackathons, setHackathons] = useState([]);
  const [filteredHackathons, setFilteredHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    organizers: [],
    mode: [],
    scope: [],
    difficulty: [],
    status: []
  });
  const [selectedFilters, setSelectedFilters] = useState({
    organizers: [],
    mode: [],
    scope: [],
    difficulty: [],
    status: []
  });

  // Sample hackathon data (in real app, this would come from API)
  const sampleHackathons = [
    {
      id: 1,
      title: "Google Developer Student Clubs Solution Challenge 2024",
      organizer: "Google",
      date: "2024-04-15",
      deadline: "2024-04-10",
      location: "Global",
      mode: "online",
      scope: "international",
      difficulty: "intermediate",
      status: "open",
      tags: ["Google", "Student", "Innovation", "Technology"],
      description: "Build solutions for local community problems using Google technologies. Win prizes up to $50,000 and mentorship opportunities.",
      link: "https://developers.google.com/community/gdsc/events/solution-challenge",
      isBookmarked: false
    },
    {
      id: 2,
      title: "Microsoft Imagine Cup 2024",
      organizer: "Microsoft",
      date: "2024-05-20",
      deadline: "2024-05-15",
      location: "Seattle, WA",
      mode: "hybrid",
      scope: "international",
      difficulty: "advanced",
      status: "open",
      tags: ["Microsoft", "AI", "Cloud", "Innovation"],
      description: "The world's premier student technology competition. Build innovative solutions using Microsoft technologies.",
      link: "https://imaginecup.microsoft.com/",
      isBookmarked: false
    },
    {
      id: 3,
      title: "Meta Hacker Cup 2024",
      organizer: "Meta",
      date: "2024-08-15",
      deadline: "2024-08-01",
      location: "Menlo Park, CA",
      mode: "offline",
      scope: "international",
      difficulty: "advanced",
      status: "open",
      tags: ["Meta", "Algorithm", "Competitive Programming"],
      description: "Annual programming competition hosted by Meta. Solve algorithmic challenges and compete for prizes.",
      link: "https://www.facebook.com/hackercup/",
      isBookmarked: false
    },
    {
      id: 4,
      title: "AWS Build On 2024",
      organizer: "Amazon Web Services",
      date: "2024-06-10",
      deadline: "2024-06-05",
      location: "Online",
      mode: "online",
      scope: "international",
      difficulty: "intermediate",
      status: "open",
      tags: ["AWS", "Cloud", "Serverless", "Innovation"],
      description: "Build innovative solutions using AWS services. Focus on cloud-native applications and serverless architecture.",
      link: "https://aws.amazon.com/events/build-on/",
      isBookmarked: false
    },
    {
      id: 5,
      title: "Devpost Hackathon",
      organizer: "Devpost",
      date: "2024-07-20",
      deadline: "2024-07-15",
      location: "Online",
      mode: "online",
      scope: "international",
      difficulty: "beginner",
      status: "open",
      tags: ["Devpost", "Open Source", "Innovation"],
      description: "Join thousands of developers worldwide in this open hackathon. Build anything you can imagine.",
      link: "https://devpost.com/hackathons",
      isBookmarked: false
    },
    {
      id: 6,
      title: "HackerEarth Machine Learning Challenge",
      organizer: "HackerEarth",
      date: "2024-05-30",
      deadline: "2024-05-25",
      location: "Online",
      mode: "online",
      scope: "international",
      difficulty: "intermediate",
      status: "open",
      tags: ["Machine Learning", "AI", "Data Science"],
      description: "Solve real-world machine learning problems. Compete with data scientists worldwide.",
      link: "https://www.hackerearth.com/challenges/",
      isBookmarked: false
    },
    {
      id: 7,
      title: "MLH Local Hack Day: Build",
      organizer: "Major League Hacking",
      date: "2024-04-25",
      deadline: "2024-04-20",
      location: "Local Communities",
      mode: "offline",
      scope: "national",
      difficulty: "beginner",
      status: "open",
      tags: ["MLH", "Local", "Community", "Learning"],
      description: "Join your local developer community for a day of building, learning, and networking.",
      link: "https://localhackday.mlh.io/",
      isBookmarked: false
    },
    {
      id: 8,
      title: "AngelHack Global Hackathon Series",
      organizer: "AngelHack",
      date: "2024-06-30",
      deadline: "2024-06-25",
      location: "Multiple Cities",
      mode: "hybrid",
      scope: "international",
      difficulty: "intermediate",
      status: "open",
      tags: ["Startup", "Innovation", "Pitch", "Funding"],
      description: "Build innovative solutions and pitch to investors. Get funding and mentorship opportunities.",
      link: "https://angelhack.com/",
      isBookmarked: false
    },
    {
      id: 9,
      title: "HackMIT 2024",
      organizer: "MIT",
      date: "2024-09-15",
      deadline: "2024-09-01",
      location: "Cambridge, MA",
      mode: "offline",
      scope: "international",
      difficulty: "advanced",
      status: "open",
      tags: ["MIT", "University", "Innovation", "Technology"],
      description: "One of the most prestigious university hackathons. Join students from top universities worldwide.",
      link: "https://hackmit.org/",
      isBookmarked: false
    },
    {
      id: 10,
      title: "PennApps Hackathon",
      organizer: "University of Pennsylvania",
      date: "2024-08-25",
      deadline: "2024-08-15",
      location: "Philadelphia, PA",
      mode: "offline",
      scope: "international",
      difficulty: "intermediate",
      status: "open",
      tags: ["University", "Innovation", "Technology", "Networking"],
      description: "America's first student-run college hackathon. Build innovative solutions with students worldwide.",
      link: "https://pennapps.com/",
      isBookmarked: false
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setHackathons(sampleHackathons);
      setFilteredHackathons(sampleHackathons);
      setLoading(false);
      
      // Extract unique filter options
      const organizers = [...new Set(sampleHackathons.map(h => h.organizer))];
      const modes = [...new Set(sampleHackathons.map(h => h.mode))];
      const scopes = [...new Set(sampleHackathons.map(h => h.scope))];
      const difficulties = [...new Set(sampleHackathons.map(h => h.difficulty))];
      const statuses = [...new Set(sampleHackathons.map(h => h.status))];
      
      setFilters({
        organizers,
        mode: modes,
        scope: scopes,
        difficulty: difficulties,
        status: statuses
      });
    }, 1000);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, selectedFilters, hackathons]);

  const applyFilters = () => {
    let filtered = [...hackathons];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(hackathon =>
        hackathon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hackathon.organizer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hackathon.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Organizer filter
    if (selectedFilters.organizers.length > 0) {
      filtered = filtered.filter(hackathon =>
        selectedFilters.organizers.includes(hackathon.organizer)
      );
    }

    // Mode filter
    if (selectedFilters.mode.length > 0) {
      filtered = filtered.filter(hackathon =>
        selectedFilters.mode.includes(hackathon.mode)
      );
    }

    // Scope filter
    if (selectedFilters.scope.length > 0) {
      filtered = filtered.filter(hackathon =>
        selectedFilters.scope.includes(hackathon.scope)
      );
    }

    // Difficulty filter
    if (selectedFilters.difficulty.length > 0) {
      filtered = filtered.filter(hackathon =>
        selectedFilters.difficulty.includes(hackathon.difficulty)
      );
    }

    // Status filter
    if (selectedFilters.status.length > 0) {
      filtered = filtered.filter(hackathon =>
        selectedFilters.status.includes(hackathon.status)
      );
    }

    setFilteredHackathons(filtered);
  };

  const toggleFilter = (filterType, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter(item => item !== value)
        : [...prev[filterType], value]
    }));
  };

  const clearAllFilters = () => {
    setSelectedFilters({
      organizers: [],
      mode: [],
      scope: [],
      difficulty: [],
      status: []
    });
    setSearchTerm('');
  };

  const toggleBookmark = async (hackathonId) => {
    if (!user) {
      toast.error('Please login to bookmark hackathons');
      return;
    }

    try {
      const hackathon = hackathons.find(h => h.id === hackathonId);
      if (hackathon.isBookmarked) {
        // Remove bookmark
        setHackathons(prev => prev.map(h => 
          h.id === hackathonId ? { ...h, isBookmarked: false } : h
        ));
        toast.success('Bookmark removed');
      } else {
        // Add bookmark
        setHackathons(prev => prev.map(h => 
          h.id === hackathonId ? { ...h, isBookmarked: true } : h
        ));
        toast.success('Hackathon bookmarked');
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      toast.error('Failed to update bookmark');
    }
  };

  const getDaysUntilDeadline = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {/* Header Skeleton */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="animate-pulse">
                <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
                <div className="h-4 w-96 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            </div>
            
            {/* Search and Filters Skeleton */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="animate-pulse">
                <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded mb-4" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="h-10 bg-gray-200 dark:bg-gray-700 rounded" />
                  ))}
                </div>
              </div>
            </div>
            
            {/* Hackathons Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <EventCardSkeleton key={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center space-x-3">
              <ComputerDesktopIcon className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Hackathons</h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">Discover and participate in exciting hackathons</p>
              </div>
            </div>
            <div className="mt-4 lg:mt-0">
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{filteredHackathons.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Available Hackathons</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8"
        >
          {/* Search Bar */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search hackathons by name, organizer, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <FunnelIcon className="w-5 h-5 mr-2" />
              Filters
            </h3>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>

          {/* Active Filters */}
          {(Object.values(selectedFilters).some(f => f.length > 0) || searchTerm) && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm font-medium text-gray-700">Active filters:</span>
                {searchTerm && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                    Search: "{searchTerm}"
                    <button
                      onClick={() => setSearchTerm('')}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                )}
                {Object.entries(selectedFilters).map(([filterType, values]) =>
                  values.map(value => (
                    <span key={`${filterType}-${value}`} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800">
                      {filterType}: {value}
                      <button
                        onClick={() => toggleFilter(filterType, value)}
                        className="ml-2 text-gray-600 hover:text-gray-800"
                      >
                        ×
                      </button>
                    </span>
                  ))
                )}
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Clear all
                </button>
              </div>
            </div>
          )}

          {/* Filter Panel */}
          {showFilters && (
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {/* Organizers */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Organizers</h3>
                  <div className="space-y-2">
                    {filters.organizers.map(organizer => (
                      <label key={organizer} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedFilters.organizers.includes(organizer)}
                          onChange={() => toggleFilter('organizers', organizer)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{organizer}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Mode */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Mode</h3>
                  <div className="space-y-2">
                    {filters.mode.map(mode => (
                      <label key={mode} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedFilters.mode.includes(mode)}
                          onChange={() => toggleFilter('mode', mode)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700 capitalize">{mode}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Scope */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Scope</h3>
                  <div className="space-y-2">
                    {filters.scope.map(scope => (
                      <label key={scope} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedFilters.scope.includes(scope)}
                          onChange={() => toggleFilter('scope', scope)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700 capitalize">{scope}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Difficulty */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Difficulty</h3>
                  <div className="space-y-2">
                    {filters.difficulty.map(difficulty => (
                      <label key={difficulty} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedFilters.difficulty.includes(difficulty)}
                          onChange={() => toggleFilter('difficulty', difficulty)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700 capitalize">{difficulty}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Status */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Status</h3>
                  <div className="space-y-2">
                    {filters.status.map(status => (
                      <label key={status} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedFilters.status.includes(status)}
                          onChange={() => toggleFilter('status', status)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700 capitalize">{status}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredHackathons.length} of {hackathons.length} hackathons
          </p>
        </div>

        {/* Hackathons Grid */}
        {filteredHackathons.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center py-16"
          >
            <ComputerDesktopIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No hackathons found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Try adjusting your search or filters</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedFilters({
                  organizers: [],
                  mode: [],
                  scope: [],
                  difficulty: [],
                  status: []
                });
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredHackathons.map((hackathon, index) => {
              const daysUntilDeadline = getDaysUntilDeadline(hackathon.deadline);
              const isUrgent = daysUntilDeadline <= 3 && daysUntilDeadline > 0;
              
              return (
                <motion.div
                  key={hackathon.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-white"
                >
                  {/* Header */}
                  <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                        {hackathon.title}
                      </h3>
                      {user && (
                        <button
                          onClick={() => toggleBookmark(hackathon.id)}
                          className="text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <BookmarkIcon className={`w-5 h-5 ${hackathon.isBookmarked ? 'text-blue-600 fill-current' : ''}`} />
                        </button>
                      )}
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <BuildingOfficeIcon className="w-4 h-4 mr-2" />
                      {hackathon.organizer}
                    </div>

                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      {new Date(hackathon.date).toLocaleDateString()}
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {hackathon.tags.map(tag => (
                        <span key={tag} className="inline-block px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(hackathon.difficulty)}`}>
                        {hackathon.difficulty}
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(hackathon.status)}`}>
                        {hackathon.status}
                      </span>
                      {isUrgent && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Urgent
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-6">
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        {hackathon.mode === 'online' ? (
                          <ComputerDesktopIcon className="w-4 h-4 mr-2 text-green-500" />
                        ) : (
                          <MapPinIcon className="w-4 h-4 mr-2 text-blue-500" />
                        )}
                        {hackathon.location}
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <GlobeAltIcon className="w-4 h-4 mr-2" />
                        {hackathon.scope} scope
                      </div>

                      {isUrgent && (
                        <div className="flex items-center text-sm text-red-600 dark:text-red-400 font-medium">
                          <ClockIcon className="w-4 h-4 mr-2" />
                          {daysUntilDeadline} day{daysUntilDeadline !== 1 ? 's' : ''} left to register
                        </div>
                      )}
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                      {hackathon.description}
                    </p>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <a
                        href={hackathon.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        Register Now
                      </a>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Hackathons; 