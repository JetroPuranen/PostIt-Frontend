import React, { useEffect, useState } from 'react';
import { Post } from '../models/post';
import { getPostImage } from '../api/getPosts'; // Import the function to fetch images
import '../styles/PostModal.css';

type PostModalProps = {
    post: Post;
    onClose: () => void;
};

const PostModal: React.FC<PostModalProps> = ({ post, onClose }) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null); // Store the image URL

    useEffect(() => {
        // Fetch the post image when the modal is opened
        const fetchPostImage = async () => {
            const imageBlob = await getPostImage(post.id); // Fetch the image as a Blob
            if (imageBlob) {
                const url = URL.createObjectURL(imageBlob);
                setImageUrl(url);
            }
        };

        fetchPostImage();

        // Cleanup the object URL when the component unmounts
        return () => {
            if (imageUrl) {
                URL.revokeObjectURL(imageUrl);
            }
        };
    }, [post.id]); // Remove imageUrl from the dependency array

    return (
        <div className="post-modal-overlay" onClick={onClose}>
            <div className="post-modal-content" onClick={(e) => e.stopPropagation()}>
                {imageUrl ? (
                    <img src={imageUrl} alt="Post" className="post-modal-image" />
                ) : (
                    <div className="image-placeholder">Loading...</div>
                )}
                <div className="post-modal-details">
                    <p><strong>Likes:</strong> {post.likeCount}</p>
                    <p><strong>Caption:</strong> {post.caption}</p>
                    <p><strong>Comments:</strong> {post.comments?.join(', ') || 'No comments'}</p>
                    <p><strong>Liked By:</strong> {post.whoHasLiked?.join(', ') || 'No likes yet'}</p>
                </div>
                <button className="close-button" onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default PostModal;
