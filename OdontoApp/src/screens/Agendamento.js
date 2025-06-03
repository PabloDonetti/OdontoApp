// screens/Agendamento.js
import React, { useState, useEffect, useMemo, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Calendar } from 'react-native-calendars'; // LocaleConfig é configurado no App.js
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../context/ThemeContext'; // AJUSTE O CAMINHO SE NECESSÁRIO

// ***** INÍCIO DAS DEFINIÇÕES IMPORTANTES NO TOPO DO ARQUIVO *****
// Função para gerar datas futuras para o MOCK_AVAILABLE_TIMES
const getISODateWithOffset = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0]; // Formato 'AAAA-MM-DD'
};

// Horários disponíveis mockados (com datas futuras)
const MOCK_AVAILABLE_TIMES = {
  [getISODateWithOffset(1)]: ['09:00', '09:30', '10:00', '14:00', '14:30'],
  [getISODateWithOffset(2)]: ['10:30', '11:00', '11:30', '15:00', '16:00'],
  [getISODateWithOffset(3)]: [], // Dia sem horários
  [getISODateWithOffset(5)]: ['09:00', '11:00', '14:00', '16:30'],
  [getISODateWithOffset(7)]: ['10:00', '10:30', '11:00', '11:30', '12:00'],
};
// ***** FIM DAS DEFINIÇÕES IMPORTANTES *****

