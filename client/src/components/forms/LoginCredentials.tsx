import React, { useState } from 'react';
import { getRoleColorScheme } from '../../utils/roleColors';

/**
 * Test credentials data with first 5 essential user roles from database schema
 * Uses real role names from the database ENUM values
 */
const TEST_CREDENTIALS = [
  {
    email: 'admin25@gmail.com',
    password: 'UserTest123!<>',
    role: 'ADMIN'
  },
  {
    email: 'karenacosta@gmail.com',
    password: 'UserTest123!<>',
    role: 'Project Manager'
  },
  {
    email: 'jgriffin@thomas.com',
    password: 'UserTest123!<>',
    role: 'Software Architect'
  },
  {
    email: 'dicksonmark@greene.com',
    password: 'UserTest123!<>',
    role: 'Frontend Developer'
  },
  {
    email: 'andrewmay@yahoo.com',
    password: 'UserTest123!<>',
    role: 'Backend Developer'
  }
];

/**
 * Login Credentials Component
 * Compact, elegant display of test credentials with collapsible design
 * Uses actual database role values with proper color coding
 */
const LoginCredentials: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  /**
   * Toggle expanded state for credentials display
   * Provides space-efficient collapsible interface
   */
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  /**
   * Copy credentials to clipboard
   * Provides user feedback for better UX
   */
  const copyToClipboard = async (email: string, password: string, index: number) => {
    try {
      await navigator.clipboard.writeText(`${email}\n${password}`);
      setCopiedIndex(index);
      // Reset copied state after 2 seconds
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = `${email}\n${password}`;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      {/* Compact Header with Toggle */}
      <div className="text-center mb-4">
        <button
          onClick={toggleExpanded}
          className="inline-flex items-center px-4 py-2 backdrop-blur-sm border rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-sm font-medium"
          style={{
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-primary)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--accent-from)';
            e.currentTarget.style.borderColor = 'var(--accent-from)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-primary)';
            e.currentTarget.style.borderColor = 'var(--border-color)';
          }}
        >
          <span className="mr-2">Test Credentials</span>
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {!isExpanded && (
          <p className="text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>
            Click to view 5 essential test accounts with different roles
          </p>
        )}
      </div>

      {/* Collapsible Credentials */}
      {isExpanded && (
        <div
          className="backdrop-blur-sm border rounded-xl shadow-sm p-4 transition-all duration-300"
          style={{
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--border-color)'
          }}
        >
          {/* Compact Grid - 5 cards per row for optimal space efficiency */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {TEST_CREDENTIALS.map((credential, index) => {
              const roleColors = getRoleColorScheme(credential.role);

              return (
                <div
                  key={index}
                  className="border rounded-lg p-3 transition-all duration-200 cursor-pointer group"
                  style={{
                    backgroundColor: 'var(--card-bg)',
                    borderColor: 'var(--border-color)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--card-hover-bg)';
                    e.currentTarget.style.borderColor = 'var(--accent-from)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--card-bg)';
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                  }}
                  onClick={() => copyToClipboard(credential.email, credential.password, index)}
                >
                  {/* Role Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${roleColors.bg} ${roleColors.text} ${roleColors.border} border`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${roleColors.dot} mr-1.5`}></div>
                      {credential.role}
                    </span>
                    {copiedIndex === index ? (
                      <div className="flex items-center text-xs" style={{ color: 'var(--success-text)' }}>
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Copied!
                      </div>
                    ) : (
                      <svg
                        className="w-3 h-3 transition-colors"
                        style={{ color: 'var(--text-muted)' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = 'var(--accent-from)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = 'var(--text-muted)';
                        }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                  </div>

                  {/* Inline Credentials */}
                  <div className="space-y-2">
                    {/* Email Row */}
                    <div className="flex items-start">
                      <div className="flex items-center justify-center w-5 h-5 mt-0.5">
                        <svg
                          className="w-4 h-4"
                          style={{ color: 'var(--text-secondary)' }}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                      </div>
                      <span
                        className="text-xs font-mono px-2 py-1 rounded border flex-1 ml-2 break-all"
                        style={{
                          color: 'var(--text-primary)',
                          backgroundColor: 'var(--input-bg)',
                          borderColor: 'var(--border-color)'
                        }}
                      >
                        {credential.email}
                      </span>
                    </div>

                    {/* Password Row */}
                    <div className="flex items-center">
                      <div className="flex items-center justify-center w-5 h-5">
                        <svg
                          className="w-4 h-4"
                          style={{ color: 'var(--text-secondary)' }}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <span
                        className="text-xs font-mono px-2 py-1 rounded border flex-1 ml-2"
                        style={{
                          color: 'var(--text-primary)',
                          backgroundColor: 'var(--input-bg)',
                          borderColor: 'var(--border-color)'
                        }}
                      >
                        {credential.password}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Note */}
          <div
            className="text-center mt-4 pt-3 border-t"
            style={{ borderColor: 'var(--border-color)' }}
          >
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Click any credential to copy • 5 essential user roles available • Development purposes only
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginCredentials; 