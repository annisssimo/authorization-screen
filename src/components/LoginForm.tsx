import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined, HomeOutlined } from '@ant-design/icons';
import { useLogin } from '@/hooks/useAuth';
import { getErrorMessage, cn } from '@/lib/utils';

interface LoginFormProps {
  onSuccess: (requiresTwoFactor: boolean, tempToken?: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const [form] = Form.useForm();
  const loginMutation = useLogin();

  const onFinish = async (values: { email: string; password: string }) => {
    try {
      const result = await loginMutation.mutateAsync(values);

      if (result.success && result.data) {
        onSuccess(!!result.data.requiresTwoFactor, result.data.tempToken);
      } else if (result.error) {
        message.error(getErrorMessage(result.error.code || 'UNKNOWN_ERROR'));

        if (result.error.field) {
          form.setFields([
            {
              name: result.error.field,
              errors: [result.error.message],
            },
          ]);
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      message.error('An unexpected error occurred');
    }
  };

  return (
    <div className="w-full space-y-8">
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
            <HomeOutlined className="text-white text-2xl" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 m-0">Company</h2>
        </div>

        <h1 className="text-2xl font-semibold text-gray-900 mb-4">
          Sign in to your account to continue
        </h1>
        <p className="text-base text-gray-600">
          Welcome back! Please enter your credentials
        </p>
      </div>

      <Form
        form={form}
        name="login"
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
        className="w-full flex flex-col gap-4"
      >
        <Form.Item
          name="email"
          rules={[
            { required: true, message: 'Please input your email!' },
            { type: 'email', message: 'Please enter a valid email!' },
          ]}
        >
          <Input
            prefix={<UserOutlined className="text-gray-400" />}
            placeholder="Email"
            disabled={loginMutation.isPending}
            className={cn('h-[40px] rounded-xl text-base')}
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            { required: true, message: 'Please input your password!' },
            { min: 8, message: 'Password must be at least 8 characters!' },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="text-gray-400" />}
            placeholder="Password"
            disabled={loginMutation.isPending}
            className={cn('h-[40px] rounded-xl text-base')}
          />
        </Form.Item>

        <Form.Item className="mb-0">
          <Button
            type="primary"
            htmlType="submit"
            loading={loginMutation.isPending}
            className={cn(
              'w-full h-[40px] rounded-xl text-base font-medium',
              'bg-blue-500 hover:bg-blue-600 border-blue-500 hover:border-blue-600',
              'transition-colors duration-200'
            )}
          >
            Log in
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export { LoginForm };
