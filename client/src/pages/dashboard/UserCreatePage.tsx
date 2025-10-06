import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { DashboardLayout } from '../../components/layout';
import { CREATE_USER_MUTATION } from '../../services/graphql/userQueries';
import { UserInput, UserRole } from '../../types/userManagement';
import { USER_FORM_VALIDATION, USER_ROLE_OPTIONS } from '../../constants/userManagement';
import { useNavigate } from 'react-router-dom';
import { ROUTE_PATHS } from '../../constants/routingConstants';

/**
 * User Create Page
 * Full-page elegant form for creating a user
 */
const UserCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<UserInput>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'Frontend Developer' as UserRole,
  });
  const [errors, setErrors] = useState<Partial<UserInput>>({});
  const [createUser, { loading }] = useMutation(CREATE_USER_MUTATION);

  // Validate field on change/blur
  const validate = (name: keyof UserInput, value: string): string => {
    switch (name) {
      case 'email':
        if (!value.trim()) return USER_FORM_VALIDATION.email.required;
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return USER_FORM_VALIDATION.email.pattern;
        return '';
      case 'password':
        if (!value) return USER_FORM_VALIDATION.password.required;
        if (value.length < 8) return USER_FORM_VALIDATION.password.minLength;
        return '';
      case 'firstName':
        if (!value.trim()) return USER_FORM_VALIDATION.firstName.required;
        return '';
      case 'lastName':
        if (!value.trim()) return USER_FORM_VALIDATION.lastName.required;
        return '';
      case 'role':
        if (!value) return USER_FORM_VALIDATION.role.required;
        return '';
      default:
        return '';
    }
  };

  /**
   * Handle input change
   */
  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  /**
   * Handle form submit
   */
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Partial<UserInput> = {};
    (Object.keys(form) as Array<keyof UserInput>).forEach((k) => {
      const err = validate(k, (form as any)[k] || '');
      if (err) newErrors[k] = err;
    });
    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;

    try {
      await createUser({ variables: { input: form } });
      navigate(ROUTE_PATHS.DASHBOARD_USERS);
    } catch { }
  };

  return (
    <DashboardLayout>
      <div className="w-full h-full bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-white">
              <h1 className="text-2xl font-bold text-gray-900">Create New User</h1>
              <p className="text-gray-600 mt-1">Add a new team member to your organization</p>
            </div>

            <form onSubmit={onSubmit} className="px-8 py-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={onChange}
                  className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm ${errors.firstName ? 'border-red-300' : 'border-gray-300'
                    }`}
                  placeholder="Enter first name"
                />
                {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={onChange}
                  className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm ${errors.lastName ? 'border-red-300' : 'border-gray-300'
                    }`}
                  placeholder="Enter last name"
                />
                {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={onChange}
                  className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm ${errors.email ? 'border-red-300' : 'border-gray-300'
                    }`}
                  placeholder="Enter email address"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={onChange}
                  className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm ${errors.password ? 'border-red-300' : 'border-gray-300'
                    }`}
                  placeholder="Enter password (min 8 characters)"
                />
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
                <select
                  name="role"
                  value={form.role}
                  onChange={onChange}
                  className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm ${errors.role ? 'border-red-300' : 'border-gray-300'
                    }`}
                >
                  {USER_ROLE_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role}</p>}
              </div>

              <div className="md:col-span-2 flex items-center justify-end gap-3 pt-2">
                <button type="button" onClick={() => navigate(ROUTE_PATHS.DASHBOARD_USERS)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">Cancel</button>
                <button type="submit" disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50">Create User</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserCreatePage;


