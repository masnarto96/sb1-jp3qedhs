import React, { useState } from 'react';
import { MessageSquare, Send, Users, Target } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';

export const BroadcastSystem: React.FC = () => {
  const { users, sendBroadcast } = useAdmin();
  const [message, setMessage] = useState('');
  const [targetType, setTargetType] = useState<'all' | 'active' | 'custom'>('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false);

  const handleSendBroadcast = async () => {
    if (!message.trim()) {
      alert('Please enter a message');
      return;
    }

    setIsSending(true);
    try {
      let targetUsers: string[] = [];

      switch (targetType) {
        case 'all':
          targetUsers = users.map(u => u.telegramId);
          break;
        case 'active':
          targetUsers = users
            .filter(u => u.status === 'active' && u.lastActive > Date.now() - 7 * 24 * 60 * 60 * 1000)
            .map(u => u.telegramId);
          break;
        case 'custom':
          targetUsers = selectedUsers;
          break;
      }

      await sendBroadcast(message, targetUsers);
      setMessage('');
      setSelectedUsers([]);
      alert(`Broadcast sent to ${targetUsers.length} users successfully!`);
    } catch (error) {
      console.error('Failed to send broadcast:', error);
      alert('Failed to send broadcast. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const getTargetCount = () => {
    switch (targetType) {
      case 'all':
        return users.length;
      case 'active':
        return users.filter(u => u.status === 'active' && u.lastActive > Date.now() - 7 * 24 * 60 * 60 * 1000).length;
      case 'custom':
        return selectedUsers.length;
      default:
        return 0;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Broadcast System</h2>
        <p className="text-gray-600">Send messages to Tree TON users</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Message Composer */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <MessageSquare className="w-5 h-5 mr-2" />
              Compose Message
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Audience
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setTargetType('all')}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      targetType === 'all'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Users className="w-6 h-6 mx-auto mb-1 text-blue-600" />
                    <div className="font-bold text-sm">All Users</div>
                    <div className="text-xs text-gray-600">{users.length} users</div>
                  </button>
                  <button
                    onClick={() => setTargetType('active')}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      targetType === 'active'
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Target className="w-6 h-6 mx-auto mb-1 text-green-600" />
                    <div className="font-bold text-sm">Active Users</div>
                    <div className="text-xs text-gray-600">
                      {users.filter(u => u.status === 'active' && u.lastActive > Date.now() - 7 * 24 * 60 * 60 * 1000).length} users
                    </div>
                  </button>
                  <button
                    onClick={() => setTargetType('custom')}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      targetType === 'custom'
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <MessageSquare className="w-6 h-6 mx-auto mb-1 text-purple-600" />
                    <div className="font-bold text-sm">Custom</div>
                    <div className="text-xs text-gray-600">{selectedUsers.length} selected</div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message Content
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={6}
                  placeholder="Enter your broadcast message here..."
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>HTML formatting supported</span>
                  <span>{message.length}/4096</span>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-blue-800">Ready to send</div>
                    <div className="text-sm text-blue-600">
                      Message will be sent to {getTargetCount()} users
                    </div>
                  </div>
                  <button
                    onClick={handleSendBroadcast}
                    disabled={isSending || !message.trim()}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-bold transition-all disabled:opacity-50 flex items-center space-x-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSending ? 'Sending...' : 'Send Broadcast'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User Selection (for custom targeting) */}
        <div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {targetType === 'custom' ? 'Select Users' : 'Broadcast Preview'}
            </h3>

            {targetType === 'custom' ? (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {users.map((user) => (
                  <label key={user.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.telegramId)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUsers(prev => [...prev, user.telegramId]);
                        } else {
                          setSelectedUsers(prev => prev.filter(id => id !== user.telegramId));
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-xs text-gray-500">@{user.username}</div>
                    </div>
                  </label>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm font-medium text-gray-700">Target Audience</div>
                  <div className="text-lg font-bold text-gray-900">
                    {targetType === 'all' ? 'All Users' : 'Active Users'}
                  </div>
                  <div className="text-sm text-gray-600">{getTargetCount()} recipients</div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm font-medium text-gray-700">Message Preview</div>
                  <div className="text-sm text-gray-900 mt-1 whitespace-pre-wrap">
                    {message || 'Your message will appear here...'}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};