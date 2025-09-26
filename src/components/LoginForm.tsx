import { useState, useCallback } from 'react';
import { Form, Input, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useLogin } from '@/hooks/useAuth';
import { getErrorMessage } from '@/lib/utils';
import { CompanyLogo } from './ui/CompanyLogo';
import { Button } from '@/components/ui/Button';
import { AsteriskPasswordInput } from './ui/AsteriskPasswordInput';
import { debounce } from 'lodash';

interface LoginFormProps {
  onSuccess: (requiresTwoFactor: boolean, tempToken?: string) => void;
}

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const [form] = Form.useForm();
  const loginMutation = useLogin();
  const [isFormValid, setIsFormValid] = useState(false);

  // Debounced function to check form validity without triggering errors
  const checkFormValidity = useCallback(
    debounce(async () => {
      try {
        const values = form.getFieldsValue();
        // Check if fields are filled and valid without triggering visible errors
        if (values.email && values.password) {
          await form.validateFields(['email', 'password']);
          setIsFormValid(true);
        } else {
          setIsFormValid(false);
        }
      } catch {
        setIsFormValid(false);
      }
    }, 300),
    [form]
  );

  // Handle form field changes
  const handleFormChange = () => {
    checkFormValidity();
  };

  const onFinish = async (values: { email: string; password: string }) => {
    try {
      await form.validateFields(); // Trigger validation on submit
      const result = await loginMutation.mutateAsync(values);

      if (result.success && result.data) {
        onSuccess(!!result.data.requiresTwoFactor, result.data.tempToken);
      } else if (result.error) {
        message.error(getErrorMessage(result.error.code || 'UNKNOWN_ERROR'));
      }
    } catch (error) {
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
        validateTrigger={['onBlur', 'onSubmit']}
      >
        <Form.Item
          name="email"
          rules={[
            { required: true, message: 'Please input your email!' },
            { type: 'email', message: 'Please enter a valid email!' },
          ]}
          validateFirst
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
          validateFirst
        >
          <AsteriskPasswordInput
            size="large"
            prefix={<LockOutlined className="text-gray-400" />}
            placeholder="Password"
            disabled={loginMutation.isPending}
            onChange={(value) => {
              form.setFieldsValue({ password: value });
              handleFormChange();
            }}
          />
        </Form.Item>

        <Form.Item className="mb-0">
          <Button
            size="large"
            htmlType="submit"
            loading={loginMutation.isPending}
            disabled={!isFormValid || loginMutation.isPending}
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
