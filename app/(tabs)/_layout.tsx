import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { supabase } from '~/utils/supabase';
import { Alert } from 'react-native';
import { TabBarIcon } from '../../components/TabBarIcon';
export default function TabLayout() {
  useEffect(() => {
    const initializeAuth = async () => {
      // Check if there's an existing session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // No existing session, sign in anonymously
        const { data, error } = await supabase.auth.signInAnonymously();
        if (error) {
          console.error('Anonymous sign-in failed:', error.message);
          if (error.message.includes('Too many requests')) {
            Alert.alert(
              'Rate Limit Exceeded',
              'Too many sign-in attempts from this device. Please try again in an hour or use a different network.'
            );
          } else if (error.message.includes('Signups not allowed')) {
            Alert.alert(
              'Sign-In Error',
              'Anonymous sign-ins are disabled for this app. Please contact support.'
            );
          } else {
            Alert.alert('Error', 'Failed to sign in anonymously. Please try again.');
          }
        } else {
          console.log('Signed in anonymously:', data.user?.id);
        }
      } else {
        console.log('User already signed in:', session.user.id);
      }
    };

    initializeAuth();
  }, []);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#A7F3D0',
        tabBarInactiveTintColor: '#A0A0A0',
        tabBarStyle: {
          backgroundColor: '#1F2937',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" size={size} color={color} />
          ),
        }}
      />
            <Tabs.Screen
        name="two"
        options={{
          title: 'Tab Two',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
        }}
      />
      <Tabs.Screen
        name="confessions"
        options={{
          title: 'Confessions',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="chat" size={size} color={color} />
          ),
        }}
      />
            <Tabs.Screen
        name="profile"
        options={{
          title: 'profile',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="face" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
