import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { firebaseService, LeadAction } from "../services/firebase";

export interface Cue {
  text: string;
  type: "STROFA" | "REFREN" | "BRIDGE" | "FINAL" | "CUSTOM";
  timestamp: number;
  duration?: number; // Duration in milliseconds
}

export interface SessionMember {
  role: "lead" | "band";
  joinedAt: number;
  lastSeen: number;
}

export interface Session {
  id: string;
  active: boolean;
  createdAt: number;
  roleLead: string;
  cue?: Cue;
  members?: { [userId: string]: SessionMember };
  memberCount?: number;
}

interface SessionContextType {
  currentSession: Session | null;
  currentCue: Cue | null;
  sessionMembers: { [userId: string]: SessionMember };
  currentLeadAction: LeadAction | null;
  isConnected: boolean;
  createSession: () => Promise<string>;
  joinSession: (sessionId: string) => Promise<boolean>;
  sendCue: (cue: Omit<Cue, "timestamp">) => Promise<void>;
  sendLeadAction: (action: Omit<LeadAction, "timestamp">) => Promise<void>;
  leaveSession: () => Promise<void>;
  clearCue: () => void;
  logout: () => Promise<void>;
  role: "lead" | "band" | null;
  sessionId: string | null;
  isSessionLoaded: boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};

interface SessionProviderProps {
  children: ReactNode;
}

// Generate a static userId for the session (for demo, random per app load)
// const staticUserId = Math.random().toString(36).substr(2, 8);
const USER_ID_KEY = "bandcue_user_id";
const SESSION_ID_KEY = "bandcue_session_id";
const ROLE_KEY = "bandcue_role";

