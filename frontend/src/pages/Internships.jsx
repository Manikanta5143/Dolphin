import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  BookmarkIcon,
  ClockIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  AcademicCapIcon,
  MapPinIcon,
  GlobeAltIcon,
  ComputerDesktopIcon,
  CalendarIcon,
  TagIcon,
  StarIcon,
  BriefcaseIcon,
  CogIcon,
  FireIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import LoadingSkeleton, { EventCardSkeleton } from '../components/LoadingSkeleton';

import {
  FaBell,
  FaFilter,
  FaSearch,
  FaTrash,
  FaCheck,
  FaExclamation,
  FaInfoCircle,
  FaTrophy,
  FaUsers,
  FaCalendar,
  FaRegBookmark,
  FaBookmark,
  FaBuilding,
  FaClock,
  FaMoneyBillWave
} from 'react-icons/fa';

import { MdAccessTime, MdComputer, MdLocationOn, MdWork } from 'react-icons/md';


const Internships = () => {
  const { user } = useAuth();
  const [internships, setInternships] = useState([]);
  const [filteredInternships, setFilteredInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filters, setFilters] = useState({
    companies: [],
    modes: [],
    types: [],
    sectors: [],
    durations: [],
    skills: []
  });
  const [selectedFilters, setSelectedFilters] = useState({
    companies: [],
    modes: [],
    types: [],
    sectors: [],
    durations: [],
    skills: []
  });

  // Sample internship data
  const sampleInternships = [
    {
      id: 1,
      title: "Software Engineering Intern",
      company: "Google",
      mode: "hybrid",
      type: "paid",
      sector: "private",
      duration: "3-6 months",
      deadline: "2024-03-15",
      stipend: "$8000/month",
      location: "Mountain View, CA",
      skills: ["JavaScript", "React", "Node.js", "Python"],
      description: "Join our engineering team to build scalable applications that impact billions of users worldwide.",
      link: "https://careers.google.com/jobs/results/",
      isBookmarked: false,
      badges: ["Popular", "Remote Friendly"],
      isUrgent: false
    },
    {
      id: 2,
      title: "Data Science Intern",
      company: "Microsoft",
      mode: "remote",
      type: "paid",
      sector: "private",
      duration: "3-6 months",
      deadline: "2024-02-28",
      stipend: "$7500/month",
      location: "Remote",
      skills: ["Python", "Machine Learning", "SQL", "Statistics"],
      description: "Work on cutting-edge AI and machine learning projects that shape the future of technology.",
      link: "https://careers.microsoft.com/us/en/search-results",
      isBookmarked: false,
      badges: ["Urgent", "Popular"],
      isUrgent: true
    },
    {
      id: 3,
      title: "Frontend Development Intern",
      company: "Meta",
      mode: "hybrid",
      type: "paid",
      sector: "private",
      duration: "3-6 months",
      deadline: "2024-04-10",
      stipend: "$7000/month",
      location: "Menlo Park, CA",
      skills: ["React", "JavaScript", "CSS", "TypeScript"],
      description: "Build user interfaces for products used by billions of people around the world.",
      link: "https://www.metacareers.com/jobs/",
      isBookmarked: false,
      badges: ["Popular"],
      isUrgent: false
    },
    {
      id: 4,
      title: "Cloud Engineering Intern",
      company: "Amazon Web Services",
      mode: "remote",
      type: "paid",
      sector: "private",
      duration: "3-6 months",
      deadline: "2024-03-20",
      stipend: "$6500/month",
      location: "Remote",
      skills: ["AWS", "Python", "Docker", "Kubernetes"],
      description: "Help build and maintain the world's most comprehensive cloud computing platform.",
      link: "https://www.amazon.jobs/en/teams/internships-for-students",
      isBookmarked: false,
      badges: ["Remote Friendly"],
      isUrgent: false
    },
    {
      id: 5,
      title: "AI Research Intern",
      company: "OpenAI",
      mode: "offline",
      type: "paid",
      sector: "private",
      duration: "3-6 months",
      deadline: "2024-02-25",
      stipend: "$8000/month",
      location: "San Francisco, CA",
      skills: ["Python", "Machine Learning", "Deep Learning", "Research"],
      description: "Contribute to cutting-edge AI research and help develop the next generation of AI systems.",
      link: "https://openai.com/careers",
      isBookmarked: false,
      badges: ["Urgent", "Research"],
      isUrgent: true
    },
    {
      id: 6,
      title: "Cybersecurity Intern",
      company: "CrowdStrike",
      mode: "hybrid",
      type: "paid",
      sector: "private",
      duration: "3-6 months",
      deadline: "2024-04-15",
      stipend: "$6000/month",
      location: "Sunnyvale, CA",
      skills: ["Cybersecurity", "Python", "Network Security", "Malware Analysis"],
      description: "Help protect organizations from cyber threats and develop security solutions.",
      link: "https://www.crowdstrike.com/careers/",
      isBookmarked: false,
      badges: ["Security"],
      isUrgent: false
    },
    {
      id: 7,
      title: "Product Management Intern",
      company: "Netflix",
      mode: "offline",
      type: "paid",
      sector: "private",
      duration: "3-6 months",
      deadline: "2024-03-30",
      stipend: "$7000/month",
      location: "Los Gatos, CA",
      skills: ["Product Management", "Data Analysis", "User Research", "Strategy"],
      description: "Help shape the future of entertainment by working on product strategy and user experience.",
      link: "https://jobs.netflix.com/",
      isBookmarked: false,
      badges: ["Popular"],
      isUrgent: false
    },
    {
      id: 8,
      title: "Government Technology Intern",
      company: "U.S. Digital Service",
      mode: "offline",
      type: "paid",
      sector: "government",
      duration: "3-6 months",
      deadline: "2024-04-20",
      stipend: "$5000/month",
      location: "Washington, DC",
      skills: ["Software Development", "Public Policy", "User-Centered Design"],
      description: "Help improve government services through technology and design thinking.",
      link: "https://www.usds.gov/join",
      isBookmarked: false,
      badges: ["Government", "Public Service"],
      isUrgent: false
    },
    {
      id: 9,
      title: "NGO Technology Intern",
      company: "UNICEF Innovation",
      mode: "remote",
      type: "unpaid",
      sector: "ngo",
      duration: "1-3 months",
      deadline: "2024-05-10",
      stipend: "Unpaid",
      location: "Remote",
      skills: ["Technology", "Social Impact", "Project Management"],
      description: "Use technology to create positive social impact and help children worldwide.",
      link: "https://www.unicef.org/innovation/",
      isBookmarked: false,
      badges: ["Social Impact", "Remote Friendly"],
      isUrgent: false
    },
    {
      id: 10,
      title: "Startup Engineering Intern",
      company: "Stripe",
      mode: "hybrid",
      type: "paid",
      sector: "private",
      duration: "3-6 months",
      deadline: "2024-03-10",
      stipend: "$7500/month",
      location: "San Francisco, CA",
      skills: ["Full Stack Development", "API Design", "Payment Systems"],
      description: "Help build the economic infrastructure for the internet at a fast-growing fintech company.",
      link: "https://stripe.com/jobs",
      isBookmarked: false,
      badges: ["Urgent", "Fintech"],
      isUrgent: true
    }
  ];

  // Popular skills and companies for suggestions
  const popularSkills = ["JavaScript", "Python", "React", "Node.js", "Machine Learning", "Data Science", "SQL", "Java", "C++", "AWS"];
  const popularCompanies = ["Google", "Microsoft", "Amazon", "Apple", "Meta", "Netflix", "Twitter", "Uber", "Airbnb", "Stripe"];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setInternships(sampleInternships);
      setFilteredInternships(sampleInternships);
      setLoading(false);

      // Extract unique filter options
      const companies = [...new Set(sampleInternships.map(i => i.company))];
      const modes = [...new Set(sampleInternships.map(i => i.mode))];
      const types = [...new Set(sampleInternships.map(i => i.type))];
      const sectors = [...new Set(sampleInternships.map(i => i.sector))];
      const durations = [...new Set(sampleInternships.map(i => i.duration))];
      const allSkills = sampleInternships.flatMap(i => i.skills);
      const skills = [...new Set(allSkills)];

      setFilters({
        companies,
        modes,
        types,
        sectors,
        durations,
        skills
      });
    }, 1000);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, selectedFilters, internships]);

  // Generate search suggestions
  useEffect(() => {
    if (searchTerm.length > 0) {
      const allSuggestions = [
        ...popularSkills.filter(skill =>
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        ),
        ...popularCompanies.filter(company =>
          company.toLowerCase().includes(searchTerm.toLowerCase())
        ),
        ...sampleInternships.filter(internship =>
          internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          internship.company.toLowerCase().includes(searchTerm.toLowerCase())
        ).map(i => i.title)
      ];

      setSuggestions([...new Set(allSuggestions)].slice(0, 8));
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm]);

  const applyFilters = () => {
    let filtered = [...internships];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(internship =>
        internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        internship.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        internship.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Company filter
    if (selectedFilters.companies.length > 0) {
      filtered = filtered.filter(internship =>
        selectedFilters.companies.includes(internship.company)
      );
    }

    // Mode filter
    if (selectedFilters.modes.length > 0) {
      filtered = filtered.filter(internship =>
        selectedFilters.modes.includes(internship.mode)
      );
    }

    // Type filter
    if (selectedFilters.types.length > 0) {
      filtered = filtered.filter(internship =>
        selectedFilters.types.includes(internship.type)
      );
    }

    // Sector filter
    if (selectedFilters.sectors.length > 0) {
      filtered = filtered.filter(internship =>
        selectedFilters.sectors.includes(internship.sector)
      );
    }

    // Duration filter
    if (selectedFilters.durations.length > 0) {
      filtered = filtered.filter(internship =>
        selectedFilters.durations.includes(internship.duration)
      );
    }

    // Skills filter
    if (selectedFilters.skills.length > 0) {
      filtered = filtered.filter(internship =>
        internship.skills.some(skill => selectedFilters.skills.includes(skill))
      );
    }

    setFilteredInternships(filtered);
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
      companies: [],
      modes: [],
      types: [],
      sectors: [],
      durations: [],
      skills: []
    });
    setSearchTerm('');
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
  };

  const toggleBookmark = async (internshipId) => {
    if (!user) {
      toast.error('Please login to bookmark internships');
      return;
    }

    try {
      const internship = internships.find(i => i.id === internshipId);
      if (internship.isBookmarked) {
        // Remove bookmark
        setInternships(prev => prev.map(i =>
          i.id === internshipId ? { ...i, isBookmarked: false } : i
        ));
        toast.success('Bookmark removed');
      } else {
        // Add bookmark
        setInternships(prev => prev.map(i =>
          i.id === internshipId ? { ...i, isBookmarked: true } : i
        ));
        toast.success('Internship bookmarked');
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

  const getTypeColor = (type) => {
    switch (type) {
      case 'paid': return 'bg-green-500/20 text-green-300 border border-green-500/30';
      case 'unpaid': return 'bg-red-500/20 text-red-300 border border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-100 border border-gray-500/30';
    }
  };

  const getSectorColor = (sector) => {
    switch (sector) {
      case 'private': return 'bg-blue-500/20 text-blue-300 border border-blue-500/30';
      case 'government': return 'bg-purple-500/20 text-purple-300 border border-purple-500/30';
      case 'ngo': return 'bg-orange-500/20 text-orange-300 border border-orange-500/30';
      default: return 'bg-gray-500/20 text-gray-100 border border-gray-500/30';
    }
  };

  const getModeColor = (mode) => {
    switch (mode) {
      case 'remote': return 'bg-teal-500/20 text-teal-300 border border-teal-500/30';
      case 'offline': return 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30';
      case 'hybrid': return 'bg-pink-500/20 text-pink-300 border border-pink-500/30';
      default: return 'bg-gray-500/20 text-gray-100 border border-gray-500/30';
    }
  };

  const getUrgentInternships = () => {
    return filteredInternships.filter(internship => {
      const daysUntilDeadline = getDaysUntilDeadline(internship.deadline);
      return daysUntilDeadline <= 7 && daysUntilDeadline > 0;
    });
  };

  if (loading) {
    return (
      <div className="relative min-h-screen py-8 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#020617]">
        <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-blue-500/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="space-y-6">
            {/* Header Skeleton */}
            <div className="bg-[#1e293b]/80 backdrop-blur-md border border-white/10 rounded-xl shadow-xl p-6">
              <div className="animate-pulse">
                <div className="h-8 w-64 bg-white/10 rounded mb-4" />
                <div className="h-4 w-96 bg-white/10 rounded" />
              </div>
            </div>

            {/* Search and Filters Skeleton */}
            <div className="bg-[#1e293b]/80 backdrop-blur-md border border-white/10 rounded-xl shadow-xl p-6">
              <div className="animate-pulse">
                <div className="h-10 w-full bg-white/10 rounded mb-4" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="h-10 bg-white/10 rounded" />
                  ))}
                </div>
              </div>
            </div>

            {/* Internships Grid Skeleton */}
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

  const urgentInternships = getUrgentInternships();

  return (
    <div className="relative min-h-screen py-8 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#020617]">
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-blue-500/10 to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          whileHover={{ scale: 1.05, y: -5 }}
          className="bg-gradient-to-br from-[#020617] via-[#0b1a3a] to-[#1d4ed8] backdrop-blur-md border border-white/10 rounded-xl shadow-xl p-6 mb-8 hover:border-white hover:shadow-[0_0_90px_rgba(59,130,246,0.35)]"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg shadow-lg shadow-blue-500/20">
                <BriefcaseIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Internships</h1>
                <p className="mt-2 text-gray-100">Find your perfect internship opportunity</p>
              </div>
            </div>
            <div className="mt-4 lg:mt-0">
              <div className="text-right">
                <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">{filteredInternships.length}</div>
                <div className="text-sm text-gray-200 font-medium tracking-wide uppercase">Available Internships</div>
              </div>
            </div>
          </div>
        </motion.div>
        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-[#1e293b]/80 backdrop-blur-md border border-white/10 rounded-xl shadow-xl p-6 mb-8"
        >
          {/* Search Bar */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-200" />
            </div>
            <input
              type="text"
              placeholder="Search internships by title, company, or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-lg leading-5 bg-black/20 backdrop-blur-sm text-white placeholder-gray-500  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />

            {/* Typeahead Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg shadow-lg">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-200  hover:bg-gray-100  focus:bg-gray-100  transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <FunnelIcon className="w-5 h-5 mr-2 text-blue-400" />
              Filters
            </h3>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors bg-blue-500/10 hover:bg-blue-500/20 rounded-lg"
            >
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>

          {/* Active Filters */}
          {(Object.values(selectedFilters).some(f => f.length > 0) || searchTerm) && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm font-medium text-gray-200">Active filters:</span>
                {searchTerm && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-500/20 text-blue-200 border border-blue-500/30">
                    Search: "{searchTerm}"
                    <button
                      onClick={() => setSearchTerm('')}
                      className="ml-2 text-blue-400 hover:text-blue-300"
                    >
                      ×
                    </button>
                  </span>
                )}
                {Object.entries(selectedFilters).map(([filterType, values]) =>
                  values.map(value => (
                    <span key={`${filterType}-${value}`} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-white/10 text-gray-200 border border-white/20">
                      {filterType}: {value}
                      <button
                        onClick={() => toggleFilter(filterType, value)}
                        className="ml-2 text-gray-200 hover:text-gray-200"
                      >
                        ×
                      </button>
                    </span>
                  ))
                )}
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-blue-400 hover:text-blue-300 font-medium"
                >
                  Clear all
                </button>
              </div>
            </div>
          )}

          {/* Filter Panel */}
          {showFilters && (
            <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Companies */}
                <div>
                  <h3 className="text-sm font-medium text-gray-100 mb-3 uppercase tracking-wider">Companies</h3>
                  <div className="space-y-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                    {filters.companies.map(company => (
                      <label key={company} className="flex items-center group cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedFilters.companies.includes(company)}
                          onChange={() => toggleFilter('companies', company)}
                          className="rounded border-white/20 bg-black/30 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-900"
                        />
                        <span className="ml-2 text-sm text-gray-200 group-hover:text-gray-200 transition-colors">{company}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Mode */}
                <div>
                  <h3 className="text-sm font-medium text-gray-100 mb-3 uppercase tracking-wider">Mode</h3>
                  <div className="space-y-2">
                    {filters.modes.map(mode => (
                      <label key={mode} className="flex items-center group cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedFilters.modes.includes(mode)}
                          onChange={() => toggleFilter('modes', mode)}
                          className="rounded border-white/20 bg-black/30 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-900"
                        />
                        <span className="ml-2 text-sm text-gray-200 group-hover:text-gray-200 transition-colors capitalize">{mode}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Type */}
                <div>
                  <h3 className="text-sm font-medium text-gray-100 mb-3 uppercase tracking-wider">Type</h3>
                  <div className="space-y-2">
                    {filters.types.map(type => (
                      <label key={type} className="flex items-center group cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedFilters.types.includes(type)}
                          onChange={() => toggleFilter('types', type)}
                          className="rounded border-white/20 bg-black/30 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-900"
                        />
                        <span className="ml-2 text-sm text-gray-200 group-hover:text-gray-200 transition-colors capitalize">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Sector */}
                <div>
                  <h3 className="text-sm font-medium text-gray-100 mb-3 uppercase tracking-wider">Sector</h3>
                  <div className="space-y-2">
                    {filters.sectors.map(sector => (
                      <label key={sector} className="flex items-center group cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedFilters.sectors.includes(sector)}
                          onChange={() => toggleFilter('sectors', sector)}
                          className="rounded border-white/20 bg-black/30 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-900"
                        />
                        <span className="ml-2 text-sm text-gray-200 group-hover:text-gray-200 transition-colors capitalize">{sector}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <h3 className="text-sm font-medium text-gray-100 mb-3 uppercase tracking-wider">Duration</h3>
                  <div className="space-y-2">
                    {filters.durations.map(duration => (
                      <label key={duration} className="flex items-center group cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedFilters.durations.includes(duration)}
                          onChange={() => toggleFilter('durations', duration)}
                          className="rounded border-white/20 bg-black/30 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-900"
                        />
                        <span className="ml-2 text-sm text-gray-200 group-hover:text-gray-200 transition-colors">{duration}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <h3 className="text-sm font-medium text-gray-100 mb-3 uppercase tracking-wider">Skills</h3>
                  <div className="space-y-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                    {filters.skills.map(skill => (
                      <label key={skill} className="flex items-center group cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedFilters.skills.includes(skill)}
                          onChange={() => toggleFilter('skills', skill)}
                          className="rounded border-white/20 bg-black/30 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-900"
                        />
                        <span className="ml-2 text-sm text-gray-200 group-hover:text-gray-200 transition-colors">{skill}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Urgent Internships Section */}
        {urgentInternships.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <span className="relative flex h-3 w-3 mr-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              Deadline Approaching
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {urgentInternships.slice(0, 3).map(internship => {
                const daysUntilDeadline = getDaysUntilDeadline(internship.deadline);
                return (
                  <div key={internship.id} className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)] transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-red-100 text-sm line-clamp-2">
                        {internship.title}
                      </h3>
                      <span className="text-xs bg-red-500/30 text-red-200 px-2 py-1 rounded-md border border-red-500/30">
                        {daysUntilDeadline} day{daysUntilDeadline !== 1 ? 's' : ''} left
                      </span>
                    </div>
                    <p className="text-sm text-red-200/70 mb-2">{internship.company}</p>
                    <a
                      href={internship.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-red-400 hover:text-red-300 font-medium inline-flex items-center group"
                    >
                      Apply Now <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="mb-7">
          <p className=" text-md font-large   text-white">
            Showing {filteredInternships.length} of {internships.length} internships
          </p>
        </div>

        {/* Internships Grid */}
        {filteredInternships.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center py-16"
          >
            <BriefcaseIcon className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No internships found</h3>
            <p className="text-gray-300  mb-6">Try adjusting your search or filters</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedFilters({
                  companies: [],
                  modes: [],
                  types: [],
                  sectors: [],
                  durations: [],
                  skills: []
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
            {filteredInternships.map((internship, index) => {
              const daysUntilDeadline = getDaysUntilDeadline(internship.deadline);
              const isUrgent = daysUntilDeadline <= 7 && daysUntilDeadline > 0;

              return (
                <motion.div
                  key={internship.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ duration: 0.05, ease: "easeOut" }}
                  className="bg-gradient-to-br from-[#020617] via-[#0b1a3a] to-[#1d4ed8] backdrop-blur-sm rounded-xl shadow-md 
transform transition-all duration-300 ease-out 
hover:scale-190 hover:-translate-y-2 
hover:shadow-[0_0_90px_rgba(59,130,246,0.35)] 
border border-white/50 hover:border-white
group flex flex-col relative overflow-hidden"
                >
                  {/* Header */}
                  <div className="p-6 border-b border-white/10 flex-1">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-white line-clamp-2">
                        {internship.title}
                      </h3>
                      {user && (
                        <button
                          onClick={() => toggleBookmark(internship.id)}
                          className="text-gray-200 hover:text-yellow-500 transition-colors"
                        >
                          {internship.isBookmarked ? <FaBookmark className="text-yellow-500" /> : <FaRegBookmark />}
                        </button>
                      )}
                    </div>

                    <div className="flex items-center text-sm text-white mb-2">
                      <FaBuilding className="mr-1" />
                      {internship.company}
                    </div>

                    <div className="flex items-center text-sm text-gray-100 mb-3">
                      <MdAccessTime className="mr-1" />
                      Deadline: {new Date(internship.deadline).toLocaleDateString()}
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(internship.type)}`}>
                        {internship.type}
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSectorColor(internship.sector)}`}>
                        {internship.sector}
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getModeColor(internship.mode)}`}>
                        {internship.mode}
                      </span>
                      {isUrgent && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-300 border border-red-500/30">
                          Urgent
                        </span>
                      )}
                    </div>

                    {/* Custom Badges */}
                    {internship.badges.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {internship.badges.map(badge => (
                          <span key={badge} className="inline-block px-2 py-1 text-xs bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-md">
                            {badge}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="p-6">
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-sm text-gray-100">
                        {internship.mode === 'remote' ? (
                          <MdComputer className="mr-2 text-green-500" />
                        ) : (
                          <MdLocationOn className="mr-2 text-blue-500" />
                        )}
                        {internship.location}
                      </div>

                      <div className="flex items-center text-sm text-gray-100">
                        <FaMoneyBillWave className="mr-2" />
                        {internship.stipend}
                      </div>

                      <div className="flex items-center text-sm text-gray-100">
                        <MdWork className="mr-2" />
                        {internship.duration}
                      </div>

                      {isUrgent && (
                        <div className="flex items-center text-sm text-gray-100 font-medium">
                          <FaClock className="mr-2" />
                          {daysUntilDeadline} day{daysUntilDeadline !== 1 ? 's' : ''} left to apply
                        </div>
                      )}
                    </div>

                    {/* Skills */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-200 mb-2">Skills Required:</h4>
                      <div className="flex flex-wrap gap-1">
                        {internship.skills.map(skill => (
                          <span key={skill} className="inline-block px-2 py-1 text-xs bg-blue-500 text-gray-100 border border-white/5 rounded-md">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <p className="text-sm text-gray-200 mb-4 line-clamp-2">
                      {internship.description}
                    </p>

                    {/* Actions */}
                    <div className="flex gap-2 mt-auto">
                      <a
                        href={internship.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-lg shadow-blue-500/20 text-white text-center py-2.5 px-4 rounded-lg transition-all duration-300 hover:scale-[1.02] text-sm font-medium"
                      >
                        Apply Now
                      </a>
                      {user && (
                        <button
                          onClick={() => toggleBookmark(internship.id)}
                          className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all duration-300 hover:scale-[1.02] ${internship.isBookmarked
                            ? 'border-yellow-500/50 bg-yellow-500/10 text-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.2)]'
                            : 'border-white/10 text-gray-200 hover:bg-white/5'
                            }`}
                        >
                          {internship.isBookmarked ? <FaBookmark /> : <FaRegBookmark />}
                        </button>
                      )}
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

export default Internships; 