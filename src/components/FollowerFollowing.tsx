import React, { useState } from 'react';
import { UserDetailData } from '../models/user';

interface FollowerFollowingProps {
  userDetails: UserDetailData;
}

const FollowerFollowing: React.FC<FollowerFollowingProps> = ({ userDetails }) => {
  const [view, setView] = useState<'followers' | 'following' | null>(null);

  const toggleView = (type: 'followers' | 'following') => {
    setView(view === type ? null : type);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '10px' }}>
        <div onClick={() => toggleView('followers')} style={{ cursor: 'pointer', textAlign: 'center' }}>
          <strong>{userDetails.followers?.length || 0}</strong>
          <div>Followers</div>
        </div>
        <div onClick={() => toggleView('following')} style={{ cursor: 'pointer', textAlign: 'center' }}>
          <strong>{userDetails.following?.length || 0}</strong>
          <div>Following</div>
        </div>
      </div>

      {/* Conditional Rendering for Followers and Following Lists */}
      {view === 'followers' && (
        <div>
          <h3>Followers</h3>
          <ul>
            {userDetails.followers?.map((follower) => (
              <li key={follower.userId}>{follower.username}</li>
            ))}
          </ul>
        </div>
      )}

      {view === 'following' && (
        <div>
          <h3>Following</h3>
          <ul>
            {userDetails.following?.map((following) => (
              <li key={following.userId}>{following.username}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FollowerFollowing;
