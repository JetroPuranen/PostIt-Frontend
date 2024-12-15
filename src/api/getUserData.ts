import axios from 'axios';
import { UserDetailData } from '../models/user'; // Make sure to update the path as necessary

// Fetches user details excluding profile picture
export const getUserData = async (userId: string): Promise<UserDetailData> => {
    const response = await axios.get<UserDetailData>(`https://localhost:7047/api/FrontEnd/getUser/${userId}`);
    return response.data;
};

// Fetches the user's profile picture as a Blob (binary data)
export const getUserProfilePicture = async (userId: string): Promise<Blob | null> => {
    try {
        const response = await axios.get(`https://localhost:7047/api/FrontEnd/downloadProfilePicture/${userId}`, {
            responseType: 'blob', // Important: Set the response type to 'blob' to handle binary data
        });
        return response.data; // This will be the image blob
    } catch (err) {
        console.error("Failed to fetch profile picture:", err);
        return null; // Handle the case where no image is found or there is an error
    }
};
