import React from 'react';
import { CheckSquare, Gift, ExternalLink, Users, MessageSquare } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

interface Task {
  id: string;
  title: string;
  description: string;
  reward: number;
  type: 'daily' | 'social' | 'referral';
  icon: React.ReactNode;
  action?: string;
  url?: string;
}

export const Tasks: React.FC = () => {
  const { user, completeTask } = useUser();

  const tasks: Task[] = [
    {
      id: 'daily-login',
      title: 'Daily Login',
      description: 'Login to the app daily',
      reward: 100,
      type: 'daily',
      icon: <Gift className="w-5 h-5" />
    },
    {
      id: 'join-telegram',
      title: 'Join Telegram Channel',
      description: 'Join our official Telegram channel',
      reward: 500,
      type: 'social',
      icon: <MessageSquare className="w-5 h-5" />,
      url: 'https://t.me/realtreeton'
    },
    {
      id: 'follow-twitter',
      title: 'Follow on Twitter',
      description: 'Follow our official Twitter account',
      reward: 300,
      type: 'social',
      icon: <ExternalLink className="w-5 h-5" />,
      url: 'https://twitter.com/treeton'
    },
    {
      id: 'invite-friends',
      title: 'Invite 5 Friends',
      description: 'Invite 5 friends to join Tree TON',
      reward: 1000,
      type: 'referral',
      icon: <Users className="w-5 h-5" />
    },
    {
      id: 'mine-1000',
      title: 'Mine 1000 Points',
      description: 'Mine a total of 1000 points',
      reward: 200,
      type: 'daily',
      icon: <CheckSquare className="w-5 h-5" />
    }
  ];

  const getTaskStatus = (task: Task) => {
    if (user.completedTasks.includes(task.id)) {
      return 'completed';
    }
    
    // Check task-specific conditions
    if (task.id === 'mine-1000' && user.points >= 1000) {
      return 'ready';
    }
    if (task.id === 'invite-friends' && user.referralCount >= 5) {
      return 'ready';
    }
    
    return 'available';
  };

  const handleTaskAction = (task: Task) => {
    const status = getTaskStatus(task);
    
    if (status === 'ready') {
      completeTask(task.id, task.reward);
    } else if (task.url) {
      window.open(task.url, '_blank');
    }
  };

  const getTasksByType = (type: string) => tasks.filter(task => task.type === type);

  const TaskCard: React.FC<{ task: Task }> = ({ task }) => {
    const status = getTaskStatus(task);
    
    return (
      <div className="bg-white rounded-xl p-4 shadow-lg">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="bg-green-100 rounded-lg p-2">
              {task.icon}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-800">{task.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{task.description}</p>
              <div className="flex items-center space-x-2 mt-2">
                <Gift className="w-4 h-4 text-green-600" />
                <span className="text-sm font-bold text-green-600">+{task.reward} coins</span>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => handleTaskAction(task)}
            disabled={status === 'completed'}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
              status === 'completed'
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : status === 'ready'
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {status === 'completed' ? 'Completed' : status === 'ready' ? 'Claim' : 'Start'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 space-y-6">
      <div className="bg-white rounded-xl p-4 shadow-lg">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Tasks</h2>
        <p className="text-gray-600">Complete tasks to earn coins and boost your mining!</p>
      </div>

      {/* Daily Tasks */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-3">Daily Tasks</h3>
        <div className="space-y-3">
          {getTasksByType('daily').map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </div>

      {/* Social Tasks */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-3">Social Tasks</h3>
        <div className="space-y-3">
          {getTasksByType('social').map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </div>

      {/* Referral Tasks */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-3">Referral Tasks</h3>
        <div className="space-y-3">
          {getTasksByType('referral').map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </div>
    </div>
  );
};