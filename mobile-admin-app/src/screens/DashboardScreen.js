import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import * as Notifications from 'expo-notifications';
import { db } from '../services/firebase';
import { COLORS } from '../theme/colors';

export default function DashboardScreen() {
  const [summary, setSummary] = useState({ sales: 0, purchases: 0, profit: 0 });
  const [lastOrderCount, setLastOrderCount] = useState(0);

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
      <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
        {card("Today's Sales", summary.sales)}
        {card('Total Purchases', summary.purchases)}
      </View>
      <View style={{ marginTop: 10 }}>{card('Net Profit', summary.profit)}</View>
    </View>
  );
}
