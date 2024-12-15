import axios from 'axios';
import { FollowUnfollow } from '../models/FollowUnfollow';

const BASE_URL = 'https://localhost:7047/api/FrontEnd';

export const followUser = async (data: FollowUnfollow): Promise<void> => {
    try {
        const formData = new FormData();
        formData.append('UserId', data.UserId);
        formData.append('FollowerUserId', data.FollowerUserId);

        await axios.post(`${BASE_URL}/addFollower`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log(data);
    } catch (error) {
        console.error('Error following user:', error);
        throw new Error('Failed to follow user.');
    }
};

export const unfollowUser = async (data: FollowUnfollow): Promise<void> => {
    try {
        const formData = new FormData();
        formData.append('UserId', data.UserId);
        formData.append('UnfollowUserId', data.FollowerUserId); 

        await axios.post(`${BASE_URL}/unfollowUser`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    } catch (error) {
        console.error('Error unfollowing user:', error);
        throw new Error('Failed to unfollow user.');
    }
};

