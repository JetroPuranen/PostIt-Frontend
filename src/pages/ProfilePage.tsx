import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserData, getUserProfilePicture } from '../api/getUserData';
import { getPostsByUser } from '../api/getPosts'; 
import { getUserId } from '../services/authService';
import { UserDetailData } from '../models/user';
import { Post } from '../models/post';
import PostGrid from '../components/PostGrid';
import PostModal from '../components/PostModal';
import FollowerFollowing from '../components/FollowerFollowing';

const ProfilePage = () => {
    const [userDetails, setUserDetails] = useState<UserDetailData | null>(null);
    const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null); // For modal

    const navigate = useNavigate();

    useEffect(() => {
        const userId = getUserId();
        if (!userId) {
            setError('User not logged in.');
            navigate('/login');
            return;
        }

        const fetchUserData = async () => {
            try {
                const [data, profilePictureResponse, userPosts] = await Promise.all([
                    getUserData(userId),
                    getUserProfilePicture(userId),
                    getPostsByUser(userId)
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
    }, []); 

    const openPostModal = (post: Post) => {
        setSelectedPost(post);
    };

    const closePostModal = () => {
        setSelectedPost(null);
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div>
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

                    <h2>User Posts</h2>
                    {posts.length > 0 ? (
                        <PostGrid posts={posts} openPostModal={openPostModal} />
                    ) : (
                        <p>No posts available.</p>
                    )}

                    {selectedPost && (
                        <PostModal post={selectedPost} onClose={closePostModal} />
                    )}
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
