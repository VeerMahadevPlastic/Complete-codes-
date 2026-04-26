import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, Switch } from 'react-native';
import { collection, doc, onSnapshot, query, setDoc, where } from 'firebase/firestore';
import * as Notifications from 'expo-notifications';
import { db } from '../services/firebase';
import { COLORS } from '../theme/colors';

export default function DashboardScreen() {
  const [summary, setSummary] = useState({ sales: 0, purchases: 0, profit: 0 });
  const [lastOrderCount, setLastOrderCount] = useState(0);
  const [aiEnabled, setAiEnabled] = useState(false);
  const [inventory, setInventory] = useState([]);
  const [paidOrders, setPaidOrders] = useState([]);
  const [seasonMode, setSeasonMode] = useState('normal');

  useEffect(() => {
    const q = query(collection(db, 'transactions'));
    const unsub = onSnapshot(q, (snap) => {
      let sales = 0;
      let purchases = 0;
      snap.forEach((d) => {
        const row = d.data();
        if (row.kind === 'cash_sale') sales += Number(row.amount || 0);
        if (row.kind === 'purchase_bill' || row.kind === 'cash_out') purchases += Number(row.amount || 0);
      });
      setSummary({ sales, purchases, profit: sales - purchases });
    });
    return unsub;
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'orders'), where('paymentStatus', '==', 'Paid'));
    const unsub = onSnapshot(q, async (snap) => {
      const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setPaidOrders(rows);
      if (lastOrderCount !== 0 && snap.size > lastOrderCount) {
        await Notifications.scheduleNotificationAsync({
          content: { title: 'New Wholesale Order', body: 'A new paid wholesale order just arrived.' },
          trigger: null
        });
      }
      setLastOrderCount(snap.size);
    });
    return unsub;
  }, [lastOrderCount]);

  useEffect(() => onSnapshot(collection(db, 'inventory'), (snap) => {
    setInventory(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  }), []);

  useEffect(() => onSnapshot(collection(db, 'appSettings'), (snap) => {
    const seasonDoc = snap.docs.find((d) => d.id === 'seasonMode');
    if (seasonDoc) setSeasonMode(seasonDoc.data()?.mode || 'normal');
  }), []);

  const setSeason = async (mode) => {
    setSeasonMode(mode);
    await setDoc(doc(db, 'appSettings', 'seasonMode'), {
      mode,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  };

  const aiSuggestions = useMemo(() => {
    if (!aiEnabled) return { lowStock: [], topSelling: [] };
    const lowStock = inventory
      .map((item) => ({ id: item.id, stock: Number(item.currentStock ?? item.stock ?? 0) }))
      .filter((item) => item.stock <= 80)
      .sort((a, b) => a.stock - b.stock)
      .slice(0, 5);

    const salesMap = {};
    paidOrders
      .filter((order) => String(order.details?.address || '').toLowerCase().includes('ahmedabad'))
      .forEach((order) => {
        (order.items || []).forEach((item) => {
          salesMap[item.id] = (salesMap[item.id] || 0) + Number(item.qty || 0);
        });
      });
    const topSelling = Object.entries(salesMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([id, qty]) => ({ id, qty }));
    return { lowStock, topSelling };
  }, [aiEnabled, inventory, paidOrders]);

  const card = (label, value) => (
    <View style={{ flex: 1, backgroundColor: COLORS.white, padding: 14, borderRadius: 14, borderWidth: 1, borderColor: '#D1FAE5' }}>
      <Text style={{ color: '#047857', fontSize: 12 }}>{label}</Text>
      <Text style={{ fontSize: 22, fontWeight: '800', color: COLORS.text }}>₹{value.toFixed(2)}</Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg, padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: '800', color: COLORS.emerald }}>Business Summary</Text>
      <Text style={{ color: '#475569', marginTop: 4 }}>Real-time card from Firestore transactions</Text>
      <View style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', padding: 10, borderRadius: 12, borderWidth: 1, borderColor: '#DCFCE7' }}>
        <View>
          <Text style={{ fontWeight: '700', color: '#065F46' }}>AI Suggestions</Text>
          <Text style={{ color: '#64748B', fontSize: 12 }}>Low stock + top sellers (Ahmedabad)</Text>
        </View>
        <Switch value={aiEnabled} onValueChange={setAiEnabled} />
      </View>
      <View style={{ marginTop: 10, backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#DCFCE7', padding: 10 }}>
        <Text style={{ fontWeight: '700', color: '#065F46' }}>Season Mode</Text>
        <View style={{ marginTop: 8, flexDirection: 'row', gap: 8 }}>
          {[
            { key: 'wedding', label: 'Wedding Season' },
            { key: 'festival', label: 'Festival Season' },
            { key: 'normal', label: 'Normal' }
          ].map((item) => (
            <Text
              key={item.key}
              onPress={() => setSeason(item.key)}
              style={{
                paddingVertical: 7,
                paddingHorizontal: 10,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: '#A7F3D0',
                backgroundColor: seasonMode === item.key ? '#ECFDF5' : '#fff',
                color: seasonMode === item.key ? '#065F46' : '#475569',
                fontWeight: '700'
              }}
            >
              {item.label}
            </Text>
          ))}
        </View>
      </View>
      <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
        {card("Today's Sales", summary.sales)}
        {card('Total Purchases', summary.purchases)}
      </View>
      <View style={{ marginTop: 10 }}>{card('Net Profit', summary.profit)}</View>
      {aiEnabled && (
        <View style={{ marginTop: 12, backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#DCFCE7', padding: 12 }}>
          <Text style={{ color: '#047857', fontWeight: '800' }}>Low Stock Suggestions</Text>
          {aiSuggestions.lowStock.length ? aiSuggestions.lowStock.map((item) => (
            <Text key={`low-${item.id}`} style={{ marginTop: 4, color: '#334155' }}>• {item.id} → stock {item.stock}</Text>
          )) : <Text style={{ marginTop: 4, color: '#64748B' }}>No urgent low-stock alerts.</Text>}

          <Text style={{ marginTop: 10, color: '#047857', fontWeight: '800' }}>Top Selling Items (Ahmedabad)</Text>
          {aiSuggestions.topSelling.length ? aiSuggestions.topSelling.map((item) => (
            <Text key={`top-${item.id}`} style={{ marginTop: 4, color: '#334155' }}>• {item.id} → sold {item.qty}</Text>
          )) : <Text style={{ marginTop: 4, color: '#64748B' }}>No Ahmedabad sales trend yet.</Text>}
        </View>
      )}
    </View>
  );
}
