import { redirect } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
export function getTokenDuration() {
  const storedExpirationDate = localStorage.getItem('expiration');
  const expirationDate = new Date(storedExpirationDate);
  const now = new Date();
  const duration = expirationDate.getTime() - now.getTime();
  return duration;
}

export function getAuthToken() {
  const token = localStorage.getItem('token');

  if (!token) {
    return null;
  }

  const tokenDuration = getTokenDuration();

  if (tokenDuration < 0) {
    return 'EXPIRED';
  }

  return token;
}

export function tokenLoader() {
  const token = getAuthToken();
  return token;
}

export function checkAuthLoader() {
  const token = getAuthToken();

  if (!token) {
    return redirect('/auth?mode=login');
  }
  return null;
}

export function getUserRole() {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return null;  
  }

  try {
    const decodedToken = jwtDecode(token);
    
    return decodedToken.user_type || null;  
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;  
  }
}

export function isManager() {
  const role = getUserRole();
  return role === 'manager';  // Adjust according to your role definition
}
