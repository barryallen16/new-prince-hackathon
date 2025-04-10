import { View, Text, Pressable, ActivityIndicator, ScrollView, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { supabase } from '~/utils/supabase';
import { create } from 'apisauce';

// Interface for chat message
interface Message {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
}

// Interface for Flask response from /predict_text and /analyze_chat
interface FlaskResponseData {
  risk: string;
  message: string;
  score?: number; // Optional, only present in /predict_text
}

const flaskApiClient = create({
  baseURL: process.env.EXPO_PUBLIC_FLASK_BACKEND_ENDPOINT as string,
  headers: { 'Content-Type': 'application/json' },
});

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      setIsProcessing(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('You must be logged in to view messages.');
        setIsProcessing(false);
        return;
      }

      const { data, error } = await supabase
        .from('chat_messages')
        .select('id, content, created_at, user_id')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Failed to fetch messages:', error.message);
        setError('Failed to load messages. Please try again.');
      } else {
        setMessages(data || []);
        setError(null);
      }
      setIsProcessing(false);
    };

    fetchMessages();

    const subscription = supabase
      .channel('chat-messages-channel')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_messages' },
        (payload: { new: Message }) => {
          setMessages((current) => [payload.new, ...current]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const sendMessage = async () => {
    if (!newMessage.trim()) {
      Alert.alert('Error', 'Please enter a message.');
      return;
    }
  
    setIsProcessing(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError('You must be logged in to send messages.');
      setIsProcessing(false);
      return;
    }
  
    console.log('Sending request to:', flaskApiClient.getBaseURL() + '/send_message'); // Debug line
    const response = await flaskApiClient.post('/send_message', {
      user_id: user.id,
      content: newMessage,
    });
  
    if (!response.ok) {
      console.error('Failed to send message:', response.problem, response.status, response.data);
      setError(`Failed to send message: ${response.problem} (${response.status})`);
      if (response.data && 'error' in response.data) {
        setError(`Failed to send message: ${response.data.error}`);
      }
    } else {
      setNewMessage('');
    }
    setIsProcessing(false);
  };
  const analyzeMentalHealth = async () => {
    setIsProcessing(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError('You must be logged in to analyze your mental health.');
      setIsProcessing(false);
      return;
    }

    // Specify the response type explicitly
    const response = await flaskApiClient.post<FlaskResponseData>('/analyze_chat', {
      user_id: user.id,
    });

    if (response.ok && response.data) {
      const { risk, message } = response.data; // TypeScript now knows these exist
      Alert.alert('Mental Health Analysis', `Risk: ${risk}\nMessage: ${message}`);
    } else {
      console.error('Failed to analyze chat:', response.problem);
      setError('Failed to analyze chat.');
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
          <Text className="text-white text-3xl font-extrabold tracking-wide">Chat</Text>
        </View>

        <View className="flex-1 p-4">
          {isProcessing && (
            <ActivityIndicator size="large" color="#A7F3D0" className="mb-4" />
          )}

          <View className="bg-gray-800 rounded-xl p-4 shadow-md flex-1">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-white text-lg font-semibold">Messages</Text>
              <Pressable onPress={analyzeMentalHealth}>
                <Text className="text-blue-400 text-sm font-medium">Analyze Mental Health</Text>
              </Pressable>
            </View>
            {messages.length === 0 ? (
              <Text className="text-gray-400 text-base text-center mt-2">No messages yet.</Text>
            ) : (
              messages.map((message) => (
                <View key={message.id} className="bg-gray-700 p-3 rounded-lg mb-2 shadow-sm">
                  <Text className="text-white text-base">{message.content}</Text>
                  <Text className="text-gray-400 text-xs mt-1">
                    {new Date(message.created_at).toLocaleString()}
                  </Text>
                </View>
              ))
            )}
          </View>

          <View className="mt-4 flex-row items-center">
            <TextInput
              className="flex-1 bg-gray-700 text-white text-base p-3 rounded-lg mr-2"
              placeholder="Type a message..."
              placeholderTextColor="#A0A0A0"
              value={newMessage}
              onChangeText={setNewMessage}
            />
            <Pressable
              className="bg-blue-600 py-3 px-4 rounded-lg"
              onPress={sendMessage}
              disabled={isProcessing}
            >
              <Text className="text-white text-base font-semibold">Send</Text>
            </Pressable>
          </View>

          {error && (
            <Text className="text-red-400 text-base mt-4 text-center">{error}</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}