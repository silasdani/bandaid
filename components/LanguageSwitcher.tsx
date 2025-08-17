import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../constants/Colors';
import { useLanguage } from '../context/LanguageContext';

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  const handleLanguageChange = (newLanguage: 'en' | 'ro') => {
    if (newLanguage !== language) {
      setLanguage(newLanguage);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{t('common.language')}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.languageButton,
            language === 'ro' && styles.activeButton
          ]}
          onPress={() => handleLanguageChange('ro')}
        >
          <Text style={[
            styles.languageText,
            language === 'ro' && styles.activeText
          ]}>
            {t('common.romanian')}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.languageButton,
            language === 'en' && styles.activeButton
          ]}
          onPress={() => handleLanguageChange('en')}
        >
          <Text style={[
            styles.languageText,
            language === 'en' && styles.activeText
          ]}>
            {t('common.english')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  languageButton: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#222',
    borderWidth: 1,
    borderColor: '#333',
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  languageText: {
    color: '#ccc',
    fontSize: 14,
    fontWeight: '500',
  },
  activeText: {
    color: '#fff',
  },
});
