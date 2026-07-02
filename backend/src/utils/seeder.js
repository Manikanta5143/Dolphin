const Event = require('../models/Event');
const { createSampleNotifications } = require('./notificationSeeder');

const events = [
  // HACKATHONS (8 events)
  {
    title: "Google Developer Student Clubs Solution Challenge 2024",
    organizer: "Google",
    description: "Build solutions for local community problems using Google technologies. Win prizes up to $50,000 and mentorship opportunities. Open to all students worldwide.",
    type: "HACKATHON",
    date: new Date("2024-04-15"),
    location: "Global",
    link: "https://developers.google.com/community/gdsc/events/solution-challenge",
    tags: ["Google", "Student", "Innovation", "Technology", "Community"],
    organizer: "Google",
    eligibility: "Open to all students worldwide",
    deadline: new Date("2024-04-10"),
    isActive: true,
    engagement: { viewCount: 1250, bookmarkCount: 89, shareCount: 45, rsvpCount: 234, trendingScore: 1250 }
  },
  {
    title: "Microsoft Imagine Cup 2024",
    organizer: "Microsoft",
    description: "The world's premier student technology competition. Build innovative solutions using Microsoft technologies and compete for global recognition.",
    type: "HACKATHON",
    date: new Date("2024-05-20"),
    location: "Seattle, WA",
    link: "https://imaginecup.microsoft.com/",
    tags: ["Microsoft", "AI", "Cloud", "Innovation", "Competition"],
    organizer: "Microsoft",
    eligibility: "Students aged 16+ from eligible countries",
    deadline: new Date("2024-05-15"),
    isActive: true,
    engagement: { viewCount: 2100, bookmarkCount: 156, shareCount: 78, rsvpCount: 445, trendingScore: 2100 }
  },
  {
    title: "Meta Hacker Cup 2024",
    organizer: "Meta",
    description: "Annual programming competition hosted by Meta. Solve algorithmic challenges and compete for prizes in this prestigious competition.",
    type: "HACKATHON",
    date: new Date("2024-08-15"),
    location: "Menlo Park, CA",
    link: "https://www.facebook.com/hackercup/",
    tags: ["Meta", "Algorithm", "Competitive Programming", "Prizes", "SDE"],
    organizer: "Meta",
    eligibility: "Open to all programmers worldwide",
    deadline: new Date("2024-08-01"),
    isActive: true,
    engagement: { viewCount: 3200, bookmarkCount: 234, shareCount: 123, rsvpCount: 678, trendingScore: 3200 }
  },
  {
    title: "SDE CodeFest 2024",
    description: "Software Engineering focused hackathon for building scalable applications. Focus on system design, algorithms, and best practices.",
    type: "HACKATHON",
    date: new Date("2024-07-20"),
    location: "San Francisco, CA",
    link: "https://sde-codefest.com",
    tags: ["SDE", "Software Engineering", "System Design", "Algorithms", "Scalability"],
    eligibility: "Computer Science students and professionals",
    deadline: new Date("2024-07-15"),
    isActive: true,
    engagement: { viewCount: 1800, bookmarkCount: 145, shareCount: 67, rsvpCount: 312, trendingScore: 1800 }
  },
  {
    title: "AWS Build On 2024",
    description: "Build innovative solutions using AWS services. Focus on cloud-native applications and serverless architecture.",
    type: "HACKATHON",
    date: new Date("2024-06-10"),
    location: "Online",
    link: "https://aws.amazon.com/events/build-on/",
    tags: ["AWS", "Cloud", "Serverless", "Innovation"],
    eligibility: "Open to all developers",
    deadline: new Date("2024-06-05"),
    isActive: true,
    engagement: { viewCount: 1800, bookmarkCount: 134, shareCount: 67, rsvpCount: 345, trendingScore: 1800 }
  },
  {
    title: "TechCrunch Disrupt Hackathon 2024",
    description: "48-hour hackathon at TechCrunch Disrupt. Build the next big thing and pitch to investors and industry leaders.",
    type: "HACKATHON",
    date: new Date("2024-09-15"),
    location: "San Francisco, CA",
    link: "https://techcrunch.com/events/disrupt/",
    tags: ["TechCrunch", "Startup", "Pitch", "Investors", "Innovation"],
    eligibility: "Open to all developers and entrepreneurs",
    deadline: new Date("2024-09-10"),
    isActive: true,
    engagement: { viewCount: 2800, bookmarkCount: 198, shareCount: 95, rsvpCount: 567, trendingScore: 2800 }
  },
  {
    title: "MIT Hacking Medicine 2024",
    description: "Healthcare-focused hackathon bringing together clinicians, engineers, and entrepreneurs to solve healthcare challenges.",
    type: "HACKATHON",
    date: new Date("2024-10-20"),
    location: "Cambridge, MA",
    link: "https://hackingmedicine.mit.edu/",
    tags: ["MIT", "Healthcare", "Medicine", "Innovation", "Social Impact"],
    eligibility: "Open to all students and professionals",
    deadline: new Date("2024-10-15"),
    isActive: true,
    engagement: { viewCount: 1650, bookmarkCount: 112, shareCount: 56, rsvpCount: 289, trendingScore: 1650 }
  },
  {
    title: "Blockchain Hackathon 2024",
    description: "Build decentralized applications using blockchain technology. Focus on DeFi, NFTs, and Web3 solutions.",
    type: "HACKATHON",
    date: new Date("2024-07-25"),
    location: "Online",
    link: "https://blockchainhackathon.io/",
    tags: ["Blockchain", "Web3", "DeFi", "NFT", "Cryptocurrency"],
    eligibility: "Open to all blockchain developers",
    deadline: new Date("2024-07-20"),
    isActive: true,
    engagement: { viewCount: 2200, bookmarkCount: 167, shareCount: 89, rsvpCount: 423, trendingScore: 2200 }
  },
  {
    title: "Climate Tech Hackathon 2024",
    description: "Build solutions to combat climate change using technology. Focus on sustainability, renewable energy, and environmental impact.",
    type: "HACKATHON",
    date: new Date("2024-11-10"),
    location: "New York, NY",
    link: "https://climatetechhackathon.org/",
    tags: ["Climate", "Sustainability", "Green Tech", "Environment", "Impact"],
    eligibility: "Open to all developers and environmentalists",
    deadline: new Date("2024-11-05"),
    isActive: true,
    engagement: { viewCount: 1950, bookmarkCount: 145, shareCount: 72, rsvpCount: 334, trendingScore: 1950 }
  },

  // INTERNSHIPS (6 events)
  {
    title: "Google Summer of Code 2024",
    organizer: "Google",
    description: "Work with open source organizations during your summer break. Get paid to write code and learn from experienced mentors.",
    type: "INTERNSHIP",
    date: new Date("2024-06-01"),
    location: "Remote",
    link: "https://summerofcode.withgoogle.com/",
    tags: ["Google", "Open Source", "Summer", "Mentorship", "Paid"],
    organizer: "Google",
    eligibility: "University students worldwide",
    deadline: new Date("2024-04-15"),
    isActive: true,
    engagement: { viewCount: 4500, bookmarkCount: 345, shareCount: 178, rsvpCount: 890, trendingScore: 4500 }
  },
  {
    title: "Microsoft SDE Internship 2024",
    organizer: "Microsoft",
    description: "Software Development Engineer internship at Microsoft. Work on core products, learn system design, and contribute to large-scale software development.",
    type: "INTERNSHIP",
    date: new Date("2024-06-15"),
    location: "Redmond, WA",
    link: "https://careers.microsoft.com/students/",
    tags: ["Microsoft", "SDE", "Software Engineering", "System Design", "Paid", "Mentorship"],
    organizer: "Microsoft",
    eligibility: "Computer Science students with strong coding skills",
    deadline: new Date("2024-03-31"),
    isActive: true,
    engagement: { viewCount: 4200, bookmarkCount: 320, shareCount: 165, rsvpCount: 850, trendingScore: 4200 }
  },
  {
    title: "Amazon SDE Internship 2024",
    organizer: "Amazon",
    description: "Software Development Engineer internship at Amazon. Build scalable systems, work with AWS, and learn from senior engineers.",
    type: "INTERNSHIP",
    date: new Date("2024-06-01"),
    location: "Seattle, WA",
    link: "https://www.amazon.jobs/en/teams/student-programs",
    tags: ["Amazon", "SDE", "AWS", "Scalability", "Distributed Systems", "Paid"],
    organizer: "Amazon",
    eligibility: "CS students with algorithm and system design knowledge",
    deadline: new Date("2024-03-15"),
    isActive: true,
    engagement: { viewCount: 3800, bookmarkCount: 295, shareCount: 152, rsvpCount: 745, trendingScore: 3800 }
  },
  {
    title: "Meta University Internship 2024",
    organizer: "Meta",
    description: "8-week internship program for underrepresented students. Learn about software engineering at Meta and build meaningful connections.",
    type: "INTERNSHIP",
    date: new Date("2024-07-01"),
    location: "Menlo Park, CA",
    link: "https://www.metacareers.com/university/",
    tags: ["Meta", "Diversity", "Software Engineering", "Mentorship", "Networking"],
    organizer: "Meta",
    eligibility: "Underrepresented students in tech",
    deadline: new Date("2024-04-30"),
    isActive: true,
    engagement: { viewCount: 3200, bookmarkCount: 234, shareCount: 112, rsvpCount: 567, trendingScore: 3200 }
  },
  {
    title: "Amazon Software Development Internship",
    organizer: "Amazon",
    description: "12-week internship working on Amazon's most challenging technical problems. Gain experience with large-scale systems.",
    type: "INTERNSHIP",
    date: new Date("2024-06-01"),
    location: "Seattle, WA",
    link: "https://www.amazon.jobs/en/teams/university-recruiting",
    tags: ["Amazon", "Software Development", "Large Scale", "Systems", "Career"],
    organizer: "Amazon",
    eligibility: "Computer Science/Engineering students",
    deadline: new Date("2024-03-15"),
    isActive: true,
    engagement: { viewCount: 4200, bookmarkCount: 312, shareCount: 156, rsvpCount: 789, trendingScore: 4200 }
  },
  {
    title: "Apple Engineering Internship 2024",
    organizer: "Apple",
    description: "Work on Apple's innovative products and technologies. Join a team of world-class engineers and designers.",
    type: "INTERNSHIP",
    date: new Date("2024-06-15"),
    location: "Cupertino, CA",
    link: "https://jobs.apple.com/en-us/teams/student-programs",
    tags: ["Apple", "Engineering", "Innovation", "Products", "Design"],
    organizer: "Apple",
    eligibility: "Engineering students with strong technical skills",
    deadline: new Date("2024-04-01"),
    isActive: true,
    engagement: { viewCount: 3600, bookmarkCount: 278, shareCount: 134, rsvpCount: 645, trendingScore: 3600 }
  },
  {
    title: "Tesla Software Engineering Internship",
    organizer: "Tesla",
    description: "Contribute to Tesla's mission of accelerating the world's transition to sustainable energy through software engineering.",
    type: "INTERNSHIP",
    date: new Date("2024-07-01"),
    location: "Palo Alto, CA",
    link: "https://www.tesla.com/careers/students",
    tags: ["Tesla", "Sustainability", "Software Engineering", "Innovation", "Clean Energy"],
    organizer: "Tesla",
    eligibility: "Software Engineering students",
    deadline: new Date("2024-05-15"),
    isActive: true,
    engagement: { viewCount: 2900, bookmarkCount: 198, shareCount: 89, rsvpCount: 456, trendingScore: 2900 }
  },

  // WORKSHOPS (5 events)
  {
    title: "React Workshop: Building Modern Web Applications",
    description: "Learn React fundamentals and build a complete web application. Perfect for beginners and intermediate developers.",
    type: "WORKSHOP",
    date: new Date("2024-04-20"),
    location: "San Francisco, CA",
    link: "https://reactworkshop.dev/",
    tags: ["React", "JavaScript", "Web Development", "Frontend"],
    eligibility: "Open to all developers",
    deadline: new Date("2024-04-15"),
    isActive: true,
    engagement: { viewCount: 1200, bookmarkCount: 78, shareCount: 34, rsvpCount: 189, trendingScore: 1200 }
  },
  {
    title: "Machine Learning Bootcamp",
    description: "Intensive 3-day workshop covering machine learning fundamentals, practical applications, and hands-on projects.",
    type: "WORKSHOP",
    date: new Date("2024-05-10"),
    location: "Online",
    link: "https://mlbootcamp.ai/",
    tags: ["Machine Learning", "Python", "AI", "Data Science"],
    eligibility: "Basic Python knowledge required",
    deadline: new Date("2024-05-05"),
    isActive: true,
    engagement: { viewCount: 1800, bookmarkCount: 123, shareCount: 56, rsvpCount: 267, trendingScore: 1800 }
  },
  {
    title: "DevOps Best Practices Workshop",
    description: "Learn modern DevOps practices including CI/CD, containerization, and cloud deployment strategies.",
    type: "WORKSHOP",
    date: new Date("2024-06-15"),
    location: "New York, NY",
    link: "https://devopsworkshop.tech/",
    tags: ["DevOps", "CI/CD", "Docker", "Kubernetes"],
    eligibility: "Software developers and IT professionals",
    deadline: new Date("2024-06-10"),
    isActive: true,
    engagement: { viewCount: 1450, bookmarkCount: 89, shareCount: 42, rsvpCount: 198, trendingScore: 1450 }
  },
  {
    title: "Cybersecurity Workshop: Ethical Hacking",
    description: "Learn ethical hacking techniques and cybersecurity best practices. Hands-on labs and real-world scenarios.",
    type: "WORKSHOP",
    date: new Date("2024-08-20"),
    location: "Online",
    link: "https://cybersecurityworkshop.io/",
    tags: ["Cybersecurity", "Ethical Hacking", "Security", "Penetration Testing"],
    eligibility: "IT professionals and security enthusiasts",
    deadline: new Date("2024-08-15"),
    isActive: true,
    engagement: { viewCount: 2100, bookmarkCount: 156, shareCount: 78, rsvpCount: 334, trendingScore: 2100 }
  },
  {
    title: "Mobile App Development Workshop",
    description: "Build cross-platform mobile applications using React Native. Learn about app store deployment and monetization.",
    type: "WORKSHOP",
    date: new Date("2024-09-25"),
    location: "Austin, TX",
    link: "https://mobileappworkshop.dev/",
    tags: ["Mobile Development", "React Native", "iOS", "Android", "App Store"],
    eligibility: "JavaScript developers",
    deadline: new Date("2024-09-20"),
    isActive: true,
    engagement: { viewCount: 1650, bookmarkCount: 112, shareCount: 56, rsvpCount: 245, trendingScore: 1650 }
  },

  // CONFERENCES (5 events)
  {
    title: "PyCon US 2024",
    description: "The largest annual gathering for the Python community. Learn from experts, network, and discover new technologies.",
    type: "CONFERENCE",
    date: new Date("2024-05-15"),
    location: "Pittsburgh, PA",
    link: "https://us.pycon.org/2024/",
    tags: ["Python", "Conference", "Networking", "Learning"],
    eligibility: "Open to all Python enthusiasts",
    deadline: new Date("2024-05-01"),
    isActive: true,
    engagement: { viewCount: 3200, bookmarkCount: 234, shareCount: 123, rsvpCount: 567, trendingScore: 3200 }
  },
  {
    title: "React Conf 2024",
    description: "The official React conference. Learn about the latest React features, best practices, and future roadmap.",
    type: "CONFERENCE",
    date: new Date("2024-09-20"),
    location: "Las Vegas, NV",
    link: "https://conf.reactjs.org/",
    tags: ["React", "JavaScript", "Frontend", "Conference"],
    eligibility: "React developers and enthusiasts",
    deadline: new Date("2024-08-15"),
    isActive: true,
    engagement: { viewCount: 2800, bookmarkCount: 198, shareCount: 95, rsvpCount: 445, trendingScore: 2800 }
  },
  {
    title: "AWS re:Invent 2024",
    description: "Amazon Web Services' annual conference. Learn about cloud computing, new services, and best practices.",
    type: "CONFERENCE",
    date: new Date("2024-12-02"),
    location: "Las Vegas, NV",
    link: "https://reinvent.awsevents.com/",
    tags: ["AWS", "Cloud Computing", "Conference", "Technology"],
    eligibility: "Cloud professionals and developers",
    deadline: new Date("2024-11-01"),
    isActive: true,
    engagement: { viewCount: 4500, bookmarkCount: 345, shareCount: 178, rsvpCount: 890, trendingScore: 4500 }
  },
  {
    title: "Google I/O 2024",
    organizer: "Google",
    description: "Google's annual developer conference. Learn about the latest Google technologies, tools, and platforms.",
    type: "CONFERENCE",
    date: new Date("2024-05-14"),
    location: "Mountain View, CA",
    link: "https://events.google.com/io/",
    tags: ["Google", "Android", "Web", "AI", "Developer"],
    organizer: "Google",
    eligibility: "Developers and tech enthusiasts",
    deadline: new Date("2024-04-15"),
    isActive: true,
    engagement: { viewCount: 5200, bookmarkCount: 412, shareCount: 234, rsvpCount: 1023, trendingScore: 5200 }
  },
  {
    title: "Apple WWDC 2024",
    organizer: "Apple",
    description: "Apple's Worldwide Developers Conference. Discover the latest Apple technologies and connect with the developer community.",
    type: "CONFERENCE",
    date: new Date("2024-06-10"),
    location: "Cupertino, CA",
    link: "https://developer.apple.com/wwdc/",
    tags: ["Apple", "iOS", "macOS", "Developer", "Innovation"],
    organizer: "Apple",
    eligibility: "Apple developers and enthusiasts",
    deadline: new Date("2024-05-15"),
    isActive: true,
    engagement: { viewCount: 4800, bookmarkCount: 367, shareCount: 189, rsvpCount: 912, trendingScore: 4800 }
  },

  // COMPETITIONS (4 events)
  {
    title: "Kaggle Competitions",
    description: "Join data science competitions on Kaggle. Solve real-world problems and compete with data scientists worldwide.",
    type: "COMPETITION",
    date: new Date("2024-04-01"),
    location: "Online",
    link: "https://www.kaggle.com/competitions",
    tags: ["Data Science", "Machine Learning", "Competition", "Kaggle"],
    eligibility: "Open to all data scientists",
    deadline: new Date("2024-03-25"),
    isActive: true,
    engagement: { viewCount: 3800, bookmarkCount: 289, shareCount: 145, rsvpCount: 723, trendingScore: 3800 }
  },
  {
    title: "Topcoder Open 2024",
    description: "Annual programming competition with multiple tracks including algorithm, development, and design.",
    type: "COMPETITION",
    date: new Date("2024-10-15"),
    location: "Online",
    link: "https://www.topcoder.com/tco/",
    tags: ["Competition", "Programming", "Development", "Design"],
    eligibility: "Open to all developers",
    deadline: new Date("2024-09-30"),
    isActive: true,
    engagement: { viewCount: 2200, bookmarkCount: 167, shareCount: 89, rsvpCount: 423, trendingScore: 2200 }
  },
  {
    title: "Codeforces Round",
    description: "Regular competitive programming contests. Improve your algorithmic skills and compete with programmers worldwide.",
    type: "COMPETITION",
    date: new Date("2024-04-05"),
    location: "Online",
    link: "https://codeforces.com/",
    tags: ["Competitive Programming", "Algorithm", "Online", "Regular"],
    eligibility: "Open to all programmers",
    deadline: new Date("2024-04-04"),
    isActive: true,
    engagement: { viewCount: 1800, bookmarkCount: 123, shareCount: 56, rsvpCount: 267, trendingScore: 1800 }
  },
  {
    title: "Google Code Jam 2024",
    organizer: "Google",
    description: "Google's annual coding competition. Solve algorithmic challenges and compete with programmers worldwide.",
    type: "COMPETITION",
    date: new Date("2024-07-20"),
    location: "Online",
    link: "https://codingcompetitions.withgoogle.com/codejam",
    tags: ["Google", "Competitive Programming", "Algorithm", "Prizes"],
    organizer: "Google",
    eligibility: "Open to all programmers",
    deadline: new Date("2024-07-01"),
    isActive: true,
    engagement: { viewCount: 3200, bookmarkCount: 234, shareCount: 123, rsvpCount: 567, trendingScore: 3200 }
  },

  // MEETUPS (3 events)
  {
    title: "San Francisco JavaScript Meetup",
    description: "Monthly meetup for JavaScript developers. Network with peers, learn new technologies, and share experiences.",
    type: "MEETUP",
    date: new Date("2024-04-25"),
    location: "San Francisco, CA",
    link: "https://sfjsmeetup.com/",
    tags: ["JavaScript", "Networking", "Community", "Learning"],
    eligibility: "JavaScript developers",
    deadline: new Date("2024-04-20"),
    isActive: true,
    engagement: { viewCount: 850, bookmarkCount: 45, shareCount: 23, rsvpCount: 123, trendingScore: 850 }
  },
  {
    title: "New York Python Meetup",
    description: "Connect with Python developers in NYC. Share projects, learn best practices, and build your professional network.",
    type: "MEETUP",
    date: new Date("2024-05-30"),
    location: "New York, NY",
    link: "https://nypythonmeetup.org/",
    tags: ["Python", "Networking", "Community", "NYC"],
    eligibility: "Python developers and enthusiasts",
    deadline: new Date("2024-05-25"),
    isActive: true,
    engagement: { viewCount: 1200, bookmarkCount: 78, shareCount: 34, rsvpCount: 189, trendingScore: 1200 }
  },
  {
    title: "Seattle AI/ML Meetup",
    description: "Monthly gathering for AI and machine learning enthusiasts. Discuss latest trends, share research, and collaborate on projects.",
    type: "MEETUP",
    date: new Date("2024-06-20"),
    location: "Seattle, WA",
    link: "https://seattleaimlmeetup.com/",
    tags: ["AI", "Machine Learning", "Research", "Collaboration"],
    eligibility: "AI/ML researchers and practitioners",
    deadline: new Date("2024-06-15"),
    isActive: true,
    engagement: { viewCount: 1450, bookmarkCount: 89, shareCount: 42, rsvpCount: 198, trendingScore: 1450 }
  },

  // WEBINARS (3 events)
  {
    title: "Introduction to Blockchain Technology",
    description: "Free webinar covering blockchain fundamentals, use cases, and development opportunities. Perfect for beginners.",
    type: "WEBINAR",
    date: new Date("2024-04-18"),
    location: "Online",
    link: "https://blockchainwebinar.io/",
    tags: ["Blockchain", "Web3", "Cryptocurrency", "Education"],
    eligibility: "Open to all",
    deadline: new Date("2024-04-15"),
    isActive: true,
    engagement: { viewCount: 2100, bookmarkCount: 156, shareCount: 78, rsvpCount: 334, trendingScore: 2100 }
  },
  {
    title: "Cloud Security Best Practices",
    description: "Learn about securing cloud infrastructure and applications. Expert insights and practical recommendations.",
    type: "WEBINAR",
    date: new Date("2024-05-22"),
    location: "Online",
    link: "https://cloudsecuritywebinar.com/",
    tags: ["Cloud Security", "AWS", "Azure", "Best Practices"],
    eligibility: "Cloud professionals and developers",
    deadline: new Date("2024-05-20"),
    isActive: true,
    engagement: { viewCount: 1650, bookmarkCount: 112, shareCount: 56, rsvpCount: 245, trendingScore: 1650 }
  },
  {
    title: "Data Science Career Path",
    description: "Explore career opportunities in data science. Learn about required skills, salary expectations, and growth prospects.",
    type: "WEBINAR",
    date: new Date("2024-06-12"),
    location: "Online",
    link: "https://datasciencecareer.io/",
    tags: ["Data Science", "Career", "Skills", "Opportunities"],
    eligibility: "Students and career changers",
    deadline: new Date("2024-06-10"),
    isActive: true,
    engagement: { viewCount: 1800, bookmarkCount: 123, shareCount: 56, rsvpCount: 267, trendingScore: 1800 }
  },

  // BOOTCAMPS (2 events)
  {
    title: "Full Stack Web Development Bootcamp",
    description: "Intensive 12-week program covering frontend and backend development. Build real projects and prepare for your first job.",
    type: "BOOTCAMP",
    date: new Date("2024-06-01"),
    location: "San Francisco, CA",
    link: "https://fullstackbootcamp.dev/",
    tags: ["Full Stack", "Web Development", "Career Change", "Intensive"],
    eligibility: "No prior experience required",
    deadline: new Date("2024-05-15"),
    isActive: true,
    engagement: { viewCount: 3200, bookmarkCount: 234, shareCount: 123, rsvpCount: 567, trendingScore: 3200 }
  },
  {
    title: "Data Science Bootcamp",
    description: "Comprehensive program covering data analysis, machine learning, and statistical modeling. Hands-on projects and industry mentorship.",
    type: "BOOTCAMP",
    date: new Date("2024-07-15"),
    location: "Online",
    link: "https://datasciencebootcamp.ai/",
    tags: ["Data Science", "Machine Learning", "Statistics", "Career"],
    eligibility: "Basic math and programming knowledge",
    deadline: new Date("2024-07-01"),
    isActive: true,
    engagement: { viewCount: 2800, bookmarkCount: 198, shareCount: 95, rsvpCount: 445, trendingScore: 2800 }
  },

  // SCHOLARSHIPS (2 events)
  {
    title: "Google Women Techmakers Scholarship",
    organizer: "Google",
    description: "Scholarship program for women pursuing computer science degrees. Financial support and mentorship opportunities.",
    type: "SCHOLARSHIP",
    date: new Date("2024-05-01"),
    location: "Global",
    link: "https://www.womentechmakers.com/scholars",
    tags: ["Google", "Women in Tech", "Scholarship", "Mentorship"],
    organizer: "Google",
    eligibility: "Women pursuing CS degrees",
    deadline: new Date("2024-04-15"),
    isActive: true,
    engagement: { viewCount: 4500, bookmarkCount: 345, shareCount: 178, rsvpCount: 890, trendingScore: 4500 }
  },
  {
    title: "Microsoft Diversity Scholarship",
    organizer: "Microsoft",
    description: "Scholarship program for underrepresented students in technology. Financial aid and internship opportunities.",
    type: "SCHOLARSHIP",
    date: new Date("2024-06-01"),
    location: "Global",
    link: "https://careers.microsoft.com/students/scholarships",
    tags: ["Microsoft", "Diversity", "Scholarship", "Underrepresented"],
    organizer: "Microsoft",
    eligibility: "Underrepresented students in tech",
    deadline: new Date("2024-05-15"),
    isActive: true,
    engagement: { viewCount: 3800, bookmarkCount: 289, shareCount: 145, rsvpCount: 723, trendingScore: 3800 }
  },

  // JOB_FAIRS (2 events)
  {
    title: "Tech Career Fair 2024",
    description: "Connect with top tech companies and startups. Network with recruiters and discover job opportunities.",
    type: "JOB_FAIR",
    date: new Date("2024-09-15"),
    location: "San Francisco, CA",
    link: "https://techcareerfair.com/",
    tags: ["Career Fair", "Jobs", "Networking", "Recruiters"],
    eligibility: "Tech professionals and students",
    deadline: new Date("2024-09-10"),
    isActive: true,
    engagement: { viewCount: 5200, bookmarkCount: 412, shareCount: 234, rsvpCount: 1023, trendingScore: 5200 }
  },
  {
    title: "Startup Job Fair",
    description: "Meet with innovative startups looking for talent. Explore opportunities in emerging companies and technologies.",
    type: "JOB_FAIR",
    date: new Date("2024-10-20"),
    location: "New York, NY",
    link: "https://startupjobfair.nyc/",
    tags: ["Startup", "Jobs", "Innovation", "Entrepreneurship"],
    eligibility: "Tech professionals and entrepreneurs",
    deadline: new Date("2024-10-15"),
    isActive: true,
    engagement: { viewCount: 3600, bookmarkCount: 278, shareCount: 134, rsvpCount: 645, trendingScore: 3600 }
  },

  // NETWORKING (2 events)
  {
    title: "Tech Leaders Networking Event",
    description: "Connect with industry leaders and executives. Build relationships and learn from successful professionals.",
    type: "NETWORKING",
    date: new Date("2024-08-10"),
    location: "Los Angeles, CA",
    link: "https://techleadersnetwork.com/",
    tags: ["Networking", "Leadership", "Career", "Professional"],
    eligibility: "Tech professionals and students",
    deadline: new Date("2024-08-05"),
    isActive: true,
    engagement: { viewCount: 2200, bookmarkCount: 167, shareCount: 89, rsvpCount: 423, trendingScore: 2200 }
  },
  {
    title: "Women in Tech Networking",
    description: "Exclusive networking event for women in technology. Connect with mentors and build your professional network.",
    type: "NETWORKING",
    date: new Date("2024-11-05"),
    location: "Chicago, IL",
    link: "https://womenintechnetworking.org/",
    tags: ["Women in Tech", "Networking", "Mentorship", "Diversity"],
    eligibility: "Women in technology",
    deadline: new Date("2024-11-01"),
    isActive: true,
    engagement: { viewCount: 2900, bookmarkCount: 198, shareCount: 89, rsvpCount: 456, trendingScore: 2900 }
  },

  // TECH_TALK (2 events)
  {
    title: "AI and the Future of Work",
    description: "Expert panel discussion on how artificial intelligence is transforming the workplace and creating new opportunities.",
    type: "TECH_TALK",
    date: new Date("2024-07-30"),
    location: "Boston, MA",
    link: "https://aifuturework.com/",
    tags: ["AI", "Future of Work", "Panel", "Discussion"],
    eligibility: "Open to all",
    deadline: new Date("2024-07-25"),
    isActive: true,
    engagement: { viewCount: 1800, bookmarkCount: 123, shareCount: 56, rsvpCount: 267, trendingScore: 1800 }
  },
  {
    title: "Quantum Computing: The Next Frontier",
    description: "Learn about quantum computing breakthroughs and their potential impact on technology and society.",
    type: "TECH_TALK",
    date: new Date("2024-12-15"),
    location: "Online",
    link: "https://quantumcomputingtalk.org/",
    tags: ["Quantum Computing", "Technology", "Innovation", "Future"],
    eligibility: "Tech enthusiasts and researchers",
    deadline: new Date("2024-12-10"),
    isActive: true,
    engagement: { viewCount: 1450, bookmarkCount: 89, shareCount: 42, rsvpCount: 198, trendingScore: 1450 }
  },

  // STARTUP_PITCH (2 events)
  {
    title: "Startup Pitch Competition 2024",
    description: "Pitch your startup idea to investors and industry experts. Win funding and mentorship opportunities.",
    type: "STARTUP_PITCH",
    date: new Date("2024-09-25"),
    location: "Austin, TX",
    link: "https://startuppitchcomp.com/",
    tags: ["Startup", "Pitch", "Investors", "Funding"],
    eligibility: "Startup founders and entrepreneurs",
    deadline: new Date("2024-09-20"),
    isActive: true,
    engagement: { viewCount: 3200, bookmarkCount: 234, shareCount: 123, rsvpCount: 567, trendingScore: 3200 }
  },
  {
    title: "Student Innovation Pitch Night",
    description: "Students pitch innovative ideas and solutions. Connect with mentors and potential collaborators.",
    type: "STARTUP_PITCH",
    date: new Date("2024-10-30"),
    location: "Online",
    link: "https://studentinnovationpitch.com/",
    tags: ["Student", "Innovation", "Pitch", "Mentorship"],
    eligibility: "University students",
    deadline: new Date("2024-10-25"),
    isActive: true,
    engagement: { viewCount: 2100, bookmarkCount: 156, shareCount: 78, rsvpCount: 334, trendingScore: 2100 }
  },

  // RESEARCH_OPPORTUNITY (2 events)
  {
    title: "MIT Research Internship Program",
    description: "Work on cutting-edge research projects at MIT. Collaborate with world-class researchers and contribute to scientific advancement.",
    type: "RESEARCH_OPPORTUNITY",
    date: new Date("2024-06-01"),
    location: "Cambridge, MA",
    link: "https://web.mit.edu/research/internships/",
    tags: ["MIT", "Research", "Internship", "Academic"],
    eligibility: "Graduate students and researchers",
    deadline: new Date("2024-04-30"),
    isActive: true,
    engagement: { viewCount: 2800, bookmarkCount: 198, shareCount: 95, rsvpCount: 445, trendingScore: 2800 }
  },
  {
    title: "Stanford AI Research Fellowship",
    description: "Join Stanford's AI research community. Work on breakthrough projects in artificial intelligence and machine learning.",
    type: "RESEARCH_OPPORTUNITY",
    date: new Date("2024-07-15"),
    location: "Stanford, CA",
    link: "https://ai.stanford.edu/fellowship/",
    tags: ["Stanford", "AI Research", "Fellowship", "Machine Learning"],
    eligibility: "PhD students and researchers",
    deadline: new Date("2024-06-15"),
    isActive: true,
    engagement: { viewCount: 3600, bookmarkCount: 278, shareCount: 134, rsvpCount: 645, trendingScore: 3600 }
  },

  // VOLUNTEER (2 events)
  {
    title: "Code for Good Hackathon",
    description: "Volunteer to build technology solutions for non-profit organizations. Make a positive impact while developing your skills.",
    type: "VOLUNTEER",
    date: new Date("2024-08-15"),
    location: "Seattle, WA",
    link: "https://codeforgood.org/",
    tags: ["Volunteer", "Non-profit", "Social Impact", "Technology"],
    eligibility: "Open to all developers",
    deadline: new Date("2024-08-10"),
    isActive: true,
    engagement: { viewCount: 1650, bookmarkCount: 112, shareCount: 56, rsvpCount: 245, trendingScore: 1650 }
  },
  {
    title: "Tech Mentorship Program",
    description: "Volunteer to mentor students and newcomers in technology. Share your knowledge and help others grow in their careers.",
    type: "VOLUNTEER",
    date: new Date("2024-09-01"),
    location: "Online",
    link: "https://techmentorship.org/",
    tags: ["Mentorship", "Volunteer", "Education", "Career Growth"],
    eligibility: "Experienced tech professionals",
    deadline: new Date("2024-08-25"),
    isActive: true,
    engagement: { viewCount: 1200, bookmarkCount: 78, shareCount: 34, rsvpCount: 189, trendingScore: 1200 }
  },

  // MENTORSHIP (2 events)
  {
    title: "Google Mentorship Program",
    organizer: "Google",
    description: "Get paired with Google engineers for career guidance and technical mentorship. Accelerate your professional growth.",
    type: "MENTORSHIP",
    date: new Date("2024-06-01"),
    location: "Online",
    link: "https://mentorship.google.com/",
    tags: ["Google", "Mentorship", "Career", "Engineering"],
    organizer: "Google",
    eligibility: "Students and early-career professionals",
    deadline: new Date("2024-05-15"),
    isActive: true,
    engagement: { viewCount: 4200, bookmarkCount: 312, shareCount: 156, rsvpCount: 789, trendingScore: 4200 }
  },
  {
    title: "Women in Tech Mentorship Circle",
    description: "Join a supportive community of women in technology. Get mentorship, share experiences, and advance your career.",
    type: "MENTORSHIP",
    date: new Date("2024-07-01"),
    location: "Online",
    link: "https://womenintechmentorship.com/",
    tags: ["Women in Tech", "Mentorship", "Community", "Career"],
    eligibility: "Women in technology",
    deadline: new Date("2024-06-20"),
    isActive: true,
    engagement: { viewCount: 3200, bookmarkCount: 234, shareCount: 123, rsvpCount: 567, trendingScore: 3200 }
  },

  // CAREER_FAIR (2 events)
  {
    title: "University Career Fair 2024",
    description: "Connect with employers and explore career opportunities. Network with recruiters and learn about different career paths.",
    type: "CAREER_FAIR",
    date: new Date("2024-10-15"),
    location: "University Campus",
    link: "https://universitycareerfair.edu/",
    tags: ["Career Fair", "Jobs", "Employers", "Networking"],
    eligibility: "University students and alumni",
    deadline: new Date("2024-10-10"),
    isActive: true,
    engagement: { viewCount: 4800, bookmarkCount: 367, shareCount: 189, rsvpCount: 912, trendingScore: 4800 }
  },
  {
    title: "Tech Industry Career Fair",
    description: "Meet with leading tech companies and startups. Discover job opportunities and learn about company cultures.",
    type: "CAREER_FAIR",
    date: new Date("2024-11-20"),
    location: "San Jose, CA",
    link: "https://techindustrycareerfair.com/",
    tags: ["Tech Industry", "Jobs", "Companies", "Culture"],
    eligibility: "Tech professionals and students",
    deadline: new Date("2024-11-15"),
    isActive: true,
    engagement: { viewCount: 3800, bookmarkCount: 289, shareCount: 145, rsvpCount: 723, trendingScore: 3800 }
  },

  // ALUMNI_EVENT (2 events)
  {
    title: "Computer Science Alumni Reunion",
    description: "Reconnect with fellow CS alumni. Share career updates, network, and learn about industry trends.",
    type: "ALUMNI_EVENT",
    date: new Date("2024-09-10"),
    location: "University Campus",
    link: "https://csalumnireunion.edu/",
    tags: ["Alumni", "Networking", "Career", "Reunion"],
    eligibility: "CS alumni",
    deadline: new Date("2024-09-05"),
    isActive: true,
    engagement: { viewCount: 1800, bookmarkCount: 123, shareCount: 56, rsvpCount: 267, trendingScore: 1800 }
  },
  {
    title: "Engineering Alumni Networking Night",
    description: "Connect with engineering alumni from various companies. Share experiences and explore collaboration opportunities.",
    type: "ALUMNI_EVENT",
    date: new Date("2024-12-05"),
    location: "Online",
    link: "https://engineeringalumni.net/",
    tags: ["Engineering", "Alumni", "Networking", "Collaboration"],
    eligibility: "Engineering alumni",
    deadline: new Date("2024-12-01"),
    isActive: true,
    engagement: { viewCount: 1450, bookmarkCount: 89, shareCount: 42, rsvpCount: 198, trendingScore: 1450 }
  },

  // STUDY_GROUP (2 events)
  {
    title: "Data Structures Study Group",
    description: "Weekly study group for learning data structures and algorithms. Practice problems and prepare for technical interviews.",
    type: "STUDY_GROUP",
    date: new Date("2024-04-01"),
    location: "Online",
    link: "https://datastructuresstudy.com/",
    tags: ["Data Structures", "Algorithms", "Study", "Interview Prep"],
    eligibility: "Students and job seekers",
    deadline: new Date("2024-03-25"),
    isActive: true,
    engagement: { viewCount: 1200, bookmarkCount: 78, shareCount: 34, rsvpCount: 189, trendingScore: 1200 }
  },
  {
    title: "Machine Learning Study Group",
    description: "Collaborative learning group for machine learning concepts. Work on projects and share knowledge with peers.",
    type: "STUDY_GROUP",
    date: new Date("2024-05-15"),
    location: "Online",
    link: "https://mlstudygroup.ai/",
    tags: ["Machine Learning", "Study", "Collaboration", "Projects"],
    eligibility: "ML enthusiasts and students",
    deadline: new Date("2024-05-10"),
    isActive: true,
    engagement: { viewCount: 1650, bookmarkCount: 112, shareCount: 56, rsvpCount: 245, trendingScore: 1650 }
  }
];

const seedEvents = async () => {
  try {
    // Clear existing events
    await Event.deleteMany({});
    
    // Insert new events
    await Event.insertMany(events);
    
    console.log('✅ Events seeded successfully!');
    console.log(`📊 Total events created: ${events.length}`);
    
    // Log event types distribution
    const eventTypes = events.reduce((acc, event) => {
      acc[event.type] = (acc[event.type] || 0) + 1;
      return acc;
    }, {});
    
    console.log('📈 Event types distribution:');
    Object.entries(eventTypes).forEach(([type, count]) => {
      console.log(`   ${type}: ${count} events`);
    });
    
  } catch (error) {
    console.error('❌ Error seeding events:', error);
  }
};

const seedNotifications = async () => {
  try {
    await createSampleNotifications();
  } catch (error) {
    console.error('❌ Error seeding notifications:', error);
  }
};

module.exports = { seedEvents, seedNotifications }; 