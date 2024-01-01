import RPC from './web3RPC';
import Web3 from 'web3';

jest.mock('web3');

describe('RPC', () => {
  let rpc;

  beforeEach(() => {
    rpc = new RPC('mockProvider');
  });

  describe('getAccounts', () => {
    it('should return the user\'s Ethereum address', async () => {
      const mockWeb3Instance = {
        eth: { getAccounts: jest.fn(() => Promise.resolve(['0xUserAddress'])) },
      };

      Web3.mockImplementation(() => mockWeb3Instance);

      const result = await rpc.getAccounts();

      expect(result).toBe('0xUserAddress');
      expect(mockWeb3Instance.eth.getAccounts).toHaveBeenCalled();
    });

    it('should handle errors and return them', async () => {
      const mockWeb3Instance = {
        eth: { getAccounts: jest.fn(() => Promise.reject('Error')) },
      };

      Web3.mockImplementation(() => mockWeb3Instance);

      const result = await rpc.getAccounts();

      expect(result).toBe('Error');
    });
  });

  describe('getBalance', () => {
    it('should return the user\'s balance in ether', async () => {
      const mockWeb3Instance = {
        eth: {
          getAccounts: jest.fn(() => Promise.resolve(['0xUserAddress'])),
          getBalance: jest.fn(() => Promise.resolve('1000000000000000000')), // 1 ether in wei
        },
        utils: { fromWei: jest.fn((value) => value) },
      };

      Web3.mockImplementation(() => mockWeb3Instance);

      const result = await rpc.getBalance();
      
      const balance = Number(result / 1e18);


      expect(balance).toBe(1);
      expect(mockWeb3Instance.eth.getAccounts).toHaveBeenCalled();
      expect(mockWeb3Instance.eth.getBalance).toHaveBeenCalledWith('0xUserAddress');
      expect(mockWeb3Instance.utils.fromWei).toHaveBeenCalledWith('1000000000000000000');
    });

    it('should handle errors and return them', async () => {
      const mockWeb3Instance = {
        eth: { getAccounts: jest.fn(() => Promise.reject('Error')) },
      };

      Web3.mockImplementation(() => mockWeb3Instance);

      const result = await rpc.getBalance();

      expect(result).toBe('Error');
    });
  });

  describe('sendTransaction', () => {
    it('should send a transaction and return the receipt', async () => {
      const mockWeb3Instance = {
        eth: {
          getAccounts: jest.fn(() => Promise.resolve(['0xUserAddress'])),
          sendTransaction: jest.fn(() => Promise.resolve({ transactionHash: 'txHash' })),
        },
        utils: { toWei: jest.fn((value) => value) },
      };

      Web3.mockImplementation(() => mockWeb3Instance);

      const result = await rpc.sendTransaction();

      expect(result).toEqual({ transactionHash: 'txHash' });
      expect(mockWeb3Instance.eth.getAccounts).toHaveBeenCalled();
      expect(mockWeb3Instance.eth.sendTransaction).toHaveBeenCalledWith({
        from: '0xUserAddress',
        to: '0x5FD22e75d105DD4640eE5c9b862722010B7F273A',
        value: parseFloat(1000000000000000 / 1e18),
        maxPriorityFeePerGas: '5000000000',
        maxFeePerGas: '6000000000000',
      });
    });

    it('should handle errors and return them', async () => {
      const mockWeb3Instance = {
        eth: { getAccounts: jest.fn(() => Promise.reject('Error')) },
      };

      Web3.mockImplementation(() => mockWeb3Instance);

      const result = await rpc.sendTransaction();

      expect(result).toBe('Error');
    });
  });


  describe('getPrivateKey', () => {
    it('should return the private key', async () => {
      const mockProvider = {
        request: jest.fn(() => Promise.resolve('privateKey')),
      };

      const rpcWithMockProvider = new RPC(mockProvider);

      const result = await rpcWithMockProvider.getPrivateKey();

      expect(result).toBe('privateKey');
      expect(mockProvider.request).toHaveBeenCalledWith({ method: 'eth_private_key' });
    });

    it('should handle errors and return them', async () => {
      const mockProvider = {
        request: jest.fn(() => Promise.reject('Error')),
      };

      const rpcWithMockProvider = new RPC(mockProvider);

      const result = await rpcWithMockProvider.getPrivateKey();

      expect(result).toBe('Error');
    });
  });
});
