'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-redux';
import { login, register, getProfile, logout } from '@/store/slices/authSlice';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

/**
 * Example authentication component showing Redux integration
 * Demonstrates:
 * - Login functionality
 * - Register functionality
 * - Profile fetching
 * - Logout
 * - Error handling and loading states
 */
export function AuthExample() {
  const { user, loading, error, isAuthenticated, dispatch } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isLoginMode, setIsLoginMode] = useState(true);

  // Fetch profile on mount if authenticated
  useEffect(() => {
    if (isAuthenticated && !user) {
      dispatch(getProfile());
    }
  }, [isAuthenticated, user, dispatch]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(login({ username, password }));
    setUsername('');
    setPassword('');
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(
      register({
        username,
        email,
        password,
        password_confirm: password,
      })
    );
    setUsername('');
    setEmail('');
    setPassword('');
    setIsLoginMode(true);
  };

  const handleLogout = async () => {
    await dispatch(logout());
  };

  if (isAuthenticated && user) {
    return (
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Welcome!</h2>
        <p className="mb-2">Username: {user.username}</p>
        <p className="mb-4">Email: {user.email}</p>
        <Button onClick={handleLogout} variant="destructive">
          Logout
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-6 max-w-md">
      <h2 className="text-2xl font-bold mb-4">
        {isLoginMode ? 'Login' : 'Register'}
      </h2>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

      <form onSubmit={isLoginMode ? handleLogin : handleRegister} className="space-y-4">
        <div>
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        {!isLoginMode && (
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        )}

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Loading...' : isLoginMode ? 'Login' : 'Register'}
        </Button>
      </form>

      <button
        type="button"
        onClick={() => setIsLoginMode(!isLoginMode)}
        className="text-blue-600 mt-4 text-sm"
      >
        {isLoginMode ? "Don't have an account? Register" : 'Already have an account? Login'}
      </button>
    </Card>
  );
}
