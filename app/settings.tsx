import { Ionicons } from '@expo/vector-icons';
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { LanguageSwitcher } from "../components/LanguageSwitcher";
import Colors from "../constants/Colors";
import { useLanguage } from "../context/LanguageContext";
import { useSession } from "../context/SessionContext";
import { TileConfig } from "../context/SettingsContext";

export default function SettingsScreen() {
  const { currentSession, updateSessionTile, addSessionTile, removeSessionTile } = useSession();
  const { t } = useLanguage();
  const [editingTile, setEditingTile] = useState<TileConfig | null>(null);
  const [showAddTile, setShowAddTile] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleEditTile = (tile: TileConfig) => {
    setEditingTile(tile);
  };

  const handleSaveTile = () => {
    if (editingTile) {
      updateSessionTile(editingTile.id, editingTile);
      setEditingTile(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingTile(null);
  };

  const handleAddTile = () => {
    const newTile: Omit<TileConfig, 'id'> = {
      text: 'New Tile',
      color: '#FFFFFF',
      duration: 15000,
      fontSize: 20,
      fontWeight: 'bold',
      isActive: true,
    };
    addSessionTile(newTile);
    setShowAddTile(false);
  };

  const handleRemoveTile = (id: string) => {
    Alert.alert(
      t('settings.removeTile'),
      t('settings.removeTileConfirm'),
      [
        { text: t('settings.cancel'), style: "cancel" },
        { text: t('settings.removeTile'), style: "destructive", onPress: () => removeSessionTile(id) },
      ]
    );
  };

  // Reset to defaults is now handled by session settings
  const handleResetToDefaults = () => {
    // This will be implemented to reset session settings to defaults
    Alert.alert(
      t('settings.resetToDefaults'),
      'Reset session settings to defaults?',
      [
        { text: t('settings.cancel'), style: "cancel" },
        { text: 'Reset', style: "destructive", onPress: () => {
          // TODO: Implement reset to session defaults
        }},
      ]
    );
  };

  const predefinedColors = [
    '#FFFFFF', '#FF3B30', '#FF9500', '#34C759', '#007AFF', '#5856D6',
    '#FF2D92', '#AF52DE', '#FF6B22', '#30D158', '#64D2FF', '#FF9F0A'
  ];

  const fontWeights = ['normal', 'bold', '900'] as const;

  // Dynamic styles for tile properties
  const getTilePreviewButtonStyle = (color: string) => [
    styles.tilePreviewButton,
    { borderColor: color }
  ];

  const getTilePreviewTextStyle = (tile: TileConfig) => [
    styles.tilePreviewText,
    { color: tile.color, fontSize: tile.fontSize, fontWeight: tile.fontWeight }
  ];

  const getTileStatusStyle = (isActive: boolean) => [
    styles.tileStatus,
    { color: isActive ? Colors.light.success : Colors.light.error }
  ];

  const getSliderFillStyle = (textSize: number) => [
    styles.sliderFill,
    { width: `${((textSize - 12) / (48 - 12)) * 100}%` as any }
  ];

  const getColorOptionStyle = (color: string, isSelected: boolean) => [
    styles.colorOption,
    { backgroundColor: color },
    isSelected && styles.selectedColor
  ];

  const getWeightOptionStyle = (weight: string, isSelected: boolean) => [
    styles.weightOption,
    isSelected && styles.selectedWeight
  ];

  const getWeightTextStyle = (isSelected: boolean) => [
    styles.weightText,
    isSelected && styles.selectedWeightText
  ];

  const getThemeOptionStyle = (theme: string, isSelected: boolean) => [
    styles.themeOption,
    isSelected && styles.selectedTheme
  ];

  const getThemeTextStyle = (isSelected: boolean) => [
    styles.themeText,
    isSelected && styles.selectedThemeText
  ];

  const renderTileEditor = (tile: TileConfig) => (
    <View key={tile.id} style={styles.tileEditor}>
      <View style={styles.tileEditorHeader}>
        <Text style={styles.tileEditorTitle}>{t('settings.editTile')}</Text>
        <View style={styles.tileEditorActions}>
          <TouchableOpacity onPress={handleSaveTile} style={styles.saveButton}>
            <Ionicons name="checkmark" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleCancelEdit} style={styles.cancelButton}>
            <Ionicons name="close" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>{t('settings.text')}</Text>
        <TextInput
          style={styles.textInput}
          value={tile.text}
          onChangeText={(text) => setEditingTile({ ...tile, text })}
          placeholder="Enter tile text"
          placeholderTextColor="#666"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>{t('settings.color')}</Text>
        <View style={styles.colorPicker}>
          {predefinedColors.map((color) => (
            <TouchableOpacity
              key={color}
              style={getColorOptionStyle(color, tile.color === color)}
              onPress={() => setEditingTile({ ...tile, color })}
            />
          ))}
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>{t('settings.duration')}</Text>
        <TextInput
          style={styles.textInput}
          value={tile.duration.toString()}
          onChangeText={(text) => setEditingTile({ ...tile, duration: parseInt(text) || 0 })}
          keyboardType="numeric"
          placeholder="6000"
          placeholderTextColor="#666"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>{t('settings.fontSize')}</Text>
        <TextInput
          style={styles.textInput}
          value={tile.fontSize.toString()}
          onChangeText={(text) => setEditingTile({ ...tile, fontSize: parseInt(text) || 20 })}
          keyboardType="numeric"
          placeholder="20"
          placeholderTextColor="#666"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>{t('settings.fontWeight')}</Text>
        <View style={styles.weightPicker}>
          {fontWeights.map((weight) => (
            <TouchableOpacity
              key={weight}
              style={getWeightOptionStyle(weight, tile.fontWeight === weight)}
              onPress={() => setEditingTile({ ...tile, fontWeight: weight })}
            >
              <Text style={getWeightTextStyle(tile.fontWeight === weight)}>
                {t(`settings.weights.${weight}`)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>{t('settings.active')}</Text>
        <Switch
          value={tile.isActive}
          onValueChange={(isActive) => setEditingTile({ ...tile, isActive })}
          trackColor={{ false: '#333', true: Colors.light.primary }}
          thumbColor={tile.isActive ? '#fff' : '#666'}
        />
      </View>
    </View>
  );

  const renderTile = (tile: TileConfig) => (
    <View key={tile.id} style={styles.tileItem}>
      <View style={styles.tilePreview}>
        <View style={getTilePreviewButtonStyle(tile.color)}>
          <Text style={getTilePreviewTextStyle(tile)}>
            {tile.text || t('settings.emptyTile')}
          </Text>
        </View>
      </View>
      
      <View style={styles.tileInfo}>
        <Text style={styles.tileText} numberOfLines={1}>
          {tile.text || t('settings.emptyTile')}
        </Text>
        <Text style={styles.tileDetails}>
          {tile.duration > 0 ? `${tile.duration}${t('settings.ms')}` : t('settings.noDuration')} • {tile.fontSize}{t('settings.px')} • {t(`settings.weights.${tile.fontWeight}`)}
        </Text>
        <Text style={getTileStatusStyle(tile.isActive)}>
          {tile.isActive ? t('settings.active') : t('settings.inactive')}
        </Text>
      </View>

      <View style={styles.tileActions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => handleEditTile(tile)}
        >
          <Ionicons name="pencil" size={16} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveTile(tile.id)}
        >
          <Ionicons name="trash" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#333" />
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('settings.title')}</Text>
          <View style={styles.headerRight} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Language Switcher */}
          <View style={styles.section}>
            <LanguageSwitcher />
          </View>
          
          {/* Session Settings Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Session Settings</Text>
            <Text style={styles.settingLabel}>
              These settings are specific to the current session and will not affect other sessions.
            </Text>
          </View>

          {/* Tiles Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{t('settings.tilesConfiguration')}</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => setShowAddTile(true)}
              >
                <Ionicons name="add" size={20} color="#fff" />
              </TouchableOpacity>
            </View>

            {showAddTile && (
              <View style={styles.addTileForm}>
                <Text style={styles.addTileTitle}>{t('settings.addNewTile')}</Text>
                <TouchableOpacity style={styles.addTileButton} onPress={handleAddTile}>
                  <Text style={styles.addTileButtonText}>{t('settings.createTile')}</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.cancelAddButton} 
                  onPress={() => setShowAddTile(false)}
                >
                  <Text style={styles.cancelAddButtonText}>{t('settings.cancel')}</Text>
                </TouchableOpacity>
              </View>
            )}

            {editingTile ? (
              renderTileEditor(editingTile)
            ) : (
              currentSession?.sessionSettings?.tiles?.map(renderTile) || []
            )}
          </View>

          {/* Reset Section */}
          <View style={styles.section}>
            <TouchableOpacity style={styles.resetButton} onPress={handleResetToDefaults}>
              <Ionicons name="refresh" size={20} color="#fff" />
              <Text style={styles.resetButtonText}>{t('settings.resetToDefaults')}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#333",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginVertical: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 16,
  },
  settingItem: {
    marginBottom: 24,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 12,
  },
  sliderContainer: {
    alignItems: "center",
  },
  sliderValue: {
    fontSize: 14,
    color: "#ccc",
    marginBottom: 8,
  },
  sliderTrack: {
    width: "100%",
    height: 4,
    backgroundColor: "#333",
    borderRadius: 2,
    position: "relative",
  },
  sliderFill: {
    height: "100%",
    backgroundColor: Colors.light.primary,
    borderRadius: 2,
  },
  sliderThumb: {
    position: "absolute",
    top: -6,
    width: 16,
    height: 16,
    backgroundColor: Colors.light.primary,
    borderRadius: 8,
  },
  sliderThumbRight: {
    right: 0,
  },
  weightPicker: {
    flexDirection: "row",
    gap: 12,
  },
  weightOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#222",
    borderWidth: 1,
    borderColor: "#333",
  },
  selectedWeight: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  weightText: {
    color: "#ccc",
    fontSize: 14,
    fontWeight: "500",
  },
  selectedWeightText: {
    color: "#fff",
  },
  themePicker: {
    flexDirection: "row",
    gap: 12,
  },
  themeOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#222",
    borderWidth: 1,
    borderColor: "#333",
  },
  selectedTheme: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  themeText: {
    color: "#ccc",
    fontSize: 14,
    fontWeight: "500",
  },
  selectedThemeText: {
    color: "#fff",
  },
  addButton: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addTileForm: {
    backgroundColor: "#111",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  addTileTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 16,
    textAlign: "center",
  },
  addTileButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  addTileButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  cancelAddButton: {
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#333",
  },
  cancelAddButtonText: {
    color: "#ccc",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  tileItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  tilePreview: {
    marginRight: 16,
  },
  tilePreviewButton: {
    width: 80,
    height: 60,
    borderWidth: 2,
    borderRadius: 12,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  tilePreviewText: {
    textAlign: "center",
  },
  tileInfo: {
    flex: 1,
  },
  tileText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 4,
  },
  tileDetails: {
    fontSize: 12,
    color: "#999",
    marginBottom: 4,
  },
  tileStatus: {
    fontSize: 12,
    fontWeight: "500",
  },
  tileActions: {
    flexDirection: "row",
    gap: 8,
  },
  editButton: {
    backgroundColor: Colors.light.primary,
    padding: 8,
    borderRadius: 6,
  },
  removeButton: {
    backgroundColor: Colors.light.error,
    padding: 8,
    borderRadius: 6,
  },
  tileEditor: {
    backgroundColor: "#111",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  tileEditorHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  tileEditorTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
  tileEditorActions: {
    flexDirection: "row",
    gap: 8,
  },
  saveButton: {
    backgroundColor: Colors.light.success,
    padding: 8,
    borderRadius: 6,
  },
  cancelButton: {
    backgroundColor: Colors.light.error,
    padding: 8,
    borderRadius: 6,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: "#222",
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: "#fff",
    fontSize: 16,
  },
  colorPicker: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  colorOption: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#333",
  },
  selectedColor: {
    borderColor: "#fff",
    borderWidth: 3,
  },
  resetButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#333",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  resetButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
