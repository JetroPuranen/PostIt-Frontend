import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserData, getUserProfilePicture } from '../api/getUserData';
import { getPostsByUser, getPostImage, getPostById } from '../api/getPosts'; // Corrected function import
import { getUserId } from '../services/authService';
import { UserDetailData } from '../models/user';
import { Post } from '../models/post';

const ProfilePage = () => {
    const [userDetails, setUserDetails] = useState<UserDetailData | null>(null);
    const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null);
    const [posts, setPosts] = useState<Post[]>([]); // State for multiple posts
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            const userId = getUserId();
            if (!userId) {
                setError('User not logged in.');
                navigate('/login');
                return;
            }
    
            try {
                const data = await getUserData(userId);
                setUserDetails(data);
    
                
                const profilePictureResponse = await getUserProfilePicture(userId);
                if (profilePictureResponse) {
                    const imageUrl = URL.createObjectURL(profilePictureResponse);
                    setProfilePictureUrl(imageUrl);
                }
    
                
                const userPosts = await getPostsByUser(userId); 
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
    }, [navigate, profilePictureUrl]);

    return (
        <div>
            {userDetails ? (
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

                    {/* New section for user posts */}
                    <h2>User Posts</h2>
                    {posts.length > 0 ? (
                        posts.map((post) => (
                            <PostCard key={post.id} postId={post.id} />
                        ))
                    ) : (
                        <p>No posts available.</p>
                    )}
                </div>
            ) : (
                <p>No user details available.</p>
            )}
        </div>
    );
};

const PostCard = ({ postId }: { postId: string }) => {
    const [post, setPost] = useState<Post | null>(null);
    const [postImageUrl, setPostImageUrl] = useState<string | null>(null);

    useEffect(() => {
        const fetchPostData = async () => {
            try {
                // Fetch post details
                const postResponse = await getPostById(postId); 
                setPost(postResponse); 

                // Fetch the post image
                const imageResponse = await getPostImage(postId); 
                if (imageResponse) {
                    const imageUrl = URL.createObjectURL(imageResponse);
                    setPostImageUrl(imageUrl);
                }
            } catch (error) {
                console.error("Failed to fetch post data:", error);
            }
        };

        fetchPostData();

        return () => {
            if (postImageUrl) {
                URL.revokeObjectURL(postImageUrl);
            }
        };
    }, [postId, postImageUrl]);

    if (!post) return null; 

    return (
        <div style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
            {postImageUrl && (
                <img
                    src={postImageUrl}
                    alt="Post"
                    style={{ width: '100%', height: 'auto', maxHeight: '300px', objectFit: 'cover' }}
                />
            )}
            <p><strong>Likes:</strong> {post.likeCount}</p>
            <p><strong>Caption:</strong> {post.caption}</p>
            {/* Fallback to empty array if comments or whoHasLiked is null */}
            <p><strong>Comments:</strong> {post.comments?.join(', ') || 'No comments'}</p>
            <p><strong>Liked By:</strong> {post.whoHasLiked?.join(', ') || 'No likes yet'}</p>
        </div>
    );
};

export default ProfilePage;
