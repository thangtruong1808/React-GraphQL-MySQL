import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useFormValidation } from '../../utils/validation';
import { emailValidation, passwordValidation, usernameValidation } from '../../utils/validation';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const RegisterPage: React.FC = () => {
  const { register, registerLoading } = useAuth();

  const { data, errors, handleChange, handleBlur, isValid } = useFormValidation(
    {
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
    },
    {
      email: emailValidation,
      username: usernameValidation,
      password: passwordValidation,
      confirmPassword: {
        required: true,
        custom: (value) => {
          if (value !== data.password) {
            return 'Passwords do not match';
          }
          return true;
        },
      },
      firstName: { maxLength: 50 },
      lastName: { maxLength: 50 },
    }
  );

  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      const { confirmPassword, username, ...registerData } = data;
      const result = await register(registerData);

      if (result?.success) {
        // Registration successful, user will be automatically logged in
        window.location.href = '/dashboard';
      } else {
        setError(result?.error || 'Registration failed');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              value={data.email}
              onChange={(e) => handleChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              error={errors.email?.[0]}
              placeholder="Enter your email"
              required
            />

            <Input
              label="Username"
              type="text"
              value={data.username}
              onChange={(e) => handleChange('username', e.target.value)}
              onBlur={() => handleBlur('username')}
              error={errors.username?.[0]}
              placeholder="Choose a username"
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                type="text"
                value={data.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                onBlur={() => handleBlur('firstName')}
                error={errors.firstName?.[0]}
                placeholder="First name"
              />

              <Input
                label="Last Name"
                type="text"
                value={data.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                onBlur={() => handleBlur('lastName')}
                error={errors.lastName?.[0]}
                placeholder="Last name"
              />
            </div>

            <Input
              label="Password"
              type="password"
              value={data.password}
              onChange={(e) => handleChange('password', e.target.value)}
              onBlur={() => handleBlur('password')}
              error={errors.password?.[0]}
              placeholder="Create a password"
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              value={data.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              onBlur={() => handleBlur('confirmPassword')}
              error={errors.confirmPassword?.[0]}
              placeholder="Confirm your password"
              required
            />
          </div>

          <div>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={registerLoading}
              disabled={!isValid || registerLoading}
              className="w-full"
            >
              Create Account
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage; 