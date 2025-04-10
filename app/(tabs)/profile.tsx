import { View, Text, Pressable, Alert } from "react-native";
import React from "react";
import { supabase } from "~/utils/supabase";
import { useRouter } from "expo-router";

const Profile = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Sign-out failed:", error.message);
        Alert.alert("Error", "Failed to sign out. Please try again.");
        return;
      }
      Alert.alert("Success", "You have been signed out.", [
        {
          text: "OK",
          onPress: () => router.replace("/auth"),
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