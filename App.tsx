import './global.css';
import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';

import RootNavigator from './src/navigation/RootNavigator';
import Sidebar from './src/navigation/Sidebar';
import { navigationRef } from './src/navigation/navigationRef';
import type { RootStackParamList } from './src/navigation/types';

export default function App() {
  const [current, setCurrent] = useState<keyof RootStackParamList | undefined>('Home');

  const syncRoute = () => {
    const name = navigationRef.getCurrentRoute()?.name as keyof RootStackParamList | undefined;
    setCurrent(name);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer ref={navigationRef} onReady={syncRoute} onStateChange={syncRoute}>
          <RootNavigator />
        </NavigationContainer>
        {/* Persistent Sidebar overlay — shows only on sidebar routes (web RootLayout parity) */}
        <Sidebar current={current} />
        <StatusBar style="light" />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
