import { TonConnect } from '@tonconnect/sdk';
import { Address, beginCell, Cell, toNano } from '@ton/core';
import TonWeb from 'tonweb';
import { TON_CONFIG } from '../config/ton';

class TonService {
  private tonweb: any;
  private tonConnect: TonConnect;

  constructor() {
    this.tonweb = new TonWeb(new TonWeb.HttpProvider(TON_CONFIG.apiEndpoint, {
      apiKey: TON_CONFIG.apiKey
    }));
    
    this.tonConnect = new TonConnect({
      manifestUrl: `${window.location.origin}/tonconnect-manifest.json`
    });
  }

  async connectWallet() {
    try {
      const connectedWallet = await this.tonConnect.connectWallet();
      return {
        address: connectedWallet.account.address,
        publicKey: connectedWallet.account.publicKey
      };
    } catch (error) {
      console.error('Wallet connection failed:', error);
      throw error;
    }
  }

  async getBalance(address: string): Promise<number> {
    try {
      const balance = await this.tonweb.getBalance(address);
      return parseFloat(TonWeb.utils.fromNano(balance));
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
            payload: comment ? beginCell().storeUint(0, 32).storeStringTail(comment).endCell().toBoc().toString('base64') : undefined
          }
        ]
      };

      return await this.tonConnect.sendTransaction(transaction);
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
    // Implement token transfer logic through your Tree Token contract
    const tokenContract = new this.tonweb.Contract.Token({
      address: TON_CONFIG.contracts.treeToken
    });
    
    // This would interact with your deployed token contract
    return await tokenContract.transfer({
      to: to,
      amount: TonWeb.utils.toNano(amount.toString()),
      comment: 'Tree TON Token Withdrawal'
    });
  }

  disconnect() {
    return this.tonConnect.disconnect();
  }
}

export const tonService = new TonService();