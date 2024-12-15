// Explore.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserDetailData } from '../models/user';
import { Post } from '../models/post';
import { getUserData } from '../api/getUserData'; 
import { getPostsByUser } from '../api/getPosts'; 
import SearchBar from '../components/Searchbar'; 
import ExplorePost from '../components/ExplorePost'; 

const Explore: React.FC = () => {
    const [searchResults, setSearchResults] = useState<UserDetailData[]>([]); // Stores search results
    const [followingUsersWithPosts, setFollowingUsersWithPosts] = useState<(UserDetailData & { posts: Post[] })[]>([]); // Stores users with their posts
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch the following users and their posts
        const fetchFollowingPosts = async () => {
            try {
                setLoading(true);
                const userId = localStorage.getItem('userId'); // Retrieve logged-in user's ID
                if (!userId) {
                    setError('User not logged in');
                    navigate('/login');
                    return;
                }

                const userData = await getUserData(userId); // Get user details
                if (userData.following) {
                    const usersWithPosts = await Promise.all(
                        userData.following.map(async (followedUser) => {
                            // Fetch posts for each followed user
                            const posts = await getPostsByUser(followedUser.userId);
                            return { ...followedUser, posts }; // Add posts to the followed user
                        })
                    );
                    setFollowingUsersWithPosts(usersWithPosts); // Store users with their posts
                }
            } catch (err) {
                console.error('Failed to load posts:', err);
                setError('Failed to load posts.');
            } finally {
                setLoading(false);
            }
        };

        fetchFollowingPosts(); // Call the function to load data
    }, []);

    const handleSearch = (results: UserDetailData[]) => {
        setSearchResults(results);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            {/* Search Bar at the top */}
            <SearchBar onSearch={handleSearch} />

            {/* Display Search Results */}
            {searchResults.length > 0 && (
                <ul>
                    {searchResults.map((user, index) => (
                        <li key={index} style={{ cursor: 'pointer', margin: '10px 0' }} onClick={() => navigate(`/postit/profile/${user.userId}`)}>
                            <div style={{ display: 'flex', alignItems: 'center', padding: '10px', borderRadius: '5px', border: '1px solid #ddd', backgroundColor: '#f9f9f9' }}>
                                <img src={user.profilePictureUrl} alt={`${user.username}'s profile`} style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '10px' }} />
                                <h4 style={{ margin: 0 }}>{user.username}</h4>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {/* Loop through each user and their posts */}
            {followingUsersWithPosts.length > 0 ? (
                followingUsersWithPosts.map((userWithPosts, index) => (
                    <ExplorePost key={index} user={userWithPosts} posts={userWithPosts.posts} />
                ))
            ) : (
                <p>No posts to show</p>
            )}
        </div>
    );
};

export default Explore;
