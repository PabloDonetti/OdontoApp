// screens/MeusAgendamentosScreen.js
import React, { useState, useEffect, useMemo, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  StatusBar,
  TouchableOpacity,
  Modal,
  FlatList,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../context/ThemeContext'; // AJUSTE O CAMINHO SE NECESSÁRIO

// --- Componente de Cabeçalho Personalizado (Adaptado para Tema) ---
const CustomHeader = ({ title, onSettingsPress, onLogoutPress }) => {
  const { colors } = useContext(ThemeContext);
  const headerSpecificStyles = themedStyles(colors, null).headerStylesOnly;

  return (
    <View style={headerSpecificStyles.headerContainer}>
      <TouchableOpacity onPress={onSettingsPress} style={headerSpecificStyles.headerButton}>
        <Ionicons name="settings-outline" size={28} color={colors.headerText} />
      </TouchableOpacity>
      <View style={headerSpecificStyles.headerCenterContent}>
        <Text style={headerSpecificStyles.headerTitleText}>{title}</Text>
      </View>
      <TouchableOpacity onPress={onLogoutPress} style={headerSpecificStyles.headerButton}>
        <Ionicons name="exit-outline" size={28} color={colors.headerText} />
      </TouchableOpacity>
    </View>
  );
};

// Funções auxiliares para gerar datas
const getISODateWithOffset = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};

const formatDateForDisplay = (isoDate, includeYear = false) => {
  if (!isoDate) return '';
  const dateParts = isoDate.split('-');
  const date = new Date(Date.UTC(Number(dateParts[0]), Number(dateParts[1]) - 1, Number(dateParts[2])));
  const options = { weekday: 'long', day: '2-digit', month: 'long', timeZone: 'UTC' };
  if (includeYear) {
    options.year = 'numeric';
  }
  return date.toLocaleDateString('pt-BR', options);
};

// Dados mockados para agendamentos
const MOCKED_BOOKINGS_DATA = [
  { id: '1', date: getISODateWithOffset(7), time: '10:00', procedure: 'Limpeza Dental Completa', professional: 'Dr(a). Ana Silva', status: 'Confirmado' },
  { id: '2', date: getISODateWithOffset(-15), time: '14:30', procedure: 'Clareamento Dental a Laser', professional: 'Dr(a). Carlos Lima', status: 'Realizado' },
  { id: '3', date: getISODateWithOffset(2), time: '09:00', procedure: 'Consulta de Avaliação', professional: 'Dr(a). Ana Silva', status: 'Pendente' },
  { id: '4', date: getISODateWithOffset(-30), time: '11:00', procedure: 'Restauração Estética', professional: 'Dr(a). Sofia Costa', status: 'Realizado' },
  { id: '5', date: getISODateWithOffset(1), time: '16:00', procedure: 'Avaliação Ortodôntica', professional: 'Dr(a). Bruno Mendes', status: 'Confirmado' },
  { id: '6', date: getISODateWithOffset(10), time: '08:00', procedure: 'Extração de Siso', professional: 'Dr(a). Carlos Lima', status: 'Cancelado pelo Usuário' },
  { id: '7', date: getISODateWithOffset(-5), time: '17:00', procedure: 'Manutenção Ortodôntica', professional: 'Dr(a). Bruno Mendes', status: 'Realizado' },
];


