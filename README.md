## 🎯 Problem Statement

College students often struggle to find opportunities like hackathons, internships, and workshops in one centralized platform. Information is scattered across multiple sources, making it difficult to track and apply on time.

## 💡 Solution

Event Aggregator solves this by providing a centralized platform where students can discover, filter, and bookmark opportunities based on their interests and deadlines.


# Event Aggregator - College Student Opportunity Portal

A full-stack web application that aggregates and displays various opportunities for college students including hackathons, coding competitions, internships, workshops, and conferences.

## 🚀 Features

### Core Features
- **User Authentication**: Secure JWT-based authentication system
- **Event Categories**: Hackathons, Coding Fests, Internships, Workshops, Conferences, Competitions
- **Search & Filter**: Advanced search with filters by type, date, location, and tags
- **Bookmarking**: Save interesting events for later reference
- **Admin Panel**: Manage users, events, and view platform statistics

### Technical Features
- **Real-time Updates**: Scheduled tasks for event status updates
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Security**: Rate limiting, CORS protection, input validation
- **Scalable Architecture**: Modular backend with proper error handling

## 🛠 Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **node-cron** - Scheduled tasks
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing

### Frontend
- **React.js** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Context API** - State management

## 📁 Project Structure

```
EventAggregator/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js          # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── authController.js    # Authentication logic
│   │   │   ├── eventController.js   # Event CRUD operations
│   │   │   ├── userController.js    # User operations
│   │   │   └── adminController.js   # Admin operations
│   │   ├── middleware/
│   │   │   ├── auth.js              # JWT authentication
│   │   │   └── errorHandler.js      # Error handling
│   │   ├── models/
│   │   │   ├── User.js              # User schema
│   │   │   └── Event.js             # Event schema
│   │   ├── routes/
│   │   │   ├── auth.js              # Auth routes
│   │   │   ├── events.js            # Event routes
│   │   │   ├── users.js             # User routes
│   │   │   └── admin.js             # Admin routes
│   │   ├── services/
│   │   │   └── scheduler.js         # Scheduled tasks
│   │   ├── utils/
│   │   │   └── generateToken.js     # JWT token generation
│   │   └── app.js                   # Express app setup
│   ├── package.json
│   └── env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx           # Navigation component
│   │   │   ├── Footer.jsx           # Footer component
│   │   │   ├── ProtectedRoute.jsx   # Route protection
│   │   │   └── AdminRoute.jsx       # Admin route protection
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Authentication context
│   │   ├── pages/
│   │   │   ├── Home.jsx             # Landing page
│   │   │   ├── Login.jsx            # Login page
│   │   │   ├── Register.jsx         # Registration page
│   │   │   ├── Events.jsx           # Events listing
│   │   │   ├── EventDetail.jsx      # Event details
│   │   │   ├── Dashboard.jsx        # User dashboard
│   │   │   └── AdminPanel.jsx       # Admin panel
│   │   ├── services/
│   │   │   ├── api.js               # API configuration
│   │   │   ├── authService.js       # Auth API calls
│   │   │   ├── eventService.js      # Event API calls
│   │   │   └── adminService.js      # Admin API calls
│   │   ├── App.jsx                  # Main app component
│   │   ├── main.jsx                 # React entry point
│   │   └── index.css                # Global styles
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── env.example
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. **Clone and navigate to backend**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp env.example .env
   ```
   Edit `.env` with your configuration:
   ```env
   MONGODB_URI=mongodb://localhost:27017/event-aggregator
   JWT_SECRET=your-super-secret-jwt-key
   ```

4. **Start MongoDB** (if using local)
   ```bash
   # Start MongoDB service
   mongod
   ```

5. **Run the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

### Frontend Setup

1. **Navigate to frontend**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp env.example .env
   ```
   Edit `.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 📊 Database Schema

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: 'STUDENT', 'ADMIN'),
  bookmarks: [ObjectId] (ref: Event),
  createdAt: Date,
  updatedAt: Date
}
```

### Event Model
```javascript
{
  title: String (required),
  description: String (required),
  type: String (enum: 'HACKATHON', 'CODING_FEST', 'INTERNSHIP', 'WORKSHOP', 'CONFERENCE', 'COMPETITION'),
  date: Date (required),
  location: String,
  link: String,
  tags: [String],
  eligibility: String,
  deadline: Date,
  isActive: Boolean (default: true),
  bookmarkedBy: [ObjectId] (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile

### Events
- `GET /api/events` - Get all events (with filters)
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create event (Admin only)
- `PUT /api/events/:id` - Update event (Admin only)
- `DELETE /api/events/:id` - Delete event (Admin only)

### Users
- `GET /api/users/bookmarks` - Get user's bookmarks
- `POST /api/users/bookmarks/:eventId` - Add bookmark
- `DELETE /api/users/bookmarks/:eventId` - Remove bookmark
- `GET /api/users/bookmarks/:eventId/check` - Check bookmark status

### Admin
- `GET /api/admin/users` - Get all users
- `GET /api/admin/stats` - Get platform statistics
- `PUT /api/admin/users/:id/role` - Update user role
- `DELETE /api/admin/users/:id` - Delete user

## 🔧 Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/event-aggregator
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=30d
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## 🚀 Deployment

### Backend Deployment (Heroku)
1. Create Heroku app
2. Add MongoDB Atlas addon
3. Set environment variables
4. Deploy with Git

### Frontend Deployment (Vercel/Netlify)
1. Connect repository
2. Set build command: `npm run build`
3. Set environment variables
4. Deploy

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@eventaggregator.com or create an issue in the repository.

## 🔮 Future Enhancements

- [ ] Email notifications for new events
- [ ] Push notifications
- [ ] Social media integration
- [ ] Event recommendations
- [ ] Calendar integration
- [ ] Mobile app
- [ ] Advanced analytics
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Event submission by users
- [ ] Review and rating system 