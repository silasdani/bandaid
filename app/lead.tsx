import { router } from "expo-router";
import React, { useRef, useState } from "react";
import { Alert, Animated, Platform, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from "react-native";
import Colors from "../constants/Colors";
import { useLanguage } from "../context/LanguageContext";
import { useSession } from "../context/SessionContext";
import { useSettings } from "../context/SettingsContext";
import { firebaseService } from "../services/firebase";

// Types
interface Cue {
  text: string;
  color: string;
  fontSize: number;
  fontWeight: "normal" | "bold" | "900";
  duration: number;
  timestamp: number;
}

interface CueGridProps {
  cues: (Cue | undefined)[];
  onCuePress: (cue: Cue | undefined) => void;
  sendingCue: string | null;
  fadeAnim: Animated.Value;
  isLandscape: boolean;
}

interface SessionHeaderProps {
  session: any;
  role: "lead" | "band" | null;
  headerColor: string;
  onSettingsPress: () => void;
  onLeaveSession: () => void;
}

// Custom hook for cue management
const useCueManagement = () => {
  const { sendCue, clearCue } = useSession();
  const [sendingCue, setSendingCue] = useState<string | null>(null);

  const handleSendCue = async (cue: Cue) => {
    if (sendingCue) return; // Prevent multiple sends

    setSendingCue(cue.text);

    try {
      await sendCue({
        text: cue.text === "—" ? "" : cue.text,
        color: cue.color,
        fontSize: cue.fontSize,
        fontWeight: cue.fontWeight,
        duration: cue.duration,
      });

      // Show sending state for a short time
      setTimeout(() => {
        setSendingCue(null);
      }, 1000);
    } catch (error) {
      console.error("Error sending cue:", error);
      setSendingCue(null);
    }
  };

  const handleSendCueOrClear = async (cue: Cue) => {
    if (cue.text === "—") {
      clearCue();
      await sendCue({
        text: "",
        color: cue.color,
        fontSize: cue.fontSize,
        fontWeight: cue.fontWeight,
        duration: cue.duration,
      });
      return;
    }
    await handleSendCue(cue);
  };

  return {
    sendingCue,
    handleSendCueOrClear,
  };
};

// Custom hook for header color animation
const useHeaderColorAnimation = () => {
  const [headerColor, setHeaderColor] = useState<string>("#333");
  const headerColorTimeout = useRef<number | null>(null);

  const animateHeaderColor = (color: string, duration: number) => {
    setHeaderColor(color || "#333");

    if (headerColorTimeout.current) {
      clearTimeout(headerColorTimeout.current);
    }

    headerColorTimeout.current = setTimeout(() => {
      setHeaderColor("#333");
    }, duration) as unknown as number;
  };

  return { headerColor, animateHeaderColor };
};

// Custom hook for button press animation
const useButtonAnimation = () => {
  const [fadeAnim] = useState(new Animated.Value(1));

  const animateButtonPress = () => {
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
  };

  return { fadeAnim, animateButtonPress };
};

// Dynamic styles for cue button
const getCueButtonContainerStyle = (isCurrentlySending: boolean, fadeAnim: Animated.Value) => [styles.cueButtonContainer, { opacity: isCurrentlySending ? 0.6 : fadeAnim }];

const getSendingTextStyle = (cueColor: string) => [styles.sendingText, { color: cueColor || "#fff" }];

const getEmptyGridCellStyle = (fadeAnim: Animated.Value) => [styles.emptyGridCellContainer, { opacity: fadeAnim }];

const getCueGridStyle = () => [styles.cueGrid, { gap: 10 }];

const getHeaderContainerStyle = (headerColor: string) => [styles.headerContainer, { backgroundColor: headerColor }];

const getHeaderStyle = (headerColor: string) => [styles.header, { backgroundColor: headerColor }];

const getSessionCodeStyle = () => [styles.sessionCode, { color: "#fff" }];

const getStatusIndicatorStyle = (isActive: boolean) => [styles.statusIndicator, { backgroundColor: isActive ? Colors.light.success : Colors.light.error }];

const getStatusTextStyle = () => [styles.statusText, { color: "#fff" }];

const getSettingsButtonTextStyle = () => [styles.settingsButtonText, { color: "#fff" }];

const getMenuButtonTextStyle = () => [styles.menuButtonText, { color: "#fff" }];

// Component for individual cue button
const CueButton: React.FC<{
  cue: Cue;
  onPress: (cue: Cue) => void;
  isSending: boolean;
  fadeAnim: Animated.Value;
  activeTiles: any[];
  sendingCue: string | null;
  t: (key: string) => string;
}> = ({ cue, onPress, isSending, fadeAnim, activeTiles, sendingCue, t }) => {
  const isDash = cue.text === "—";
  const isCurrentlySending = isSending && sendingCue === cue.text;

  const buttonStyle = [
    styles.cueGridButton,
    isDash
      ? { borderColor: "#fff", backgroundColor: "#333" }
      : {
          borderColor: cue.color || "#fff",
          backgroundColor: isCurrentlySending ? "#222" : "#333",
        },
  ];

  const textStyle = [
    styles.cueGridText,
    {
      color: cue.color || "#fff",
      fontSize: isDash ? 36 : activeTiles.find((t) => t.text === cue.text)?.fontSize || 20,
      fontWeight: isDash ? "900" : activeTiles.find((t) => t.text === cue.text)?.fontWeight || "bold",
    },
  ];

  return (
    <Animated.View style={getCueButtonContainerStyle(isCurrentlySending, fadeAnim)}>
      <TouchableOpacity style={buttonStyle} onPress={() => onPress(cue)} disabled={isSending}>
        <Text style={textStyle}>{cue.text}</Text>

        {isCurrentlySending && (
          <View style={styles.sendingIndicator}>
            <Text style={getSendingTextStyle(cue.color)}>{t("lead.sending")}</Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

// Component for empty grid cell
const EmptyGridCell: React.FC<{ fadeAnim: Animated.Value }> = ({ fadeAnim }) => (
  <Animated.View style={getEmptyGridCellStyle(fadeAnim)}>
    <View style={[styles.cueGridButton, styles.emptyGridCellButton]} />
  </Animated.View>
);

// Component for the cue grid
const CueGrid: React.FC<CueGridProps & { t: (key: string) => string }> = ({ cues, onCuePress, sendingCue, fadeAnim, isLandscape, t }) => {
  const numRows = isLandscape ? 2 : 4;
  const numCols = isLandscape ? 4 : 2;

  return (
    <View style={getCueGridStyle()}>
      {Array.from({ length: numRows }).map((_, rowIdx) => (
        <View key={rowIdx} style={styles.gridRow}>
          {Array.from({ length: numCols }).map((_, colIdx) => {
            const cueIdx = rowIdx * numCols + colIdx;
            const cue = cues[cueIdx];

            return (
              <View key={colIdx} style={getGridCellStyle(isLandscape)}>
                {cue ? (
                  <CueButton
                    cue={cue}
                    onPress={() => onCuePress(cue)}
                    isSending={sendingCue !== null}
                    fadeAnim={fadeAnim}
                    activeTiles={[]} // This will be passed from parent
                    sendingCue={sendingCue}
                    t={t}
                  />
                ) : (
                  <EmptyGridCell fadeAnim={fadeAnim} />
                )}
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
};

// Component for session header
const SessionHeader: React.FC<SessionHeaderProps & { t: (key: string) => string }> = ({ session, role, headerColor, onSettingsPress, onLeaveSession, t }) => (
  <View style={getHeaderContainerStyle(headerColor)}>
    <View style={getHeaderStyle(headerColor)}>
      <View style={styles.headerContent}>
        <View style={styles.sessionInfo}>
          <Text style={getSessionCodeStyle()}>{session.id}</Text>
          <View style={styles.statusContainer}>
            <View style={getStatusIndicatorStyle(session.active)} />
            <Text style={getStatusTextStyle()}>{session.active ? t("lead.status.active") : t("lead.status.inactive")}</Text>
          </View>
        </View>

        <View style={styles.headerButtons}>
          {role === "lead" && (
            <TouchableOpacity style={styles.settingsButton} onPress={onSettingsPress}>
              <Text style={getSettingsButtonTextStyle()}>⚙️</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.menuButton} onPress={onLeaveSession}>
            <Text style={getMenuButtonTextStyle()}>⋯</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </View>
);

// Component for error state
const ErrorState: React.FC<{ t: (key: string) => string }> = ({ t }) => (
  <SafeAreaView style={styles.container}>
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>{t("lead.noActiveSession")}</Text>
      <TouchableOpacity style={styles.backButton} onPress={() => router.replace("/start")}>
        <Text style={styles.backButtonText}>{t("start.backToStart")}</Text>
      </TouchableOpacity>
    </View>
  </SafeAreaView>
);

// Main component
export default function LeadScreen() {
  // Hooks
  const { currentSession, leaveSession, role } = useSession();
  const { getActiveTiles } = useSettings();
  const { t } = useLanguage();
  const { width, height } = useWindowDimensions();

  // Custom hooks
  const { sendingCue, handleSendCueOrClear } = useCueManagement();
  const { headerColor, animateHeaderColor } = useHeaderColorAnimation();
  const { fadeAnim, animateButtonPress } = useButtonAnimation();

  // Ensure headerColor is always a string
  const safeHeaderColor: string = headerColor || "#333";

  // Derived state
  const isLandscape = width > height;
  const { getSessionActiveTiles } = useSession();
  const activeTiles = getSessionActiveTiles();

  // Prepare cues data
  const prepareCues = (): (Cue | undefined)[] => {
    const now = Date.now();

    // Map active tiles to cues
    const mappedCues: Cue[] = activeTiles.map((tile, i) => ({
      text: tile.text,
      color: tile.color,
      fontSize: tile.fontSize,
      fontWeight: tile.fontWeight,
      timestamp: now + i,
      duration: tile.duration,
    }));

    // Ensure 8 total cells
    const cuesToShow: (Cue | undefined)[] = mappedCues.slice(0, 8);

    // Fill remaining cells with undefined
    while (cuesToShow.length < 8) {
      cuesToShow.push(undefined);
    }

    return cuesToShow;
  };

  // Event handlers
  const handleCuePress = async (cue: Cue) => {
    // Animate header color
    animateHeaderColor(cue.color, cue.duration);

    // Animate button press
    animateButtonPress();

    // Handle cue action
    await handleSendCueOrClear(cue);
  };

  const handleCuePressOrEmpty = async (cue: Cue | undefined) => {
    if (cue) {
      await handleCuePress(cue);
    }
  };

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
      {
        text: t("lead.closeSessionForAll"),
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

  const handleSettingsPress = () => {
    router.push("/settings");
  };

  // Early return for error state
  if (!currentSession) {
    return <ErrorState t={t} />;
  }

  // Prepare cues
  const cues = prepareCues();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={safeHeaderColor} />

      <SessionHeader session={currentSession} role={role} headerColor={safeHeaderColor} onSettingsPress={handleSettingsPress} onLeaveSession={handleLeaveSession} t={t} />

      <View style={styles.mainContent}>
        <CueGrid cues={cues} onCuePress={handleCuePressOrEmpty} sendingCue={sendingCue} fadeAnim={fadeAnim} isLandscape={isLandscape} t={t} />
      </View>
    </SafeAreaView>
  );
}

// Dynamic styles helper for grid cell
const getGridCellStyle = (isLandscape: boolean) => [
  styles.gridCell,
  {
    width: isLandscape ? "22.5%" : "45%" as any,
    height: isLandscape ? "40%" : "20%" as any,
  }
];

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#333",
  },

  // Header styles
  header: {
    paddingBottom: 12,
    paddingHorizontal: 16,
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
  },
  menuButton: {
    padding: 4,
  },
  menuButtonText: {
    fontSize: 18,
  },

  // Main content styles
  mainContent: {
    flex: 1,
    backgroundColor: "#333",
  },

  // Grid styles
  cueGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    marginTop: 16,
    marginHorizontal: 4,
  },
  gridRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
  },
  gridCell: {
    margin: 10,
  },
  cueGridButton: {
    backgroundColor: "#333",
    borderRadius: 16,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  cueGridText: {
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
    fontSize: 8,
    fontWeight: "500",
    opacity: 0.8,
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
  // New styles for dynamic styles
  cueButtonContainer: {
    flex: 1,
  },
  emptyGridCellContainer: {
    flex: 1,
  },
  emptyGridCellButton: {
    borderColor: "#fff",
    backgroundColor: "#333",
  },
  headerContainer: {
    paddingTop: Platform.OS === "ios" ? 44 : StatusBar.currentHeight || 24,
  },
});
