import React from 'react';
import { Button, Avatar } from 'antd';
import { CheckCircleOutlined, UserOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';
import { AuthUser } from '@/types/auth';
import { useLogout } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

interface AuthSuccessProps {
  user: AuthUser;
}

const AuthSuccess: React.FC<AuthSuccessProps> = ({ user }) => {
  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="w-full space-y-8">
      {/* Success Animation */}
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-pulse">
            <CheckCircleOutlined className="text-green-600 text-5xl" />
          </div>
        </div>
        
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Welcome back!
        </h2>
        <p className="text-gray-600 mb-6">
          You have successfully signed in to your account
        </p>
      </div>

      {/* User Profile Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="flex items-center space-x-4">
          {user.avatar ? (
            <Avatar 
              src={user.avatar} 
              alt={user.name}
              size={48}
              className="flex-shrink-0"
            />
          ) : (
            <Avatar 
              size={48}
              className="bg-blue-500 flex-shrink-0"
              icon={<UserOutlined />}
            />
          )}
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-medium text-gray-900 truncate">
              {user.name}
            </h3>
            <p className="text-gray-600 truncate">
              {user.email}
            </p>
            {user.twoFactorEnabled && (
              <div className="flex items-center mt-1">
                <CheckCircleOutlined className="text-green-500 text-sm mr-1" />
                <span className="text-xs text-green-600 font-medium">
                  2FA Enabled
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Account Actions */}
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Button
            icon={<UserOutlined />}
            className={cn(
              "h-12 rounded-xl font-medium",
              "border-gray-300 hover:border-blue-400 hover:text-blue-500",
              "transition-colors duration-200"
            )}
          >
            Profile
          </Button>
          
          <Button
            icon={<SettingOutlined />}
            className={cn(
              "h-12 rounded-xl font-medium",
              "border-gray-300 hover:border-blue-400 hover:text-blue-500",
              "transition-colors duration-200"
            )}
          >
            Settings
          </Button>
        </div>

        <Button
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          loading={logoutMutation.isPending}
          className={cn(
            "w-full h-12 rounded-xl font-medium",
            "text-red-600 border-red-300 hover:border-red-400",
            "hover:bg-red-50 hover:text-red-700",
            "transition-colors duration-200"
          )}
        >
          {logoutMutation.isPending ? 'Signing out...' : 'Sign out'}
        </Button>
      </div>

      {/* Footer */}
      <div className="text-center pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Last sign in: {new Date().toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export { AuthSuccess };