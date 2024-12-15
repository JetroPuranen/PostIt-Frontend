// api/auth.ts
import axios from 'axios';
import { UserRegistrationData } from '../models/user';
export const loginUser = async (username: string, password: string) => {
  const formData = new FormData();
  formData.append('username', username);
  formData.append('password', password);

  const response = await axios.post('https://localhost:7047/api/FrontEnd/login', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};
export const registerUser = async (userData: UserRegistrationData) => {
  const formData = new FormData();
  formData.append('Username', userData.username);
  formData.append('Password', userData.password);
  formData.append('FirstName', userData.firstName);
  formData.append('SurName', userData.surName);
  formData.append('EmailAddress', userData.emailAddress);
  formData.append('HomeAddress', userData.homeAddress);
  formData.append('BirthDay', userData.birthDay.toISOString());
  formData.append('profilePicture', userData.profilePicture);

  const response = await axios.post(
    'https://localhost:7047/api/FrontEnd/addUser',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data;
};