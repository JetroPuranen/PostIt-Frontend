import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserDetailData } from '../models/user'; // Adjust the path accordingly
import { getUserProfilePicture } from '../api/getUserData'; // Adjust the path accordingly

const Explore: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [suggestions, setSuggestions] = useState<UserDetailData[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const debounce = (func: Function, delay: number) => {
        let timeoutId: NodeJS.Timeout;
        return (...args: any[]) => {
            if (timeoutId) clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func(...args);
            }, delay);
        };
    };

    const fetchSuggestions = async (term: string) => {
        if (!term) {
            setSuggestions([]);
            return;
        }
        setLoading(true);
        try {
            const response = await axios.get<UserDetailData[]>(`https://localhost:7035/api/Database/getUserByUsername/${term}`);
            const users = response.data;

            // Fetch profile pictures for each user
            const updatedUsers = await Promise.all(users.map(async (user) => {
                const profilePictureBlob = await getUserProfilePicture(user.userId);
                const profilePictureUrl = profilePictureBlob ? URL.createObjectURL(profilePictureBlob) : '';
                return { ...user, profilePictureUrl }; // Include the profile picture URL in the user object
            }));

            setSuggestions(updatedUsers);
        } catch (error) {
            console.error('Error fetching user suggestions:', error);
            setSuggestions([]);
        } finally {
            setLoading(false);
        }
    };

    const debouncedFetchSuggestions = debounce(fetchSuggestions, 300);

    useEffect(() => {
        debouncedFetchSuggestions(searchTerm);
    }, [searchTerm]);

    const handleUserClick = (userId?: string) => {
        if (userId) {
            navigate(`/postit/profile/${userId}`);
        } else {
            console.error("User ID is undefined or empty");
        }
    };

    return (
        <div>
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Enter username to search"
            />
            {loading && <p>Loading...</p>}
            {suggestions.length > 0 && (
                <ul>
                    {suggestions.map((user, index) => (
                        <li key={index} style={{ cursor: 'pointer', margin: '10px 0' }} onClick={() => handleUserClick(user.userId)}>
                            <div style={{ display: 'flex', alignItems: 'center', padding: '10px', borderRadius: '5px', border: '1px solid #ddd', backgroundColor: '#f9f9f9' }}>
                                <img src={user.profilePictureUrl} alt={`${user.username}'s profile`} style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '10px' }} />
                                <h4 style={{ margin: 0 }}>{user.username}</h4>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            {suggestions.length === 0 && searchTerm && !loading && (
                <p>No users found for "{searchTerm}".</p>
            )}
        </div>
    );
};

export default Explore;
