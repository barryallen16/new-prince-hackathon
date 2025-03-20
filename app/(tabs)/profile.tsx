import { View, Text, Pressable, Alert } from "react-native";
import React from "react";
import { supabase } from "~/utils/supabase";
import { useRouter } from "expo-router";

const Profile = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      // Sign out the current user
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) {
        console.error("Sign-out failed:", signOutError.message);
        Alert.alert("Error", "Failed to sign out. Please try again.");
        return;
      }

      // Sign in as a new anonymous user
      const { data, error: signInError } = await supabase.auth.signInAnonymously();
      if (signInError) {
        console.error("Anonymous sign-in failed:", signInError.message);
        if (signInError.message.includes("Too many requests")) {
          Alert.alert(
            "Rate Limit Exceeded",
            "Too many sign-in attempts from this device. Please try again in an hour or use a different network."
          );
        } else if (signInError.message.includes("Signups not allowed")) {
          Alert.alert(
            "Sign-In Error",
            "Anonymous sign-ins are disabled for this app. Please contact support."
          );
        } else {
          Alert.alert("Error", "Failed to sign in anonymously. Please try again.");
        }
        return;
      }

      console.log("Signed in as new anonymous user:", data.user?.id);

      // Show confirmation and redirect to Home screen
      Alert.alert("Success", "You have been signed out and signed in as a new user.", [
        {
          text: "OK",
          onPress: () => router.replace("/(tabs)"),
        },
      ]);
    } catch (err) {
      console.error("Unexpected error during sign-out:", err);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    }
  };

  return (
    <View className="flex-1 bg-gray-900 p-4">
      <Text className="text-white text-3xl font-extrabold mb-6">Profile</Text>
      <Pressable
        className="bg-red-600 py-3 px-6 rounded-lg self-center shadow-md"
        onPress={handleSignOut}
      >
        <Text className="text-white text-base font-semibold">Sign Out</Text>
      </Pressable>
    </View>
  );
};

export default Profile;