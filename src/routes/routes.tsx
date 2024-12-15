// routes/routes.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import ProfilePage from '../pages/ProfilePage';
import AddPostPage from '../pages/AddPostPage'
import ProfileDetailPage from '../pages/ProfileDetailPage';
import Explore from '../pages/Explore';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/postit/profile" element={<ProfilePage />} /> {/* Current user profile */}
      <Route path="/postit/profile/:id" element={<ProfileDetailPage />} /> {/* Other users' profiles */}
      <Route path="/add-post" element={<AddPostPage />} />
      <Route path='/explore' element={<Explore />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default AppRoutes;
