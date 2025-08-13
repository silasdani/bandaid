import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import Colors from '../constants/Colors';

export interface TileConfig {
  id: string;
  text: string;
  color: string;
  duration: number;
  fontSize: number;
  fontWeight: 'normal' | 'bold' | '900';
  isActive: boolean;
}

export interface AppSettings {
  tiles: TileConfig[];
  globalTextSize: number;
  globalFontWeight: 'normal' | 'bold' | '900';
  theme: 'light' | 'dark' | 'auto';
}

const defaultTiles: TileConfig[] = [
  {
    id: '1',
    text: '—',
    color: '#FFFFFF',
    duration: 0,
    fontSize: 36,
    fontWeight: '900',
    isActive: true,
  },
  {
    id: '2',
    text: 'Pauză Instrumental',
    color: Colors.light.warning,
    duration: 6000,
    fontSize: 20,
    fontWeight: 'bold',
    isActive: true,
  },
  {
    id: '3',
    text: 'X2 Ref',
    color: Colors.light.error,
    duration: 6000,
    fontSize: 20,
    fontWeight: 'bold',
    isActive: true,
  },
  {
    id: '4',
    text: 'Încă 1 str',
    color: Colors.dark.primary,
    duration: 6000,
    fontSize: 20,
    fontWeight: 'bold',
    isActive: true,
  },
  {
    id: '5',
    text: 'Finalul Rărit',
    color: Colors.dark.secondary,
    duration: 6000,
    fontSize: 20,
    fontWeight: 'bold',
    isActive: true,
  },
  {
    id: '6',
    text: '',
    color: '#FFFFFF',
    duration: 0,
    fontSize: 20,
    fontWeight: 'bold',
    isActive: false,
  },
  {
    id: '7',
    text: '',
    color: '#FFFFFF',
    duration: 0,
    fontSize: 20,
    fontWeight: 'bold',
    isActive: false,
  },
  {
    id: '8',
    text: '',
    color: '#FFFFFF',
    duration: 0,
    fontSize: 20,
    fontWeight: 'bold',
    isActive: false,
  },
];

const defaultSettings: AppSettings = {
  tiles: defaultTiles,
  globalTextSize: 20,
  globalFontWeight: 'bold',
  theme: 'dark',
};

interface SettingsContextType {
  settings: AppSettings;
  updateTile: (id: string, updates: Partial<TileConfig>) => void;
  addTile: (tile: Omit<TileConfig, 'id'>) => void;
  removeTile: (id: string) => void;
  updateGlobalTextSize: (size: number) => void;
  updateGlobalFontWeight: (weight: 'normal' | 'bold' | '900') => void;
  updateTheme: (theme: 'light' | 'dark' | 'auto') => void;
  resetToDefaults: () => void;
  getActiveTiles: () => TileConfig[];
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load settings from AsyncStorage on mount
  useEffect(() => {
    loadSettings();
  }, []);

  // Save settings to AsyncStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      saveSettings();
    }
  }, [settings, isLoaded]);

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('appSettings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setIsLoaded(true);
    }
  };

  const saveSettings = async () => {
    try {
      await AsyncStorage.setItem('appSettings', JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const updateTile = (id: string, updates: Partial<TileConfig>) => {
    setSettings(prev => ({
      ...prev,
      tiles: prev.tiles.map(tile =>
        tile.id === id ? { ...tile, ...updates } : tile
      ),
    }));
  };

  const addTile = (tile: Omit<TileConfig, 'id'>) => {
    const newTile: TileConfig = {
      ...tile,
      id: Date.now().toString(),
    };
    setSettings(prev => ({
      ...prev,
      tiles: [...prev.tiles, newTile],
    }));
  };

  const removeTile = (id: string) => {
    setSettings(prev => ({
      ...prev,
      tiles: prev.tiles.filter(tile => tile.id !== id),
    }));
  };

  const updateGlobalTextSize = (size: number) => {
    setSettings(prev => ({
      ...prev,
      globalTextSize: size,
    }));
  };

  const updateGlobalFontWeight = (weight: 'normal' | 'bold' | '900') => {
    setSettings(prev => ({
      ...prev,
      globalFontWeight: weight,
    }));
  };

  const updateTheme = (theme: 'light' | 'dark' | 'auto') => {
    setSettings(prev => ({
      ...prev,
      theme,
    }));
  };

  const resetToDefaults = () => {
    setSettings(defaultSettings);
  };

  const getActiveTiles = () => {
    return settings.tiles.filter(tile => tile.isActive);
  };

  const value: SettingsContextType = {
    settings,
    updateTile,
    addTile,
    removeTile,
    updateGlobalTextSize,
    updateGlobalFontWeight,
    updateTheme,
    resetToDefaults,
    getActiveTiles,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
