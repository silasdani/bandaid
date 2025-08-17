# Internationalization (i18n) Guide

This application now supports internationalization with Romanian (ro) and English (en) languages.

## Features

- **Language Switching**: Users can switch between Romanian and English on the Start and Settings screens
- **Session-Based Language Selection**: Language choice is stored at session level and resets when session ends
- **Comprehensive Coverage**: All user-facing text is internationalized
- **Default Language**: Romanian (ro) is the default language and resets after each session

## How to Use

### For Users

1. **On Start Screen**: Language switcher is located in the top-left corner
2. **On Settings Screen**: Language switcher is at the top of the settings list
3. **Language Selection**: Tap either "Română" or "English" to switch languages
4. **Session Reset**: Language choice resets to Romanian (default) when you leave or end a session

### For Developers

#### Adding New Translations

1. **Update the Translations Interface** in `constants/i18n.ts`:
```typescript
export interface Translations {
  // Add new translation keys here
  newFeature: {
    title: string;
    description: string;
  };
}
```

2. **Add Translations** for each language:
```typescript
export const translations: Record<Language, Translations> = {
  en: {
    // ... existing translations
    newFeature: {
      title: 'New Feature',
      description: 'This is a new feature',
    },
  },
  ro: {
    // ... existing translations
    newFeature: {
      title: 'Funcționalitate Nouă',
      description: 'Aceasta este o funcționalitate nouă',
    },
  },
};
```

#### Using Translations in Components

1. **Import the hook**:
```typescript
import { useLanguage } from '../context/LanguageContext';
```

2. **Use the translation function**:
```typescript
const { t } = useLanguage();

// In your JSX:
<Text>{t('newFeature.title')}</Text>
```

#### Adding New Languages

1. **Update the Language type** in `constants/i18n.ts`:
```typescript
export type Language = 'en' | 'ro' | 'de'; // Add new language
```

2. **Add translations** for the new language in the `translations` object
3. **Update the LanguageSwitcher component** to include the new language option

## File Structure

- `constants/i18n.ts` - Translation definitions and helper functions
- `context/LanguageContext.tsx` - Language state management (session-based)
- `components/LanguageSwitcher.tsx` - UI component for language switching
- All screen files - Updated to use internationalization

## Translation Keys

### Start Screen (`start.*`)
- `title` - App title
- `createSession` - Create session button
- `joinSession` - Join session button
- `sessionCode` - Session code input placeholder
- `connect` - Connect button
- `continueSession` - Continue session button
- Error messages for various scenarios

### Lead Screen (`lead.*`)
- `status.active` - Active status text
- `status.inactive` - Inactive status text
- `sending` - Sending indicator text
- `sessionManagement` - Session management dialog title
- `leaveSession` - Leave session option
- `closeSessionForAll` - Close session for all option
- `cancel` - Cancel button
- `noActiveSession` - No active session error

### Settings Screen (`settings.*`)
- `title` - Settings screen title
- `globalSettings` - Global settings section
- `globalTextSize` - Global text size setting
- `globalFontWeight` - Global font weight setting
- `theme` - Theme setting
- `tilesConfiguration` - Tiles configuration section
- `addNewTile` - Add new tile option
- `createTile` - Create tile button
- `cancel` - Cancel button
- `editTile` - Edit tile title
- `text` - Text input label
- `color` - Color input label
- `duration` - Duration input label
- `fontSize` - Font size input label
- `fontWeight` - Font weight input label
- `active` - Active status
- `inactive` - Inactive status
- `removeTile` - Remove tile option
- `resetToDefaults` - Reset to defaults option
- Various confirmation messages and labels

### Common (`common.*`)
- `language` - Language setting label
- `english` - English language option
- `romanian` - Romanian language option

## Best Practices

1. **Always use translation keys** instead of hardcoded text
2. **Keep translation keys descriptive** and organized by feature
3. **Use nested keys** for better organization (e.g., `settings.globalSettings`)
4. **Test both languages** when adding new features
5. **Consider text length** - some languages may have longer text that could affect UI layout
6. **Remember language resets** - language choice is session-based, not persistent

## Session-Based Behavior

- **Language Reset**: Language automatically resets to Romanian (default) when:
  - Starting a new session
  - Joining a different session
  - Leaving/ending a session
- **No Persistence**: Language choice is not saved between app restarts
- **Session Isolation**: Each session starts with the default language

## Troubleshooting

- **Translation not found**: Check that the translation key exists in both languages
- **Language not persisting**: This is expected behavior - language resets with each session
- **UI layout issues**: Some languages may have longer text that requires UI adjustments
- **Language not switching**: Ensure the LanguageProvider is properly wrapped around your app
