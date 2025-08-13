import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import Colors from "../constants/Colors";
import { SessionProvider, useSession } from "../context/SessionContext";
import { SettingsProvider } from "../context/SettingsContext";

function AutoRedirector() {
  const { role, sessionId, isSessionLoaded } = useSession();
  const router = useRouter();
  const [checkedRedirect, setCheckedRedirect] = useState(false);

  useEffect(() => {
    if (!isSessionLoaded) return;
    if (!checkedRedirect) {
      if (sessionId && role) {
        if (role === "lead") {
          router.replace("/lead");
        } else if (role === "band") {
          router.replace("/band");
        }
        setCheckedRedirect(true);
      } else {
        setCheckedRedirect(true);
      }
    }
  }, [sessionId, role, checkedRedirect, isSessionLoaded]);

  if (!isSessionLoaded || !checkedRedirect) {
    return null;
  }
  return null;
}

export default function RootLayout() {
  return (
    <SettingsProvider>
      <SessionProvider>
        <AutoRedirector />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: Colors.light.systemBackground },
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="start" />
          <Stack.Screen name="lead" />
          <Stack.Screen name="band" />
          <Stack.Screen name="settings" />
        </Stack>
        <StatusBar style="auto" />
      </SessionProvider>
    </SettingsProvider>
  );
}
