import React, { useState, useEffect } from 'react';
import { Post } from '../models/post';
import { getPostImage } from '../api/getPosts'; 
import { getUserProfilePicture } from '../api/getUserData'; 
import '../styles/PostGrid.css'; 
type ExplorePostProps = {
    user: {
        userId: string;
        username?: string;
        profilePictureUrl?: string; // This will be the default or fallback URL
    };
    posts: Post[];
};

const ExplorePost: React.FC<ExplorePostProps> = ({ user, posts }) => {
    // State to store image URLs for posts and profile picture
    const [postImages, setPostImages] = useState<Map<string, string>>(new Map());
    const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null); // Store profile picture URL

    // Fetch profile picture and post images when component mounts
    useEffect(() => {
        // Fetch the profile picture for the user
        const fetchProfilePicture = async () => {
            if (user.profilePictureUrl) {
                setProfileImageUrl(user.profilePictureUrl); // If URL is available, use it
            } else {
                const profileImageBlob = await getUserProfilePicture(user.userId); // Fetch profile picture as a Blob
                if (profileImageBlob) {
                    const profileImageUrl = URL.createObjectURL(profileImageBlob); // Convert Blob to Object URL
                    setProfileImageUrl(profileImageUrl); // Set the profile image URL state
                }
            }
        };

        // Fetch images for each post
        const fetchPostImages = async () => {
            const newPostImages = new Map(postImages);
            for (const post of posts) {
                // Fetch the post image if it's not already in the state
                if (!newPostImages.has(post.id)) {
                    const imageBlob = await getPostImage(post.id); // Fetch post image as Blob
                    if (imageBlob) {
                        const imageUrl = URL.createObjectURL(imageBlob); // Convert Blob to Object URL
                        newPostImages.set(post.id, imageUrl); // Add image URL to map
                    }
                }
            }
            setPostImages(newPostImages); // Update state with new image URLs
        };

        fetchProfilePicture(); // Fetch profile picture
        fetchPostImages(); // Fetch post images

    }, [user.userId, posts]); // Fetch data when userId or posts change

    return (
        <div style={{ marginBottom: '20px' }}>
            {/* Display user profile and username */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                {/* Use the profile image URL state for profile picture */}
                <img
                    src={profileImageUrl || 'default-profile-pic.jpg'} // Fallback if no profile picture URL is available
                    alt={`${user.username || 'Unknown user'}'s profile`}
                    style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '10px' }}
                />
                <h4>{user.username || 'Unknown User'}</h4>
            </div>

            {/* Post grid */}
            <div className="post-grid">
                {posts.map((post) => (
                    <div className="post-grid-item" key={post.id}>
                        {postImages.has(post.id) ? (
                            <img
                                src={postImages.get(post.id) || ''}
                                alt="User post"
                                className="post-grid-image"
                            />
                        ) : (
                            <div>Loading image...</div> // Show a loading message if the image isn't available
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ExplorePost;
