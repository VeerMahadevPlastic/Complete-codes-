import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../services/firebase';
import { COLORS } from '../theme/colors';

export default function OrdersScreen() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snap) => setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg, padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: '800', color: COLORS.emerald }}>Orders</Text>
      <FlatList data={orders} keyExtractor={(item) => item.id} renderItem={({ item }) => (
        <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 12, marginTop: 10 }}>
          <Text style={{ fontWeight: '700' }}>{item.orderId || item.id}</Text>
          <Text>Customer: {item.details?.name || item.customer?.name || '-'}</Text>
          <Text>Status: {item.status || 'Order Placed'} | ₹{item.total || item.totals?.total || 0}</Text>
        </View>
      )} />
    </View>
  );
}
