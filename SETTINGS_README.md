# BandAid Settings System

The BandAid app now includes a comprehensive settings system that allows users to customize tile configurations, colors, text sizes, and other app preferences.

## Features

### 🎯 Customizable Tiles
- **Text Content**: Customize the text displayed on each tile
- **Colors**: Choose from 12 predefined colors or use custom hex values
- **Duration**: Set how long each cue displays (in milliseconds)
- **Font Size**: Individual font size for each tile (12px - 48px)
- **Font Weight**: Choose between normal, bold, or extra bold (900)
- **Active/Inactive**: Enable or disable specific tiles

### 🌍 Global Settings
- **Global Text Size**: Adjust the base text size for all tiles
- **Global Font Weight**: Set the default font weight for tiles
- **Theme**: Choose between Light, Dark, or Auto themes

### 💾 Persistent Storage
- All settings are automatically saved to device storage
- Settings persist between app sessions
- Reset to default values option available

## How to Use

### Accessing Settings
1. **From Start Screen**: Tap the ⚙️ button in the top-right corner
2. **From Lead Screen**: Tap the ⚙️ button in the header
3. **From Band Screen**: Tap the ⚙️ button in the header

### Editing Tiles
1. Tap the **pencil** icon on any tile to edit
2. Modify text, color, duration, font size, and weight
3. Toggle the tile active/inactive state
4. Tap the **checkmark** to save or **X** to cancel

### Adding New Tiles
1. Tap the **+** button in the Tiles Configuration section
2. Tap **Create Tile** to add a new customizable tile
3. The new tile will appear in your grid

### Removing Tiles
1. Tap the **trash** icon on any tile
2. Confirm the deletion in the alert dialog

### Global Settings
- **Text Size**: Use the slider to adjust from 12px to 48px
- **Font Weight**: Choose between Normal, Bold, or Extra Bold
- **Theme**: Select Light, Dark, or Auto theme

### Reset to Defaults
- Tap the **Reset to Defaults** button at the bottom
- Confirm the action in the alert dialog
- All settings will return to their original values

## Default Tile Configuration

The app comes with these pre-configured tiles:

1. **—** (Dash): White, 36px, Extra Bold, No duration
2. **Pauză Instrumental**: Orange, 20px, Bold, 6 seconds
3. **X2 Ref**: Red, 20px, Bold, 6 seconds
4. **Încă 1 str**: Blue, 20px, Bold, 6 seconds
5. **Finalul Rărit**: Purple, 20px, Bold, 6 seconds
6-8. **Empty tiles**: Available for customization

## Color Palette

Available colors include:
- White (#FFFFFF)
- Red (#FF3B30)
- Orange (#FF9500)
- Green (#34C759)
- Blue (#007AFF)
- Purple (#5856D6)
- Pink (#FF2D92)
- Lavender (#AF52DE)
- Deep Orange (#FF6B22)
- Bright Green (#30D158)
- Light Blue (#64D2FF)
- Bright Orange (#FF9F0A)

## Technical Details

- **Storage**: Uses AsyncStorage for persistent settings
- **Context**: React Context API for state management
- **TypeScript**: Fully typed interfaces for type safety
- **Responsive**: Adapts to different screen orientations
- **Performance**: Efficient updates with minimal re-renders

## File Structure

```
context/
  └── SettingsContext.tsx    # Settings state management
app/
  ├── settings.tsx           # Settings UI screen
  ├── lead.tsx              # Updated to use settings
  ├── band.tsx              # Updated to use settings
  └── start.tsx             # Updated to use settings
```

## Future Enhancements

- Custom color picker with RGB sliders
- Tile arrangement and grid customization
- Import/export settings profiles
- Advanced typography options
- Animation duration settings
- Sound effect customization
