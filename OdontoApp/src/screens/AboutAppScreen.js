// screens/AboutAppScreen.js
//teste
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
// import { Ionicons } from '@expo/vector-icons'; // Você pode descomentar se usar ícones aqui

const AboutAppScreen = () => { // Certifique-se que o nome da função é AboutAppScreen
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Image
            source={{ uri: 'https://via.placeholder.com/100' }} // Substitua pelo seu logo
            style={styles.appLogo}
        />
        <Text style={styles.appName}>Odonto Buezzo App</Text>
        <Text style={styles.versionText}>Versão 1.0.0</Text>
        <Text style={styles.descriptionText}>
          Este aplicativo foi desenvolvido para facilitar o agendamento de consultas
          e o acompanhamento dos seus tratamentos na Clínica Odonto Buezzo.
          Agradecemos por utilizar nossos serviços!
        </Text>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Desenvolvido por:</Text>
          <Text style={styles.infoText}>[Seu Nome/Empresa]</Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Contato:</Text>
          <Text style={styles.infoText}>[Seu Contato]</Text>
        </View>

        <Text style={styles.copyRightText}>
          © {new Date().getFullYear()} Odonto Buezzo. Todos os direitos reservados.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  appLogo: {
    width: 100,
    height: 100,
    borderRadius: 20,
    marginBottom: 15,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4B3B56',
    marginBottom: 5,
  },
  versionText: {
    fontSize: 14,
    color: '#777',
    marginBottom: 20,
  },
  descriptionText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  infoSection: {
    marginBottom: 20,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4B3B56',
    marginBottom: 5,
  },
  infoText: {
    fontSize: 16,
    color: '#555',
  },
  copyRightText: {
    fontSize: 12,
    color: '#888',
    marginTop: 30,
    textAlign: 'center',
  },
});

export default AboutAppScreen; // <<--- ESSA LINHA É CRUCIAL E DEVE ESTAR CORRETA