// --- Componente de Cabeçalho Personalizado (Adaptado para Tema) ---
const CustomHeader = ({ title, onSettingsPress, onLogoutPress }) => {
  const { colors } = useContext(ThemeContext);
  // Usamos actualTheme = null aqui porque os estilos do header não dependem de sombras condicionais ao tema.
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

const formatDateForDisplay = (isoDate, includeYear = false) => {
  if (!isoDate) return '';
  const dateParts = isoDate.split('-');
  const date = new Date(Date.UTC(Number(dateParts[0]), Number(dateParts[1]) - 1, Number(dateParts[2])));
  const options = { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' };
  if (includeYear) {
    options.year = 'numeric';
  }
  return date.toLocaleDateString('pt-BR', options);
};

const AgendamentoScreen = () => {
  const navigation = useNavigation();
  const { theme, actualTheme, colors, setAppTheme } = useContext(ThemeContext);
  const [isSettingsModalVisible, setIsSettingsModalVisible] = useState(false);
  const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);

  const todayString = useMemo(() => new Date().toISOString().split('T')[0], []);

  const [selectedDate, setSelectedDate] = useState('');
  const [markedDates, setMarkedDates] = useState({});
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [confirmedAppointmentDetails, setConfirmedAppointmentDetails] = useState(null);
  const [showTimeSlots, setShowTimeSlots] = useState(false);
  const [isLoadingTimes, setIsLoadingTimes] = useState(false);
  const [currentCalendarMonth, setCurrentCalendarMonth] = useState(todayString.slice(0, 7));

  useEffect(() => {
    const initialMarkedDates = {};
    Object.keys(MOCK_AVAILABLE_TIMES).forEach(date => {
      if (MOCK_AVAILABLE_TIMES[date] && MOCK_AVAILABLE_TIMES[date].length > 0) {
        if (date >= todayString) {
            initialMarkedDates[date] = { marked: true, dotColor: '#2ecc71' };
        }
      }
    });
    if (initialMarkedDates[todayString]) {
        initialMarkedDates[todayString].today = true;
    } else {
        initialMarkedDates[todayString] = { today: true };
    }
    setMarkedDates(initialMarkedDates);
  }, [todayString]);

  const handleLogout = () => navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  const toggleSettingsModal = () => setIsSettingsModalVisible(!isSettingsModalVisible);

  const settingsOptions = [
    { id: '1', title: 'Editar Perfil', icon: 'person-circle-outline', action: () => { toggleSettingsModal(); navigation.navigate('EditProfile'); }, color: '#3498db' },
    { id: '2', title: 'Notificações', icon: 'notifications-outline', action: () => { toggleSettingsModal(); navigation.navigate('NotificationSettingsScreen'); }, color: '#2ecc71' },
    {
      id: '3',
      title: `Aparência: ${actualTheme === 'dark' ? 'Escuro' : 'Claro'}`,
      icon: actualTheme === 'dark' ? 'moon-outline' : 'sunny-outline',
      action: () => {
        const newThemePreference = actualTheme === 'dark' ? 'light' : 'dark';
        setAppTheme(newThemePreference);
      },
      color: '#f39c12',
    },
    { id: '4', title: 'Sobre o App', icon: 'information-circle-outline', action: () => { toggleSettingsModal(); navigation.navigate('AboutAppScreen'); }, color: '#9b59b6' },
  ];

  const onDayPress = (day) => {
    if (day.dateString < todayString) return;
    const dateString = day.dateString;
    setSelectedDate(dateString);
    const newMarkedDates = { ...markedDates };
    Object.keys(newMarkedDates).forEach(key => {
      if (newMarkedDates[key]?.selected) {
        delete newMarkedDates[key].selected;
        delete newMarkedDates[key].selectedColor;
        if (!newMarkedDates[key].marked && !newMarkedDates[key].today) delete newMarkedDates[key];
      }
    });
    newMarkedDates[dateString] = {
      ...(newMarkedDates[dateString] || {}),
      selected: true,
      selectedColor: colors.primary,
      disableTouchEvent: MOCK_AVAILABLE_TIMES[dateString]?.length === 0,
    };
    setMarkedDates(newMarkedDates);
    setIsLoadingTimes(true); setAvailableTimes([]); setSelectedTime('');
    setTimeout(() => {
      const times = MOCK_AVAILABLE_TIMES[dateString] || [];
      setAvailableTimes(times); setShowTimeSlots(true); setIsLoadingTimes(false);
    }, 300);
  };

  const handleTimeSelection = (time) => setSelectedTime(time);

  const processAndShowConfirmation = () => {
    console.log(`AGENDAMENTO SIMULADO CONFIRMADO: Data - ${selectedDate}, Horário - ${selectedTime}`);
    let procedureName = 'Consulta Padrão'; // Valor padrão
    // Tenta obter o parâmetro de navegação. Requer React Navigation v5+
    // Em versões mais antigas, seria navigation.getParam('preselectedProcedure', 'Consulta Padrão')
    // Para v5/v6, você normalmente passaria params para a rota e os acessaria via `route.params`
    // Aqui, vamos simular que poderia vir de um estado ou prop, se não via route.params.
    // Se você navega para Agendamento com params, use: const { preselectedProcedure } = route.params;
    // Por ora, vamos manter um placeholder ou você pode adicionar lógica para buscar de `route.params`.
    // const preselectedProcedureFromParams = navigation.state?.params?.preselectedProcedure; // Exemplo para v4
    // if(preselectedProcedureFromParams) procedureName = preselectedProcedureFromParams;

    setConfirmedAppointmentDetails({
        date: formatDateForDisplay(selectedDate, true),
        time: selectedTime,
        procedure: procedureName, // Use o nome do procedimento aqui
    });
    setShowTimeSlots(false);
    const newMarked = { ...markedDates };
    if (newMarked[selectedDate]) {
        delete newMarked[selectedDate].selected;
        delete newMarked[selectedDate].selectedColor;
        if (!newMarked[selectedDate].marked && !newMarked[selectedDate].today) delete newMarked[selectedDate];
    }
    setMarkedDates(newMarked);
    setSelectedDate(''); setSelectedTime(''); setAvailableTimes([]);
    setIsConfirmationModalVisible(true);
  };

  const confirmAppointmentIntent = () => {
    if (!selectedDate || !selectedTime) { Alert.alert("Atenção", "Por favor, selecione uma data e um horário para continuar."); return; }
    Alert.alert( "Confirmar Agendamento", `Deseja confirmar seu agendamento para:\n\nData: ${formatDateForDisplay(selectedDate)}\nHorário: ${selectedTime}`, [ { text: "Cancelar", style: "cancel" }, { text: "Confirmar", onPress: processAndShowConfirmation } ]);
  };

  const goBackToCalendar = () => { setShowTimeSlots(false); setSelectedTime(''); };

  const currentStyles = themedStyles(colors, actualTheme);

  return (
    <SafeAreaView style={currentStyles.safeArea}>
      <StatusBar barStyle={colors.statusBar} backgroundColor={colors.headerBackground} />
      <CustomHeader
        title="Agendamento"
        onSettingsPress={toggleSettingsModal}
        onLogoutPress={handleLogout}
      />
      <ScrollView contentContainerStyle={currentStyles.scrollContainer} keyboardShouldPersistTaps="handled">
        {!showTimeSlots ? (
          <>
            <Text style={currentStyles.instructionText}>Selecione uma data para ver os horários disponíveis.</Text>
            <View style={currentStyles.calendarViewContainer}>
              <Calendar
                current={currentCalendarMonth + '-01'}
                minDate={todayString}
                onDayPress={onDayPress}
                markedDates={markedDates}
                monthFormat={'MMMM yyyy'}
                onMonthChange={(month) => setCurrentCalendarMonth(month.dateString.slice(0, 7))}
                theme={{
                    backgroundColor: colors.card, calendarBackground: colors.card, textSectionTitleColor: colors.primary,
                    selectedDayBackgroundColor: colors.primary, selectedDayTextColor: colors.primaryText, todayTextColor: '#D9534F',
                    dayTextColor: colors.text, textDisabledColor: colors.subtleText, dotColor: '#2ecc71',
                    selectedDotColor: colors.primaryText, arrowColor: colors.primary, monthTextColor: colors.primary,
                    indicatorColor: colors.primary, textDayFontWeight: '400', textMonthFontWeight: 'bold',
                    textDayHeaderFontWeight: '600', textDayFontSize: 16, textMonthFontSize: 18, textDayHeaderFontSize: 14,
                }}
                style={currentStyles.calendar}
              />
            </View>
             <View style={currentStyles.clinicHelpOuterContainer}>
                <View style={currentStyles.clinicHelpContainer}>
                    <Ionicons name="help-circle-outline" size={26} color={colors.primary} style={{marginRight: 10}}/>
                    <View style={{flex: 1}}>
                        <Text style={currentStyles.clinicHelpTitle}>Dúvidas sobre qual procedimento agendar?</Text>
                        <Text style={currentStyles.clinicHelpText}>Nossa equipe está pronta para te ajudar!</Text>
                    </View>
                    <TouchableOpacity style={currentStyles.clinicHelpButton} onPress={() => Alert.alert("Contato", "Ligue para (XX) XXXX-XXXX.")}>
                        <Text style={currentStyles.clinicHelpButtonText}>Contato</Text>
                    </TouchableOpacity>
                </View>
            </View>
          </>
        ) : (
          <View style={currentStyles.timeSlotViewContainer}>
            <TouchableOpacity onPress={goBackToCalendar} style={currentStyles.backToCalendarButton}><Ionicons name="arrow-back-outline" size={22} color={colors.primary} /><Text style={currentStyles.backToCalendarButtonText}>Alterar Data Selecionada</Text></TouchableOpacity>
            <Text style={currentStyles.timeSlotTitle}>Horários disponíveis para:</Text>
            <Text style={currentStyles.selectedDateDisplay}>{formatDateForDisplay(selectedDate)}</Text>
            {isLoadingTimes ? ( <ActivityIndicator size="large" color={colors.primary} style={{ marginVertical: 30 }} /> )
            : availableTimes.length > 0 ? (
              <View style={currentStyles.timeSlotsGrid}>
                {availableTimes.map((time, index) => (
                  <TouchableOpacity key={index} style={[currentStyles.timeButton, selectedTime === time && currentStyles.selectedTimeButton]} onPress={() => handleTimeSelection(time)}>
                    <Text style={[currentStyles.timeButtonText, selectedTime === time && currentStyles.selectedTimeButtonText]}>{time}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : ( <Text style={currentStyles.noTimesText}>Desculpe, não há horários disponíveis para esta data.</Text> )}
            {availableTimes.length > 0 && (
                 <TouchableOpacity
                    style={[currentStyles.confirmButton, !selectedTime && currentStyles.confirmButtonDisabled]}
                    onPress={confirmAppointmentIntent}
                    disabled={!selectedTime}
                >
                    <Text style={currentStyles.confirmButtonText}>Agendar Horário</Text>
                </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>

      <Modal animationType="fade" transparent={true} visible={isSettingsModalVisible} onRequestClose={toggleSettingsModal}>
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

      <Modal animationType="slide" transparent={true} visible={isConfirmationModalVisible} onRequestClose={() => setIsConfirmationModalVisible(false)}>
        <View style={currentStyles.confirmationModalOverlay}>
          <View style={currentStyles.confirmationModalContainer}>
            <Ionicons name="checkmark-circle" size={70} color="#28a745" style={{ marginBottom: 15 }} />
            <Text style={currentStyles.confirmationModalTitle}>Agendamento Confirmado!</Text>
            {confirmedAppointmentDetails && (
              <>
                <Text style={currentStyles.confirmationModalText}>Seu horário para</Text>
                <Text style={currentStyles.confirmationModalDetailProcedure}>{confirmedAppointmentDetails.procedure || 'Consulta'}</Text>
                <Text style={currentStyles.confirmationModalText}>no dia <Text style={currentStyles.confirmationModalDetailBold}>{confirmedAppointmentDetails.date}</Text></Text>
                <Text style={currentStyles.confirmationModalText}>às <Text style={currentStyles.confirmationModalDetailBold}>{confirmedAppointmentDetails.time}</Text> foi reservado com sucesso.</Text>
              </>
            )}
            <Text style={currentStyles.confirmationModalSubText}>Você receberá um lembrete próximo à data.</Text>
            <TouchableOpacity style={currentStyles.confirmationModalCloseButton} onPress={() => setIsConfirmationModalVisible(false)}>
              <Text style={currentStyles.confirmationModalCloseButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const themedStyles = (colors, actualTheme) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  headerStylesOnly: { // Estilos apenas para o CustomHeader
    headerContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 5 : (Platform.OS === 'ios' ? 44 : 20), paddingBottom: 10, backgroundColor: colors.headerBackground },
    headerButton: { padding: 8 },
    headerCenterContent: { flex: 1, alignItems: 'center', marginHorizontal: 10 },
    headerTitleText: { color: colors.headerText, fontSize: 18, fontWeight: 'bold' },
  },
  scrollContainer: { flexGrow: 1, paddingBottom: 20 },
  instructionText: { fontSize: 16, color: colors.subtleText, textAlign: 'center', paddingHorizontal: 20, marginTop: 20, marginBottom: 15 },
  calendarViewContainer: { backgroundColor: colors.card, marginHorizontal: 15, borderRadius: 12, paddingVertical: 10, paddingHorizontal: 5, shadowColor: actualTheme === 'dark' ? colors.subtleText : '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: actualTheme === 'dark' ? 0.2 : 0.08, shadowRadius: 4, elevation: 3, marginBottom: 20 },
  calendar: { borderRadius: 12 },
  timeSlotViewContainer: { backgroundColor: colors.card, marginHorizontal: 15, marginTop: 10, padding: 20, borderRadius: 12, shadowColor: actualTheme === 'dark' ? colors.subtleText : '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: actualTheme === 'dark' ? 0.2 : 0.08, shadowRadius: 4, elevation: 3 },
  backToCalendarButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, marginBottom: 15, alignSelf: 'flex-start' },
  backToCalendarButtonText: { fontSize: 16, color: colors.primary, fontWeight: '500', marginLeft: 8 },
  timeSlotTitle: { fontSize: 19, fontWeight: '600', textAlign: 'center', marginBottom: 5, color: colors.text },
  selectedDateDisplay: { fontSize: 17, color: colors.primary, textAlign: 'center', fontWeight: '500', marginBottom: 25 },
  timeSlotsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', marginHorizontal: -5 },
  timeButton: { backgroundColor: colors.inputBackground, paddingVertical: 12, paddingHorizontal: 10, borderRadius: 8, margin: 5, alignItems: 'center', borderWidth: 1, borderColor: colors.borderColor, minWidth: '30%', flexGrow: 1 },
  selectedTimeButton: { backgroundColor: colors.primary, borderColor: colors.primary },
  timeButtonText: { fontSize: 15, color: colors.primary, fontWeight: '500' },
  selectedTimeButtonText: { color: colors.primaryText },
  noTimesText: { textAlign: 'center', fontSize: 16, color: colors.subtleText, marginVertical: 30, paddingHorizontal: 10 },
  confirmButton: { backgroundColor: '#28a745', paddingVertical: 15, borderRadius: 8, alignItems: 'center', marginTop: 30 },
  confirmButtonDisabled: { backgroundColor: '#a5d6a7' },
  confirmButtonText: { color: '#FFFFFF', fontSize: 17, fontWeight: 'bold' },
  clinicHelpOuterContainer: { paddingHorizontal: 15, marginTop: 25 },
  clinicHelpContainer: { backgroundColor: colors.card, borderRadius: 12, paddingVertical: 15, paddingHorizontal: 15, flexDirection: 'row', alignItems: 'center', shadowColor: actualTheme === 'dark' ? colors.subtleText : '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: actualTheme === 'dark' ? 0.2 : 0.08, shadowRadius: 3, elevation: 2 },
  clinicHelpTitle: { fontSize: 15, fontWeight: '600', color: colors.primary, marginBottom: 4 },
  clinicHelpText: { fontSize: 13, color: colors.subtleText, lineHeight: 18, flexShrink: 1 },
  clinicHelpButton: { marginLeft: 10, backgroundColor: colors.primary, paddingVertical: 10, paddingHorizontal: 18, borderRadius: 20 },
  clinicHelpButtonText: { color: colors.primaryText, fontSize: 13, fontWeight: '500' },

  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.65)' },
  modalContentContainer: { width: '90%', maxWidth: 400, backgroundColor: colors.card, borderRadius: 15, paddingVertical: 20, elevation: 10, shadowColor: actualTheme === 'dark' ? colors.subtleText : '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.30, shadowRadius: 8 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: colors.primary, textAlign: 'center', marginBottom: 20, paddingHorizontal: 20 },
  modalOptionButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 20 },
  modalIconContainer: { width: 36, height: 36, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 18 },
  modalOptionText: { flex: 1, fontSize: 16, color: colors.text },
  modalSeparator: { height: 1, backgroundColor: colors.borderColor, marginLeft: 20 + 36 + 18 },
  modalCloseButton: { marginTop: 20, paddingVertical: 15, paddingHorizontal: 20, backgroundColor: colors.inputBackground, alignItems: 'center', borderBottomLeftRadius: 15, borderBottomRightRadius: 15, borderTopWidth: 1, borderTopColor: colors.borderColor},
  modalCloseButtonText: { fontSize: 17, color: colors.primary, fontWeight: '600' },

  confirmationModalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.7)'},
  confirmationModalContainer: { width: '85%', maxWidth: 360, backgroundColor: colors.card, borderRadius: 15, padding: 25, alignItems: 'center', elevation: 12, shadowColor: actualTheme === 'dark' ? colors.subtleText : '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, },
  confirmationModalTitle: { fontSize: 22, fontWeight: 'bold', color: colors.primary, textAlign: 'center', marginBottom: 10, },
  confirmationModalText: { fontSize: 16, color: colors.text, textAlign: 'center', lineHeight: 24, marginBottom: 5, },
  confirmationModalDetailProcedure: { fontSize: 17, fontWeight: '600', color: colors.accent || colors.primary, textAlign: 'center', marginVertical: 5, },
  confirmationModalDetailBold: { fontWeight: 'bold', color: colors.text, },
  confirmationModalSubText: { fontSize: 14, color: colors.subtleText, textAlign: 'center', marginTop: 15, marginBottom: 25, },
  confirmationModalCloseButton: { backgroundColor: colors.primary, paddingVertical: 12, paddingHorizontal: 40, borderRadius: 25, marginTop: 10, },
  confirmationModalCloseButtonText: { color: colors.primaryText, fontSize: 16, fontWeight: 'bold', },
});

export default AgendamentoScreen;