import { RegisterFormData } from '../types';

export const loginApi = async (email: string, password: string) => {
    const response = await fetch('https://dylexia.onrender.com/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
  
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.detail || 'Login failed');
    }
    return data;
  };
  
  export const registerApi = async (data: RegisterFormData) => {
    try {
      const response = await fetch('https://dylexia.onrender.com/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || errorData.message || 'Registration failed');
      }
  
      return await response.json();
    } catch (error: any) {
      throw new Error(error.message || 'An unexpected error occurred');
    }
  };