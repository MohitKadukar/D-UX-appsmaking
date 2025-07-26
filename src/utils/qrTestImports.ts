// Test file to verify QR code dependencies are properly installed
import { Camera } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';
import QRCode from 'react-native-qrcode-svg';
import * as Sharing from 'expo-sharing';

// Basic test to ensure all imports work
export const testQRDependencies = () => {
  console.log('QR Dependencies loaded successfully:');
  console.log('- Camera:', typeof Camera);
  console.log('- BarCodeScanner:', typeof BarCodeScanner);
  console.log('- QRCode:', typeof QRCode);
  console.log('- Sharing:', typeof Sharing);
  return true;
};

// Export the components for use in the actual implementation
export {
  Camera,
  BarCodeScanner,
  QRCode,
  Sharing
};