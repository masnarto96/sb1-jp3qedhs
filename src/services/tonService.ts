import { TonConnectUI } from '@tonconnect/ui-react';
import { Address, beginCell, Cell, toNano } from '@ton/core';
import { TON_CONFIG } from '../config/ton';

class TonService {
  private tonConnectUI: TonConnectUI;

  constructor() {
    this.tonConnectUI = new TonConnectUI({
      manifestUrl: `${window.location.origin}/tonconnect-manifest.json`,
      buttonRootId: null
    });
  }

  async connectWallet() {
    try {
      const connectedWallet = await this.tonConnectUI.connectWallet();
      return {
        address: connectedWallet.account.address,
        publicKey: connectedWallet.account.publicKey || ''
      };
    } catch (error) {
      console.error('Wallet connection failed:', error);
      throw error;
    }
  }

  async getBalance(address: string): Promise<number> {
    try {
      const response = await fetch(`${TON_CONFIG.apiEndpoint}getAddressInformation?address=${address}&api_key=${TON_CONFIG.apiKey}`);
      const data = await response.json();
      if (data.ok && data.result) {
        return parseFloat((parseInt(data.result.balance) / 1000000000).toFixed(9));
      }
      return 0;
    } catch (error) {
      console.error('Failed to get balance:', error);
      return 0;
    }
  }

  async sendTransaction(to: string, amount: number, comment?: string) {
    try {
      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 300, // 5 minutes
        messages: [
          {
            address: to,
            amount: toNano(amount.toString()).toString(),
            payload: comment ? beginCell().storeUint(0, 32).storeStringTail(comment).endCell().toBoc({ idx: false }).toString('base64') : undefined
          }
        ]
      };

      return await this.tonConnectUI.sendTransaction(transaction);
    } catch (error) {
      console.error('Transaction failed:', error);
      throw error;
    }
  }

  async processWithdrawal(userAddress: string, amount: number, type: 'ton' | 'token') {
    try {
      if (type === 'ton') {
        return await this.sendTransaction(userAddress, amount, 'Tree TON Withdrawal');
      } else {
        // Process token withdrawal through smart contract
        return await this.sendTokens(userAddress, amount);
      }
    } catch (error) {
      console.error('Withdrawal processing failed:', error);
      throw error;
    }
  }

  private async sendTokens(to: string, amount: number) {
    // Simplified token transfer - implement with your actual token contract
    return await this.sendTransaction(to, amount, 'Tree TON Token Withdrawal');
  }

  disconnect() {
    return this.tonConnectUI.disconnect();
  }
}

export const tonService = new TonService();