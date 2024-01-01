import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import App from './App';

// Mock the Web3Auth module
jest.mock('@web3auth/modal', () => {
  return {
    Web3Auth: jest.fn().mockImplementation(() => ({
      initModal: jest.fn(),
      connect: jest.fn(),
      logout: jest.fn(),
      getUserInfo: jest.fn().mockResolvedValue({ name: 'Test User', email: 'test@example.com' }),
    })),
    CHAIN_NAMESPACES: {
      EIP155: 'EIP155',
    },
  };
});

// Mock the RPC module
jest.mock('./web3RPC', () => {
  return jest.fn().mockImplementation(() => ({
    getChainId: jest.fn().mockResolvedValue('1'),
    getAccounts: jest.fn().mockResolvedValue('0x1234567890'),
    getBalance: jest.fn().mockResolvedValue('10'),
    sendTransaction: jest.fn().mockResolvedValue({ transactionHash: 'abc123' }),
    sendContractTransaction: jest.fn().mockResolvedValue({ transactionHash: 'def456' }),
    getPrivateKey: jest.fn().mockResolvedValue('private_key'),
  }));
});

describe('App Component', () => {
  it('renders login button initially', () => {
    render(<App />);
    const loginButton = screen.getByText('Login with social');
    expect(loginButton).toBeInTheDocument();
  });


  // Add more tests based on your application's functionality
});
