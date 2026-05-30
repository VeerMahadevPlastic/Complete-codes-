import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { addDoc, collection } from 'firebase/firestore';
import { db, storage } from '../services/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { COLORS } from '../theme/colors';

export default function DaybookScreen() {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  const addEntry = async (kind) => {
    await addDoc(collection(db, 'transactions'), {
      kind,
      amount: Number(amount || 0),
      note,
      date: new Date().toISOString().slice(0, 10),
      mode: 'cash',
      timestamp: new Date(),
      admin_id: 'Karan_VMP_01'
    });
    setAmount('');
    setNote('');
  };

  const uploadPhoto = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) return Alert.alert('Permission required', 'Camera permission is required.');
    const capture = await ImagePicker.launchCameraAsync({ quality: 1 });
    if (capture.canceled) return;

    const uri = capture.assets[0].uri;
    const compressed = await ImageManipulator.manipulateAsync(uri, [{ resize: { width: 1400 } }], { compress: 0.72, format: ImageManipulator.SaveFormat.JPEG });
    const blob = await (await fetch(compressed.uri)).blob();
    const path = `products/mobile-${Date.now()}.jpg`;
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, blob, { contentType: 'image/jpeg' });
    const downloadUrl = await getDownloadURL(storageRef);
    await addDoc(collection(db, 'mediaUploads'), { url: downloadUrl, path, createdAt: new Date().toISOString() });
    Alert.alert('Uploaded', 'Compressed product image uploaded successfully.');
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg, padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: '800', color: COLORS.emerald }}>Daybook</Text>
      <TextInput value={amount} onChangeText={setAmount} placeholder="Amount" keyboardType="decimal-pad" style={{ marginTop: 12, backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#CBD5E1', padding: 12 }} />
      <TextInput value={note} onChangeText={setNote} placeholder="Narration" style={{ marginTop: 10, backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#CBD5E1', padding: 12 }} />
      <TouchableOpacity onPress={() => addEntry('cash_sale')} style={{ marginTop: 10, backgroundColor: '#047857', borderRadius: 12, padding: 12 }}><Text style={{ color: '#fff', textAlign: 'center', fontWeight: '700' }}>Quick Entry: Cash Sale</Text></TouchableOpacity>
      <TouchableOpacity onPress={() => addEntry('cash_out')} style={{ marginTop: 8, backgroundColor: '#B91C1C', borderRadius: 12, padding: 12 }}><Text style={{ color: '#fff', textAlign: 'center', fontWeight: '700' }}>Quick Entry: Cash Out</Text></TouchableOpacity>
      <TouchableOpacity onPress={() => addEntry('purchase_bill')} style={{ marginTop: 8, backgroundColor: COLORS.emerald, borderRadius: 12, padding: 12 }}><Text style={{ color: '#fff', textAlign: 'center', fontWeight: '700' }}>Add Purchase Bill</Text></TouchableOpacity>
      <TouchableOpacity onPress={uploadPhoto} style={{ marginTop: 18, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: COLORS.gold }}><Text style={{ textAlign: 'center', color: COLORS.emerald, fontWeight: '700' }}>Media Upload (Camera + Compressor)</Text></TouchableOpacity>
    </View>
  );
}
