import axios from 'axios';
import { UserDetailData } from '../models/user'; // Make sure to update the path as necessary

export const getUserData = async (userId: string): Promise<UserDetailData> => {
    const response = await axios.get<UserDetailData>(`https://localhost:7035/api/Database/getUser/${userId}`);
    return response.data;
};