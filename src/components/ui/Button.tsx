import { Button as AntButton } from 'antd';
import { cn } from '@/lib/utils';

interface ButtonProps {
  children: React.ReactNode;
  type?: 'primary' | 'default' | 'text' | 'link';
  size?: 'large' | 'middle' | 'small';
  loading?: boolean;
  disabled?: boolean;
  htmlType?: 'button' | 'submit' | 'reset';
  icon?: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  block?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
}

const Button = ({
  children,
  type = 'default',
  size = 'middle',
  loading = false,
  disabled = false,
  htmlType = 'button',
  icon,
  onClick,
  className,
  block = false,
  variant = 'primary',
  ...props
}: ButtonProps) => {
  const getVariantStyles = () => {
    const baseStyles = 'font-medium transition-colors duration-200 rounded-xl';

    switch (variant) {
      case 'primary':
        return cn(
          baseStyles,
          disabled
            ? '!bg-gray-300 !border-gray-300 !text-gray-500 cursor-not-allowed hover:!bg-gray-300 hover:!border-gray-300 focus:!bg-gray-300 focus:!border-gray-300'
            : 'bg-blue-500 hover:bg-blue-600 border-blue-500 hover:border-blue-600 text-white'
        );
      case 'secondary':
        return cn(
          baseStyles,
          disabled
            ? 'bg-gray-300 border-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-gray-500 hover:bg-gray-600 border-gray-500 hover:border-gray-600 text-white'
        );
      case 'outline':
        return cn(
          baseStyles,
          disabled
            ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
            : 'border-gray-300 hover:border-blue-400 bg-white hover:bg-blue-50 text-gray-700 hover:text-blue-600'
        );
      case 'ghost':
        return cn(
          baseStyles,
          disabled
            ? 'border-transparent text-gray-400 cursor-not-allowed'
            : 'border-transparent hover:bg-gray-100 text-gray-600 hover:text-gray-800'
        );
      case 'danger':
        return cn(
          baseStyles,
          disabled
            ? 'text-gray-400 border-gray-300 cursor-not-allowed'
            : 'text-red-600 border-red-300 hover:border-red-400 hover:bg-red-50 hover:text-red-700'
        );
      default:
        return baseStyles;
    }
  };

  const buttonClassName = cn(getVariantStyles(), block && 'w-full', className);

  return (
    <AntButton
      size={size}
      type={variant === 'primary' ? 'primary' : type}
      loading={loading}
      disabled={disabled}
      htmlType={htmlType}
      icon={icon}
      onClick={onClick}
      className={buttonClassName}
      block={block}
      {...props}
    >
      {children}
    </AntButton>
  );
};

export default Button;
