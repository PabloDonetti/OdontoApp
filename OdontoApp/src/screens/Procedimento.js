// screens/ProcedimentoScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image, // Se for usar imagens nos cards de procedimento
  StyleSheet,
  TouchableOpacity,
  FlatList, // Para listar os procedimentos
  Platform,
  StatusBar,
  Modal,
  SafeAreaView,
  Alert, // Para ações de "Saiba Mais" (exemplo)
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// --- Componente de Cabeçalho Personalizado ---
// (Pode ser o mesmo usado em outras telas ou definido aqui)
const CustomHeader = ({ title, onSettingsPress, onLogoutPress }) => (
  <View style={styles.headerContainer}>
    <TouchableOpacity onPress={onSettingsPress} style={styles.headerButton}>
      <Ionicons name="settings-outline" size={28} color="white" />
    </TouchableOpacity>
    <View style={styles.headerCenterContent}>
      {/* Opcional: Adicionar logo aqui se desejar, como na HomeScreen */}
      {/* <Image source={require('../assets/logo_branca.png')} style={styles.headerLogo} /> */}
      <Text style={styles.headerTitleText}>{title}</Text>
    </View>
    <TouchableOpacity onPress={onLogoutPress} style={styles.headerButton}>
      <Ionicons name="exit-outline" size={28} color="white" />
    </TouchableOpacity>
  </View>
);

// Dados mockados para os procedimentos com mais detalhes
const PROCEDURES_DATA = [
  {
    id: '1',
    icon: 'happy-outline', // Ícone Ionicons
    name: 'Limpeza Dental (Profilaxia)',
    shortDesc: 'Remoção completa de placa bacteriana, tártaro e manchas, seguida de polimento para dentes mais saudáveis e brilhantes.',
    // fullDesc: 'Descrição detalhada da profilaxia...',
    // priceRange: 'A partir de R$ 150',
    // duration: '~45 min',
  },
  {
    id: '2',
    icon: 'sunny-outline',
    name: 'Clareamento Dental',
    shortDesc: 'Técnicas seguras e eficazes para clarear o esmalte dental, proporcionando um sorriso visivelmente mais branco.',
  },
  {
    id: '3',
    icon: 'build-outline',
    name: 'Restaurações (Obturações)',
    shortDesc: 'Reparo de dentes afetados por cáries ou fraturas, utilizando materiais estéticos e resistentes como resina composta.',
  },
  {
    id: '4',
    icon: 'pulse-outline',
    name: 'Tratamento de Canal (Endodontia)',
    shortDesc: 'Tratamento da parte interna do dente (polpa) para salvar dentes infectados ou inflamados, aliviando a dor.',
  },
  {
    id: '5',
    icon: 'trending-up-outline', // Exemplo de ícone, pode ser mais específico
    name: 'Implantes Dentários',
    shortDesc: 'Solução moderna e duradoura para a substituição de dentes perdidos, restaurando função e estética.',
  },
  {
    id: '6',
    icon: 'apps-outline', // Exemplo
    name: 'Ortodontia (Aparelhos)',
    shortDesc: 'Correção do alinhamento dental e problemas de mordida com diversos tipos de aparelhos ortodônticos.',
  },
  {
    id: '7',
    icon: 'layers-outline', // Exemplo
    name: 'Próteses Dentárias',
    shortDesc: 'Reabilitação oral com coroas, pontes ou dentaduras para devolver a função mastigatória e a beleza do sorriso.',
  },
];

