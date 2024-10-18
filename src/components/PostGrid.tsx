import React, { useEffect, useState } from 'react';
import { Post } from '../models/post';
import { getPostImage } from '../api/getPosts'; // Import the function to fetch images
import '../styles/PostGrid.css';

type PostGridProps = {
    posts: Post[];
    openPostModal: (post: Post) => void; // Function to open the modal
};

// This is the main component that will be exported
const PostGrid: React.FC<PostGridProps> = ({ posts, openPostModal }) => {
    return (
        <div className="post-grid">
            {posts.map((post) => (
                <PostGridItem key={post.id} post={post} openPostModal={openPostModal} />
            ))}
        </div>
    );
};

// Component for each post in the grid
const PostGridItem: React.FC<{ post: Post; openPostModal: (post: Post) => void }> = ({ post, openPostModal }) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null); // Store image URL

    useEffect(() => {
        // Fetch image for the post
        const fetchPostImage = async () => {
            const imageBlob = await getPostImage(post.id); // Fetch the image as a Blob
            if (imageBlob) {
                const url = URL.createObjectURL(imageBlob);
                setImageUrl(url);
            }
        };

        fetchPostImage();

        // Cleanup the image URL when component unmounts
        return () => {
            if (imageUrl) {
                URL.revokeObjectURL(imageUrl);
            }
        };
    }, [post.id]); // No need to include imageUrl in the dependency array

    return (
        <div className="post-grid-item" onClick={() => openPostModal(post)}>
            {imageUrl ? (
                <img
                    src={imageUrl}
                    alt="Post"
                    className="post-grid-image"
                />
            ) : (
                <div className="image-placeholder">Loading...</div>
            )}
        </div>
    );
};


export default PostGrid;