const MeusAgendamentosScreen = () => {
  const navigation = useNavigation();
  const { theme, actualTheme, colors, setAppTheme } = useContext(ThemeContext);
  const [isSettingsModalVisible, setIsSettingsModalVisible] = useState(false);
  const [isCancelConfirmModalVisible, setIsCancelConfirmModalVisible] = useState(false); // Estado para o modal de sucesso do cancelamento
  const [cancelledAppointmentDetails, setCancelledAppointmentDetails] = useState(null); // Detalhes para o modal

  const [allBookings, setAllBookings] = useState(MOCKED_BOOKINGS_DATA);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [activeFilter, setActiveFilter] = useState('proximos');

  const todayISO = useMemo(() => new Date().toISOString().split('T')[0], []);

  useEffect(() => { /* ... (lógica de carregar e filtrar agendamentos mantida) ... */
    let newFilteredBookings = [];
    if (activeFilter === 'proximos') {
      newFilteredBookings = allBookings
        .filter(b => b.date >= todayISO && b.status !== 'Realizado' && b.status !== 'Cancelado pelo Usuário' && b.status !== 'Cancelado')
        .sort((a, b) => new Date(a.date) - new Date(b.date));
    } else {
      newFilteredBookings = allBookings
        .filter(b => b.date < todayISO || b.status === 'Realizado' || b.status === 'Cancelado pelo Usuário' || b.status === 'Cancelado')
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    setFilteredBookings(newFilteredBookings);
  }, [allBookings, activeFilter, todayISO]);

  const handleLogout = () => navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  const toggleSettingsModal = () => setIsSettingsModalVisible(!isSettingsModalVisible);

  const settingsOptions = [ /* ... (opções do modal de configurações mantidas) ... */
    { id: '1', title: 'Editar Perfil', icon: 'person-circle-outline', action: () => { toggleSettingsModal(); navigation.navigate('EditProfile'); }, color: '#3498db' },
    { id: '2', title: 'Notificações', icon: 'notifications-outline', action: () => { toggleSettingsModal(); navigation.navigate('NotificationSettingsScreen'); }, color: '#2ecc71' },
    { id: '3', title: `Aparência: ${actualTheme === 'dark' ? 'Escuro' : 'Claro'}`, icon: actualTheme === 'dark' ? 'moon-outline' : 'sunny-outline', action: () => { const newThemePreference = actualTheme === 'dark' ? 'light' : 'dark'; setAppTheme(newThemePreference); }, color: '#f39c12', },
    { id: '4', title: 'Sobre o App', icon: 'information-circle-outline', action: () => { toggleSettingsModal(); navigation.navigate('AboutAppScreen'); }, color: '#9b59b6' },
  ];

  const processAndShowCancellationConfirmation = (booking) => {
    // Simula o cancelamento na API e atualiza o estado local
    setAllBookings(prevBookings =>
      prevBookings.map(b =>
        b.id === booking.id ? { ...b, status: 'Cancelado pelo Usuário' } : b
      )
    );
    // Guarda os detalhes para o modal de sucesso
    setCancelledAppointmentDetails({
        date: formatDateForDisplay(booking.date, true),
        time: booking.time,
        procedure: booking.procedure,
    });
    // Abre o modal de confirmação de cancelamento
    setIsCancelConfirmModalVisible(true);
  };


  const handleCancelAppointmentIntent = (booking) => { // Recebe o objeto booking completo
    Alert.alert(
      "Cancelar Agendamento",
      `Tem certeza que deseja cancelar seu agendamento para "${booking.procedure}" no dia ${formatDateForDisplay(booking.date)} às ${booking.time}?`,
      [
        { text: "Não", style: "cancel" },
        {
          text: "Sim, Cancelar",
          style: "destructive",
          onPress: () => processAndShowCancellationConfirmation(booking), // Passa o booking para a próxima função
        },
      ]
    );
  };

  const currentStyles = themedStyles(colors, actualTheme);

  const renderBookingItem = ({ item }) => (
    <View style={currentStyles.bookingItem}>
      <View style={currentStyles.bookingItemHeader}>
        <Text style={currentStyles.bookingProcedure}>{item.procedure}</Text>
        <View style={[currentStyles.statusBadge, currentStyles[`status${item.status.replace(/\s+/g, '').replace(/[().]/g, '')}`]]}>
            <Text style={currentStyles.statusBadgeText}>{item.status}</Text>
        </View>
      </View>
      <View style={currentStyles.bookingItemDetailRow}>
        <Ionicons name="calendar-outline" size={16} color={colors.subtleText} style={currentStyles.detailIcon} />
        <Text style={currentStyles.bookingDateTime}>{formatDateForDisplay(item.date)} às {item.time}</Text>
      </View>
      <View style={currentStyles.bookingItemDetailRow}>
        <Ionicons name="person-outline" size={16} color={colors.subtleText} style={currentStyles.detailIcon} />
        <Text style={currentStyles.bookingProfessional}>{item.professional}</Text>
      </View>
      {(item.status === 'Confirmado' || item.status === 'Pendente') && item.date >= todayISO && (
        <View style={currentStyles.actionsContainer}>
            <TouchableOpacity
                style={[currentStyles.actionButton, currentStyles.cancelButton]}
                onPress={() => handleCancelAppointmentIntent(item)} // Passa o item completo
            >
                <Ionicons name="close-circle-outline" size={18} color={colors.primaryText} style={{marginRight: 5}}/>
                <Text style={currentStyles.actionButtonText}>Cancelar</Text>
            </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={currentStyles.safeArea}>
      <StatusBar barStyle={colors.statusBar} backgroundColor={colors.headerBackground} />
      <CustomHeader
        title="Meus Agendamentos"
        onSettingsPress={toggleSettingsModal}
        onLogoutPress={handleLogout}
      />

      <View style={currentStyles.filterContainer}>
        {/* ... (Botões de filtro mantidos) ... */}
        <TouchableOpacity style={[currentStyles.filterButton, activeFilter === 'proximos' && currentStyles.activeFilterButton]} onPress={() => setActiveFilter('proximos')}>
          <Text style={[currentStyles.filterButtonText, activeFilter === 'proximos' && currentStyles.activeFilterButtonText]}>Próximos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[currentStyles.filterButton, activeFilter === 'anteriores' && currentStyles.activeFilterButton]} onPress={() => setActiveFilter('anteriores')}>
          <Text style={[currentStyles.filterButtonText, activeFilter === 'anteriores' && currentStyles.activeFilterButtonText]}>Anteriores</Text>
        </TouchableOpacity>
      </View>

      {filteredBookings.length === 0 ? (
        <View style={currentStyles.emptyContainer}>
            {/* ... (Conteúdo do estado vazio mantido) ... */}
            <Ionicons name="sad-outline" size={80} color={colors.borderColor} />
            <Text style={currentStyles.emptyText}>{activeFilter === 'proximos' ? "Você não possui próximos agendamentos." : "Não há agendamentos anteriores."}</Text>
            {activeFilter === 'proximos' && ( <TouchableOpacity style={currentStyles.agendarButton} onPress={() => navigation.navigate('Agendamento')}><Ionicons name="add-circle-outline" size={20} color={colors.primaryText} style={{marginRight: 8}} /><Text style={currentStyles.agendarButtonText}>Agendar Nova Consulta</Text></TouchableOpacity>)}
        </View>
      ) : (
        <FlatList
            data={filteredBookings}
            renderItem={renderBookingItem}
            keyExtractor={item => item.id}
            contentContainerStyle={currentStyles.listContainer}
        />
      )}

      {/* Modal de Configurações (mantido) */}
      <Modal animationType="fade" transparent={true} visible={isSettingsModalVisible} onRequestClose={toggleSettingsModal}>
          {/* ... (Conteúdo do modal de configurações como nas outras telas) ... */}
      </Modal>

      {/* NOVO MODAL DE CONFIRMAÇÃO DE CANCELAMENTO */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isCancelConfirmModalVisible}
        onRequestClose={() => setIsCancelConfirmModalVisible(false)}
      >
        <View style={currentStyles.confirmationModalOverlay}>
          <View style={currentStyles.confirmationModalContainer}>
            <Ionicons name="checkmark-circle-outline" size={70} color={colors.primary} /* Ou uma cor de "aviso/info" como laranja/azul */ style={{ marginBottom: 15 }} />
            <Text style={currentStyles.confirmationModalTitle}>Agendamento Cancelado</Text>
            {cancelledAppointmentDetails && (
              <>
                <Text style={currentStyles.confirmationModalText}>O agendamento para</Text>
                <Text style={currentStyles.confirmationModalDetailProcedure}>{cancelledAppointmentDetails.procedure}</Text>
                <Text style={currentStyles.confirmationModalText}>no dia <Text style={currentStyles.confirmationModalDetailBold}>{cancelledAppointmentDetails.date}</Text></Text>
                <Text style={currentStyles.confirmationModalText}>às <Text style={currentStyles.confirmationModalDetailBold}>{cancelledAppointmentDetails.time}</Text> foi cancelado.</Text>
              </>
            )}
            <Text style={currentStyles.confirmationModalSubText}>
                Se precisar, você pode realizar um novo agendamento.
            </Text>
            <TouchableOpacity
              style={currentStyles.confirmationModalCloseButton}
              onPress={() => setIsCancelConfirmModalVisible(false)}
            >
              <Text style={currentStyles.confirmationModalCloseButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// Os estilos agora são uma FUNÇÃO que recebe as cores do tema e o tema atual
const themedStyles = (colors, actualTheme) => StyleSheet.create({
  // ... (TODOS os estilos da MeusAgendamentosScreen da resposta anterior, incluindo safeArea, headerStylesOnly, filterContainer, bookingItem, emptyContainer, modalOverlay, etc.)
  // Adicionar/Ajustar os estilos para o NOVO MODAL DE CONFIRMAÇÃO DE CANCELAMENTO (serão muito similares aos de confirmação de agendamento)
  safeArea: { flex: 1, backgroundColor: colors.background },
  headerStylesOnly: { headerContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 5 : (Platform.OS === 'ios' ? 44 : 20), paddingBottom: 10, backgroundColor: colors.headerBackground }, headerButton: { padding: 8 }, headerCenterContent: { flex: 1, alignItems: 'center', marginHorizontal: 10 }, headerTitleText: { color: colors.headerText, fontSize: 18, fontWeight: 'bold' },},
  filterContainer: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: colors.card, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.borderColor,},
  filterButton: { paddingVertical: 8, paddingHorizontal: 25, borderRadius: 20,},
  activeFilterButton: { backgroundColor: colors.primary,},
  filterButtonText: { fontSize: 15, fontWeight: '600', color: colors.primary,},
  activeFilterButtonText: { color: colors.primaryText,},
  listContainer: { padding: 15, },
  bookingItem: { backgroundColor: colors.card, borderRadius: 10, padding: 18, marginBottom: 18, shadowColor: actualTheme === 'dark' ? colors.subtleText : '#000000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: actualTheme === 'dark' ? 0.25 : 0.08, shadowRadius: 5, elevation: 3, borderWidth: actualTheme === 'dark' ? 1 : 0, borderColor: colors.borderColor,},
  bookingItemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10,},
  bookingProcedure: { fontSize: 17, fontWeight: 'bold', color: colors.primary, flex: 1, marginRight: 10,},
  statusBadge: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 15,},
  statusBadgeText: { fontSize: 12, color: '#FFFFFF', fontWeight: '600',},
  statusConfirmado: { backgroundColor: '#28a745' },
  statusPendente: { backgroundColor: '#f0ad4e' },
  statusRealizado: { backgroundColor: '#5bc0de' },
  statusCancelado: { backgroundColor: '#777777' }, // Cinza para cancelado pelo sistema/clínica
  statusCanceladopeloUsuário: { backgroundColor: '#d9534f' }, // Vermelho para cancelado pelo usuário

  bookingItemDetailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 7,},
  detailIcon: { marginRight: 10,},
  bookingDateTime: { fontSize: 14, color: colors.text },
  bookingProfessional: { fontSize: 14, color: colors.subtleText, fontStyle: 'italic' },
  actionsContainer: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 15, paddingTop: 15, borderTopWidth: 1, borderTopColor: colors.borderColor,},
  actionButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 18, borderRadius: 25, marginLeft: 10,},
  cancelButton: { backgroundColor: '#d9534f',},
  actionButtonText: { color: colors.primaryText, fontSize: 14, fontWeight: '600',},
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, marginTop: 30 },
  emptyText: { fontSize: 17, color: colors.subtleText, textAlign: 'center', marginTop: 20, marginBottom: 25, lineHeight: 24 },
  agendarButton: { flexDirection: 'row', backgroundColor: colors.primary, paddingVertical: 14, paddingHorizontal: 30, borderRadius: 25, alignItems: 'center' },
  agendarButtonText: { color: colors.primaryText, fontSize: 16, fontWeight: 'bold' },

  // Estilos do Modal de Configurações
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.65)' },
  modalContentContainer: { width: '90%', maxWidth: 400, backgroundColor: colors.card, borderRadius: 15, paddingVertical: 20, elevation: 10, shadowColor: actualTheme === 'dark' ? colors.subtleText : '#000000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.30, shadowRadius: 8 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: colors.primary, textAlign: 'center', marginBottom: 20, paddingHorizontal: 20 },
  modalOptionButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 20 },
  modalIconContainer: { width: 36, height: 36, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 18 },
  modalOptionText: { flex: 1, fontSize: 16, color: colors.text },
  modalSeparator: { height: 1, backgroundColor: colors.borderColor, marginLeft: 20 + 36 + 18 },
  modalCloseButton: { marginTop: 20, paddingVertical: 15, paddingHorizontal: 20, backgroundColor: colors.inputBackground, alignItems: 'center', borderBottomLeftRadius: 15, borderBottomRightRadius: 15, borderTopWidth: 1, borderTopColor: colors.borderColor},
  modalCloseButtonText: { fontSize: 17, color: colors.primary, fontWeight: '600' },

  // Estilos para o Modal de Confirmação de Cancelamento
  confirmationModalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.7)'},
  confirmationModalContainer: { width: '85%', maxWidth: 360, backgroundColor: colors.card, borderRadius: 15, padding: 25, alignItems: 'center', elevation: 12, shadowColor: actualTheme === 'dark' ? colors.subtleText : '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  confirmationModalTitle: { fontSize: 22, fontWeight: 'bold', color: colors.primary, textAlign: 'center', marginBottom: 10 },
  confirmationModalText: { fontSize: 16, color: colors.text, textAlign: 'center', lineHeight: 24, marginBottom: 5 },
  confirmationModalDetailProcedure: { fontSize: 17, fontWeight: '600', color: colors.accent || colors.primary, textAlign: 'center', marginVertical: 5 },
  confirmationModalDetailBold: { fontWeight: 'bold', color: colors.text },
  confirmationModalSubText: { fontSize: 14, color: colors.subtleText, textAlign: 'center', marginTop: 15, marginBottom: 25 },
  confirmationModalCloseButton: { backgroundColor: colors.primary, paddingVertical: 12, paddingHorizontal: 40, borderRadius: 25, marginTop: 10 },
  confirmationModalCloseButtonText: { color: colors.primaryText, fontSize: 16, fontWeight: 'bold' },
});

export default MeusAgendamentosScreen;