// components/RegisterUser.tsx
import React, { useState } from 'react';
import { registerUser } from '../api/auth';
import { UserRegistrationData } from '../models/user';

interface RegisterUserProps {
  onSuccess: () => void; // Callback to trigger after successful registration
}

const RegisterUser: React.FC<RegisterUserProps> = ({ onSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [surName, setSurName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [homeAddress, setHomeAddress] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profilePicture) {
      setError('Profile picture is required.');
      return;
    }
    try {
      const userData: UserRegistrationData = {
        username,
        password,
        firstName,
        surName,
        emailAddress,
        homeAddress,
        birthDay: new Date(birthDay),
        profilePicture,
      };
      const response = await registerUser(userData);
      if (response.userId) {
        setError('User registered successfully. You can now log in.');
        onSuccess(); 
      }
    } catch (err) {
      setError('Failed to register. Please try again.');
    }
  };

  return (
    <div>
      <h2>Register</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleRegister}>
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
        <div>
          <label>First Name:</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div>
          <label>Surname:</label>
          <input
            type="text"
            value={surName}
            onChange={(e) => setSurName(e.target.value)}
          />
        </div>
        <div>
          <label>Email Address:</label>
          <input
            type="email"
            value={emailAddress}
            onChange={(e) => setEmailAddress(e.target.value)}
          />
        </div>
        <div>
          <label>Home Address:</label>
          <input
            type="text"
            value={homeAddress}
            onChange={(e) => setHomeAddress(e.target.value)}
          />
        </div>
        <div>
          <label>Birthday:</label>
          <input
            type="date"
            value={birthDay}
            onChange={(e) => setBirthDay(e.target.value)}
          />
        </div>
        <div>
          <label>Profile Picture:</label>
          <input
            type="file"
            onChange={(e) =>
              setProfilePicture(e.target.files ? e.target.files[0] : null)
            }
          />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterUser;
