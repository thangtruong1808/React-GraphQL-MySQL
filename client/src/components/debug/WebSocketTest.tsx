import React, { useState, useEffect } from 'react';
import { useSubscription } from '@apollo/client';
import { COMMENT_ADDED_SUBSCRIPTION } from '../../services/graphql/commentSubscriptions';

interface WebSocketTestProps {
  projectId: string;
}

const WebSocketTest: React.FC<WebSocketTestProps> = ({ projectId }) => {
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  const [messages, setMessages] = useState<string[]>([]);

  // Test WebSocket connection
  const { data, loading, error } = useSubscription(COMMENT_ADDED_SUBSCRIPTION, {
    variables: { projectId },
    onData: ({ data }) => {
      setMessages(prev => [...prev, `✅ Received comment: ${data?.data?.commentAdded?.content || 'Unknown'}`]);
    },
    onError: (error) => {
      setMessages(prev => [...prev, `❌ Subscription error: ${error.message}`]);
    }
  });

  useEffect(() => {
    if (loading) {
      setConnectionStatus('Connecting...');
    } else if (error) {
      setConnectionStatus(`Error: ${error.message}`);
    } else {
      setConnectionStatus('Connected');
    }
  }, [loading, error]);

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-2">WebSocket Test</h3>
      <div className="mb-2">
        <strong>Status:</strong> {connectionStatus}
      </div>
      <div className="mb-2">
        <strong>Project ID:</strong> {projectId}
      </div>
      <div className="mb-2">
        <strong>Messages:</strong>
        <div className="max-h-32 overflow-y-auto bg-white p-2 rounded border">
          {messages.length === 0 ? (
            <div className="text-gray-500">No messages yet...</div>
          ) : (
            messages.map((msg, index) => (
              <div key={index} className="text-sm">{msg}</div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default WebSocketTest;
