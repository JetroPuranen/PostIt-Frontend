import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getUserId } from '../services/authService';
import '../styles/AddPost.css'; // Assuming you create a CSS file for this component

const AddPost = () => {
    const [caption, setCaption] = useState<string>(''); // State for caption
    const [image, setImage] = useState<File | null>(null); // State for the image file
    const [previewUrl, setPreviewUrl] = useState<string | null>(null); // State for the image preview URL
    const [error, setError] = useState<string>(''); // State for error handling
    const [loading, setLoading] = useState<boolean>(false); // Loading state
    const navigate = useNavigate(); // For navigation after successful submission

    // Handler for image selection
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            // Create a preview URL for the selected image
            const previewUrl = URL.createObjectURL(file);
            setPreviewUrl(previewUrl);
        }
    };

    // Submit handler to send the form data
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const userId = getUserId();
        if (!userId) {
            setError('User is not logged in.');
            setLoading(false);
            return;
        }

        if (!image) {
            setError('Please upload an image.');
            setLoading(false);
            return;
        }

        try {
            // Prepare the form data to send the post
            const formData = new FormData();
            formData.append('postDto.UserId', userId);
            formData.append('postDto.Caption', caption);
            formData.append('postPicture', image);

            const response = await axios.post(
                'https://localhost:7047/api/FrontEnd/addPost',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            console.log('Post created successfully:', response.data);
            navigate(`/postit/profile/${userId}`);
        } catch (err) {
            console.error('Error creating post:', err);
            setError('Failed to create post. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-post-container">
            <h2>Create a New Post</h2>
            <form onSubmit={handleSubmit} className="add-post-form">
                <div className="form-group">
                    <label htmlFor="caption">Caption:</label>
                    <input
                        type="text"
                        id="caption"
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        placeholder="Write your caption here"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="image">Upload Image:</label>
                    <input
                        type="file"
                        id="image"
                        accept="image/*"
                        onChange={handleImageChange}
                        required
                    />
                </div>

                {/* Image Preview */}
                {previewUrl && (
                    <div className="image-preview">
                        <img src={previewUrl} alt="Preview" className="preview-image" />
                    </div>
                )}

                {/* Updated button class name */}
                <button type="submit" className="add-post-button" disabled={loading}>
                    {loading ? 'Posting...' : 'Add Post'}
                </button>
            </form>

            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default AddPost;
