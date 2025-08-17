import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Dimensions, Platform, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Colors from "../constants/Colors";
import { useLanguage } from "../context/LanguageContext";
import { useSession } from "../context/SessionContext";

const { width, height } = Dimensions.get("window");

export default function BandScreen() {
  const { currentSession, currentCue, leaveSession } = useSession();
  const { t } = useLanguage();
  const [visibleCue, setVisibleCue] = useState(currentCue);

  useEffect(() => {
    if (currentCue && currentCue.text) {
      setVisibleCue(currentCue);
      const duration = currentCue.duration ?? 30000;
      const timer = setTimeout(() => {
        setVisibleCue(null);
      }, duration);
      return () => clearTimeout(timer);
    } else {
      setVisibleCue(null);
    }
  }, [currentCue]);

  // Redirect to start if session is closed
  useEffect(() => {
    if (currentSession && currentSession.active === false) {
      router.replace("/start");
    }
  }, [currentSession]);

  const handleLeaveSession = async () => {
    Alert.alert(t("lead.sessionManagement"), "Ce dorești să faci?", [
      { text: t("lead.cancel"), style: "cancel" },
      {
        text: t("lead.leaveSession"),
        onPress: async () => {
          await leaveSession();
          router.replace("/start");
        },
      },
    ]);
  };

  if (!currentSession) {
    return (
      <View style={styles.errorScreenContainer}>
        <SafeAreaView style={styles.errorScreenContainer}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{t("lead.noActiveSession")}</Text>
            <TouchableOpacity style={styles.backButton} onPress={() => router.replace("/start")}>
              <Text style={styles.backButtonText}>{t("start.backToStart")}</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#333" />
        {/* Compact Header */}
        <View style={[styles.header, styles.headerBorder]}>
          <View style={styles.headerContent}>
            <View style={styles.sessionInfo}>
              <Text style={styles.sessionCode}>{currentSession.id}</Text>
              <View style={styles.statusContainer}>
                <View style={[styles.statusIndicator, { backgroundColor: currentSession.active ? Colors.light.success : Colors.light.error }]} />
                <Text style={styles.statusText}>{currentSession.active ? t("lead.status.active") : t("lead.status.inactive")}</Text>
              </View>
            </View>
            <View style={styles.headerButtons}>
              <TouchableOpacity style={styles.menuButton} onPress={handleLeaveSession}>
                <Text style={styles.menuButtonText}>⋯</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.cueContainer}>
          <Text
            style={[
              styles.cueText,
              {
                color: visibleCue?.color || "#fff",
                fontSize: visibleCue?.fontSize ? visibleCue.fontSize * 2.4 : 48,
                fontWeight: visibleCue?.fontWeight || "bold",
              },
            ]}
          >
            {visibleCue?.text || ""}
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  // Main container styles
  container: {
    flex: 1,
    backgroundColor: "#333",
  },

  // Error screen styles
  errorScreenContainer: {
    flex: 1,
    backgroundColor: "#333",
  },

  // Header styles
  header: {
    backgroundColor: "#333",
    paddingTop: Platform.OS === "ios" ? 0 : StatusBar.currentHeight || 0,
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  headerBorder: {
    borderBottomColor: "#222",
    borderBottomWidth: 1,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sessionInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  sessionCode: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    marginRight: 12,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  statusText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "500",
  },
  headerButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  menuButton: {
    padding: 4,
  },
  menuButtonText: {
    fontSize: 18,
    color: "#fff",
  },

  // Cue display styles
  cueContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  cueText: {
    color: "#fff",
    fontSize: 48,
    fontWeight: "bold",
    textAlign: "center",
    letterSpacing: 1,
    paddingHorizontal: 16,
    marginBottom: 70,
  },

  // Error state styles
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  errorText: {
    color: Colors.light.error,
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  backButtonText: {
    color: Colors.light.background,
    fontSize: 16,
    fontWeight: "600",
  },
});
