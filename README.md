# 🎵 Band Cue

**Sincronizare perfectă pentru trupe** - O aplicație React Native modernă pentru gestionarea sesiunilor de cântări în timp real.

## ✨ Caracteristici

### 🎤 **Lead Mode**
- Creează sesiuni cu cod unic
- Trimite comenzi în timp real către toți membrii trupei
- Comenzi predefinite: Strofa, Refren, Bridge, Final
- Comenzi personalizate pentru situații specifice
- Gestionare PDF partituri cu evidențieri sincronizate

### 🎸 **Band Mode**
- Conectare la sesiuni existente
- Primește comenzi în timp real
- Vizualizare full-screen pentru comenzi
- Sincronizare PDF cu lead-ul
- Status indicator pentru conexiune

### 📄 **PDF Management**
- Upload și partajare PDF partituri
- Navigare sincronizată între pagini
- Zoom și evidențieri în timp real
- Sincronizare perfectă între lead și band

### 🔄 **Persistență Completă**
- Login anonim persistent
- Sesiuni active salvate
- Continuare automată după restart
- AsyncStorage pentru date locale

## 🎨 Design Modern

Aplicația folosește **Apple Design Guidelines** pentru o experiență modernă și profesională:

- **Culori Apple**: `#007AFF` (primary), `#34C759` (success), `#FF3B30` (error)
- **Tipografie**: Fonturi moderne cu hierarchy clară
- **Spacing**: Sistem consistent de padding și margin
- **Shadows**: Umbre subtile pentru depth
- **Animations**: Tranziții smooth și feedback haptic

## 🚀 Instalare și Rulare

### Prerequisites
- Node.js (v18+)
- Expo CLI
- Expo Go app pe telefon

### Setup
```bash
# Clone repository
git clone <repository-url>
cd band-cue

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your Firebase config

# Start development server
npx expo start
```

### Environment Variables
Creează un fișier `.env` cu configurația Firebase și Dropbox:

```env
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
DROPBOX_ACCESS_TOKEN=your_dropbox_access_token
```

**Important**: Pentru PDF storage, aplicația folosește Dropbox în loc de Firebase. Vezi [DROPBOX_SETUP.md](DROPBOX_SETUP.md) pentru instrucțiuni de configurare.

## 📱 Utilizare

### Pentru Lead
1. **Conectare**: Aplicația se conectează automat anonim
2. **Creare sesiune**: Atinge "Creează Sesiune" pe ecranul Start
3. **Distribuie codul**: Partajează codul sesiunii cu trupa
4. **Trimite comenzi**: Folosește butoanele predefinite sau creează comenzi personalizate
5. **Gestionare PDF**: Încarcă partituri și evidențiază părți importante

### Pentru Band
1. **Conectare**: Aplicația se conectează automat anonim
2. **Join sesiune**: Introdu codul sesiunii de la lead
3. **Primește comenzi**: Comenzile apar în timp real pe ecran
4. **Vizualizează PDF**: Partiturile se sincronizează cu lead-ul

## 🛠 Tehnologii

- **Frontend**: React Native + Expo
- **Backend**: Firebase Realtime Database
- **Auth**: Firebase Anonymous Authentication
- **Storage**: AsyncStorage pentru persistență locală
- **PDF Storage**: Dropbox API
- **UI**: Apple Design Guidelines
- **State Management**: React Context API

## 📁 Structura Proiectului

```
band-cue/
├── app/                    # Expo Router screens
│   ├── _layout.tsx        # Root layout
│   ├── index.tsx          # Main screen
│   ├── start.tsx          # Role selection
│   ├── lead.tsx           # Lead interface
│   └── band.tsx           # Band interface
├── context/              # React Context providers
│   ├── AuthContext.tsx   # Authentication state
│   └── SessionContext.tsx # Session management
├── services/             # External services
│   └── firebase.ts       # Firebase integration
├── constants/            # App constants
│   └── Colors.ts         # Design system
└── hooks/               # Custom hooks
```

## 🔧 Configurare Firebase

1. Creează un proiect Firebase
2. Activează Realtime Database
3. Activează Anonymous Authentication
4. Configurează regulile de securitate
5. Adaugă configurația în `.env`

## 🎯 Funcționalități Avansate

### Real-time Synchronization
- Comenzi instant între lead și band
- Status conexiune în timp real
- Sincronizare PDF cu evidențieri
- Member tracking în sesiune

### Haptic Feedback
- Feedback la trimiterea comenzilor
- Vibrații pentru acțiuni importante
- Feedback la navigare

### Error Handling
- Graceful error handling
- Retry mechanisms
- User-friendly error messages
- Offline support

## 📈 Performance

- **Lazy loading** pentru componente
- **Optimized re-renders** cu React.memo
- **Efficient state management** cu Context API
- **Minimal bundle size** cu tree shaking

## 🔒 Securitate

- **Anonymous auth** pentru simplicitate
- **Firebase security rules** pentru date
- **Input validation** pe client
- **Error boundaries** pentru crash protection

## 🚀 Deployment

### Expo Go (Development)
```bash
npx expo start
# Scanează QR code cu Expo Go
```

### Production Build
```bash
# Build pentru iOS
npx expo build:ios

# Build pentru Android
npx expo build:android
```

## 🤝 Contribuții

1. Fork repository
2. Creează feature branch
3. Commit changes
4. Push la branch
5. Creează Pull Request

## 📄 Licență

MIT License - vezi [LICENSE](LICENSE) pentru detalii.

## 🆘 Support

Pentru întrebări sau probleme:
- Creează un Issue pe GitHub
- Contactează echipa de dezvoltare

---

**Band Cue** - Sincronizare perfectă pentru trupe 🎵
