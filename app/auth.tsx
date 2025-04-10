import { View, Text, TextInput, Pressable, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { supabase } from '~/utils/supabase';
import { useRouter } from 'expo-router';

export default function Auth() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const router = useRouter();

  const handleAuth = async () => {
    setIsLoading(true);
    try {
      const pseudoEmail = `${username}@all-is-well.app`;

      if (isSignUp) {
        // Show warning before sign-up
        Alert.alert(
          'Important Notice',
          'You are signing up with a username and password only. If you forget your password, you will not be able to recover your account.',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Proceed',
              onPress: async () => {
                const { data, error } = await supabase.auth.signUp({
                  email: pseudoEmail,
                  password,
                });
                if (error) throw error;
                Alert.alert('Success', 'Sign-up successful! You are now signed in.');
                router.replace('/(tabs)');
              },
            },
          ]
        );
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: pseudoEmail,
          password,
        });
        if (error) throw error;
        router.replace('/(tabs)');
      }
    } catch (err: any) {
      console.error('Auth error:', err.message);
      Alert.alert('Error', err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <View className="flex-1 p-4 justify-center">
        <Text className="text-white text-3xl font-extrabold text-center mb-6">All Is Well</Text>

        <TextInput
          className="bg-gray-800 text-white text-lg p-3 rounded-lg mb-4"
          placeholder="Username"
          placeholderTextColor="#A0A0A0"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        <TextInput
          className="bg-gray-800 text-white text-lg p-3 rounded-lg mb-6"
          placeholder="Password"
          placeholderTextColor="#A0A0A0"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
        />

        {isLoading ? (
          <ActivityIndicator size="large" color="#A7F3D0" />
        ) : (
          <>
            <Pressable
              className="bg-blue-600 py-3 px-6 rounded-lg mb-4 shadow-md"
              onPress={handleAuth}
            >
              <Text className="text-white text-lg font-semibold text-center">
                {isSignUp ? 'Sign Up' : 'Sign In'}
              </Text>
            </Pressable>
            <Pressable onPress={() => setIsSignUp(!isSignUp)}>
              <Text className="text-blue-400 text-center text-base">
                {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
              </Text>
            </Pressable>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}