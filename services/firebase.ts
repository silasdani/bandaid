import Constants from "expo-constants";
import { initializeApp } from "firebase/app";
import { get, getDatabase, off, onValue, push, ref, set } from "firebase/database";

export interface LeadAction {
  type: "SCROLL" | "TAP" | "ZOOM" | "HIGHLIGHT" | "ANNOTATE" | "PAGE_CHANGE" | "PDF_UPLOAD" | "PDF_SELECT";
  x?: number;
  y?: number;
  scale?: number;
  color?: string;
  text?: string;
  page?: number;
  timestamp: number;
  [key: string]: any;
}

const firebaseConfig = {
  apiKey: Constants?.expoConfig?.extra?.FIREBASE_API_KEY,
  authDomain: Constants?.expoConfig?.extra?.FIREBASE_AUTH_DOMAIN,
  databaseURL: Constants?.expoConfig?.extra?.FIREBASE_DATABASE_URL,
  projectId: Constants?.expoConfig?.extra?.FIREBASE_PROJECT_ID,
  storageBucket: Constants?.expoConfig?.extra?.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: Constants?.expoConfig?.extra?.FIREBASE_MESSAGING_SENDER_ID,
  appId: Constants?.expoConfig?.extra?.FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const database = getDatabase(app);

// Helper function to generate session ID
const generateSessionId = (): string => {
  return Math.random().toString(36).substr(2, 6).toUpperCase();
};

// Removed ensureAuthenticated and all auth logic

export const firebaseService = {
  initializeApp: () => {
    console.log("Firebase initialized successfully");
  },

  createSession: async (userId: string): Promise<string> => {
    try {
      const sessionId = generateSessionId();
      const sessionRef = ref(database, `sessions/${sessionId}`);
      await set(sessionRef, {
        roleLead: userId,
        active: true,
        createdAt: Date.now(),
        members: {
          [userId]: {
            role: "lead",
            joinedAt: Date.now(),
          },
        },
        memberCount: 1,
        token: "albini12345!", // Add token for security rule
      });
      console.log("Session created in Firebase:", sessionId);
      return sessionId;
    } catch (error) {
      console.error("Error creating session:", error);
      throw error;
    }
  },

  joinSession: async (sessionId: string, userId: string): Promise<boolean> => {
    try {
      const sessionRef = ref(database, `sessions/${sessionId}`);
      const snapshot = await get(sessionRef);
      if (!snapshot.exists()) {
        return false;
      }
      const sessionData = snapshot.val();
      if (!sessionData.active) {
        return false;
      }

      // Add member to session
      const membersRef = ref(database, `sessions/${sessionId}/members/${userId}`);
      await set(membersRef, {
        role: "band",
        joinedAt: Date.now(),
        lastSeen: Date.now(),
        token: "albini12345!",
      });

      // Update member count
      const memberCountRef = ref(database, `sessions/${sessionId}/memberCount`);
      await set(memberCountRef, (sessionData.memberCount || 0) + 1);

      console.log("Joined session in Firebase:", sessionId);
      return true;
    } catch (error) {
      console.error("Error joining session:", error);
      return false;
    }
  },

  sendCue: async (sessionId: string, cue: any) => {
    try {
      const cueRef = ref(database, `sessions/${sessionId}/cue`);
      const cueData = {
        ...cue,
        timestamp: Date.now(),
        token: "albini12345!",
      };
      await set(cueRef, cueData);
      console.log("Cue sent to Firebase:", sessionId, cueData);
    } catch (error) {
      console.error("Error sending cue:", error);
      throw error;
    }
  },

  listenToCues: (sessionId: string, callback: (cue: any) => void) => {
    try {
      console.log("Setting up listener for session:", sessionId);
      const cueRef = ref(database, `sessions/${sessionId}/cue`);
      const unsubscribe = onValue(
        cueRef,
        (snapshot) => {
          console.log("Firebase cue listener triggered, exists:", snapshot.exists());
          if (snapshot.exists()) {
            const cueData = snapshot.val();
            console.log("Cue data received:", cueData);
            callback(cueData);
          } else {
            console.log("No cue data in snapshot");
          }
        },
        (error) => {
          console.error("Error listening to cues:", error);
        }
      );
      console.log("Listener set up successfully for session:", sessionId);
      return () => {
        console.log("Cleaning up listener for session:", sessionId);
        off(cueRef);
      };
    } catch (error) {
      console.error("Error setting up cue listener:", error);
      return () => {};
    }
  },

  leaveSession: async (sessionId: string, userId: string) => {
    try {
      // Remove member from session
      const memberRef = ref(database, `sessions/${sessionId}/members/${userId}`);
      await set(memberRef, {
        token: "albini12345!",
      });

      // Update member count
      const sessionRef = ref(database, `sessions/${sessionId}`);
      const snapshot = await get(sessionRef);
      if (snapshot.exists()) {
        const sessionData = snapshot.val();
        const newMemberCount = Math.max(0, (sessionData.memberCount || 1) - 1);
        const memberCountRef = ref(database, `sessions/${sessionId}/memberCount`);
        await set(memberCountRef, newMemberCount);

        // If no members left, end session
        if (newMemberCount === 0) {
          await set(sessionRef, {
            ...sessionData,
            active: false,
            endedAt: Date.now(),
            token: "albini12345!",
          });
        }
      }

      console.log("Left session in Firebase:", sessionId);
    } catch (error) {
      console.error("Error leaving session:", error);
    }
  },

  endSession: async (sessionId: string) => {
    try {
      const sessionRef = ref(database, `sessions/${sessionId}`);
      await set(sessionRef, {
        active: false,
        endedAt: Date.now(),
        token: "albini12345!",
      });
      console.log("Session ended in Firebase:", sessionId);
    } catch (error) {
      console.error("Error ending session:", error);
      throw error;
    }
  },

  updateMemberLastSeen: async (sessionId: string, userId: string) => {
    try {
      const memberRef = ref(database, `sessions/${sessionId}/members/${userId}/lastSeen`);
      await set(memberRef, {
        lastSeen: Date.now(),
        token: "albini12345!",
      });
    } catch (error) {
      console.error("Error updating member last seen:", error);
    }
  },

  getSessionMembers: async (sessionId: string) => {
    try {
      const membersRef = ref(database, `sessions/${sessionId}/members`);
      const snapshot = await get(membersRef);
      if (snapshot.exists()) {
        return snapshot.val();
      }
      return {};
    } catch (error) {
      console.error("Error getting session members:", error);
      return {};
    }
  },

  listenToMembers: (sessionId: string, callback: (members: any) => void) => {
    try {
      console.log("Setting up members listener for session:", sessionId);
      const membersRef = ref(database, `sessions/${sessionId}/members`);
      const unsubscribe = onValue(
        membersRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const membersData = snapshot.val();
            console.log("Received members data:", membersData);
            callback(membersData);
          } else {
            callback({});
          }
        },
        (error) => {
          console.error("Error listening to session members:", error);
        }
      );
      return () => {
        off(membersRef);
      };
    } catch (error) {
      console.error("Error setting up members listener:", error);
      return () => {};
    }
  },

  // Alias for listenToMembers to match SessionContext expectations
  listenToSessionMembers: (sessionId: string, callback: (members: any) => void) => {
    return firebaseService.listenToMembers(sessionId, callback);
  },

  // Real-time lead actions
  sendLeadAction: async (sessionId: string, action: Omit<LeadAction, "timestamp">) => {
    try {
      const actionsRef = ref(database, `sessions/${sessionId}/leadActions`);
      const actionData = {
        ...action,
        timestamp: Date.now(),
      };
      await push(actionsRef, actionData);
      console.log("Lead action sent to Firebase:", sessionId, actionData);
    } catch (error) {
      console.error("Error sending lead action:", error);
      throw error;
    }
  },

  listenToLeadActions: (sessionId: string, callback: (action: LeadAction) => void) => {
    try {
      console.log("Setting up lead actions listener for session:", sessionId);
      const actionsRef = ref(database, `sessions/${sessionId}/leadActions`);
      const unsubscribe = onValue(
        actionsRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const actions = snapshot.val();
            // Get the latest action
            const actionKeys = Object.keys(actions);
            if (actionKeys.length > 0) {
              const latestKey = actionKeys[actionKeys.length - 1];
              const latestAction = actions[latestKey];
              console.log("Latest lead action received:", latestAction);
              callback(latestAction);
            }
          }
        },
        (error) => {
          console.error("Error listening to lead actions:", error);
        }
      );
      return () => {
        off(actionsRef);
      };
    } catch (error) {
      console.error("Error setting up lead actions listener:", error);
      return () => {};
    }
  },

  getSession: async (sessionId: string) => {
    try {
      const sessionRef = ref(database, `sessions/${sessionId}`);
      const snapshot = await get(sessionRef);
      if (snapshot.exists()) {
        return snapshot.val();
      }
      return null;
    } catch (error) {
      console.error("Error getting session data:", error);
      return null;
    }
  },

  updateSessionSettings: async (sessionId: string, settings: any): Promise<void> => {
    try {
      const sessionRef = ref(database, `sessions/${sessionId}/sessionSettings`);
      await set(sessionRef, settings);
      console.log("Session settings updated in Firebase:", sessionId);
    } catch (error) {
      console.error("Error updating session settings:", error);
      throw error;
    }
  },
};
