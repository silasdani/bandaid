export type Language = 'en' | 'ro';

export interface Translations {
  // Start Screen
  start: {
    title: string;
    createSession: string;
    createSessionLoading: string;
    joinSession: string;
    joinSessionLoading: string;
    sessionCode: string;
    connect: string;
    connecting: string;
    continueSession: string;
    backToStart: string;
    errors: {
      createSessionFailed: string;
      invalidSessionCode: string;
      connectionFailed: string;
      sessionCodeRequired: string;
    };
  };
  
  // Lead Screen
  lead: {
    status: {
      active: string;
      inactive: string;
    };
    sessionCodeCopied: string;
    sending: string;
    sessionManagement: string;
    leaveSession: string;
    closeSessionForAll: string;
    cancel: string;
    noActiveSession: string;
  };
  
  // Settings Screen
  settings: {
    title: string;
    globalSettings: string;
    globalTextSize: string;
    globalFontWeight: string;
    theme: string;
    tilesConfiguration: string;
    addNewTile: string;
    createTile: string;
    cancel: string;
    editTile: string;
    text: string;
    color: string;
    duration: string;
    fontSize: string;
    fontWeight: string;
    active: string;
    inactive: string;
    removeTile: string;
    removeTileConfirm: string;
    resetToDefaults: string;
    resetToDefaultsConfirm: string;
    save: string;
    close: string;
    emptyTile: string;
    noDuration: string;
    px: string;
    ms: string;
    themes: {
      light: string;
      dark: string;
      auto: string;
    };
    weights: {
      normal: string;
      bold: string;
      '900': string;
    };
  };
  
  // Common
  common: {
    language: string;
    english: string;
    romanian: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    start: {
      title: 'AID',
      createSession: 'Create Session',
      createSessionLoading: 'Creating...',
      joinSession: 'Join Session',
      joinSessionLoading: 'Joining...',
      sessionCode: 'Session Code',
      connect: 'Connect',
      connecting: 'Connecting...',
      continueSession: 'Continue Session',
      backToStart: 'Back to Start',
      errors: {
        createSessionFailed: 'Could not create session. Check your internet connection.',
        invalidSessionCode: 'Session code is invalid or session is no longer active.',
        connectionFailed: 'Could not connect to session. Check the code and connection.',
        sessionCodeRequired: 'Please enter the session code.',
      },
    },
    lead: {
      status: {
        active: 'Active',
        inactive: 'Inactive',
      },
      sessionCodeCopied: 'Copied!',
      sending: 'Sending...',
      sessionManagement: 'Session Management',
      leaveSession: 'Leave Session',
      closeSessionForAll: 'Close Session for All',
      cancel: 'Cancel',
      noActiveSession: 'No active session',
    },
    settings: {
      title: 'Settings',
      globalSettings: 'Global Settings',
      globalTextSize: 'Global Text Size',
      globalFontWeight: 'Global Font Weight',
      theme: 'Theme',
      tilesConfiguration: 'Tiles Configuration',
      addNewTile: 'Add New Tile',
      createTile: 'Create Tile',
      cancel: 'Cancel',
      editTile: 'Edit Tile',
      text: 'Text',
      color: 'Color',
      duration: 'Duration (ms)',
      fontSize: 'Font Size',
      fontWeight: 'Font Weight',
      active: 'Active',
      inactive: 'Inactive',
      removeTile: 'Remove Tile',
      removeTileConfirm: 'Are you sure you want to remove this tile?',
      resetToDefaults: 'Reset to Defaults',
      resetToDefaultsConfirm: 'Are you sure you want to reset all settings to default values? This cannot be undone.',
      save: 'Save',
      close: 'Close',
      emptyTile: 'Empty Tile',
      noDuration: 'No duration',
      px: 'px',
      ms: 'ms',
      themes: {
        light: 'Light',
        dark: 'Dark',
        auto: 'Auto',
      },
      weights: {
        normal: 'Normal',
        bold: 'Bold',
        '900': '900',
      },
    },
    common: {
      language: 'Language',
      english: 'English',
      romanian: 'Romanian',
    },
  },
  ro: {
    start: {
      title: 'AID',
      createSession: 'Creează Sesiune',
      createSessionLoading: 'Se creează...',
      joinSession: 'Conectează-te la Sesiune',
      joinSessionLoading: 'Se conectează...',
      sessionCode: 'Cod sesiune',
      connect: 'Conectare',
      connecting: 'Se conectează...',
      continueSession: 'Continuă sesiunea',
      backToStart: 'Înapoi la Start',
      errors: {
        createSessionFailed: 'Nu s-a putut crea sesiunea. Verifică conexiunea la internet.',
        invalidSessionCode: 'Codul sesiunii este invalid sau sesiunea nu mai este activă.',
        connectionFailed: 'Nu s-a putut conecta la sesiune. Verifică codul și conexiunea.',
        sessionCodeRequired: 'Introduceți codul sesiunii',
      },
    },
    lead: {
      status: {
        active: 'Activă',
        inactive: 'Închisă',
      },
      sessionCodeCopied: 'Copiat!',
      sending: 'Se trimite...',
      sessionManagement: 'Gestionare Sesiune',
      leaveSession: 'Părăsește sesiunea',
      closeSessionForAll: 'Închide sesiunea pentru toți',
      cancel: 'Anulează',
      noActiveSession: 'Nu există o sesiune activă',
    },
    settings: {
      title: 'Setări',
      globalSettings: 'Setări Globale',
      globalTextSize: 'Dimensiune Text Global',
      globalFontWeight: 'Grosime Font Global',
      theme: 'Temă',
      tilesConfiguration: 'Configurare Plăcuțe',
      addNewTile: 'Adaugă Plăcuță Nouă',
      createTile: 'Creează Plăcuță',
      cancel: 'Anulează',
      editTile: 'Editează Plăcuță',
      text: 'Text',
      color: 'Culoare',
      duration: 'Durată (ms)',
      fontSize: 'Dimensiune Font',
      fontWeight: 'Grosime Font',
      active: 'Activă',
      inactive: 'Inactivă',
      removeTile: 'Șterge Plăcuță',
      removeTileConfirm: 'Ești sigur că vrei să ștergi această plăcuță?',
      resetToDefaults: 'Resetează la Implicite',
      resetToDefaultsConfirm: 'Ești sigur că vrei să resetezi toate setările la valorile implicite? Aceasta nu poate fi anulată.',
      save: 'Salvează',
      close: 'Închide',
      emptyTile: 'Plăcuță Goală',
      noDuration: 'Fără durată',
      px: 'px',
      ms: 'ms',
      themes: {
        light: 'Luminos',
        dark: 'Întunecat',
        auto: 'Automat',
      },
      weights: {
        normal: 'Normal',
        bold: 'Îngroșat',
        '900': '900',
      },
    },
    common: {
      language: 'Limbă',
      english: 'Engleză',
      romanian: 'Română',
    },
  },
};

export const getTranslation = (language: Language, key: string): string => {
  const keys = key.split('.');
  let value: any = translations[language];
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return key; // Return key if translation not found
    }
  }
  
  return typeof value === 'string' ? value : key;
};
