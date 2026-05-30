import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';
import { collection, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { COLORS } from '../theme/colors';

export default function InventoryScreen() {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [pricingMode, setPricingMode] = useState('retail');

  useEffect(() => {
    return onSnapshot(collection(db, 'products'), (snap) => {
      setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
  }, []);

  const saveEdit = async () => {
    if (!editing) return;
    const wholesaleRate = Number(price || 0);
    const retailRate = Number((wholesaleRate * 1.25).toFixed(2));
    await updateDoc(doc(db, 'products', editing.id), {
      liveWholesaleRate: wholesaleRate,
      wholesale_price_slabs: [
        { min: 150, price: wholesaleRate },
        { min: 300, price: Number((wholesaleRate * 0.93).toFixed(2)) },
        { min: 600, price: Number((wholesaleRate * 0.86).toFixed(2)) }
      ],
      retail_price: retailRate,
      currentStock: Number(stock || 0),
      updatedAt: new Date().toISOString()
    });
    setEditing(null);
  };

  const removeItem = (id) => Alert.alert('Delete product?', 'This will remove item from website database.', [
    { text: 'Cancel' },
    { text: 'Delete', style: 'destructive', onPress: async () => deleteDoc(doc(db, 'products', id)) }
  ]);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg, padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: '800', color: COLORS.emerald }}>Inventory Manager</Text>
      <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
        <TouchableOpacity onPress={() => setPricingMode('retail')} style={{ padding: 8, borderRadius: 8, backgroundColor: pricingMode === 'retail' ? '#ECFDF5' : '#fff', borderWidth: 1, borderColor: '#A7F3D0' }}><Text>Retail</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => setPricingMode('wholesale')} style={{ padding: 8, borderRadius: 8, backgroundColor: pricingMode === 'wholesale' ? '#ECFDF5' : '#fff', borderWidth: 1, borderColor: '#A7F3D0' }}><Text>Wholesale</Text></TouchableOpacity>
      </View>
      <FlatList
        style={{ marginTop: 12 }}
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: '#DCFCE7' }}>
            <Text style={{ fontWeight: '700' }}>{item.name || item.id}</Text>
            <Text style={{ color: '#475569' }}>
              {pricingMode === 'retail' ? `Retail: ₹${item.retail_price ?? 0}` : `Wholesale: ₹${item.liveWholesaleRate ?? item.price100 ?? 0}`} | Qty: {item.currentStock ?? item.stock ?? 0}
            </Text>
            <Text style={{ color: '#0F766E', fontSize: 12 }}>Compare → Retail ₹{item.retail_price ?? 0} | Wholesale ₹{item.liveWholesaleRate ?? item.price100 ?? 0}</Text>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
              <TouchableOpacity onPress={() => { setEditing(item); setPrice(String(item.liveWholesaleRate ?? item.price100 ?? 0)); setStock(String(item.currentStock ?? item.stock ?? 0)); }} style={{ padding: 8, borderRadius: 8, backgroundColor: '#ECFDF5' }}>
                <Text style={{ color: '#047857', fontWeight: '700' }}>Quick Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => removeItem(item.id)} style={{ padding: 8, borderRadius: 8, backgroundColor: '#FEE2E2' }}>
                <Text style={{ color: COLORS.danger, fontWeight: '700' }}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {editing && (
        <View style={{ position: 'absolute', bottom: 20, left: 16, right: 16, backgroundColor: '#fff', padding: 12, borderRadius: 12 }}>
          <Text style={{ fontWeight: '700' }}>Editing: {editing.name || editing.id}</Text>
          <TextInput value={price} onChangeText={setPrice} placeholder="Live Wholesale Rate" keyboardType="decimal-pad" style={{ borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 10, padding: 10, marginTop: 8 }} />
          <TextInput value={stock} onChangeText={setStock} placeholder="Stock Qty" keyboardType="number-pad" style={{ borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 10, padding: 10, marginTop: 8 }} />
          <TouchableOpacity onPress={saveEdit} style={{ marginTop: 8, backgroundColor: COLORS.emerald, borderRadius: 10, padding: 10 }}><Text style={{ color: '#fff', textAlign: 'center', fontWeight: '700' }}>Save</Text></TouchableOpacity>
        </View>
      )}
    </View>
  );
}
