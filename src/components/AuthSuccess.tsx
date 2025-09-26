import { Avatar } from 'antd';
import {
  CheckCircleOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { Button } from '@/components/ui/Button';
import { AuthUser } from '@/types/auth';
import { useLogout } from '@/hooks/useAuth';

interface AuthSuccessProps {
  user: AuthUser;
}

export const AuthSuccess = ({ user }: AuthSuccessProps) => {
  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="w-full space-y-8" role="main" aria-labelledby="success-title">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div 
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-pulse"
            role="img"
            aria-label="Success checkmark"
          >
            <CheckCircleOutlined className="text-green-600 text-5xl" aria-hidden="true" />
          </div>
        </div>

        <h2 
          id="success-title"
          className="text-2xl font-semibold text-gray-900 mb-2"
        >
          Welcome back!
        </h2>
        <p className="text-gray-600 mb-6">
          You have successfully signed in to your account
        </p>
      </div>

      <div 
        className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
        role="region"
        aria-labelledby="user-info-title"
      >
        <h3 id="user-info-title" className="sr-only">User Information</h3>
        <div className="flex items-center space-x-4">
          {user.avatar ? (
            <Avatar
              src={user.avatar}
              alt={`${user.name}'s profile picture`}
              size={48}
              className="flex-shrink-0"
            />
          ) : (
            <Avatar
              size={48}
              className="bg-blue-500 flex-shrink-0"
              icon={<UserOutlined aria-hidden="true" />}
              alt={`${user.name}'s profile picture`}
            />
          )}

          <div className="flex-1 min-w-0">
            <h4 className="text-lg font-medium text-gray-900 truncate">
              {user.name}
            </h4>
            <p className="text-gray-600 truncate">{user.email}</p>
            {user.twoFactorEnabled && (
              <div 
                className="flex items-center mt-1"
                role="status"
                aria-label="Two-factor authentication is enabled"
              >
                <CheckCircleOutlined 
                  className="text-green-500 text-sm mr-1" 
                  aria-hidden="true" 
                />
                <span className="text-xs text-green-600 font-medium">
                  2FA Enabled
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-3" role="group" aria-label="Account actions">
        <div className="grid grid-cols-2 gap-3">
          <Button 
            icon={<UserOutlined aria-hidden="true" />} 
            variant="outline" 
            size="large"
            aria-label="View profile settings"
          >
            Profile
          </Button>

          <Button 
            icon={<SettingOutlined aria-hidden="true" />} 
            variant="outline" 
            size="large"
            aria-label="Open account settings"
          >
            Settings
          </Button>
        </div>

        <Button
          icon={<LogoutOutlined aria-hidden="true" />}
          onClick={handleLogout}
          loading={logoutMutation.isPending}
          variant="danger"
          size="large"
          block
          aria-label="Sign out of your account"
        >
          {logoutMutation.isPending ? 'Signing out...' : 'Sign out'}
        </Button>
      </div>

      <div className="text-center pt-4 border-t border-gray-200">
        <p 
          className="text-xs text-gray-500"
          aria-label={`Last sign in: ${new Date().toLocaleString()}`}
        >
          Last sign in: <time dateTime={new Date().toISOString()}>{new Date().toLocaleString()}</time>
        </p>
      </div>
    </div>
  );
};
