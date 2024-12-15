import React, { useState } from 'react';
import { followUser, unfollowUser } from '../api/FollowUnfollowUser'; // Import your API functions

interface FollowButtonProps {
    userId: string; // ID of the logged-in user
    followerUserId: string; // ID of the user being followed/unfollowed
    followers: { userId: string }[]; // Array of follower objects
}

const FollowButton: React.FC<FollowButtonProps> = ({ userId, followerUserId, followers }) => {
    const [isFollowing, setIsFollowing] = useState<boolean>(
        followers.some((follower) => follower.userId === userId)
    );
    const [error, setError] = useState<string>('');

    const handleToggleFollow = async () => {
        try {
            if (isFollowing) {
                await unfollowUser({ 
                    UserId: userId, 
                    FollowerUserId: followerUserId // The user being unfollowed 
                });
            } else {
                await followUser({ 
                    UserId: userId, 
                    FollowerUserId: followerUserId // The user being followed
                });
            }
            setIsFollowing(!isFollowing);
        } catch (err) {
            setError('Failed to update follow status. Please try again.');
            console.error(err);
        }
    };

    return (
        <div>
            <button onClick={handleToggleFollow} style={{ padding: '10px 20px', margin: '10px 0' }}>
                {isFollowing ? 'Unfollow' : 'Follow'}
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default FollowButton;