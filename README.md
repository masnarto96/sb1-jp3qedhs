# Tree TON - Telegram Mini App

A comprehensive Telegram Mini App for TON blockchain mining with real mainnet integration.

## Features

### User App
- **Real TON Mining**: Interactive mining system with energy management
- **TON Wallet Integration**: Connect real TON wallets for transactions
- **Referral System**: Complete referral program with tracking and rewards
- **Task System**: Daily and social tasks with coin rewards
- **Level Upgrades**: Purchase upgrades using real TON
- **Withdrawal System**: Withdraw coins and TON to external wallets
- **Real-time Stats**: Live user statistics and progress tracking

### Admin Dashboard
- **User Management**: Monitor and manage all users
- **Withdrawal Processing**: Approve/reject withdrawal requests
- **Analytics Dashboard**: Comprehensive analytics and insights
- **Broadcast System**: Send messages to users
- **Real-time Monitoring**: System health and performance metrics
- **Transaction Management**: Monitor all blockchain transactions

## Technology Stack

- **Frontend**: React + TypeScript + Tailwind CSS
- **Blockchain**: TON Network (Mainnet)
- **Wallet**: TON Connect
- **Charts**: Recharts
- **Icons**: Lucide React

## Setup Instructions

### 1. Environment Configuration

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Fill in your configuration:
- `VITE_TON_API_KEY`: Your TON API key from toncenter.com
- `VITE_ADMIN_SECRET`: Secret key for admin access
- `VITE_API_URL`: Your backend API URL
- `VITE_WEBHOOK_URL`: Telegram webhook URL
- `VITE_MINI_APP_URL`: Your mini app URL

### 2. Install Dependencies

```bash
npm install
```

### 3. Development

Start the user app:
```bash
npm run dev
```

Start the admin panel:
```bash
npm run dev:admin
```

### 4. Build for Production

```bash
npm run build
```

## Deployment

### User App
Deploy the main app to your domain and configure it as a Telegram Mini App.

### Admin Panel
Deploy the admin panel to a secure subdomain (e.g., admin.your-domain.com).

### TON Connect Manifest
Update `public/tonconnect-manifest.json` with your domain information.

## Backend Requirements

You'll need to implement a backend API with the following endpoints:

### User Management
- `POST /api/users` - Create user
- `GET /api/users/:id` - Get user
- `PUT /api/users/:id` - Update user

### Mining
- `POST /api/mining/record` - Record mining activity

### Tasks
- `POST /api/tasks/complete` - Complete task

### Referrals
- `POST /api/referrals` - Process referral

### Withdrawals
- `POST /api/withdrawals` - Create withdrawal request
- `GET /api/withdrawals` - Get withdrawals
- `PUT /api/withdrawals/:id` - Update withdrawal

### Admin
- `GET /api/admin/stats` - Get admin statistics
- `GET /api/admin/users` - Get all users
- `GET /api/admin/withdrawals` - Get all withdrawals
- `POST /api/admin/withdrawals/:id/approve` - Approve withdrawal
- `POST /api/admin/withdrawals/:id/reject` - Reject withdrawal

## Security Considerations

1. **Admin Access**: Secure admin panel with proper authentication
2. **Wallet Security**: Never store private keys, use TON Connect
3. **API Security**: Implement proper API authentication and rate limiting
4. **Withdrawal Verification**: Always verify withdrawal requests manually
5. **Environment Variables**: Keep sensitive data in environment variables

## TON Integration

### Smart Contracts
Deploy your own TON smart contracts for:
- Tree Token (TRC-20 compatible)
- Mining rewards distribution
- Withdrawal processing

### Mainnet Configuration
The app is configured for TON mainnet. Ensure you have:
- Real TON for transaction fees
- Proper API keys for toncenter.com
- Valid smart contract addresses

## Telegram Bot Setup

1. Create a bot with @BotFather
2. Set up webhook: `https://api.telegram.org/bot<TOKEN>/setWebhook?url=<WEBHOOK_URL>`
3. Configure Mini App in bot settings
4. Set bot commands and description

## Support

For support and questions:
- Telegram: @realtreeton
- Bot Token: 8095799496:AAG7nTlh-NUC6rnEC8rKVfoaPoxyb1pPaPM

## License

This project is proprietary software. All rights reserved.