import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Colors from "../constants/Colors";
import { useSession } from "../context/SessionContext";
import { useSettings } from "../context/SettingsContext";

export default function StartScreen() {
  const { createSession, joinSession } = useSession();
  const { settings } = useSettings();
  const [sessionIdInput, setSessionIdInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState<"lead" | "band" | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [showJoinInput, setShowJoinInput] = useState(false);

  const handleCreateSession = async () => {
    setIsLoading(true);
    try {
      setRole("lead");
      const newSessionId = await createSession();
      setSessionId(newSessionId);
    } catch (error) {
      Alert.alert("Eroare", "Nu s-a putut crea sesiunea. Verifică conexiunea la internet.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinSession = async () => {
    if (!sessionIdInput.trim()) {
      Alert.alert("Eroare", "Introduceți codul sesiunii");
      return;
    }
    setIsLoading(true);
    try {
      setRole("band");
      const success = await joinSession(sessionIdInput.trim().toUpperCase());
      if (success) {
        setSessionId(sessionIdInput.trim().toUpperCase());
        router.push("/band");
      } else {
        Alert.alert("Eroare", "Codul sesiunii este invalid sau sesiunea nu mai este activă.");
      }
    } catch (error) {
      Alert.alert("Eroare", "Nu s-a putut conecta la sesiune. Verifică codul și conexiunea.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueSession = () => {
    if (role === "lead") {
      router.push("/lead");
    } else if (role === "band") {
      router.push("/band");
    }
  };

  useEffect(() => {
    if (sessionId && role) {
      if (role === "lead") {
        router.replace("/lead");
      } else if (role === "band") {
        router.replace("/band");
      }
    }
  }, [sessionId, role]);

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.inner}>
          {/* Settings Button */}
          <TouchableOpacity 
            style={styles.settingsButton} 
            onPress={() => router.push('/settings')}
          >
            <Text style={styles.settingsButtonText}>⚙️</Text>
          </TouchableOpacity>
          
          {sessionId && role && (
            <TouchableOpacity style={styles.continueButton} onPress={handleContinueSession}>
              <Text style={styles.continueButtonText}>Continuă sesiunea</Text>
            </TouchableOpacity>
          )}
          <Text style={styles.title}>Band Cue</Text>
          <View style={styles.buttonGroup}>
            <TouchableOpacity style={[styles.mainButton, isLoading && styles.disabledButton]} onPress={handleCreateSession} disabled={isLoading}>
              <Text style={styles.mainButtonText}>{isLoading ? "Se creează..." : "Creează Sesiune"}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.mainButton, isLoading && styles.disabledButton]} onPress={() => setShowJoinInput((v) => !v)} disabled={isLoading}>
              <Text style={styles.mainButtonText}>Conectează-te la Sesiune</Text>
            </TouchableOpacity>
          </View>
          {showJoinInput && (
            <View style={styles.joinSection}>
              <TextInput
                style={styles.input}
                placeholder="Cod sesiune"
                placeholderTextColor={Colors.light.gray[400]}
                value={sessionIdInput}
                onChangeText={setSessionIdInput}
                autoCapitalize="characters"
                maxLength={6}
                editable={!isLoading}
                textAlign="center"
              />
              <TouchableOpacity style={[styles.joinButton, isLoading && styles.disabledButton]} onPress={handleJoinSession} disabled={isLoading}>
                <Text style={styles.joinButtonText}>{isLoading ? "Se conectează..." : "Conectare"}</Text>
              </TouchableOpacity>
            </View>
          )}
          {/* Extra space at the end for Android and keyboard */}
          <View style={{ height: 48 }} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
  },
  inner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 24,
    position: "relative",
  },
  settingsButton: {
    position: "absolute",
    top: 60,
    right: 24,
    padding: 8,
    zIndex: 1,
  },
  settingsButtonText: {
    fontSize: 24,
    color: "#fff",
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 40,
    marginTop: 20,
  },
  buttonGroup: {
    width: "100%",
    gap: 20,
    marginBottom: 24,
  },
  mainButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 16,
    paddingVertical: 20,
    alignItems: "center",
    marginBottom: 0,
  },
  mainButtonText: {
    color: Colors.light.background,
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: 1,
  },
  joinSection: {
    width: "100%",
    alignItems: "center",
    marginTop: 16,
  },
  input: {
    backgroundColor: Colors.light.gray[900],
    color: "#fff",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    fontSize: 20,
    textAlign: "center",
    marginBottom: 12,
    width: "100%",
    letterSpacing: 2,
  },
  joinButton: {
    backgroundColor: Colors.light.success,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    width: "100%",
  },
  joinButtonText: {
    color: Colors.light.background,
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 1,
  },
  disabledButton: {
    opacity: 0.6,
  },
  continueButton: {
    backgroundColor: Colors.light.secondary,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: "center",
    marginBottom: 32,
    marginTop: 24,
  },
  continueButtonText: {
    color: Colors.light.background,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 1,
  },
  logoutContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  logoutText: {
    color: Colors.light.error,
    fontWeight: "600",
    fontSize: 16,
    opacity: 0.7,
  },
});
