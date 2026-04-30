import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Switch, Alert } from 'react-native';
import { collection, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { COLORS } from '../theme/colors';

export default function RetailSettingsScreen() {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [wholesaleRate, setWholesaleRate] = useState('');
  const [packetPrice, setPacketPrice] = useState('');
  const [retailMoq, setRetailMoq] = useState('1');
  const [piecesPerUnit, setPiecesPerUnit] = useState('100');
  const [retailUnit, setRetailUnit] = useState('Packet');
  const [retailEnabled, setRetailEnabled] = useState(true);
  const [retailStock, setRetailStock] = useState('0');
  const [wholesaleStock, setWholesaleStock] = useState('0');

  useEffect(() => onSnapshot(collection(db, 'products'), (snap) => {
    setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  }), []);

  const marginPercent = useMemo(() => {
    const w = Number(wholesaleRate || 0);
    const r = Number(packetPrice || 0);
    if (w <= 0 || r <= 0) return 0;
    return Number((((r - w) / w) * 100).toFixed(2));
  }, [wholesaleRate, packetPrice]);

  const applyAutoRetailPrice = () => {
    const w = Number(wholesaleRate || 0);
    if (w <= 0) return;
    setPacketPrice(String(Number((w * 1.25).toFixed(2))));
  };

  const openEdit = (item) => {
    setEditing(item);
    setWholesaleRate(String(item.liveWholesaleRate ?? item.price100 ?? 0));
    setPacketPrice(String(item.retail_price ?? 0));
    setRetailMoq(String(item.retail_moq ?? 1));
    setPiecesPerUnit(String(item.pieces_per_unit ?? 100));
    setRetailUnit(String(item.retail_unit ?? 'Packet'));
    setRetailEnabled(item.retail_enabled !== false);
    setRetailStock(String(item.retail_stock ?? item.currentStock ?? item.stock ?? 0));
    setWholesaleStock(String(item.wholesale_stock ?? item.currentStock ?? item.stock ?? 0));
  };

  const saveEdit = async () => {
    if (!editing) return;
    const baseWholesale = Number(wholesaleRate || 0);
    await updateDoc(doc(db, 'products', editing.id), {
      liveWholesaleRate: baseWholesale,
      wholesale_price_slabs: [
        { min: 150, price: baseWholesale },
        { min: 300, price: Number((baseWholesale * 0.93).toFixed(2)) },
        { min: 600, price: Number((baseWholesale * 0.86).toFixed(2)) }
      ],
      retail_enabled: retailEnabled,
      retail_price: Number(packetPrice || 0),
      retail_moq: Math.max(1, Number(retailMoq || 1)),
      pieces_per_unit: Math.max(1, Number(piecesPerUnit || 1)),
      retail_unit: retailUnit || 'Packet',
      retail_stock: Math.max(0, Number(retailStock || 0)),
      wholesale_stock: Math.max(0, Number(wholesaleStock || 0)),
      currentStock: Math.max(0, Number(wholesaleStock || 0)),
      updatedAt: new Date().toISOString()
    });
    setEditing(null);
  };

  const applyBulkMoq = (pattern, moq) => {
    const matched = products.filter((item) => (item.category || '').toLowerCase().includes(pattern));
    if (!matched.length) {
      Alert.alert('No products found', `No category matched: ${pattern}`);
      return;
    }
    Promise.all(matched.map((item) => updateDoc(doc(db, 'products', item.id), {
      retail_moq: moq,
      updatedAt: new Date().toISOString()
    }))).then(() => {
      Alert.alert('Bulk MOQ updated', `${matched.length} products updated to MOQ ${moq}`);
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg, padding: 14 }}>
      <Text style={{ fontSize: 22, fontWeight: '800', color: COLORS.emerald }}>Retail Settings</Text>
      <Text style={{ marginTop: 4, color: '#475569' }}>Retail Inventory + MOQ Controls</Text>

      <View style={{ marginTop: 10, flexDirection: 'row', gap: 8 }}>
        <TouchableOpacity onPress={() => applyBulkMoq('bag', 2)} style={{ backgroundColor: '#ECFDF5', borderColor: '#A7F3D0', borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8 }}>
          <Text style={{ color: '#065F46', fontWeight: '700' }}>Bulk MOQ: Bags = 2</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => applyBulkMoq('book', 3)} style={{ backgroundColor: '#FEF3C7', borderColor: '#FCD34D', borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8 }}>
          <Text style={{ color: '#92400E', fontWeight: '700' }}>Bulk MOQ: Books = 3</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        style={{ marginTop: 12 }}
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const w = Number(item.liveWholesaleRate ?? item.price100 ?? 0);
          const r = Number(item.retail_price ?? 0);
          const margin = w > 0 && r > 0 ? Number((((r - w) / w) * 100).toFixed(1)) : 0;
          return (
            <View style={{ backgroundColor: '#fff', borderRadius: 12, borderColor: '#DCFCE7', borderWidth: 1, padding: 12, marginBottom: 10 }}>
              <Text style={{ fontWeight: '800' }}>{item.name || item.id}</Text>
              <Text style={{ color: '#475569', marginTop: 4 }}>Packet: ₹{item.retail_price ?? 0} • MOQ: {item.retail_moq ?? 1} • Pack: {item.pieces_per_unit ?? 100} pcs</Text>
              <Text style={{ color: '#0F766E', fontSize: 12 }}>Margin: {margin}% | Retail stock: {item.retail_stock ?? 0} | Wholesale stock: {item.wholesale_stock ?? item.currentStock ?? item.stock ?? 0}</Text>
              <View style={{ marginTop: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={{ color: item.retail_enabled === false ? '#DC2626' : '#065F46', fontWeight: '700' }}>
                  Retail {item.retail_enabled === false ? 'Disabled' : 'Enabled'}
                </Text>
                <TouchableOpacity onPress={() => openEdit(item)} style={{ padding: 8, borderRadius: 8, backgroundColor: '#ECFDF5' }}>
                  <Text style={{ color: '#047857', fontWeight: '700' }}>Edit Retail</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />

      {editing && (
        <View style={{ position: 'absolute', bottom: 12, left: 12, right: 12, backgroundColor: '#fff', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0' }}>
          <Text style={{ fontWeight: '800' }}>Editing: {editing.name || editing.id}</Text>
          <View style={{ marginTop: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={{ fontWeight: '700', color: '#334155' }}>Enable Retail</Text>
            <Switch value={retailEnabled} onValueChange={setRetailEnabled} />
          </View>
          <TextInput value={wholesaleRate} onChangeText={setWholesaleRate} placeholder="Wholesale Rate" keyboardType="decimal-pad" style={{ borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 10, padding: 10, marginTop: 8 }} />
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
            <TextInput value={packetPrice} onChangeText={setPacketPrice} placeholder="Retail Packet Price" keyboardType="decimal-pad" style={{ flex: 1, borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 10, padding: 10 }} />
            <TouchableOpacity onPress={applyAutoRetailPrice} style={{ borderRadius: 10, backgroundColor: '#ECFDF5', justifyContent: 'center', paddingHorizontal: 12 }}>
              <Text style={{ color: '#065F46', fontWeight: '700' }}>+25%</Text>
            </TouchableOpacity>
          </View>
          <Text style={{ marginTop: 6, color: marginPercent >= 0 ? '#0F766E' : '#B91C1C', fontWeight: '700' }}>Margin Calculator: {marginPercent}%</Text>
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
            <TextInput value={retailMoq} onChangeText={setRetailMoq} placeholder="Retail MOQ" keyboardType="number-pad" style={{ flex: 1, borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 10, padding: 10 }} />
            <TextInput value={piecesPerUnit} onChangeText={setPiecesPerUnit} placeholder="Pieces per Unit" keyboardType="number-pad" style={{ flex: 1, borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 10, padding: 10 }} />
          </View>
          <TextInput value={retailUnit} onChangeText={setRetailUnit} placeholder="Retail Unit (Packet/Roll/Bundle)" style={{ borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 10, padding: 10, marginTop: 8 }} />
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
            <TextInput value={retailStock} onChangeText={setRetailStock} placeholder="Retail Stock" keyboardType="number-pad" style={{ flex: 1, borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 10, padding: 10 }} />
            <TextInput value={wholesaleStock} onChangeText={setWholesaleStock} placeholder="Wholesale Stock" keyboardType="number-pad" style={{ flex: 1, borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 10, padding: 10 }} />
          </View>
          <TouchableOpacity onPress={saveEdit} style={{ marginTop: 8, borderRadius: 10, backgroundColor: COLORS.emerald, padding: 10 }}>
            <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '800' }}>Save Retail Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setEditing(null)} style={{ marginTop: 6 }}><Text style={{ textAlign: 'center', color: '#64748B', fontWeight: '600' }}>Cancel</Text></TouchableOpacity>
        </View>
      )}
    </View>
  );
}
