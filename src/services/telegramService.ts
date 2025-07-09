import axios from 'axios';
import { TELEGRAM_CONFIG } from '../config/ton';

class TelegramService {
  private baseUrl = `https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}`;

  async sendMessage(chatId: string, text: string, options?: any) {
    try {
      const response = await axios.post(`${this.baseUrl}/sendMessage`, {
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        ...options
      });
      return response.data;
    } catch (error) {
      console.error('Failed to send Telegram message:', error);
      throw error;
    }
  }

  async sendNotification(userId: string, message: string) {
    return this.sendMessage(userId, `🌳 <b>Tree TON</b>\n\n${message}`);
  }

  async notifyWithdrawalComplete(userId: string, amount: number, type: string) {
    const message = `✅ <b>Withdrawal Completed</b>\n\n` +
      `Amount: ${amount} ${type.toUpperCase()}\n` +
      `Status: Successfully processed\n` +
      `Time: ${new Date().toLocaleString()}`;
    
    return this.sendNotification(userId, message);
  }

  async notifyReferralReward(userId: string, referrerName: string, reward: number) {
    const message = `🎉 <b>Referral Reward!</b>\n\n` +
      `${referrerName} joined using your link!\n` +
      `Reward: +${reward} coins\n` +
      `Keep sharing to earn more!`;
    
    return this.sendNotification(userId, message);
  }

  async setWebhook() {
    try {
      const response = await axios.post(`${this.baseUrl}/setWebhook`, {
        url: TELEGRAM_CONFIG.webhookUrl,
        allowed_updates: ['message', 'callback_query', 'inline_query']
      });
      return response.data;
    } catch (error) {
      console.error('Failed to set webhook:', error);
      throw error;
    }
  }

  async getUserInfo(userId: string) {
    try {
      const response = await axios.post(`${this.baseUrl}/getChat`, {
        chat_id: userId
      });
      return response.data.result;
    } catch (error) {
      console.error('Failed to get user info:', error);
      return null;
    }
  }
}

export const telegramService = new TelegramService();