import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Alert,
    Dimensions,
    Platform,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import Colors from "../constants/Colors";
import { useSession } from "../context/SessionContext";
import { useSettings } from "../context/SettingsContext";

const { width, height } = Dimensions.get("window");

// Get cue color mapping from settings
const getCueColor = (cueText: string, settings: any) => {
  const tile = settings.tiles.find((t: any) => t.text === cueText);
  return tile ? tile.color : "#fff";
};

export default function BandScreen() {
  const { currentSession, currentCue, leaveSession } = useSession();
  const { settings } = useSettings();
  const [visibleCue, setVisibleCue] = useState(currentCue);

  useEffect(() => {
    if (currentCue && currentCue.text) {
      setVisibleCue(currentCue);
      const duration = currentCue.duration ?? 6000;
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
      router.replace('/start');
    }
  }, [currentSession]);

  const handleLeaveSession = async () => {
    Alert.alert("Gestionare Sesiune", "Ce dorești să faci?", [
      { text: "Anulează", style: "cancel" },
      {
        text: "Părăsește sesiunea",
        onPress: async () => {
          await leaveSession();
          router.replace("/start");
        },
      },
    ]);
  };

  if (!currentSession) {
    return (
      <View style={{ flex: 1, backgroundColor: "#000" }}>
        <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Nu există o sesiune activă</Text>
            <TouchableOpacity style={styles.backButton} onPress={() => router.replace("/start")}>
              <Text style={styles.backButtonText}>Înapoi la Start</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        {/* Compact Header */}
        <View style={[styles.header, { backgroundColor: "#000", borderBottomColor: "#222", borderBottomWidth: 1 }]}> 
          <View style={styles.headerContent}>
            <View style={styles.sessionInfo}>
              <Text style={[styles.sessionCode, { color: "#fff" }]}>{currentSession.id}</Text>
              <View style={styles.statusContainer}>
                <View style={[styles.statusIndicator, { backgroundColor: currentSession.active ? Colors.light.success : Colors.light.error }]} />
                <Text style={[styles.statusText, { color: "#fff" }]}>{currentSession.active ? "Activă" : "Închisă"}</Text>
              </View>
            </View>
            <View style={styles.headerButtons}>
              <TouchableOpacity 
                style={styles.settingsButton} 
                onPress={() => router.push('/settings')}
              >
                <Text style={[styles.settingsButtonText, { color: "#fff" }]}>⚙️</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuButton} onPress={handleLeaveSession}>
                <Text style={[styles.menuButtonText, { color: "#fff" }]}>⋯</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.cueContainer}>
          <Text style={[
            styles.cueText, 
            { 
              color: visibleCue ? getCueColor(visibleCue.text, settings) : "#fff",
              fontSize: visibleCue ? (visibleCue.text === "—" ? 48 : settings.globalTextSize * 2.4) : 48,
              fontWeight: visibleCue ? (visibleCue.text === "—" ? "900" : settings.globalFontWeight) : "bold"
            }
          ]}>
            {visibleCue?.text || ""}
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    backgroundColor: Colors.light.primary,
    paddingTop: Platform.OS === "ios" ? 0 : StatusBar.currentHeight || 0,
    paddingBottom: 12,
    paddingHorizontal: 16,
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
    color: Colors.light.background,
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
    color: Colors.light.background,
    fontWeight: "500",
  },
  headerButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  settingsButton: {
    padding: 4,
  },
  settingsButtonText: {
    fontSize: 18,
    color: Colors.light.background,
  },
  menuButton: {
    padding: 4,
  },
  menuButtonText: {
    fontSize: 18,
    color: Colors.light.background,
  },
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
