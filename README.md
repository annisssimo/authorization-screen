# Authorization Screen

Modern authentication system with React, TypeScript, and Tailwind CSS.
See demo on https://authorization-screen.vercel.app/

## Features

- Email/password login
- Two-factor authentication (2FA)
- Form validation with
- Responsive design
- Loading states and error handling

## Demo Credentials

### Login Accounts

- **Valid User**: `user@example.com` / `Password123` (2FA: `123456`)
- **Locked Account**: `locked@example.com` / `Password123`
- **Suspended Account**: `suspended@example.com` / `Password123`
- **Unverified Account**: `unverified@example.com` / `Password123`

### 2FA Codes

- **Valid**: `123456`, `654321`, `111111`
- **Expired**: Any code ending in `1` (e.g., `131313`)

### Security Features

- **Rate Limiting**: 5 failed attempts → 15 min lockout
- **Account States**: Active, Locked, Suspended, Unverified
- **Network Simulation**: 5% network errors, 2% server errors
- **Real-time Validation**: Form validation after first attempt

## Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:5173`

## Build

```bash
npm run build
```

## Tech Stack

- React 18 + TypeScript
- Tailwind CSS
- React Query
- Ant Design
