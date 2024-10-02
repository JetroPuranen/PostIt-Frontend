// pages/ProfilePage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserData } from '../api/getUserData'; // Update the path as necessary
import { getUserId } from '../services/authService'; // Import getUserId to fetch the user ID from localStorage
import { UserDetailData } from '../models/user'

const ProfilePage = () => {
    const [userDetails, setUserDetails] = useState<UserDetailData | null>(null);
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            const userId = getUserId(); // Get the logged-in user's ID
            if (!userId) {
                setError('User not logged in.');
                navigate('/login'); // Redirect to login if not authenticated
                return;
            }

            try {
                const data = await getUserData(userId);
                setUserDetails(data);
            } catch (err) {
                setError('Failed to fetch user data. Please try again.');
                console.error(err);
            }
        };

        fetchUserData();
    }, [navigate]);

    return (
        <div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {userDetails ? (
                <div>
                    <h2>Profile Information</h2>
                    <p><strong>Username:</strong> {userDetails.username}</p>
                    <p><strong>First Name:</strong> {userDetails.firstName}</p>
                    <p><strong>Sur Name:</strong> {userDetails.surName}</p>
                    {/* Uncomment below if profilePicture is included in the UserDetailDto */}
                    {/* {userDetails.profilePicture && <img src={`data:image/jpeg;base64,${userDetails.profilePicture}`} alt="Profile" />} */}
                </div>
            ) : (
                <p>Loading user details...</p>
            )}
        </div>
    );
};

export default ProfilePage;
