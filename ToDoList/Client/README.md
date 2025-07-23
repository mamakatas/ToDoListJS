# ToDoList React Frontend

A modern React frontend for the ToDoList application with authentication, task management, and real-time messaging features.

## Features

- 🔐 **Authentication**: Login/Register with JWT tokens
- 📝 **Task Management**: Create, edit, delete, and mark tasks as complete
- 🔍 **Filtering & Sorting**: Filter by status and sort by various criteria
- 💬 **Task Messages**: Add comments and messages to tasks
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🎨 **Modern UI**: Clean and intuitive user interface

## Demo Accounts

The application comes with pre-configured demo accounts:

- **Admin**: `admin` / `Admin@123`
- **User**: `user` / `User@123`

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn
- Backend API running on `https://localhost:7000`

### Installation

1. Navigate to the Client directory:
   ```bash
   cd ToDoList/Client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Building for Production

```bash
npm run build
```

This creates a `build` folder with the production-ready files.

## Project Structure

```
src/
├── components/          # React components
│   ├── Login.js        # Login form
│   ├── Register.js     # Registration form
│   ├── Dashboard.js    # Dashboard with stats
│   ├── TaskList.js     # Task list with filtering
│   ├── TaskForm.js     # Create/edit task form
│   ├── TaskDetail.js   # Task details and messages
│   ├── Navbar.js       # Navigation bar
│   └── PrivateRoute.js # Route protection
├── contexts/           # React contexts
│   └── AuthContext.js  # Authentication context
├── services/           # API services
│   └── api.js         # Axios configuration and API calls
├── App.js             # Main app component
└── index.js           # App entry point
```

## API Integration

The frontend communicates with the backend API through the following endpoints:

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/change-password` - Change password
- `GET /api/auth/profile` - Get user profiles

### Tasks
- `GET /api/task/user-tasks` - Get user's tasks
- `POST /api/task` - Create new task
- `PUT /api/task/{id}` - Update task
- `DELETE /api/task/{id}` - Delete task
- `PUT /api/task/{id}/completion` - Update task status
- `POST /api/task/{id}/messages` - Add message to task
- `GET /api/task/{id}/messages` - Get task messages

## Technologies Used

- **React 18** - Frontend framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **React Hot Toast** - Toast notifications
- **Lucide React** - Icon library
- **Date-fns** - Date formatting utilities

## Styling

The application uses custom CSS with:
- Modern gradient backgrounds
- Card-based layouts
- Responsive design
- Hover effects and transitions
- Status-based color coding

## Development

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (not recommended)

### Environment Variables

Create a `.env` file in the Client directory to customize:

```
REACT_APP_API_URL=https://localhost:7000/api
```

## Troubleshooting

### Common Issues

1. **API Connection Error**: Make sure the backend is running on `https://localhost:7000`
2. **CORS Issues**: The backend should be configured to allow requests from `http://localhost:3000`
3. **Authentication Issues**: Check that JWT tokens are being properly stored and sent

### SSL Certificate Issues

If you encounter SSL certificate issues with the backend, you may need to:
- Accept the self-signed certificate in your browser
- Or configure the backend to use a valid SSL certificate

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of the ToDoList application. 