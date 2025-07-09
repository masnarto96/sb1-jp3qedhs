export const TON_CONFIG = {
  // Mainnet configuration
  network: 'mainnet',
  apiEndpoint: 'https://toncenter.com/api/v2/',
  apiKey: import.meta.env.VITE_TON_API_KEY || '',
  
  // Contract addresses (deploy your own contracts)
  contracts: {
    treeToken: 'EQD...' // Your Tree Token contract address
  },
  
  // Bot configuration
  bot: {
    token: '8095799496:AAG7nTlh-NUC6rnEC8rKVfoaPoxyb1pPaPM',
    username: 'realtreeton'
  },
  
  // Admin configuration
  admin: {
    walletAddress: 'UQD...', // Admin wallet address
    secretKey: import.meta.env.VITE_ADMIN_SECRET || 'demo-admin-secret'
  },
  
  // Mining rates and economics
  economics: {
    pointsToTonRate: 10000, // 10,000 points = 1 TON
    energyRegenTime: 30000, // 30 seconds per energy
    dailyTaskReward: 100,
    referralReward: 100,
    withdrawalFee: 0.001, // 0.001 TON
    minWithdrawal: 0.01 // 0.01 TON minimum
  }
};

export const TELEGRAM_CONFIG = {
  botToken: TON_CONFIG.bot.token,
  webhookUrl: import.meta.env.VITE_WEBHOOK_URL || 'https://your-domain.com/webhook',
  miniAppUrl: import.meta.env.VITE_MINI_APP_URL || 'https://your-domain.com'
};