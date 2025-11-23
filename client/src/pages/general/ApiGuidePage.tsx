import React from 'react';
import { API_CONFIG } from '../../constants';

/**
 * API Guide Page Component
 * Description: Detailed Postman guide for testing comment API endpoint flow in real-time
 * Date: 2024-12-19
 * Author: thangtruong
 */
const ApiGuidePage: React.FC = () => {
  /**
   * Reusable style objects for consistent theming
   */
  const sectionStyle = {
    backgroundColor: 'var(--card-bg)',
    backgroundImage: 'var(--card-surface-overlay)',
    borderColor: 'var(--border-color)',
    borderWidth: '1px',
    borderStyle: 'solid' as const
  };

  const codeBlockStyle = {
    backgroundColor: 'var(--input-bg)',
    color: 'var(--text-primary)',
    borderColor: 'var(--border-color)',
    borderWidth: '1px',
    borderStyle: 'solid' as const
  };

  const inlineCodeStyle = {
    backgroundColor: 'var(--table-header-bg)',
    color: 'var(--text-primary)'
  };

  const infoSectionStyle = {
    backgroundColor: 'var(--project-info-bg)',
    borderColor: 'var(--project-info-border)',
    borderWidth: '1px',
    borderStyle: 'solid' as const
  };

  /**
   * Get GraphQL endpoint URL
   * Uses environment variable or defaults to localhost
   */
  const getGraphQLEndpoint = () => {
    return API_CONFIG.GRAPHQL_URL;
  };

  /**
   * Example login mutation payload
   * Shows the structure needed for authentication
   */
  const loginMutation = {
    query: `mutation Login($input: LoginInput!) {
      login(input: $input) {
        accessToken
        refreshToken
        csrfToken
        user {
          id
          email
          firstName
          lastName
          role
        }
      }
    }`,
    variables: {
      input: {
        email: "user@example.com",
        password: "yourpassword"
      }
    }
  };

  /**
   * Example comment mutation payload
   * Shows the structure needed for creating a comment
   */
  const commentMutation = {
    query: `mutation CreateComment($input: CommentInput!) {
      createComment(input: $input) {
        id
        uuid
        content
        author {
          id
          firstName
          lastName
          email
          role
        }
        projectId
        taskId
        createdAt
        updatedAt
        likesCount
        isLikedByUser
      }
    }`,
    variables: {
      input: {
        content: "Your comment content here",
        projectId: "1"
      }
    }
  };

  return (
    <div className="w-full public-dashboard">
      <div
        className="min-h-screen pt-24"
        style={{
          minHeight: '100vh',
          backgroundColor: 'var(--bg-base)',
          backgroundImage: 'var(--bg-gradient)',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover'
        }}
      >
        {/* Page Container */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              API Testing Guide
            </h1>
            <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
              Step-by-step guide for testing comment API endpoint flow in real-time
            </p>
          </div>

          {/* Guide Content */}
          <div className="space-y-8">
            {/* Step 1: Postman Setup - Login */}
            <section className="rounded-lg shadow-md p-6" style={sectionStyle}>
              <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                Step 1: Login to Get Access Token (Postman)
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--text-primary)' }}>1.1 Create New POST Request</h3>
                  <p className="mb-2" style={{ color: 'var(--text-secondary)' }}>In Postman, create a new POST request to:</p>
                  <code className="block p-3 rounded text-sm break-all mb-3" style={codeBlockStyle}>{getGraphQLEndpoint()}</code>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--text-primary)' }}>1.2 Set Headers</h3>
                  <p className="mb-2" style={{ color: 'var(--text-secondary)' }}>In Headers tab, add: <code className="px-1 py-0.5 rounded" style={inlineCodeStyle}>Content-Type: application/json</code></p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--text-primary)' }}>1.3 Set Body (raw JSON)</h3>
                  <p className="mb-2" style={{ color: 'var(--text-secondary)' }}>Select Body tab → raw → JSON, then paste:</p>
                  <pre className="block p-3 rounded text-xs overflow-x-auto" style={codeBlockStyle}>{JSON.stringify(loginMutation, null, 2)}</pre>
                  <p className="mt-2 text-sm italic" style={{ color: 'var(--text-muted)' }}>Replace email and password with your credentials</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--text-primary)' }}>1.4 Send & Copy Access Token</h3>
                  <p className="mb-2" style={{ color: 'var(--text-secondary)' }}>Click Send. Copy the <code className="px-1 py-0.5 rounded" style={inlineCodeStyle}>accessToken</code> from response for Step 2.</p>
                </div>
              </div>
            </section>

            {/* Step 2: Postman Setup - Create Comment */}
            <section className="rounded-lg shadow-md p-6" style={sectionStyle}>
              <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                Step 2: Create Comment (Postman)
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--text-primary)' }}>2.1 Create New POST Request</h3>
                  <p className="mb-2" style={{ color: 'var(--text-secondary)' }}>Create another POST request to:</p>
                  <code className="block p-3 rounded text-sm break-all mb-3" style={codeBlockStyle}>{getGraphQLEndpoint()}</code>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--text-primary)' }}>2.2 Set Headers</h3>
                  <p className="mb-2" style={{ color: 'var(--text-secondary)' }}>In Headers tab, add:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4 mb-2" style={{ color: 'var(--text-secondary)' }}>
                    <li><code className="px-1 py-0.5 rounded" style={inlineCodeStyle}>Content-Type: application/json</code></li>
                    <li><code className="px-1 py-0.5 rounded" style={inlineCodeStyle}>Authorization: Bearer YOUR_ACCESS_TOKEN</code></li>
                  </ul>
                  <p className="text-sm italic" style={{ color: 'var(--text-muted)' }}>Replace YOUR_ACCESS_TOKEN with token from Step 1.4</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--text-primary)' }}>2.3 Set Body (raw JSON)</h3>
                  <p className="mb-2" style={{ color: 'var(--text-secondary)' }}>Select Body tab → raw → JSON, then paste:</p>
                  <pre className="block p-3 rounded text-xs overflow-x-auto" style={codeBlockStyle}>{JSON.stringify(commentMutation, null, 2)}</pre>
                  <p className="mt-2 text-sm italic" style={{ color: 'var(--text-muted)' }}>Replace content and projectId with your values</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--text-primary)' }}>2.4 Send Request</h3>
                  <p className="mb-2" style={{ color: 'var(--text-secondary)' }}>Click Send. You should receive the created comment in the response.</p>
                </div>
              </div>
            </section>

            {/* Step 3: Testing Tips */}
            <section className="rounded-lg shadow-md p-6" style={sectionStyle}>
              <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                Step 3: Important Notes
              </h2>
              <ul className="list-disc list-inside space-y-2" style={{ color: 'var(--text-secondary)' }}>
                <li>Ensure you're a project team member before creating comments</li>
                <li>Use a valid projectId from your projects</li>
                <li>Access tokens expire after 1 minute - use refreshToken mutation if needed</li>
                <li>Refresh token is stored in httpOnly cookie - not accessible in Postman</li>
                <li>For real-time updates, use WebSocket clients (not Postman)</li>
                <li>CSRF token may be required for mutations in browser clients</li>
              </ul>
            </section>

            {/* Note about Vercel */}
            <section className="rounded-lg p-6" style={infoSectionStyle}>
              <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                Deployment Note
              </h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                Backend endpoint will be updated after Vercel deployment.
                Update VITE_API_URL environment variable accordingly.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiGuidePage;
