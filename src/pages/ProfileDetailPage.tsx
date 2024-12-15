import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getUserData, getUserProfilePicture } from '../api/getUserData';
import { getPostsByUser } from '../api/getPosts';
import { UserDetailData } from '../models/user';
import { Post } from '../models/post';
import PostGrid from '../components/PostGrid';
import PostModal from '../components/PostModal';
import FollowerFollowing from '../components/FollowerFollowing';
import FollowButton from '../components/FollowButton'; // FollowButton component
import { getUserId } from '../services/authService';

const ProfileDetailPage = () => {
    const { id } = useParams<{ id: string }>(); // Get the user ID from the route
    const [userDetails, setUserDetails] = useState<UserDetailData | null>(null);
    const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null); // For modal

    const navigate = useNavigate();

    // Get logged-in user's ID from localStorage
    const loggedInUserId = getUserId();

    useEffect(() => {
        if (!id) {
            setError('User ID is missing.');
            return;
        }

        const fetchUserData = async () => {
            try {
                const [data, profilePictureResponse, userPosts] = await Promise.all([
                    getUserData(id), // Use the user ID from params
                    getUserProfilePicture(id),
                    getPostsByUser(id)
                ]);

                setUserDetails(data);

                if (profilePictureResponse) {
                    const imageUrl = URL.createObjectURL(profilePictureResponse);
                    setProfilePictureUrl(imageUrl);
                }

                setPosts(userPosts);
            } catch (err) {
                setError('Failed to fetch user data. Please try again.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();

        return () => {
            if (profilePictureUrl) {
                URL.revokeObjectURL(profilePictureUrl);
            }
        };
    }, [id]); // Run this effect when the ID changes

    const openPostModal = (post: Post) => {
        setSelectedPost(post);
    };

    const closePostModal = () => {
        setSelectedPost(null);
    };

    return (
        <div>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {userDetails && (
                <div>
                    {profilePictureUrl && (
                        <div>
                            <p><strong>Username:</strong> {userDetails.username}</p>
                            <h3>Profile Picture</h3>
                            <img
                                src={profilePictureUrl}
                                alt="Profile"
                                style={{ width: '150px', height: '150px', borderRadius: '50%' }}
                            />
                        </div>
                    )}
                    <h2>Profile Information</h2>
                    <p><strong>Name:</strong> {userDetails.firstName} {userDetails.surName}</p>
                    <FollowerFollowing userDetails={userDetails} />
                    <FollowButton 
                        userId={loggedInUserId || ''} // Pass the logged-in user's ID
                        followerUserId={id || ''} // User being followed
                        followers={userDetails.followers || []} 
                    />

                    {/* Posts in grid layout */}
                    <h2>User Posts</h2>
                    {posts.length > 0 ? (
                        <PostGrid posts={posts} openPostModal={openPostModal} />
                    ) : (
                        <p>No posts available.</p>
                    )}

                    {/* Modal for larger view */}
                    {selectedPost && (
                        <PostModal post={selectedPost} onClose={closePostModal} />
                    )}
                </div>
            )}
        </div>
    );
};

export default ProfileDetailPage;
