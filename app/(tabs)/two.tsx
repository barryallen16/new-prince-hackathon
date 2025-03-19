// import { View, Text, Pressable, Alert, ActivityIndicator, TextInput, KeyboardAvoidingView, ScrollView } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { Audio } from 'expo-av';
// import { useEffect, useState } from 'react';
// import { create, ApiResponse } from 'apisauce';
// import * as FileSystem from 'expo-file-system';
// import FormData from 'form-data';
// import { MaterialIcons } from '@expo/vector-icons';
// import { MeshGradientView } from 'expo-mesh-gradient';

import { View , Text} from "react-native";

// interface ApiResponseData {
//   language_code: string;
//   language_probability: number;
//   text: string;
// }

// const apiClient = create({
//   baseURL: 'https://api.elevenlabs.io/v1',
//   headers: {
//     'xi-api-key': 'sk_eec44fdc73cfdb37dddc9f1c96916faa44e722a0b47d3ce7',
//   },
// });

// const flaskApiClient = create({
//   baseURL: 'https://1468-2402-3a80-1bbe-ad8a-5d39-506b-3cd3-ac46.ngrok-free.app',
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Define points for the 3x3 grid
// const points: [number, number][] = [
//   [0.0, 0.0], [0.5, 0.0], [1.0, 0.0],
//   [0.0, 0.5], [0.5, 0.5], [1.0, 0.5],
//   [0.0, 1.0], [0.5, 1.0], [1.0, 1.0],
// ];

// // Calming color sets for each risk level
// const colorSets = {
//   Low: [
//     "#A7F3D0", "#34D399", "#6EE7B7",
//     "#AEDFF7", "#60A5FA", "#93C5FD",
//     "#D1FAE5", "#BFDBFE", "#E5E7EB",
//   ],
//   Medium: [
//     "#AEDFF7", "#60A5FA", "#93C5FD",
//     "#E9D5FF", "#A78BFA", "#C4B5FD",
//     "#FBCFE8", "#D1D5DB", "#BFDBFE",
//   ],
//   High: [
//     "#E9D5FF", "#A78BFA", "#C4B5FD",
//     "#FBCFE8", "#F9A8D4", "#F3D7E8",
//     "#D1D5DB", "#E5E7EB", "#C4B5FD",
//   ],
// };

// export default function Home() {
//   const [recording, setRecording] = useState<Audio.Recording | null>(null);
//   const [permissionResponse, requestPermission] = Audio.usePermissions();
//   const [audioUri, setAudioUri] = useState<string | null>(null);
//   const [transcription, setTranscription] = useState<string | null>(null);
//   const [risk, setRisk] = useState<string | null>(null);
//   const [message, setMessage] = useState<string | null>(null);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [inputText, setInputText] = useState<string>('');

//   useEffect(() => {
//     (async () => {
//       if (permissionResponse?.status !== 'granted') {
//         const permission = await requestPermission();
//         if (!permission.granted) {
//           Alert.alert(
//             'Permission Denied',
//             'Microphone access is required to record audio. Please enable it in settings.'
//           );
//         }
//       }
//     })();
//   }, [permissionResponse, requestPermission]);

//   async function StartRecording() {
//     try {
//       if (permissionResponse?.status !== 'granted') {
//         const permission = await requestPermission();
//         if (!permission.granted) {
//           Alert.alert('Permission Denied', 'Microphone access is needed to proceed.');
//           return;
//         }
//       }
//       await Audio.setAudioModeAsync({ playsInSilentModeIOS: true, allowsRecordingIOS: true });
//       const { recording } = await Audio.Recording.createAsync(
//         Audio.RecordingOptionsPresets.HIGH_QUALITY
//       );
//       setRecording(recording);
//       setAudioUri(null);
//       setTranscription(null);
//       setRisk(null);
//       setMessage(null);
//       setError(null);
//       setInputText('');
//       setIsProcessing(false);
//     } catch (err) {
//       console.error('Failed to start recording', err);
//       Alert.alert('Error', 'Could not start recording. Please try again.');
//     }
//   }

//   async function StopRecording() {
//     try {
//       if (!recording) return;

//       await recording.stopAndUnloadAsync();
//       await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
//       const uri = recording.getURI();
//       setAudioUri(uri);
//       console.log('Recording saved at:', uri);
//       setRecording(null);
//       setIsProcessing(true);
//       if (uri) {
//         await transcribeAudio(uri);
//       }
//     } catch (err) {
//       console.error('Failed to stop recording', err);
//       Alert.alert('Error', 'Could not stop recording. Please try again.');
//       setError('Failed to stop recording.');
//     } finally {
//       setRecording(null);
//     }
//   }

//   async function transcribeAudio(audioUri: string) {
//     try {
//       const fileInfo = await FileSystem.getInfoAsync(audioUri);
//       if (!fileInfo.exists) {
//         throw new Error('Audio file not found.');
//       }

//       const formData = new FormData();
//       formData.append('model_id', 'scribe_v1');
//       formData.append('file', {
//         uri: audioUri,
//         name: 'audio.m4a',
//         type: 'audio/m4a',
//       });
//       formData.append('language_code', 'en');

