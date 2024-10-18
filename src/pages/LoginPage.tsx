// pages/LoginPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/auth';
import { saveTokenAndUserId, clearAuthData } from '../services/authService'; // Import clearAuthData
import RegisterUser from '../components/RegisterUser';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false); // Toggle registration mode
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Clear existing auth data before logging in
      clearAuthData(); 

      const response = await loginUser(username, password);
      if (response.token && response.userId) {
        saveTokenAndUserId(response.token, response.userId);
        
        console.log('User ID:', response.userId);
        console.log('Token:', response.token);
        
        navigate(`/postit/profile/${response.userId}`);
      } else {
        setError('Invalid username or password.');
      }
    } catch (err) {
      setError('Failed to login. Please try again.');
    }
  };

  // Callback after successful registration to go back to login form
  const handleRegistrationSuccess = () => {
    setIsRegistering(false);
    setError('User registered successfully. You can now log in.');
  };

  return (
    <div>
      {!isRegistering ? (
        <>
          <h2>Login</h2>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <form onSubmit={handleLogin}>
            <div>
              <label>Username:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit">Login</button>
            <p>
              Don't have an account?{' '}
              <button type="button" onClick={() => setIsRegistering(true)}>
                Register
              </button>
            </p>
          </form>
        </>
      ) : (
        <RegisterUser onSuccess={handleRegistrationSuccess} />
      )}
    </div>
  );
};

export default LoginPage;
