import axios from 'axios';
import { Post } from '../models/post';

// Fetches a single post by ID
export const getPostById = async (postId: string): Promise<Post> => {
    const response = await axios.get<Post>(`https://localhost:7047/api/FrontEnd/getPost/${postId}`);
    return response.data;
}

// Fetches the post image by ID
export const getPostImage = async (postId: string): Promise<Blob | null> => {
    try {
        const response = await axios.get(`https://localhost:7047/api/FrontEnd/getPostImage/${postId}`, {
            responseType: 'blob', // Specify that the response should be a blob
        });
        return response.data;
    } catch (err) {
        console.error("Failed to fetch post image:", err);
        return null; 
    }
};

export const getPostsByUser = async (userId: string): Promise<Post[]> => {
    const response = await axios.get<Post[]>(`https://localhost:7047/api/FrontEnd/getPostsByUser/${userId}`);
    return response.data;
};