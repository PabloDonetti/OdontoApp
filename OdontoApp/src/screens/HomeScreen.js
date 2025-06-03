// screens/HomeScreen.js
import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  StatusBar,
  Modal,
  Linking,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../context/ThemeContext';

// Componente InfoCard (mantido como na versão anterior)
const InfoCard = ({ icon, title, subtitle, onPress, customBackgroundColor, iconBackgroundColor, titleColor, subtitleColor }) => {
  const { colors, actualTheme } = useContext(ThemeContext);
  const cardStyles = themedStyles(colors, actualTheme);

  return (
    <TouchableOpacity
      style={[cardStyles.card, { backgroundColor: customBackgroundColor || colors.card }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[cardStyles.cardIconContainer, icon && { backgroundColor: iconBackgroundColor || colors.primary }]}>
        {icon && <Ionicons name={icon} size={28} color={colors.primaryText} />}
      </View>
      <View style={cardStyles.cardTextContainer}>
        <Text style={[cardStyles.cardTitle, { color: titleColor || colors.text }]}>{title}</Text>
        {subtitle && <Text style={[cardStyles.cardSubtitle, { color: subtitleColor || colors.subtleText }]}>{subtitle}</Text>}
      </View>
      <Ionicons name="chevron-forward-outline" size={24} color={subtitleColor || colors.subtleText} />
    </TouchableOpacity>
  );
};


const HomeScreen = () => {
  const navigation = useNavigation();
  const { theme, actualTheme, colors, setAppTheme } = useContext(ThemeContext);
  const [isSettingsModalVisible, setIsSettingsModalVisible] = useState(false);
  const [userName, setUserName] = useState('Cliente');

  useEffect(() => { /* ... carregar nome ... */ }, []);

  const handleLogout = () => navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  const toggleSettingsModal = () => setIsSettingsModalVisible(!isSettingsModalVisible);

  const settingsOptions = [
    { id: '1', title: 'Editar Perfil', icon: 'person-circle-outline', action: () => { toggleSettingsModal(); navigation.navigate('EditProfile'); }, color: '#3498db' },
    { id: '2', title: 'Notificações', icon: 'notifications-outline', action: () => { toggleSettingsModal(); navigation.navigate('NotificationSettingsScreen'); }, color: '#2ecc71' },
    { id: '3', title: `Aparência: ${actualTheme === 'dark' ? 'Escuro' : 'Claro'}`, icon: actualTheme === 'dark' ? 'moon-outline' : 'sunny-outline', action: () => { const newThemePreference = actualTheme === 'dark' ? 'light' : 'dark'; setAppTheme(newThemePreference); }, color: '#f39c12',},
    { id: '4', title: 'Sobre o App', icon: 'information-circle-outline', action: () => { toggleSettingsModal(); navigation.navigate('AboutAppScreen'); }, color: '#9b59b6' },
  ];

  const quickActionsData = [
    { id: '1', titleLine1: 'Dicas de', titleLine2: 'Saúde', icon: 'fitness-outline', action: () => Alert.alert("Dicas de Saúde", "Seção de dicas em breve!"), cardColorParam: colors.accent, textColorParam: colors.accentText },
    { id: '2', titleLine1: 'Agendar', titleLine2: 'Consulta', icon: 'calendar-sharp', screen: 'Agendamento', cardColorParam: colors.primary, textColorParam: colors.primaryText },
    { id: '3', titleLine1: 'Fale', titleLine2: 'Conosco', icon: 'call-outline', action: () => Linking.openURL('tel:+553412345678'), cardColorParam: colors.accent, textColorParam: colors.accentText }
  ];

  const currentStyles = themedStyles(colors, actualTheme);

  return (
    <View style={currentStyles.container}>
      <StatusBar barStyle={colors.statusBar} backgroundColor={colors.headerBackground} />
      <View style={currentStyles.header}>
        <TouchableOpacity onPress={toggleSettingsModal} style={currentStyles.headerButton}>
          <Ionicons name="settings-outline" size={28} color={colors.headerText} />
        </TouchableOpacity>
        <View style={currentStyles.headerCenterContent}>
          <Image source={require('../assets/icon.png')} style={currentStyles.logo}/>
          <Text style={currentStyles.headerText}>Odonto Buezzo</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={currentStyles.headerButton}>
          <Ionicons name="exit-outline" size={28} color={colors.headerText} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={currentStyles.scrollContent}>
        <View style={currentStyles.welcomeSection}>
          <Text style={currentStyles.welcomeTitle}>Olá, {userName}!</Text>
          <Text style={currentStyles.welcomeSubtitle}>Como podemos cuidar do seu sorriso hoje?</Text>
        </View>

        {/* Imagem Hero. O TouchableOpacity continua aqui se você quiser que a imagem seja clicável */}
        <TouchableOpacity onPress={() => navigation.navigate('Agendamento')} activeOpacity={0.9}>
            <Image source={require('../assets/paciente.jpg')} style={currentStyles.heroImage}/>
        </TouchableOpacity>

        {/* Ações Rápidas com margem superior negativa para sobrepor a imagem */}
        <View style={currentStyles.quickActionsContainer}>
          {quickActionsData.map(action => (
            <TouchableOpacity
              key={action.id}
              style={[currentStyles.quickActionButton, { backgroundColor: action.cardColorParam }]}
              onPress={() => action.screen ? navigation.navigate(action.screen) : action.action()}
              activeOpacity={0.7}
            >
              <Ionicons name={action.icon} size={36} color={action.textColorParam} />
              <Text style={[currentStyles.quickActionText, { color: action.textColorParam }]}>{action.titleLine1}</Text>
              {action.titleLine2 && <Text style={[currentStyles.quickActionText, { color: action.textColorParam }]}>{action.titleLine2}</Text>}
            </TouchableOpacity>
          ))}
        </View>

        {/* Seção de Informações com Cards */}
        <View style={currentStyles.infoSection}>
          <Text style={currentStyles.sectionHeaderTitle}>Conheça Mais</Text>
          <InfoCard
            icon="medkit-outline" title="Nossos Procedimentos"
            subtitle="Veja os tratamentos e especialidades que oferecemos."
            onPress={() => navigation.navigate('Procedimentos')}
            iconBackgroundColor={colors.accent}
          />
          <InfoCard
            icon="business-outline" title="Nossa Clínica"
            subtitle="Equipe especializada e ambiente acolhedor para o seu tratamento."
            onPress={() => Alert.alert("Sobre a Clínica", "Informações detalhadas sobre a clínica aqui.")}
            iconBackgroundColor={colors.accent}
          />
           <InfoCard
            icon="fitness-outline" title="Dicas de Saúde Bucal"
            subtitle="Mantenha seu sorriso saudável com nossas orientações."
            onPress={() => Alert.alert("Dicas de Saúde", "Seção de dicas e artigos em breve!")}
            iconBackgroundColor={'#5cb85c'}
          />
          <InfoCard
            icon="call-outline" title="Fale Conosco"
            subtitle="Tire suas dúvidas ou envie sugestões para nossa equipe."
            onPress={() => { Alert.alert( "Fale Conosco", "Como você prefere entrar em contato?", [ { text: "Ligar", onPress: () => Linking.openURL('tel:+553412345678') }, { text: "WhatsApp", onPress: () => Linking.openURL('https://wa.me/5534912345678') }, { text: "Cancelar", style: "cancel" } ]); }}
            iconBackgroundColor={'#5bc0de'}
          />
        </View>
      </ScrollView>

      {/* Modal de Configurações (mantido) */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isSettingsModalVisible}
        onRequestClose={toggleSettingsModal}
      >
        <TouchableOpacity style={currentStyles.modalOverlay} activeOpacity={1} onPressOut={toggleSettingsModal}>
            <View style={currentStyles.modalContentContainer} onStartShouldSetResponder={() => true}>
                <Text style={currentStyles.modalTitle}>Configurações</Text>
                {settingsOptions.map((option, index) => (
                <React.Fragment key={option.id}>
                    <TouchableOpacity style={currentStyles.modalOptionButton} onPress={option.action}>
                    <View style={[currentStyles.modalIconContainer, { backgroundColor: option.color || colors.primary }]}>
                        <Ionicons name={option.icon} size={20} color={colors.primaryText} />
                    </View>
                    <Text style={currentStyles.modalOptionText}>{option.title}</Text>
                    <Ionicons name="chevron-forward-outline" size={20} color={colors.subtleText} />
                    </TouchableOpacity>
                    {index < settingsOptions.length - 1 && <View style={currentStyles.modalSeparator} />}
                </React.Fragment>
                ))}
                <TouchableOpacity style={currentStyles.modalCloseButton} onPress={toggleSettingsModal}>
                    <Text style={currentStyles.modalCloseButtonText}>Fechar</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

// Os estilos agora são uma FUNÇÃO que recebe as cores do tema e o tema atual
const themedStyles = (colors, actualTheme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : (Platform.OS === 'ios' ? 50 : 30), paddingBottom: 15, backgroundColor: colors.headerBackground, borderBottomLeftRadius: Platform.OS === 'ios' ? 20 : 0, borderBottomRightRadius: Platform.OS === 'ios' ? 20 : 0 },
  headerButton: { padding: 8 },
  headerCenterContent: { flex: 1, alignItems: 'center', marginHorizontal: 5, flexDirection: 'row', justifyContent: 'center' },
  logo: { width: 32, height: 32, resizeMode: 'contain', marginRight: 10 },
  headerText: { color: colors.headerText, fontSize: 18, fontWeight: 'bold' },
  scrollContent: { paddingBottom: 30 },
  welcomeSection: { paddingHorizontal: 20, paddingTop: 25, paddingBottom: 20, backgroundColor: colors.card },
  welcomeTitle: { fontSize: 26, fontWeight: 'bold', color: colors.primary, marginBottom: 5 },
  welcomeSubtitle: { fontSize: 16, color: colors.subtleText, lineHeight: 22 },
  
  heroImage: { 
    width: '100%',
    height: 240, // Aumente a altura da imagem para que haja "espaço" para os botões sobreporem
    resizeMode: 'cover', 
    backgroundColor: colors.borderColor,
    // Não precisa de marginBottom, pois o quickActionsContainer será puxado para cima
  },
  quickActionsContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    paddingHorizontal: 10,
    paddingVertical: 20, // Padding interno para os botões
    backgroundColor: 'transparent', // O container em si pode ser transparente
    marginTop: -60, // <<--- ESSA É A MÁGICA! Puxa para cima sobre a imagem. Ajuste o valor.
    // O valor negativo deve ser aproximadamente a altura que você quer de sobreposição
    // menos o padding vertical do próprio container, ou um pouco menos que a altura dos botões.
    // Ex: se os botões têm 100 de altura e paddingVertical: 20 (total 40),
    // um marginTop de -50 ou -60 fará uma boa sobreposição.
    // Ajuste este valor para obter o efeito visual desejado.
    marginBottom: 15, // Espaço antes da próxima seção (InfoCards)
  },
  quickActionButton: { alignItems: 'center', justifyContent: 'space-between', paddingVertical: 15, paddingHorizontal: 5, borderRadius: 18, width: Platform.OS === 'ios' ? 105 : 100, height: Platform.OS === 'ios' ? 105 : 100, shadowColor: actualTheme === 'dark' ? colors.subtleText : '#000000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.25, shadowRadius: 5, elevation: 6, marginHorizontal: 5 }, // Sombra um pouco mais forte
  quickActionText: { fontSize: 12.5, fontWeight: '600', marginTop: 10, textAlign: 'center', lineHeight: 15 },
  
  infoSection: { 
    // marginTop foi removido daqui, pois o quickActionsContainer agora tem marginBottom
    paddingHorizontal: 15 
  },
  sectionHeaderTitle: { fontSize: 20, fontWeight: 'bold', color: colors.primary, marginBottom: 15, paddingHorizontal: 5 },
  card: { flexDirection: 'row', alignItems: 'center', padding: 15, borderRadius: 12, marginBottom: 15, shadowColor: actualTheme === 'dark' ? colors.subtleText : '#000000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: actualTheme === 'dark' ? 0.2 : 0.07, shadowRadius: 4, elevation: 3, borderWidth: 1, borderColor: colors.borderColor },
  cardIconContainer: { width: 45, height: 45, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  cardTextContainer: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  cardSubtitle: { fontSize: 14, lineHeight: 20 },
  
  // Estilos do Modal (mantidos consistentes)
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.65)' },
  modalContentContainer: { width: '90%', maxWidth: 400, backgroundColor: colors.card, borderRadius: 15, paddingVertical: 20, elevation: 10, shadowColor: actualTheme === 'dark' ? colors.subtleText : '#000000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.30, shadowRadius: 8 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: colors.primary, textAlign: 'center', marginBottom: 20, paddingHorizontal: 20 },
  modalOptionButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 20 },
  modalIconContainer: { width: 36, height: 36, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 18 },
  modalOptionText: { flex: 1, fontSize: 16, color: colors.text },
  modalSeparator: { height: 1, backgroundColor: colors.borderColor, marginLeft: 20 + 36 + 18 },
  modalCloseButton: { marginTop: 20, paddingVertical: 15, paddingHorizontal: 20, backgroundColor: colors.inputBackground, alignItems: 'center', borderBottomLeftRadius: 15, borderBottomRightRadius: 15, borderTopWidth: 1, borderTopColor: colors.borderColor},
  modalCloseButtonText: { fontSize: 17, color: colors.primary, fontWeight: '600' },
});

export default HomeScreen;