const ProcedimentoScreen = () => {
  const navigation = useNavigation();
  const [isSettingsModalVisible, setIsSettingsModalVisible] = useState(false);

  const handleLogout = () => {
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  const toggleSettingsModal = () => {
    setIsSettingsModalVisible(!isSettingsModalVisible);
  };

  // Opções do modal de configurações
  const settingsOptions = [
    { id: '1', title: 'Editar Perfil', icon: 'person-circle-outline', action: () => { toggleSettingsModal(); navigation.navigate('EditProfile'); }, color: '#3498db' },
    { id: '2', title: 'Notificações', icon: 'notifications-outline', action: () => { toggleSettingsModal(); navigation.navigate('NotificationSettingsScreen'); }, color: '#2ecc71' },
    { id: '3', title: 'Aparência (Tema)', icon: 'contrast-outline', action: () => { toggleSettingsModal(); console.log('Aparência'); }, color: '#f39c12' },
    { id: '4', title: 'Sobre o App', icon: 'information-circle-outline', action: () => { toggleSettingsModal(); navigation.navigate('AboutAppScreen'); }, color: '#9b59b6' },
  ];

  const handleSaibaMais = (procedure) => {
    Alert.alert(
      procedure.name,
      procedure.shortDesc + "\n\n(Em uma versão completa, esta ação poderia navegar para uma tela com todos os detalhes, vídeos, FAQs, etc sobre o procedimento.)"
    );
    // Em uma implementação real:
    // navigation.navigate('ProcedureDetailScreen', { procedureId: procedure.id });
  };

  const handleAgendarProcedimento = (procedure) => {
    // Navega para a tela de agendamento, opcionalmente passando o nome do procedimento
    navigation.navigate('Agendamento', { preselectedProcedure: procedure.name });
    Alert.alert("Agendar Procedimento", `Você será redirecionado para agendar: ${procedure.name}`);
  };


  const renderProcedureItem = ({ item }) => (
    <View style={styles.procedureCard}>
      <View style={styles.procedureCardHeader}>
        <View style={styles.procedureIconContainer}>
            <Ionicons name={item.icon} size={26} color="#FFFFFF" />
        </View>
        <Text style={styles.procedureName}>{item.name}</Text>
      </View>
      <Text style={styles.procedureDescription}>{item.shortDesc}</Text>
      <View style={styles.procedureActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.saibaMaisButton]}
          onPress={() => handleSaibaMais(item)}
          activeOpacity={0.7}
        >
          <Ionicons name="information-circle-outline" size={18} color="#4B3B56" style={{marginRight: 5}}/>
          <Text style={styles.saibaMaisButtonText}>Saiba Mais</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.agendarProcButton]}
          onPress={() => handleAgendarProcedimento(item)}
          activeOpacity={0.7}
        >
          <Ionicons name="calendar-outline" size={18} color="#FFFFFF" style={{marginRight: 5}}/>
          <Text style={styles.agendarProcButtonText}>Agendar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={PROCEDURES_DATA}
        renderItem={renderProcedureItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContentContainer}
        ListHeaderComponent={
          <Text style={styles.screenIntroText}>
            Conheça os tratamentos que oferecemos para transformar o seu sorriso e cuidar da sua saúde bucal.
          </Text>
        }
        ListFooterComponent={<View style={{ height: 20 }} />} // Espaço no final da lista
      />

      {/* Modal de Configurações */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isSettingsModalVisible}
        onRequestClose={toggleSettingsModal}
      >
        <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPressOut={toggleSettingsModal}
        >
            <View style={styles.modalContentContainer} onStartShouldSetResponder={() => true}>
                <Text style={styles.modalTitle}>Configurações</Text>
                {settingsOptions.map((option, index) => (
                <React.Fragment key={option.id}>
                    <TouchableOpacity style={styles.modalOptionButton} onPress={option.action}>
                    <View style={[styles.modalIconContainer, { backgroundColor: option.color || '#cccccc' }]}>
                        <Ionicons name={option.icon} size={20} color="white" />
                    </View>
                    <Text style={styles.modalOptionText}>{option.title}</Text>
                    <Ionicons name="chevron-forward-outline" size={20} color="#A0A0A0" />
                    </TouchableOpacity>
                    {index < settingsOptions.length - 1 && <View style={styles.modalSeparator} />}
                </React.Fragment>
                ))}
                <TouchableOpacity style={styles.modalCloseButton} onPress={toggleSettingsModal}>
                    <Text style={styles.modalCloseButtonText}>Fechar</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F6F8', // Fundo geral da tela
  },
  // Estilos do Header
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 5 : (Platform.OS === 'ios' ? 44 : 20),
    paddingBottom: 10,
    backgroundColor: '#4B3B56', // Cor principal do tema
  },
  headerButton: {
    padding: 8,
  },
  headerCenterContent: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 10,
    // Se for adicionar logo: flexDirection: 'row', justifyContent: 'center'
  },
  // headerLogo: { width: 30, height: 30, resizeMode: 'contain', marginRight: 8 },
  headerTitleText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },

  // Estilos da Lista e Itens de Procedimento
  listContentContainer: {
    paddingHorizontal: 15,
    paddingTop: 20,
  },
  screenIntroText: {
    fontSize: 16,
    color: '#4A5568', // Cinza escuro para texto
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  procedureCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 18,
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1, // Sombra mais sutil
    shadowRadius: 6,
    elevation: 4,
  },
  procedureCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  procedureIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 21, // Círculo
    backgroundColor: '#6D5B7E', // Tom de roxo do tema
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  procedureName: {
    flex: 1, // Para o texto quebrar linha se for longo
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4B3B56', // Cor principal do tema
  },
  procedureDescription: {
    fontSize: 15,
    color: '#555555',
    lineHeight: 22, // Melhor legibilidade
    marginBottom: 15,
  },
  procedureActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end', // Alinha botões à direita
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 15,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20, // Botões mais arredondados
    marginLeft: 10,
  },
  saibaMaisButton: {
    backgroundColor: '#E8EAF6', // Lilás bem claro ou cinza azulado
  },
  saibaMaisButtonText: {
    color: '#4B3B56', // Roxo escuro
    fontSize: 14,
    fontWeight: '600',
  },
  agendarProcButton: {
    backgroundColor: '#4B3B56', // Roxo principal
  },
  agendarProcButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  // Estilos do Modal (consistentes com outras telas)
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.65)' },
  modalContentContainer: { width: '90%', maxWidth: 400, backgroundColor: '#FFFFFF', borderRadius: 15, paddingVertical: 20, elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.30, shadowRadius: 8 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#4B3B56', textAlign: 'center', marginBottom: 20, paddingHorizontal: 20 },
  modalOptionButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 20 },
  modalIconContainer: { width: 36, height: 36, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 18 },
  modalOptionText: { flex: 1, fontSize: 16, color: '#333333' },
  modalSeparator: { height: 1, backgroundColor: '#F0F0F0', marginLeft: 20 + 36 + 18 },
  modalCloseButton: { marginTop: 20, paddingVertical: 15, paddingHorizontal: 20, backgroundColor: '#EFEFEF', alignItems: 'center', borderBottomLeftRadius: 15, borderBottomRightRadius: 15, borderTopWidth: 1, borderTopColor: '#DADADA'},
  modalCloseButtonText: { fontSize: 17, color: '#4B3B56', fontWeight: '600' },
});

export default ProcedimentoScreen;