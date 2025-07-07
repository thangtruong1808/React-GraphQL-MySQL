import { useMutation, useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { LOGIN, REGISTER, LOGOUT } from '../../services/graphql/mutations';
import { GET_CURRENT_USER } from '../../services/graphql/queries';
import { LoginInput, RegisterInput, AuthResponse, User } from '../../types/graphql';

export const useAuth = () => {
  const navigate = useNavigate();

  // Login mutation
  const [login, { loading: loginLoading, error: loginError }] = useMutation(LOGIN, {
    onCompleted: (data: { login: AuthResponse }) => {
      localStorage.setItem('authToken', data.login.token);
      localStorage.setItem('user', JSON.stringify(data.login.user));
      navigate('/dashboard');
    },
    onError: (error) => {
      console.error('Login error:', error);
    },
  });

  // Register mutation
  const [register, { loading: registerLoading, error: registerError }] = useMutation(REGISTER, {
    onCompleted: (data: { register: AuthResponse }) => {
      localStorage.setItem('authToken', data.register.token);
      localStorage.setItem('user', JSON.stringify(data.register.user));
      navigate('/dashboard');
    },
    onError: (error) => {
      console.error('Register error:', error);
    },
  });

  // Logout mutation
  const [logout] = useMutation(LOGOUT, {
    onCompleted: () => {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      navigate('/login');
    },
    onError: (error) => {
      console.error('Logout error:', error);
      // Still clear local storage even if server logout fails
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      navigate('/login');
    },
  });

  // Get current user
  const { data: currentUserData, loading: currentUserLoading, error: currentUserError } = useQuery(GET_CURRENT_USER, {
    skip: !localStorage.getItem('authToken'),
  });

  const handleLogin = async (input: LoginInput) => {
    try {
      await login({ variables: { input } });
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleRegister = async (input: RegisterInput) => {
    try {
      await register({ variables: { input } });
    } catch (error) {
      console.error('Register failed:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isAuthenticated = !!localStorage.getItem('authToken');
  const currentUser = currentUserData?.currentUser || JSON.parse(localStorage.getItem('user') || 'null');

  return {
    // State
    isAuthenticated,
    currentUser,
    currentUserLoading,
    currentUserError,
    
    // Actions
    handleLogin,
    handleRegister,
    handleLogout,
    
    // Loading states
    loginLoading,
    registerLoading,
    
    // Errors
    loginError,
    registerError,
  };
}; 