# Authorization Screen

A comprehensive, production-ready authentication system built with TypeScript, React, and React Query. This application demonstrates best practices for user authentication including form validation, error handling, two-factor authentication, and modern UX patterns.

## Features

### 🔐 Authentication Flow
- **Multi-step authentication** with visual progress indicators
- **Form validation** using Zod and React Hook Form
- **Two-factor authentication** with 6-digit code input
- **Comprehensive error handling** with user-friendly messages
- **Auto-focus and navigation** between form fields
- **Accessibility support** with proper ARIA labels and keyboard navigation

### 🎨 User Experience
- **Modern, responsive design** using Tailwind CSS
- **Smooth animations** and transitions
- **Loading states** with spinners and disabled controls
- **Visual feedback** for success and error states
- **Mobile-optimized** touch interactions
- **Auto-paste support** for 2FA codes

### 🛠 Technical Features
- **TypeScript** for type safety
- **React Query** for API state management and caching
- **Zod** for runtime validation
- **React Hook Form** for efficient form handling
- **Mock API** with realistic delays and error scenarios
- **Retry logic** for network errors
- **localStorage/sessionStorage** for persistence

### 🧪 Demo Scenarios

#### Login Credentials
- **Valid User**: `user@example.com` / `Password123` (has 2FA enabled)
- **Locked Account**: `locked@example.com` / `Password123`
- **Suspended Account**: `suspended@example.com` / `Password123`
- **Unverified Email**: `unverified@example.com` / `Password123`

#### Two-Factor Authentication
- **Valid Codes**: `123456`, `654321`, `111111`
- **Expired Codes**: Any code ending in `1` (e.g., `131313`)
- **Invalid Codes**: Any other 6-digit combination

#### Error Scenarios
- **Network Errors**: 5% chance of simulated network failure
- **Server Errors**: 2% chance of simulated server error
- **Rate Limiting**: After 5 failed attempts, account is locked for 15 minutes
- **Validation Errors**: Real-time form validation with field-specific errors

## Project Structure

```
src/
├── components/           # React components
│   ├── ui/              # Reusable UI components
│   │   ├── Alert.tsx
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── LoadingSpinner.tsx
│   ├── AuthScreen.tsx   # Main authentication container
│   ├── AuthSuccess.tsx  # Success page after login
│   ├── LoginForm.tsx    # Email/password login form
│   └── TwoFactorForm.tsx # 2FA verification form
├── hooks/               # Custom React hooks
│   └── useAuth.ts       # Authentication-related hooks
├── lib/                 # Utility functions
│   ├── utils.ts         # General utilities
│   └── validation.ts    # Zod schemas
├── types/               # TypeScript type definitions
│   └── auth.ts          # Authentication types
├── api/                 # API layer
│   └── auth.ts          # Mock authentication API
├── App.tsx              # Main app component
├── main.tsx             # Entry point
└── index.css            # Global styles
```

## Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Modern web browser

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser** and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## Architecture Decisions

### State Management
- **React Query** for server state management with intelligent caching and retry logic
- **localStorage** for persistent authentication state
- **sessionStorage** for temporary 2FA tokens
- **React Hook Form** for form state with minimal re-renders

### Error Handling
- **Global error boundary** with fallback UI
- **Field-specific validation** with real-time feedback
- **API error mapping** to user-friendly messages
- **Retry logic** for network failures
- **Progressive error disclosure** (show relevant errors only)

### Security Considerations
- **No sensitive data** in localStorage (only non-sensitive user info)
- **Temporary tokens** for 2FA flow
- **Rate limiting** simulation
- **Secure form validation** with client and server-side checks
- **XSS prevention** through proper data sanitization

### Performance Optimizations
- **Code splitting** with React.lazy (can be added)
- **Optimistic updates** for better UX
- **Debounced validation** to reduce API calls
- **Efficient re-rendering** with React Hook Form
- **Intelligent caching** with React Query

## API Mock Implementation

The mock API simulates realistic scenarios:

### Login Endpoint
- **Latency**: 500-1500ms random delay
- **Success Rate**: ~93% (5% network errors, 2% server errors)
- **Rate Limiting**: 5 attempts per email, 15-minute lockout
- **Account States**: Active, locked, suspended, unverified

### 2FA Endpoint
- **Latency**: 300-1100ms random delay
- **Code Validation**: Realistic validation logic
- **Expiration**: Codes ending in '1' are expired
- **Session Management**: Temp token validation

### Error Responses
All errors include:
- **Error Code**: Machine-readable error identifier
- **Message**: Human-readable error description
- **Field**: Which form field caused the error (if applicable)
- **Details**: Additional context for debugging

## Accessibility Features

- **ARIA labels** and descriptions
- **Keyboard navigation** support
- **Focus management** between form steps
- **Screen reader** compatibility
- **High contrast** support
- **Reduced motion** respect for user preferences

## Browser Support

- **Modern browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile browsers**: iOS Safari 14+, Chrome Mobile 90+
- **JavaScript required**: No fallback for non-JS environments

## Git Workflow

### Useful Commands
```bash
# View current status
git status

# Add all changes
git add .

# Commit with conventional commit message
git commit -m "feat: add new feature"
git commit -m "fix: resolve login issue"  
git commit -m "docs: update README"

# View commit history
git log --oneline

# View files tracked by git
git ls-files
```

### What's Excluded from Git
- `node_modules/` - Dependencies (install with `npm install`)
- `dist/` - Build outputs
- `.env*` - Environment files
- IDE and OS files (`.vscode/`, `.DS_Store`, etc.)
- Logs and cache files

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/feature-name`
3. Make your changes following conventional commits
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

