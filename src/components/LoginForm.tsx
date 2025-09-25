import { useState } from 'react';
import { Form, Input, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useLogin } from '@/hooks/useAuth';
import { getErrorMessage } from '@/lib/utils';
import { CompanyLogo } from './ui/CompanyLogo';
import Button from '@/components/ui/Button';

interface LoginFormProps {
  onSuccess: (requiresTwoFactor: boolean, tempToken?: string) => void;
}

const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const [form] = Form.useForm();
  const loginMutation = useLogin();
  const [hasMinimumInput, setHasMinimumInput] = useState(false);
  const [validationEnabled, setValidationEnabled] = useState(false);

  const handleFormChange = () => {
    const values = form.getFieldsValue();
    const hasValues =
      values.email && values.password && values.password.length >= 8;
    setHasMinimumInput(hasValues);
  };

  const onFinish = async (values: { email: string; password: string }) => {
    try {
      // Enable validation mode after first submit attempt
      if (!validationEnabled) {
        setValidationEnabled(true);
      }

      // Validate the form before submission
      await form.validateFields();

      const result = await loginMutation.mutateAsync(values);

      if (result.success && result.data) {
        onSuccess(!!result.data.requiresTwoFactor, result.data.tempToken);
      } else if (result.error) {
        // Show general errors only as toasts, not under fields
        message.error(getErrorMessage(result.error.code || 'UNKNOWN_ERROR'));
      }
    } catch (error) {
      // If validation fails, the error will contain field validation errors
      // and the form will automatically show them
      if (error && typeof error === 'object' && 'errorFields' in error) {
        console.log('Validation failed:', error.errorFields);
        return;
      }

      console.error('Login error:', error);
      message.error('An unexpected error occurred');
    }
  };

  return (
    <div className="w-[440px] bg-white rounded-md shadow-lg p-8 pt-[52px] flex flex-col justify-center items-center gap-6">
      <CompanyLogo />

      <h1 className="text-2xl font-semibold text-center">
        Sign in to your account to <br />
        continue
      </h1>

      <Form
        form={form}
        name="login"
        onFinish={onFinish}
        onFieldsChange={handleFormChange}
        autoComplete="off"
        layout="vertical"
        className="w-full flex flex-col gap-4"
        validateTrigger={validationEnabled ? ['onChange'] : []}
      >
        <Form.Item
          name="email"
          rules={[
            { required: true, message: 'Please input your email!' },
            { type: 'email', message: 'Please enter a valid email!' },
          ]}
          validateTrigger={validationEnabled ? ['onChange'] : []}
        >
          <Input
            size="large"
            prefix={<UserOutlined className="text-gray-400" />}
            placeholder="Email"
            disabled={loginMutation.isPending}
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            { required: true, message: 'Please input your password!' },
            { min: 8, message: 'Password must be at least 8 characters!' },
          ]}
          validateTrigger={validationEnabled ? ['onChange'] : []}
        >
          <Input.Password
            size="large"
            prefix={<LockOutlined className="text-gray-400" />}
            placeholder="Password"
            disabled={loginMutation.isPending}
            visibilityToggle={false}
          />
        </Form.Item>

        <Form.Item className="mb-0">
          <Button
            size="large"
            htmlType="submit"
            loading={loginMutation.isPending}
            disabled={!hasMinimumInput || loginMutation.isPending}
            variant="primary"
            block
          >
            Log in
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export { LoginForm };
