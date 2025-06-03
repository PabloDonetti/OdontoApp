// App.js
import React from 'react';
import { Platform } from 'react-native'; // Importar Platform se for usar para estilos específicos
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Importar o ThemeProvider do seu arquivo ThemeContext.js
// AJUSTE O CAMINHO SE A PASTA 'src/context' FOR DIFERENTE
import { ThemeProvider } from './context/ThemeContext';

// --- CONFIGURAÇÃO GLOBAL DO LOCALE DO CALENDÁRIO ---
import { LocaleConfig } from 'react-native-calendars';

LocaleConfig.locales['pt-br'] = {
  monthNames: [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho',
    'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
  ],
  monthNamesShort: [
    'Jan.', 'Fev.', 'Mar.', 'Abr.', 'Mai.', 'Jun.', 'Jul.',
    'Ago.', 'Set.', 'Out.', 'Nov.', 'Dez.',
  ],
  dayNames: [
    'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira',
    'Quinta-feira', 'Sexta-feira', 'Sábado',
  ],
  dayNamesShort: ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'],
  today: 'Hoje',
};
LocaleConfig.defaultLocale = 'pt-br';
// --- FIM DA CONFIGURAÇÃO DO LOCALE ---

// Importe suas telas (certifique-se que os caminhos estão corretos)
import LoginScreen from './screens/LoginScreen';
import CadastroScreen from './screens/CadastroScreen';
import HomeScreen from './screens/HomeScreen';
import AgendamentoScreen from './screens/Agendamento';
import MeusAgendamentosScreen from './screens/MeusAgendamentosScreen';

// Telas acessadas a partir dos modais de configuração ou outras navegações
import EditProfileScreen from './screens/EditProfileScreen';
import NotificationSettingsScreen from './screens/NotificationSettingsScreen';
import AboutAppScreen from './screens/AboutAppScreen';
import ProcedimentoScreen from './screens/Procedimento';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Componente para o Bottom Tab Navigator
function MainAppTabs() {
  // A ThemeContext pode ser usada aqui para estilizar a TabBar dinamicamente se necessário,
  // mas por enquanto, o estilo está hardcoded como antes.
  // const { colors } = useContext(ThemeContext);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          size = focused ? 30 : 28;

          if (route.name === 'Início') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Agendamento') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Meus Agendamentos') {
            iconName = focused ? 'list-circle' : 'list-circle-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FFFFFF', // Pode ser substituído por colors.tabBarActive
        tabBarInactiveTintColor: '#A0A0A0', // Pode ser substituído por colors.tabBarInactive
        tabBarStyle: {
          backgroundColor: '#4B3B56', // Pode ser substituído por colors.tabBarBackground
          paddingTop: 5,
          height: 60,
          borderTopWidth: 0,
        },
        tabBarShowLabel: true,
      })}
    >
      <Tab.Screen name="Início" component={HomeScreen} />
      <Tab.Screen name="Agendamento" component={AgendamentoScreen} />
      <Tab.Screen name="Meus Agendamentos" component={MeusAgendamentosScreen} />
    </Tab.Navigator>
  );
}

// Stack Navigator Principal
export default function App() {
  return (
    // 1. ThemeProvider envolve tudo
    <ThemeProvider>
      {/* 2. NavigationContainer envolve os Navegadores */}
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{ // Opções padrão para os headers do Stack (se mostrados)
            // Estas cores também podem vir do contexto do tema no futuro
            headerStyle: { backgroundColor: '#4B3B56' },
            headerTintColor: '#FFFFFF',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        >
          {/* Telas de Autenticação */}
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Cadastro"
            component={CadastroScreen}
            options={{ title: 'CRIE SUA CONTA' }}
          />

          {/* Tela Principal do App (que contém o TabNavigator) */}
          <Stack.Screen
            name="MainApp"
            component={MainAppTabs}
            options={{ headerShown: false }}
          />

          {/* Telas acessadas a partir dos modais de configuração ou outros fluxos */}
          <Stack.Screen
            name="EditProfile"
            component={EditProfileScreen}
            options={{ title: 'Editar Perfil' }}
          />
          <Stack.Screen
            name="NotificationSettingsScreen"
            component={NotificationSettingsScreen}
            options={{ title: 'Configurar Notificações' }}
          />
          <Stack.Screen
            name="AboutAppScreen"
            component={AboutAppScreen}
            options={{ title: 'Sobre o Aplicativo' }}
          />
          <Stack.Screen
            name="Procedimentos" // Tela de Procedimentos ainda definida no Stack
            component={ProcedimentoScreen}
            options={{ title: 'Nossos Procedimentos' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}