import React from 'react';
import { motion } from 'framer-motion';
import {
  BuildingOfficeIcon,
  MapPinIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ClockIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

const MAANGInternships = () => {
  const internships = [
    {
      id: 1,
      title: "Software Engineering Intern",
      company: "Google",
      location: "Mountain View, CA",
      duration: "12 weeks",
      stipend: "$7,000/month",
      requirements: "CS/CE major, Python/Java, GPA 3.5+",
      link: "https://careers.google.com/jobs/results/",
      logo: "🔍",
      color: "from-blue-500 to-red-500"
    },
    {
      id: 2,
      title: "iOS Development Intern",
      company: "Apple",
      location: "Cupertino, CA",
      duration: "16 weeks",
      stipend: "$6,500/month",
      requirements: "Swift/Objective-C, iOS SDK, Portfolio",
      link: "https://jobs.apple.com/en-us/search?search=intern",
      logo: "🍎",
      color: "from-gray-600 to-gray-800"
    },
    {
      id: 3,
      title: "Cloud Solutions Intern",
      company: "Amazon",
      location: "Seattle, WA",
      duration: "12 weeks",
      stipend: "$6,200/month",
      requirements: "AWS, Python/Java, Cloud Architecture",
      link: "https://www.amazon.jobs/en/search?base_query=intern",
      logo: "📦",
      color: "from-orange-400 to-orange-600"
    },
    {
      id: 4,
      title: "Machine Learning Intern",
      company: "Meta",
      location: "Menlo Park, CA",
      duration: "12 weeks",
      stipend: "$6,800/month",
      requirements: "ML/AI, Python, TensorFlow/PyTorch",
      link: "https://www.metacareers.com/jobs/",
      logo: "📘",
      color: "from-blue-600 to-blue-800"
    },
    {
      id: 5,
      title: "Data Science Intern",
      company: "Netflix",
      location: "Los Gatos, CA",
      duration: "12 weeks",
      stipend: "$7,200/month",
      requirements: "Python/R, Statistics, Big Data",
      link: "https://jobs.netflix.com/",
      logo: "🎬",
      color: "from-red-500 to-red-700"
    },
    {
      id: 6,
      title: "Product Management Intern",
      company: "Google",
      location: "New York, NY",
      duration: "12 weeks",
      stipend: "$6,500/month",
      requirements: "Business/CS background, Analytics",
      link: "https://careers.google.com/jobs/results/",
      logo: "🔍",
      color: "from-green-500 to-blue-500"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {internships.map((internship, index) => (
        <motion.div
          key={internship.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.05, y: -5 }}
          transition={{ duration: 0.05, ease: "easeInOut" }}
          className="bg-gradient-to-br from-[#020617] via-[#0b1a3a] to-[#1d4ed8] rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-gray-100 dark:border-gray-100 hover:border-white hover:shadow-[0_0_50px_rgba(131,212,152,0.35)]"
        >
          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="text-3xl">{internship.logo}</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white dark:group-hover:blue transition-colors">
                    {internship.title}
                  </h3>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {internship.company}
                  </p>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${internship.color}`}>
                MAANG
              </div>
            </div>

            {/* Details */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-200">
                <MapPinIcon className="w-4 h-4 mr-2 text-gray-400" />
                {internship.location}
              </div>

              <div className="flex items-center text-sm text-gray-600 dark:text-gray-200">
                <ClockIcon className="w-4 h-4 mr-2 text-gray-400" />
                {internship.duration}
              </div>

              <div className="flex items-center text-sm text-gray-600 dark:text-gray-200">
                <CurrencyDollarIcon className="w-4 h-4 mr-2 text-gray-400" />
                {internship.stipend}
              </div>
            </div>

            {/* Requirements */}
            <div className="mb-4">
              <div className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <AcademicCapIcon className="w-4 h-4 mr-2 text-blue-500" />
                Requirements
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                {internship.requirements}
              </p>
            </div>

            {/* Action Button */}
            <div className="flex items-center justify-between">
              <a
                href={internship.link}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-700 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                Apply Now
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>

              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <CalendarIcon className="w-3 h-3 mr-1" />
                Summer 2024
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default MAANGInternships;
