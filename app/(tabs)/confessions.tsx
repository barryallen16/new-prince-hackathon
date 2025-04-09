import { View, Text, Pressable, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { supabase } from '~/utils/supabase';

interface Confession {
  id: string;
  content: string;
  created_at: string;
}

export default function Confessions() {
  const [confessions, setConfessions] = useState<Confession[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConfessions = async () => {
      setIsProcessing(true);
      const { data, error } = await supabase
        .from('confessions')
        .select('id, content, created_at')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Failed to fetch confessions:', error.message);
        if (error.message.includes('permission denied')) {
          setError('You do not have permission to view confessions.');
        } else if (error.message.includes('column')) {
          setError('Database error: Invalid column. Please contact support.');
        } else {
          setError('Failed to load confessions. Please try again.');
        }
      } else {
        setConfessions(data || []);
        if (data?.length === 0) {
          // setError('No confessions available yet.');
        } else {
          setError(null);
        }
      }
      setIsProcessing(false);
    };

    fetchConfessions();

    const subscription = supabase
      .channel('confessions-channel')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'confessions' },
        (payload: { new: Confession }) => {
          setConfessions((current) => [payload.new, ...current]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const refreshConfessions = async () => {
    setIsProcessing(true);
    const { data, error } = await supabase
      .from('confessions')
      .select('id, content, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to refresh confessions:', error.message);
      setError('Failed to refresh confessions.');
    } else {
      setConfessions(data || []);
      if (data?.length === 0) {
        setError('No confessions available yet.');
      } else {
        setError(null);
      }
    }
    setIsProcessing(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <ScrollView
        className="flex-1"
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
      >
        <View className="bg-gray-900 p-5 items-center border-b border-gray-700 shadow-md">
          <Text className="text-white text-3xl font-extrabold tracking-wide">Anonymous Confessions</Text>
        </View>

        <View className="flex-1 p-4">
          {isProcessing && (
            <ActivityIndicator size="large" color="#A7F3D0" className="mb-4" />
          )}

          <View className="bg-gray-800 rounded-xl p-4 shadow-md">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-white text-lg font-semibold">Confessions</Text>
              <Pressable onPress={refreshConfessions}>
                <Text className="text-blue-400 text-sm font-medium">Refresh</Text>
              </Pressable>
            </View>
            {confessions.length === 0 ? (
              <Text className="text-gray-400 text-base text-center mt-2">No confessions available yet.</Text>
            ) : (
              confessions.map((confession) => (
                <View
                  key={confession.id}
                  className="bg-gray-700 p-3 rounded-lg mb-2 shadow-sm"
                >
                  <Text className="text-white text-base">{confession.content}</Text>
                  <Text className="text-gray-400 text-xs mt-1">
                    {new Date(confession.created_at).toLocaleString()}
                  </Text>
                </View>
              ))
            )}
          </View>

          {error && (
            <Text className="text-red-400 text-base mt-4 text-center">{error}</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}