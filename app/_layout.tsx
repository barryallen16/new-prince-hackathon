import '../global.css';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { supabase } from '~/utils/supabase';
import { useRouter } from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'auth',
};

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace('/(tabs)');
      } else {
        router.replace('/auth');
      }
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        router.replace('/(tabs)');
      } else if (event === 'SIGNED_OUT') {
        router.replace('/auth');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <Stack>
      <Stack.Screen name="auth" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}