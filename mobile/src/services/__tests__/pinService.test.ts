import * as SecureStore from 'expo-secure-store';
import { setPin, validatePin, isPinSet, deletePin } from '../pinService';

jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn(),
  getItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

describe('pinService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('isPinSet', () => {
    it('returns true when PIN exists', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue('1234');
      const result = await isPinSet();
      expect(result).toBe(true);
    });

    it('returns false when PIN does not exist', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);
      const result = await isPinSet();
      expect(result).toBe(false);
    });
  });

  describe('setPin', () => {
    it('stores PIN in SecureStore', async () => {
      await setPin('5678');
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith('parent_pin', '5678');
    });
  });

  describe('validatePin', () => {
    it('returns true for correct PIN', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue('1234');
      const result = await validatePin('1234');
      expect(result).toBe(true);
    });

    it('returns false for incorrect PIN', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue('1234');
      const result = await validatePin('0000');
      expect(result).toBe(false);
    });
  });
});