export const SessionProvider: React.FC<SessionProviderProps> = ({ children }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [role, setRole] = useState<"lead" | "band" | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [currentCue, setCurrentCue] = useState<Cue | null>(null);
  const [sessionMembers, setSessionMembers] = useState<{ [userId: string]: SessionMember }>({});
  const [currentLeadAction, setCurrentLeadAction] = useState<LeadAction | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [unsubscribeListener, setUnsubscribeListener] = useState<(() => void) | null>(null);
  const [unsubscribeMembersListener, setUnsubscribeMembersListener] = useState<(() => void) | null>(null);
  const [unsubscribeLeadActionsListener, setUnsubscribeLeadActionsListener] = useState<(() => void) | null>(null);
  const [isSessionLoaded, setIsSessionLoaded] = useState(false);

  // On mount, load or generate userId and restore session if possible
  useEffect(() => {
    const loadOrCreateUserIdAndSession = async () => {
      try {
        let storedId = await AsyncStorage.getItem(USER_ID_KEY);
        let storedSessionId = await AsyncStorage.getItem(SESSION_ID_KEY);
        let storedRole = await AsyncStorage.getItem(ROLE_KEY);
        console.log('[SessionContext] AsyncStorage USER_ID_KEY:', storedId);
        console.log('[SessionContext] AsyncStorage SESSION_ID_KEY:', storedSessionId);
        console.log('[SessionContext] AsyncStorage ROLE_KEY:', storedRole);
        if (storedId) {
          setUserId(storedId);
          if (storedSessionId && storedRole) {
            setSessionId(storedSessionId);
            setRole(storedRole as "lead" | "band");
            // Fetch session data from Firebase and set currentSession
            try {
              const sessionData = await firebaseService.getSession(storedSessionId);
              console.log('[SessionContext] Firebase sessionData:', sessionData);
              if (sessionData) {
                setCurrentSession({
                  id: storedSessionId,
                  ...sessionData,
                });
                setIsConnected(true);
              } else {
                setCurrentSession(null);
                setIsConnected(false);
                console.log('[SessionContext] No session data found for sessionId:', storedSessionId);
              }
            } catch (e) {
              setCurrentSession(null);
              setIsConnected(false);
              console.log('[SessionContext] Error fetching session data:', e);
            }
          } else {
            setCurrentSession(null);
            setIsConnected(false);
            console.log('[SessionContext] No sessionId or role in AsyncStorage');
          }
        } else {
          setUserId(null);
          setCurrentSession(null);
          setIsConnected(false);
          console.log('[SessionContext] No userId in AsyncStorage');
        }
      } catch (e) {
        setUserId(null);
        setCurrentSession(null);
        setIsConnected(false);
        console.log('[SessionContext] Error loading from AsyncStorage:', e);
      } finally {
        setIsSessionLoaded(true);
        console.log('[SessionContext] isSessionLoaded set to true');
      }
    };
    loadOrCreateUserIdAndSession();
  }, []);

  // Persist sessionId and role when they change
  useEffect(() => {
    if (sessionId && role) {
      AsyncStorage.setItem(SESSION_ID_KEY, sessionId);
      AsyncStorage.setItem(ROLE_KEY, role);
    }
  }, [sessionId, role]);

  useEffect(() => {
    if (currentCue && currentCue.duration) {
      const timer = setTimeout(() => {
        setCurrentCue(null);
      }, currentCue.duration);

      return () => clearTimeout(timer);
    }
  }, [currentCue]);

  // Set up listener when role changes to 'band'
  useEffect(() => {
    if (role === "band" && currentSession && !unsubscribeListener) {
      console.log("Setting up listener for band member in session:", currentSession.id);
      const unsubscribe = firebaseService.listenToCues(currentSession.id, (cueData) => {
        console.log("Received cue data for band member:", cueData);
        if (cueData) {
          setCurrentCue(cueData);
        }
      });
      setUnsubscribeListener(() => unsubscribe);
    }
  }, [role, currentSession, unsubscribeListener]);

  // Set up listener for session members
  useEffect(() => {
    if (currentSession && !unsubscribeMembersListener) {
      console.log("Setting up members listener for session:", currentSession.id);
      const unsubscribe = firebaseService.listenToSessionMembers(currentSession.id, (membersData) => {
        console.log("Received members data:", membersData);
        setSessionMembers(membersData || {});
      });
      setUnsubscribeMembersListener(() => unsubscribe);
    }
  }, [currentSession, unsubscribeMembersListener]);

  // Set up listener for lead actions (for band members)
  useEffect(() => {
    if (currentSession && role === "band" && !unsubscribeLeadActionsListener) {
      console.log("Setting up lead actions listener for session:", currentSession.id);
      const unsubscribe = firebaseService.listenToLeadActions(currentSession.id, (actionData) => {
        console.log("Received lead action:", actionData);
        setCurrentLeadAction(actionData);
      });
      setUnsubscribeLeadActionsListener(() => unsubscribe);
    }
  }, [currentSession, role, unsubscribeLeadActionsListener]);



  // Helper to ensure userId exists
  const ensureUserId = async (): Promise<string> => {
    let id = userId;
    if (!id) {
      let storedId = await AsyncStorage.getItem(USER_ID_KEY);
      if (!storedId) {
        storedId = Math.random().toString(36).substr(2, 8);
        await AsyncStorage.setItem(USER_ID_KEY, storedId);
      }
      setUserId(storedId);
      id = storedId;
    }
    return id;
  };

  const createSession = async (): Promise<string> => {
    const id = await ensureUserId();
    try {
      const sessionId = await firebaseService.createSession(id);
      setSessionId(sessionId);
      await AsyncStorage.setItem(SESSION_ID_KEY, sessionId);
      await AsyncStorage.setItem(ROLE_KEY, "lead");
      const session: Session = {
        id: sessionId,
        active: true,
        createdAt: Date.now(),
        roleLead: id,
      };
      setCurrentSession(session);
      setIsConnected(true);
      setRole("lead");
      return sessionId;
    } catch (error) {
      console.error("Error creating session:", error);
      throw error;
    }
  };

  const joinSession = async (sessionId: string): Promise<boolean> => {
    const id = await ensureUserId();
    try {
      const success = await firebaseService.joinSession(sessionId, id);
      if (success) {
        setSessionId(sessionId);
        await AsyncStorage.setItem(SESSION_ID_KEY, sessionId);
        await AsyncStorage.setItem(ROLE_KEY, "band");
        // Fetch the full session data after join
        try {
          const sessionData = await firebaseService.getSession(sessionId);
          console.log('[SessionContext] joinSession fetched sessionData:', sessionData);
          if (sessionData) {
            setCurrentSession({ id: sessionId, ...sessionData });
            setIsConnected(true);
            setRole("band");
            return true;
          } else {
            setCurrentSession(null);
            setIsConnected(false);
            return false;
          }
        } catch (e) {
          setCurrentSession(null);
          setIsConnected(false);
          console.log('[SessionContext] joinSession error fetching session data:', e);
          return false;
        }
      }
      return false;
    } catch (error) {
      console.error("Error joining session:", error);
      return false;
    }
  };

  const sendCue = async (cue: Omit<Cue, "timestamp">) => {
    if (!currentSession) return;

    const cueWithTimestamp: Cue = {
      ...cue,
      timestamp: Date.now(),
      duration: getCueDuration(cue.type), // Add duration based on cue type
    };

    try {
      await firebaseService.sendCue(currentSession.id, cueWithTimestamp);
      console.log("Cue sent to Firebase:", currentSession.id, cueWithTimestamp);
    } catch (error) {
      console.error("Error sending cue:", error);
      throw error;
    }
  };

  const sendLeadAction = async (action: Omit<LeadAction, "timestamp">) => {
    if (!currentSession) return;

    const actionWithTimestamp: LeadAction = {
      ...action,
      timestamp: Date.now(),
    };

    try {
      await firebaseService.sendLeadAction(currentSession.id, actionWithTimestamp);
      console.log("Lead action sent to Firebase:", currentSession.id, actionWithTimestamp);
    } catch (error) {
      console.error("Error sending lead action:", error);
      throw error;
    }
  };

  const leaveSession = async () => {
    if (currentSession) {
      try {
        await firebaseService.leaveSession(currentSession.id, userId);
        setCurrentSession(null);
        setCurrentCue(null);
        setCurrentLeadAction(null);
        setSessionMembers({});
        setIsConnected(false);
      } catch (error) {
        console.error("Error leaving session:", error);
      }
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (unsubscribeListener) {
        unsubscribeListener();
      }
      if (unsubscribeMembersListener) {
        unsubscribeMembersListener();
      }
      if (unsubscribeLeadActionsListener) {
        unsubscribeLeadActionsListener();
      }
    };
  }, [unsubscribeListener, unsubscribeMembersListener, unsubscribeLeadActionsListener]);

  // Helper function to determine cue duration based on type
  const getCueDuration = (type: Cue["type"]): number => {
    switch (type) {
      case "STROFA":
        return 6000; // 10 seconds
      case "REFREN":
        return 6000; // 15 seconds
      case "BRIDGE":
        return 6000; // 8 seconds
      case "FINAL":
        return 6000; // 20 seconds
      case "CUSTOM":
        return 6000; // 12 seconds
      default:
        return 6000; // 10 seconds default
    }
  };

  const clearCue = () => {
    setCurrentCue(null);
  };

  const logout = async () => {
    await AsyncStorage.removeItem(USER_ID_KEY);
    await AsyncStorage.removeItem(SESSION_ID_KEY);
    await AsyncStorage.removeItem(ROLE_KEY);
    setUserId(null);
    setCurrentSession(null);
    setCurrentCue(null);
    setCurrentLeadAction(null);
    setSessionMembers({});
    setIsConnected(false);
    setRole(null);
    setSessionId(null);
  };

  const value: SessionContextType = {
    currentSession,
    currentCue,
    sessionMembers,
    currentLeadAction,
    isConnected,
    createSession,
    joinSession,
    sendCue,
    sendLeadAction,
    leaveSession,
    clearCue,
    logout,
    role,
    sessionId,
    isSessionLoaded,
  };

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
};
