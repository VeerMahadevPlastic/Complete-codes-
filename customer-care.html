import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { COLORS } from '../theme/colors';

const OFFICE_PIN = '8050';

export default function PinBiometricGate({ onUnlock }) {
  const [pin, setPin] = useState('');

  const unlockWithBiometric = async () => {
    const supported = await LocalAuthentication.hasHardwareAsync();
    if (!supported) return Alert.alert('Biometric unavailable', 'Use office PIN instead.');
    const result = await LocalAuthentication.authenticateAsync({ promptMessage: 'Ahmedabad Office Access' });
    if (result.success) onUnlock();
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 24, backgroundColor: COLORS.bg }}>
      <Text style={{ fontSize: 24, fontWeight: '800', color: COLORS.emerald }}>VMP Admin Secure Access</Text>
      <Text style={{ marginTop: 8, color: '#475569' }}>Ahmedabad office PIN or biometric required.</Text>
      <TextInput
        value={pin}
        onChangeText={setPin}
        placeholder="Enter 4-digit PIN"
        secureTextEntry
        keyboardType="number-pad"
        maxLength={4}
        style={{ marginTop: 16, borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 12, padding: 12, backgroundColor: '#fff' }}
      />
      <TouchableOpacity
        onPress={() => (pin === OFFICE_PIN ? onUnlock() : Alert.alert('Access Denied', 'Invalid office PIN'))}
        style={{ marginTop: 14, backgroundColor: COLORS.emerald, padding: 12, borderRadius: 12 }}
      >
        <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '700' }}>Unlock with PIN</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={unlockWithBiometric} style={{ marginTop: 10, borderWidth: 1, borderColor: COLORS.gold, padding: 12, borderRadius: 12 }}>
        <Text style={{ color: COLORS.emerald, textAlign: 'center', fontWeight: '700' }}>Unlock with Biometric</Text>
      </TouchableOpacity>
    </View>
  );
}