//       const response = await apiClient.post<ApiResponseData, ApiResponse<ApiResponseData>>(
//         '/speech-to-text',
//         formData,
//         { headers: { 'Content-Type': 'multipart/form-data' } }
//       );

//       if (response.ok && response.data) {
//         const transcriptionText = response.data.text;
//         setTranscription(transcriptionText);
//         console.log(`Transcription: ${transcriptionText}`);
//         await predictRisk(transcriptionText);
//       } else {
//         console.error('Transcription failed', response.problem, response.data);
//         setError('Transcription failed. Please try again.');
//       }
//     } catch (err) {
//       console.error('Error transcribing:', err);
//       setError('An error occurred during transcription.');
//     } finally {
//       setIsProcessing(false);
//     }
//   }

//   async function predictRisk(text: string) {
//     try {
//       setIsProcessing(true);
//       const response = await flaskApiClient.post('/predict_text', { text });

//       if (response.ok && response.data) {
//         const { risk, message } = response.data;
//         setRisk(risk);
//         setMessage(message);
//         console.log(`Predicted Risk: ${risk}, Message: ${message}`);
//       } else {
//         console.error('Risk prediction failed', response.problem, response.data);
//         setError('Failed to predict risk.');
//       }
//     } catch (err) {
//       console.error('Error predicting risk:', err);
//       setError('An error occurred during risk prediction.');
//     } finally {
//       setIsProcessing(false);
//     }
//   }

//   const handleTextSubmit = async () => {
//     if (!inputText.trim()) {
//       Alert.alert('Error', 'Please enter some text to analyze.');
//       return;
//     }
//     setTranscription(null);
//     setRisk(null);
//     setMessage(null);
//     setError(null);
//     await predictRisk(inputText);
//   };

//   const currentColors = risk ? colorSets[risk] : colorSets.Low;

//   return (
//     <SafeAreaView className="flex-1 relative">
//       <MeshGradientView
//         style={{ flex: 1, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
//         columns={3}
//         ignoresSafeArea={false}
//         rows={3}
//         colors={currentColors}
//         points={points}
//       />

//       <KeyboardAvoidingView className="flex-1" behavior="padding" >
//       <ScrollView
//           className="flex-1"
//           keyboardShouldPersistTaps="handled" 
//           keyboardDismissMode="on-drag" 
//           contentContainerStyle={{ flexGrow: 1 }}
//         >
//         <View className="bg-header-bg p-5 items-center border-b border-border-gray">
//           <Text className="text-white text-2xl font-bold">ALL IS WELL</Text>
//         </View>

//         <View className="flex-1 justify-center items-center p-5">
//           {isProcessing && <ActivityIndicator size="large" color="#ffffff" className="mb-5" />}
//           <View className="w-full mb-5">
//             <Text className="text-white text-base font-bold mb-2">Or Type Your Thoughts:</Text>
//             <TextInput
//               className="bg-gray-800 text-white text-lg p-3 rounded-lg w-full"
//               placeholder="Enter your thoughts here..."
//               placeholderTextColor="#a0a0a0"
//               value={inputText}
//               onChangeText={setInputText}
//               multiline
//             />
//             <Pressable
//               className="bg-blue-500 py-3 px-6 rounded-lg mt-3 self-center"
//               onPress={handleTextSubmit}
//             >
//               <Text className="text-white text-lg font-semibold">Submit</Text>
//             </Pressable>
//           </View>

//           {!recording ? (
//             <Pressable
//               className="flex-row items-center bg-start-green py-4 px-6 rounded-lg"
//               onPress={StartRecording}
//             >
//               <MaterialIcons name="mic" size={24} color="#ffffff" />
//               <Text className="text-white text-lg font-semibold ml-2">Start Recording</Text>
//             </Pressable>
//           ) : (
//             <Pressable
//               className="flex-row items-center bg-stop-red py-4 px-6 rounded-lg"
//               onPress={StopRecording}
//             >
//               <MaterialIcons name="stop" size={24} color="#ffffff" />
//               <Text className="text-white text-lg font-semibold ml-2">Stop Recording</Text>
//             </Pressable>
//           )}

//           {transcription && (
//             <View className="mt-5 items-center w-full">
//               <Text className="text-white text-base font-bold">Transcription:</Text>
//               <Text className="text-white text-lg mt-1 text-center">{transcription}</Text>
//             </View>
//           )}

//           {risk && (
//             <View className="mt-5 items-center w-full">
//               <Text className="text-white text-base font-bold">Predicted Risk:</Text>
//               <Text className="text-white text-lg mt-1 text-center">{risk}</Text>
//             </View>
//           )}

//           {message && (
//             <View className="mt-5 items-center w-full">
//               <Text className="text-white text-base font-bold">Message for You:</Text>
//               <Text className="text-white text-lg mt-1 text-center">{message}</Text>
//             </View>
//           )}

//           {error && <Text className="text-error-red text-base mt-5 text-center">{error}</Text>}
//         </View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }
export default function App(){
  return(
    <View>
      <Text>profile</Text>
    </View>
  )
}