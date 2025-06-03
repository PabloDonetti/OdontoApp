// src/context/ThemeContext.js
import React, { createContext, useState, useEffect, useMemo } from 'react';
import { Appearance } from 'react-native'; // Para detectar o tema do sistema
import AsyncStorage from '@react-native-async-storage/async-storage';

export const lightTheme = {
  background: '#F7F8FA', // Fundo principal claro
  card: '#FFFFFF',       // Fundo de cards e modais
  text: '#1A202C',       // Cor de texto principal (escuro)
  subtleText: '#4A5568', // Texto secundário/descrições
  primary: '#4B3B56',     // Roxo principal
  primaryText: '#FFFFFF',  // Texto sobre o roxo principal
  accent: '#6D5B7E',      // Roxo secundário/acento
  accentText: '#FFFFFF',   // Texto sobre o roxo secundário
  headerBackground: '#4B3B56',
  headerText: '#FFFFFF',
  tabBarBackground: '#4B3B56',
  tabBarActive: '#FFFFFF',
  tabBarInactive: '#A0A0A0',
  statusBar: 'light-content', // Para fundos escuros (como o header roxo)
  inputBackground: '#F0F2F5',
  borderColor: '#E2E8F0',
  // Adicione mais cores conforme necessário
};
//TODO: trocar a cor do header e da tabbar para um roxo mais claro no tema claro
export const darkTheme = {
  background: '#1A202C', // Fundo principal escuro
  card: '#2D3748',       // Fundo de cards e modais escuros
  text: '#E2E8F0',       // Cor de texto principal (claro)
  subtleText: '#A0AEC0', // Texto secundário/descrições
  primary: '#7E75A3',     // Roxo mais claro para contraste no escuro
  primaryText: '#FFFFFF',
  accent: '#938AAE',      // Roxo secundário mais claro
  accentText: '#FFFFFF',
  headerBackground: '#2D3748', // Um cinza escuro para o header no tema escuro
  headerText: '#FFFFFF',
  tabBarBackground: '#1E232B', // Um cinza bem escuro para a tabbar
  tabBarActive: '#FFFFFF',
  tabBarInactive: '#718096',
  statusBar: 'light-content', // Geralmente light-content para fundos escuros
  inputBackground: '#2D3748',
  borderColor: '#4A5568',
  // Adicione mais cores
};

export const ThemeContext = createContext({
  theme: 'light', // 'light', 'dark', ou 'system'
  colors: lightTheme,
  setAppTheme: (themeName) => {},
});

export const ThemeProvider = ({ children }) => {
  const systemTheme = Appearance.getColorScheme(); // 'light' ou 'dark'
  const [theme, setTheme] = useState('system'); // 'light', 'dark', 'system'
  const [currentColors, setCurrentColors] = useState(systemTheme === 'dark' ? darkTheme : lightTheme);

  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('appTheme');
        if (savedTheme) {
          setTheme(savedTheme);
        } else {
          setTheme('system'); // Padrão para tema do sistema se nada salvo
        }
      } catch (error) {
        console.error("Failed to load theme from storage", error);
        setTheme('system');
      }
    };
    loadThemePreference();
  }, []);

  useEffect(() => {
    let newColors;
    if (theme === 'system') {
      newColors = systemTheme === 'dark' ? darkTheme : lightTheme;
    } else {
      newColors = theme === 'dark' ? darkTheme : lightTheme;
    }
    setCurrentColors(newColors);

    // Atualiza a cor da StatusBar globalmente (requer atenção se headers têm cores diferentes)
    // StatusBar.setBarStyle(newColors.statusBar, true);
    // Platform.OS === 'android' && StatusBar.setBackgroundColor(newColors.headerBackground); // Pode ser problemático se headers variam

  }, [theme, systemTheme]);

  // Listener para mudanças no tema do sistema
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (theme === 'system') {
        setCurrentColors(colorScheme === 'dark' ? darkTheme : lightTheme);
      }
    });
    return () => subscription.remove();
  }, [theme]);


  const setAppTheme = async (themeName) => { // 'light', 'dark', 'system'
    try {
      await AsyncStorage.setItem('appTheme', themeName);
      setTheme(themeName);
    } catch (error) {
      console.error("Failed to save theme to storage", error);
    }
  };

  // useMemo para evitar recriações desnecessárias do objeto de valor do contexto
  const contextValue = useMemo(() => ({
    theme, // 'light', 'dark', ou 'system' (a preferência do usuário)
    actualTheme: currentColors === darkTheme ? 'dark' : 'light', // o tema efetivamente aplicado
    colors: currentColors,
    setAppTheme,
  }), [theme, currentColors, setAppTheme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};