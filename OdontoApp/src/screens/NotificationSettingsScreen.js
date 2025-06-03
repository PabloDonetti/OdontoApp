// screens/NotificationSettingsScreen.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
// Você pode adicionar switches ou outras opções de notificação aqui no futuro
// import { Switch } from 'react-native';

const NotificationSettingsScreen = () => {
  // const [isEnabled, setIsEnabled] = useState(false);
  // const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.settingItem}>
        <Text style={styles.settingText}>Notificações Gerais</Text>
        {/* <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
        /> */}
        <Text style={styles.placeholderText}>(Configuração de Switch aqui)</Text>
      </View>

      <View style={styles.settingItem}>
        <Text style={styles.settingText}>Notificações de Agendamentos</Text>
        <Text style={styles.placeholderText}>(Configuração de Switch aqui)</Text>
      </View>

      <View style={styles.settingItem}>
        <Text style={styles.settingText}>Promoções e Novidades</Text>
        <Text style={styles.placeholderText}>(Configuração de Switch aqui)</Text>
      </View>
      {/* Adicione mais opções de notificação conforme necessário */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F8', // Mesmo fundo da tela de Configurações
  },
  settingItem: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  settingText: {
    fontSize: 16,
    color: '#333',
  },
  placeholderText: {
    fontSize: 14,
    color: '#888',
  },
});

export default NotificationSettingsScreen;