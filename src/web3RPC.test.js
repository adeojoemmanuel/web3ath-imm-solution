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
        utils: { fromWei: jest.fn((value) => value / 10^18) },
      };

      Web3.mockImplementation(() => mockWeb3Instance);

      const result = await rpc.getBalance();
      
      const balance = await mockWeb3Instance.utils.fromWei(result);


      expect(balance).toBe('1');
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

//   describe('sendTransaction', () => {
//     // Write your test cases for sendTransaction
//   });

//   describe('sendContractTransaction', () => {
//     // Write your test cases for sendContractTransaction
//   });

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
