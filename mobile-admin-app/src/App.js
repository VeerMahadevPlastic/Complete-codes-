import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';
import DashboardScreen from './screens/DashboardScreen';
import InventoryScreen from './screens/InventoryScreen';
import OrdersScreen from './screens/OrdersScreen';
import DaybookScreen from './screens/DaybookScreen';
import PinBiometricGate from './components/PinBiometricGate';
import { COLORS } from './theme/colors';

Notifications.setNotificationHandler({
  handleNotification: async () => ({ shouldShowBanner: true, shouldShowList: true, shouldPlaySound: true, shouldSetBadge: false })
});

const Tab = createBottomTabNavigator();

export default function App() {
  const [unlocked, setUnlocked] = useState(false);

  if (!unlocked) return <PinBiometricGate onUnlock={() => setUnlocked(true)} />;

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: COLORS.emerald },
            headerTintColor: '#fff',
            tabBarActiveTintColor: COLORS.gold,
            tabBarInactiveTintColor: '#D1FAE5',
            tabBarStyle: { backgroundColor: COLORS.emerald }
          }}
        >
          <Tab.Screen name="Dashboard" component={DashboardScreen} />
          <Tab.Screen name="Inventory" component={InventoryScreen} />
          <Tab.Screen name="Orders" component={OrdersScreen} />
          <Tab.Screen name="Daybook" component={DaybookScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
