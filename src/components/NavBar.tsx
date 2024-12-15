// src/components/Navbar.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { getUserId } from '../services/authService'; // Import the function to get the user ID
import '../styles/Navbar.css'; // Assuming you have some styles for your Navbar

const Navbar: React.FC = () => {
    const userId = getUserId(); // Get the user ID from local storage

    return (
        <nav className="navbar">
            <ul>
                <li>
                    <Link to="/explore">Explore</Link>
                </li>
                <li>
                    <Link to="/add-post">Add Post</Link>
                </li>
                {/* Use userId to navigate to the profile page */}
                {userId && (
                    <li>
                        <Link to={`/postit/profile/`}>Profile</Link>
                    </li>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
