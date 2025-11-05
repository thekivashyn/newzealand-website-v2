// Qwik composable for auth actions
import { useStore, $ } from '@builder.io/qwik';
import { authStore, authActions } from '~/store/auth';
import { authLogin, authSignup, authVerify, AuthService } from '../services/auth.service';

export const useAuthActions = () => {
  const login = $(async (email: string, password: string, rememberMe = false): Promise<void> => {
    authActions.setLoading(true);
    try {
      const response = await authLogin({ email, password, rememberMe });
      authActions.login(response.user, response.token);
      AuthService.setAuthToken(response.token);
      AuthService.setUser(response.user);
    } catch (error: any) {
      authActions.setError(error.message || 'Login failed');
      throw error;
    } finally {
      authActions.setLoading(false);
    }
  });

  const signup = $(async (email: string, password: string) => {
    authActions.setLoading(true);
    try {
      const response = await authSignup({ email, password });
      authActions.login(response.user, response.token);
      AuthService.setAuthToken(response.token);
      AuthService.setUser(response.user);
    } catch (error: any) {
      authActions.setError(error.message || 'Signup failed');
      throw error;
    } finally {
      authActions.setLoading(false);
    }
  });

  const logout = $(() => {
    authActions.logout();
  });

  const clearError = $(() => {
    authActions.setError(null);
  });

  const updateUser = $((user: any) => {
    authActions.updateUser(user);
  });

  const refreshAuth = $(async () => {
    const token = AuthService.getAuthToken();
    if (!token) return;
    
    try {
      const { user } = await authVerify(token);
      authActions.initialize(user, token);
    } catch {
      authActions.logout();
    }
  });

  return {
    login,
    signup,
    logout,
    clearError,
    updateUser,
    refreshAuth,
  };
};

export const useAuth = () => {
  const store = useStore(authStore);
  const actions = useAuthActions();
  
  return {
    ...store,
    ...actions,
  };
};

