// App.tsx
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/NavBar'; // Import the Navbar component
import AppRoutes from './routes/routes'; // Import your routes

function App() {
  return (
    <Router>
      <AppRoutes /> {/* Render the routes */}
      <Navbar /> {/* Add the Navbar here */}
    </Router>
  );
}

export default App;
