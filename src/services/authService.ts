// services/authService.ts
export const saveTokenAndUserId = (token: string, userId: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
  };
  
  export const getToken = () => {
    return localStorage.getItem('token');
  };
  
  export const getUserId = () => {
    return localStorage.getItem('userId');
  };
  
  export const clearAuthData = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  };
  export{}