import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { LanguageSwitcher } from "../components/LanguageSwitcher";
import Colors from "../constants/Colors";
import { useLanguage } from "../context/LanguageContext";
import { useSession } from "../context/SessionContext";
import { useSettings } from "../context/SettingsContext";

export default function StartScreen() {
  const { createSession, joinSession, role, currentSession } = useSession();
  const { settings } = useSettings();
  const { t } = useLanguage();
  const [sessionIdInput, setSessionIdInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [localRole, setLocalRole] = useState<"lead" | "band" | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [showJoinInput, setShowJoinInput] = useState(false);

  const handleCreateSession = async () => {
    setIsLoading(true);
    try {
      setLocalRole("lead");
      const newSessionId = await createSession();
      setSessionId(newSessionId);
    } catch (error) {
      Alert.alert("Eroare", t('start.errors.createSessionFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinSession = async () => {
    if (!sessionIdInput.trim()) {
      Alert.alert("Eroare", t('start.errors.sessionCodeRequired'));
      return;
    }
    setIsLoading(true);
    try {
      setLocalRole("band");
      const success = await joinSession(sessionIdInput.trim().toUpperCase());
      if (success) {
        setSessionId(sessionIdInput.trim().toUpperCase());
        router.push("/band");
      } else {
        Alert.alert("Eroare", t('start.errors.invalidSessionCode'));
      }
    } catch (error) {
      Alert.alert("Eroare", t('start.errors.connectionFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueSession = () => {
    if (localRole === "lead") {
      router.push("/lead");
    } else if (localRole === "band") {
      router.push("/band");
    }
  };

  useEffect(() => {
    if (sessionId && localRole) {
      if (localRole === "lead") {
        router.replace("/lead");
      } else if (localRole === "band") {
        router.replace("/band");
      }
    }
  }, [sessionId, localRole]);

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.inner}>
          {/* Language Switcher */}
          <View style={styles.languageContainer}>
            <LanguageSwitcher />
          </View>
          
          {/* Settings Button - Only show for leaders with active session */}
          {role === "lead" && currentSession && (
            <TouchableOpacity 
              style={styles.settingsButton} 
              onPress={() => router.push('/settings')}
            >
              <Text style={styles.settingsButtonText}>⚙️</Text>
            </TouchableOpacity>
          )}
          
          {sessionId && localRole && (
            <TouchableOpacity style={styles.continueButton} onPress={handleContinueSession}>
              <Text style={styles.continueButtonText}>{t('start.continueSession')}</Text>
            </TouchableOpacity>
          )}
          <Text style={styles.title}>{t('start.title')}</Text>
          <View style={styles.buttonGroup}>
            <TouchableOpacity style={[styles.mainButton, isLoading && styles.disabledButton]} onPress={handleCreateSession} disabled={isLoading}>
              <Text style={styles.mainButtonText}>{isLoading ? t('start.createSessionLoading') : t('start.createSession')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.mainButton, isLoading && styles.disabledButton]} onPress={() => setShowJoinInput((v) => !v)} disabled={isLoading}>
              <Text style={styles.mainButtonText}>{t('start.joinSession')}</Text>
            </TouchableOpacity>
          </View>
          {showJoinInput && (
            <View style={styles.joinSection}>
              <TextInput
                style={styles.input}
                placeholder={t('start.sessionCode')}
                placeholderTextColor={Colors.light.gray[400]}
                value={sessionIdInput}
                onChangeText={setSessionIdInput}
                autoCapitalize="characters"
                maxLength={6}
                editable={!isLoading}
                textAlign="center"
              />
              <TouchableOpacity style={[styles.joinButton, isLoading && styles.disabledButton]} onPress={handleJoinSession} disabled={isLoading}>
                <Text style={styles.joinButtonText}>{isLoading ? t('start.connecting') : t('start.connect')}</Text>
              </TouchableOpacity>
            </View>
          )}
          {/* Extra space at the end for Android and keyboard */}
          <View style={styles.bottomSpacer} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  // Main container styles
  container: {
    flex: 1,
    backgroundColor: "#333",
    justifyContent: "center",
  },
  
  // ScrollView styles
  scrollViewContent: {
    flexGrow: 1,
  },
  
  // Main content styles
  inner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 24,
    position: "relative",
  },
  
  // Language switcher styles
  languageContainer: {
    position: "absolute",
    top: 60,
    left: 24,
    zIndex: 1,
    width: 200,
  },
  
  // Settings button styles
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
  
  // Continue session button styles
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
  
  // Title styles
  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 40,
    marginTop: 20,
  },
  
  // Button group styles
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
  disabledButton: {
    opacity: 0.6,
  },
  
  // Join section styles
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
  
  // Bottom spacer styles
  bottomSpacer: {
    height: 48,
  },
  
  // Logout styles (unused but kept for consistency)
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
