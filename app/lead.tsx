import { Redirect, router } from "expo-router";
import React, { useRef, useState } from "react";
import { Alert, Animated, Platform, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from "react-native";
import Colors from "../constants/Colors";
import { useSession } from "../context/SessionContext";
import { firebaseService } from "../services/firebase";

// No longer need CUE_COLORS or type

export default function LeadScreen() {
  const { currentSession, sendCue, leaveSession, clearCue } = useSession();
  const [sendingCue, setSendingCue] = useState<string | null>(null);
  const [fadeAnim] = useState(new Animated.Value(1));
  const [headerColor, setHeaderColor] = useState<string>("#000");
  const headerColorTimeout = useRef<number | null>(null);

  if (!currentSession) {
    return <Redirect href="/start" />;
  }


  // Remove color from predefinedCues and use getCueColor for text color
  const predefinedCues: { text: string; color: string; duration: number }[] = [
    { text: "Pauză Instrumental", color: Colors.light.warning, duration: 6000 },
    { text: "X2 Ref", color: Colors.light.error, duration: 6000 },
    { text: "Incă 1 str", color: Colors.dark.primary, duration: 6000 },
    { text: "Finalul Rărit", color: Colors.dark.secondary, duration: 6000 },
  ];

  const handleSendCue = async (cue: { text: string; color: string }, duration: number) => {
    if (sendingCue) return; // Prevent multiple sends

    setSendingCue(cue.text);

    // Set header color to cue color
    setHeaderColor(cue.color || "#000");
    if (headerColorTimeout.current) clearTimeout(headerColorTimeout.current);
    headerColorTimeout.current = setTimeout(() => {
      setHeaderColor("#000");
    }, 6000) as unknown as number;

    // Animate button press
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.6,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    try {
      await sendCue({ text: cue.text === "—" ? "" : cue.text, type: "CUSTOM" });

      // Show sending state for a short time
      setTimeout(() => {
        setSendingCue(null);
      }, 1000);
    } catch (error) {
      console.error("Error sending cue:", error);
      setSendingCue(null);
    }
  };

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
      {
        text: "Închide sesiunea pentru toți",
        style: "destructive",
        onPress: async () => {
          try {
            if (currentSession) {
              await firebaseService.endSession(currentSession.id);
            }
            await leaveSession();
            router.replace("/start");
          } catch (error) {
            console.error("Error ending session:", error);
          }
        },
      },
    ]);
  };

  if (!currentSession) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Nu există o sesiune activă</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.replace("/start")}>
            <Text style={styles.backButtonText}>Înapoi la Start</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Map predefinedCues to Cue objects with timestamp for type safety
  const now = Date.now();
  const mappedCues: { text: string; color: string; duration: number; timestamp: number }[] = predefinedCues.map((cue, i) => ({
    text: cue.text,
    color: cue.color,
    timestamp: now + i,
    duration: cue.duration,
  }));
  const dashCue: { text: string; color: string; duration: number; timestamp: number } = { text: "—", color: "#fff", timestamp: now - 1, duration: 0 };
  const cuesWithDash: { text: string; color: string; duration: number; timestamp: number }[] = [dashCue, ...mappedCues];

  // Always show 8 cells
  const totalCells = 8;
  const cuesToShow: ({ text: string; color: string; duration: number; timestamp: number } | undefined)[] = cuesWithDash.slice(0, totalCells);
  while (cuesToShow.length < totalCells) cuesToShow.push(undefined);

  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  // Responsive grid: 2x4 portrait, 4x2 landscape
  const numRows = isLandscape ? 2 : 4;
  const numCols = isLandscape ? 4 : 2;

  const handleSendCueOrClear = async (cue: { text: string; color: string }, duration: number) => {
    if (cue.text === "—") {
      clearCue();
      await sendCue({ text: "", type: "CUSTOM" });
      return;
    }
    await handleSendCue(cue, duration);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: "#000" }]}>
      <StatusBar barStyle="light-content" backgroundColor={headerColor} />
      {/* Colored nav/header including safe area */}
      <View style={{ backgroundColor: headerColor, paddingTop: Platform.OS === "ios" ? 44 : StatusBar.currentHeight || 24 }}>
        <View style={[styles.header, { backgroundColor: headerColor, borderBottomColor: "#222", borderBottomWidth: 1, paddingTop: 0 }]}>
          <View style={styles.headerContent}>
            <View style={styles.sessionInfo}>
              <Text style={[styles.sessionCode, { color: "#fff" }]}>{currentSession.id}</Text>
              <View style={styles.statusContainer}>
                <View style={[styles.statusIndicator, { backgroundColor: currentSession.active ? Colors.light.success : Colors.light.error }]} />
                <Text style={[styles.statusText, { color: "#fff" }]}>{currentSession.active ? "Activă" : "Închisă"}</Text>
              </View>
            </View>
            <View style={styles.headerButtons}>
              <TouchableOpacity style={styles.menuButton} onPress={handleLeaveSession}>
                <Text style={[styles.menuButtonText, { color: "#fff" }]}>⋯</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      {/* Main content stays black */}
      <View style={{ flex: 1, backgroundColor: "#000" }}>
        <View style={[styles.cueGrid, { gap: 10 }]}>
          {Array.from({ length: numRows }).map((_, rowIdx) => (
            <View key={rowIdx} style={{ flexDirection: "row", width: "100%", justifyContent: "center" }}>
              {Array.from({ length: numCols }).map((_, colIdx) => {
                const cueIdx = rowIdx * numCols + colIdx;
                const cue = cuesToShow[cueIdx];
                return (
                  <View key={colIdx} style={{ width: `${100 / numCols - 5}%`, height: "20%", margin: 10 }}>
                    {cue ? (
                      <Animated.View style={{ flex: 1, opacity: sendingCue === cue.text ? 0.6 : fadeAnim }}>
                        <TouchableOpacity
                          style={[
                            styles.cueGridButton,
                            cue.text === "—"
                              ? { borderColor: "#fff", backgroundColor: "#111" }
                              : { borderColor: cue.color || "#fff", backgroundColor: sendingCue === cue.text ? "#222" : "#111" },
                          ]}
                          onPress={() => handleSendCueOrClear({ text: cue.text, color: cue.color }, cue.duration || 0)}
                          disabled={sendingCue !== null}
                        >
                          <Text
                            style={[
                              styles.cueGridText,
                              {
                                color: cue.color || "#fff",
                              },
                              cue.text === "—" ? { color: "#fff", fontSize: 36, fontWeight: "900" } : {},
                            ]}
                          >
                            {cue.text}
                          </Text>
                          {sendingCue === cue.text && (
                            <View style={styles.sendingIndicator}>
                              <Text style={[styles.sendingText, { color: cue.color || "#fff" }]}>Se trimite...</Text>
                            </View>
                          )}
                        </TouchableOpacity>
                      </Animated.View>
                    ) : (
                      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
                        <View style={[styles.cueGridButton, { borderColor: "#fff", backgroundColor: "#111" }]}></View>
                      </Animated.View>
                    )}
                  </View>
                );
              })}
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
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
  },
  menuButton: {
    padding: 4,
  },
  menuButtonText: {
    fontSize: 18,
    color: Colors.light.background,
  },
  cueGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    marginTop: 16,
    marginHorizontal: 4,
  },
  cueGridButton: {
    backgroundColor: "#111",
    borderRadius: 16,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  cueGridText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    letterSpacing: 0.5,
  },
  sendingIndicator: {
    position: "absolute",
    bottom: 4,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  sendingText: {
    color: Colors.light.background,
    fontSize: 8,
    fontWeight: "500",
    opacity: 0.8,
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
