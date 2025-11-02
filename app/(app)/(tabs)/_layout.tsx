import { Tabs } from "expo-router";
import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { auth } from "@/services/firebase";
import { useAuth } from "@/contexts/auth";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { user } = useAuth();

  console.log('TabLayout rendered, user:', user);

  const handleLogout = () => {
    console.log('handleLogout called');
    auth.signOut();
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Inicio",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
          title: "Agendamentos",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="paperplane.fill" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="agendamento-usuario"
        options={{
          title: "Meus Agendamentos",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="calendar" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
