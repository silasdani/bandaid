# Session-Based Settings System

## Overview

The application now supports session-specific settings that allow lead users to customize cue tiles for each individual session, while maintaining global defaults for new sessions.

## Key Features

### 🎯 **Session-Specific Customization**
- Each session starts with default tile configurations
- Lead users can modify tiles only for the current session
- Changes don't affect global settings or other sessions
- Settings are persisted in Firebase for each session

### 🔄 **Default Settings Integration**
- New sessions automatically inherit global default tiles
- Default tiles include the essential "—" (clear) tile
- Global settings remain unchanged and reusable

### 💾 **Firebase Persistence**
- Session settings are stored in Firebase Realtime Database
- Each session has its own `sessionSettings` node
- Settings persist across app restarts for active sessions

## Architecture

### **SessionContext Extensions**
```typescript
interface SessionContextType {
  // ... existing properties
  updateSessionTile: (id: string, updates: any) => Promise<void>;
  addSessionTile: (tile: any) => Promise<void>;
  removeSessionTile: (id: string) => Promise<void>;
  getSessionActiveTiles: () => any[];
}
```

### **Session Interface**
```typescript
interface Session {
  id: string;
  active: boolean;
  createdAt: number;
  roleLead: string;
  sessionSettings?: {
    tiles: Array<{
      id: string;
      text: string;
      color: string;
      duration: number;
      fontSize: number;
      fontWeight: 'normal' | 'bold' | '900';
      isActive: boolean;
    }>;
  };
}
```

### **Firebase Service**
```typescript
updateSessionSettings: async (sessionId: string, settings: any): Promise<void>
```

## Workflow

### 1. **Session Creation**
```typescript
// When createSession() is called:
const defaultTiles = getActiveTiles(); // From global settings
const session: Session = {
  // ... other properties
  sessionSettings: {
    tiles: defaultTiles, // Copy of global defaults
  },
};
// Save to Firebase
await firebaseService.updateSessionSettings(sessionId, session.sessionSettings);
```

### 2. **Tile Management During Session**
```typescript
// Update existing tile
await updateSessionTile(tileId, { text: "New Text", color: "#FF0000" });

// Add new tile
await addSessionTile({ text: "Custom Cue", color: "#00FF00", ... });

// Remove tile
await removeSessionTile(tileId);

// Get active tiles for current session
const activeTiles = getSessionActiveTiles();
```

### 3. **Cue Generation**
```typescript
// In lead.tsx, prepareCues() now uses session tiles:
const activeTiles = getSessionActiveTiles(); // Session-specific
const mappedCues = activeTiles.map(tile => ({
  text: tile.text,
  color: tile.color,
  fontSize: tile.fontSize,
  fontWeight: tile.fontWeight,
  duration: tile.duration,
}));
```

## Benefits

### ✅ **Isolation**
- Each session maintains independent tile configurations
- No interference between different sessions
- Global defaults remain stable and reliable

### ✅ **Flexibility**
- Lead users can adapt tiles for specific performance needs
- Quick customization without affecting other sessions
- Real-time updates visible to all session members

### ✅ **Persistence**
- Session settings survive app restarts
- Firebase ensures data consistency across devices
- Historical session configurations are preserved

### ✅ **Performance**
- Local state management for immediate UI updates
- Firebase synchronization for persistence
- Efficient tile filtering and mapping

## Usage Examples

### **Creating a Session with Defaults**
```typescript
const sessionId = await createSession();
// Session automatically gets default tiles from global settings
```

### **Customizing Tiles During Session**
```typescript
// Change tile text and color
await updateSessionTile("tile1", {
  text: "Special Cue",
  color: "#FF6B6B"
});

// Add custom tile
await addSessionTile({
  text: "Encore",
  color: "#4ECDC4",
  duration: 8000,
  fontSize: 24,
  fontWeight: "bold",
  isActive: true
});
```

### **Getting Session-Specific Tiles**
```typescript
// In lead.tsx
const { getSessionActiveTiles } = useSession();
const activeTiles = getSessionActiveTiles();

// Use tiles for cue generation
const cues = activeTiles.map(tile => ({
  text: tile.text,
  color: tile.color,
  // ... other properties
}));
```

## Database Structure

```
sessions/
  {sessionId}/
    roleLead: "userId"
    active: true
    createdAt: 1234567890
    members: {...}
    memberCount: 3
    sessionSettings/
      tiles: [
        {
          id: "1",
          text: "—",
          color: "#FFFFFF",
          duration: 0,
          fontSize: 36,
          fontWeight: "900",
          isActive: true
        },
        // ... more tiles
      ]
```

## Future Enhancements

### 🔮 **Potential Features**
- Session templates for quick setup
- Import/export session configurations
- Collaborative tile editing for lead users
- Session settings analytics and insights

### 🔧 **Technical Improvements**
- Optimistic updates for better UX
- Batch operations for multiple tile changes
- Offline support for session settings
- Real-time collaboration indicators

## Migration Notes

### **Existing Sessions**
- Sessions created before this update will not have `sessionSettings`
- They will fall back to global settings
- New sessions will automatically include session settings

### **Backward Compatibility**
- The system gracefully handles missing session settings
- Global settings remain as fallback
- No breaking changes to existing functionality

---

This system provides a robust foundation for session-specific customization while maintaining the reliability of global defaults.
