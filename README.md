# Band Cue

Band Cue is a real-time cueing app for band leaders and musicians, built with React Native and Expo. It allows a lead to send musical cues to band members during live sessions, ensuring everyone stays in sync.

## Features
- Real-time session management for bands
- Lead can send predefined or custom cues to members
- Responsive grid UI for cues
- Firebase backend for session and member management
- Cross-platform: iOS & Android support

## Prerequisites
- [Node.js](https://nodejs.org/) (v16 or newer recommended)
- [Yarn](https://yarnpkg.com/) or [npm](https://www.npmjs.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- Firebase project (Realtime Database enabled)

## Installation
1. **Clone the repository:**
   ```sh
   git clone <your-repo-url>
   cd band-cue
   ```
2. **Install dependencies:**
   ```sh
   npm install
   # or
   yarn install
   ```
3. **Configure Firebase:**
   - Add your Firebase config to `services/firebase.ts` or use environment variables as needed.
   - Ensure your Firebase Realtime Database rules allow proper session/member access.

4. **(Optional) Configure environment variables:**
   - Create a `.env` file for secrets (see `.env.example` if available).

## Running the App
1. **Start the Expo development server:**
   ```sh
   npx expo start
   ```
2. **Run on your device:**
   - Use the Expo Go app (iOS/Android) to scan the QR code.
   - Or run on an emulator/simulator via Expo CLI.

## Project Structure
```
band-cue/
  app/            # App entry points and screens
  assets/         # Images, fonts, and other static assets
  components/     # Reusable UI components
  constants/      # Color and style constants
  context/        # React context providers (e.g., session)
  hooks/          # Custom React hooks
  services/       # Firebase and other backend services
  scripts/        # Utility scripts
```

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a pull request

## Notes
- **Firebase:** Make sure your database rules allow users to join/leave sessions as needed.
- **iOS:** If running on iOS, ensure you have the necessary Apple developer tools installed.
- **Android:** Android Studio or a device is required for Android builds.

## License
MIT
