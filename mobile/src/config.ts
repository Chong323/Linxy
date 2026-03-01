import { Platform } from 'react-native';

// When running on Android emulator, localhost is 10.0.2.2
// When running on iOS simulator, localhost is localhost
// Adjust port based on your FastAPI setup (usually 8000)
export const API_BASE_URL = Platform.OS === 'android' 
  ? 'http://10.0.2.2:8000' 
  : 'http://localhost:8000';
