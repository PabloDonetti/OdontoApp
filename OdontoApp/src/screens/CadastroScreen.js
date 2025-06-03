// screens/CadastroScreen.js
import React, { useState, useContext } from 'react';
import { auth } from '../service/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Platform,
  Alert,
  KeyboardAvoidingView,
  Keyboard,
  // Button, // Não é mais necessário se o DateTimePicker for usado corretamente
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../context/ThemeContext'; // Ajuste o caminho
import MaskInput from 'react-native-mask-input';
import DateTimePicker from '@react-native-community/datetimepicker';
import { cpf as cpfValidator } from 'cpf-cnpj-validator';

// Função para validar CPF usando a biblioteca
const isActualValidCpf = (cpf) => {
  if (!cpf) return false;
  return cpfValidator.isValid(cpf);
};

// Função para validar e-mail (formato geral com domínio)
const isValidEmail = (email) => {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Função para validar a força da senha
const isStrongPassword = (password) => {
  if (!password) return false;
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password);

  if (password.length < minLength) return false;
  if (!hasUpperCase) return false;
  if (!hasLowerCase) return false;
  if (!hasNumber) return false;
  if (!hasSpecialChar) return false;
  return true;
};

const signUp = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('Usuário criado com sucesso:', user);
  } catch (error) {
    console.log('Erro ao criar usuário:', error.code, error.message);
  }
};

const CadastroScreen = () => {
  const navigation = useNavigation();
  const { colors, actualTheme } = useContext(ThemeContext);
  const currentStyles = themedStyles(colors, actualTheme);

  const [nomeCompleto, setNomeCompleto] = useState('');
  const [cpf, setCpf] = useState('');
  const [unmaskedCpf, setUnmaskedCpf] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  
  const [dataNascimento, setDataNascimento] = useState(null);
  const [dataNascimentoString, setDataNascimentoString] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [nomeError, setNomeError] = useState('');
  const [cpfError, setCpfError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [senhaError, setSenhaError] = useState('');
  const [confirmarSenhaError, setConfirmarSenhaError] = useState('');
  const [dataNascimentoError, setDataNascimentoError] = useState('');

  

  const validateForm = () => {
    let isValid = true;
    setNomeError(''); setCpfError(''); setEmailError('');
    setSenhaError(''); setConfirmarSenhaError(''); setDataNascimentoError('');

    if (!nomeCompleto.trim()) { setNomeError('Nome completo é obrigatório.'); isValid = false; }
    if (!unmaskedCpf.trim()) { setCpfError('CPF é obrigatório.'); isValid = false;
    } else if (!isActualValidCpf(unmaskedCpf)) { setCpfError('CPF inválido.'); isValid = false; }
    if (!email.trim()) { setEmailError('E-mail é obrigatório.'); isValid = false;
    } else if (!isValidEmail(email)) { setEmailError('Formato de e-mail inválido.'); isValid = false; }
    if (!senha) { setSenhaError('Senha é obrigatória.'); isValid = false;
    } else if (!isStrongPassword(senha)) { setSenhaError('Use 8+ caracteres com maiúscula, minúscula, número e símbolo (ex: !@#$).'); isValid = false; }
    if (!confirmarSenha) { setConfirmarSenhaError('Confirmação de senha é obrigatória.'); isValid = false;
    } else if (senha && senha !== confirmarSenha) { setConfirmarSenhaError('As senhas não coincidem.'); isValid = false;
    } else if (!senha && confirmarSenha) { setConfirmarSenhaError('Digite a senha principal primeiro.'); isValid = false; }
    if (!dataNascimento) { setDataNascimentoError('Data de nascimento é obrigatória.'); isValid = false; }
    return isValid;
  };

  const handleRegister = () => {
    if (validateForm()) {
      // Se todos os campos forem válidos, prosseguir com o registro
      signUp(email, senha)
        .then(() => {
          Alert.alert('Sucesso', 'Conta criada com sucesso!');
          navigation.navigate('Login'); // Navega para a tela de login após o registro
        })
        .catch((error) => {
          console.error('Erro ao criar conta:', error);
          Alert.alert('Erro', 'Não foi possível criar a conta. Tente novamente.');
        });
    }
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || dataNascimento;
    // setShowDatePicker(Platform.OS === 'ios'); // Para iOS, o spinner não fecha sozinho.
                                             // Se display="default", ele se comporta como modal.
                                             // Se display="spinner" no iOS, você precisaria de botões OK/Cancelar em um modal customizado.
                                             // Vamos fechar em ambos os casos após uma ação para simplificar.
    setShowDatePicker(false);


    if (event.type === "set" && currentDate) {
      setDataNascimento(currentDate);
      const day = currentDate.getDate().toString().padStart(2, '0');
      const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
      const year = currentDate.getFullYear();
      setDataNascimentoString(`${day}/${month}/${year}`);
      setDataNascimentoError('');
    }
    // Não precisamos tratar "dismissed" explicitamente se setShowDatePicker(false) é chamado acima.
  };
  
  const cpfMask = [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/];
  const maximumBirthDate = new Date();
  maximumBirthDate.setFullYear(maximumBirthDate.getFullYear() - 16); // Idade mínima 16 anos
  const initialPickerDate = new Date();
  initialPickerDate.setFullYear(initialPickerDate.getFullYear() - 25); // Começa com 25 anos atrás, por exemplo


  return (
    <SafeAreaView style={currentStyles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={currentStyles.formWrapper} keyboardShouldPersistTaps="handled">
          <Image source={require('../assets/icon.png')} style={currentStyles.logo} />
          <Text style={currentStyles.title}>CADASTRE SUA CONTA</Text>

          <View style={currentStyles.inputContainer}>
            <Text style={currentStyles.label}>Nome completo</Text>
            <TextInput value={nomeCompleto} onChangeText={setNomeCompleto} placeholder="Digite seu nome completo" style={currentStyles.input} placeholderTextColor={colors.subtleText} />
            {nomeError ? <Text style={currentStyles.errorText}>{nomeError}</Text> : null}
          </View>

          <View style={currentStyles.inputContainer}>
            <Text style={currentStyles.label}>CPF</Text>
            <MaskInput
              value={cpf}
              onChangeText={(masked, unmasked) => {
                const numericUnmasked = unmasked.replace(/[^0-9]/g, '');
                if (numericUnmasked.length <= 11) { setCpf(masked); setUnmaskedCpf(numericUnmasked); }
              }}
              mask={cpfMask} style={currentStyles.input} placeholder="000.000.000-00" keyboardType="numeric" placeholderTextColor={colors.subtleText}
            />
            {cpfError ? <Text style={currentStyles.errorText}>{cpfError}</Text> : null}
          </View>

          <View style={currentStyles.inputContainer}>
            <Text style={currentStyles.label}>E-mail</Text>
            <TextInput value={email} onChangeText={setEmail} placeholder="seuemail@dominio.com" keyboardType="email-address" autoCapitalize="none" style={currentStyles.input} placeholderTextColor={colors.subtleText} />
            {emailError ? <Text style={currentStyles.errorText}>{emailError}</Text> : null}
          </View>

          <View style={currentStyles.inputContainer}>
            <Text style={currentStyles.label}>Senha</Text>
            <TextInput value={senha} onChangeText={setSenha} placeholder="Insira a senha" secureTextEntry style={currentStyles.input} placeholderTextColor={colors.subtleText} />
            {senhaError ? <Text style={currentStyles.errorText}>{senhaError}</Text> : null}
          </View>

          <View style={currentStyles.inputContainer}>
            <Text style={currentStyles.label}>Confirme sua senha</Text>
            <TextInput value={confirmarSenha} onChangeText={setConfirmarSenha} placeholder="Repita a senha" secureTextEntry style={currentStyles.input} placeholderTextColor={colors.subtleText} />
            {confirmarSenhaError ? <Text style={currentStyles.errorText}>{confirmarSenhaError}</Text> : null}
          </View>

          <View style={currentStyles.inputContainer}>
            <Text style={currentStyles.label}>Data de Nascimento</Text>
            <TouchableOpacity onPress={() => { Keyboard.dismiss(); setShowDatePicker(true); }} style={currentStyles.dateInputButton}>
              <Text style={[currentStyles.dateInputText, !dataNascimentoString && {color: colors.subtleText}]}>
                {dataNascimentoString || 'DD/MM/AAAA'}
              </Text>
              <Ionicons name="calendar-outline" size={24} color={colors.primary} />
            </TouchableOpacity>
            {dataNascimentoError ? <Text style={currentStyles.errorText}>{dataNascimentoError}</Text> : null}
          </View>

          {showDatePicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={dataNascimento || initialPickerDate}
              mode={'date'}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onDateChange}
              maximumDate={maximumBirthDate}
              minimumDate={new Date(1920, 0, 1)} // <<--- DATA MÍNIMA AJUSTADA
            />
          )}

          <TouchableOpacity style={currentStyles.button} onPress={handleRegister}>
            <Text style={currentStyles.buttonText}>Registrar</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.goBack()} style={currentStyles.loginLinkContainer}>
            <Text style={currentStyles.linkText}>Já tenho uma conta. <Text style={currentStyles.linkActionText}>Entrar</Text></Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Estilos (com theming)
const themedStyles = (colors, actualTheme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, },
  formWrapper: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 25, paddingVertical: 20, },
  logo: { width: 100, height: 100, borderRadius: 20, marginBottom: 20, },
  title: { fontSize: 22, fontWeight: 'bold', color: colors.primary, textTransform: 'uppercase', marginBottom: 25, letterSpacing: 0.5, },
  inputContainer: { width: '100%', marginBottom: 12, },
  label: { fontSize: 14, color: colors.subtleText, marginBottom: 5, fontWeight: '500', },
  input: { width: '100%', backgroundColor: colors.inputBackground, borderWidth: 1, borderColor: colors.borderColor, borderRadius: 8, paddingVertical: Platform.OS === 'ios' ? 14 : 10, paddingHorizontal: 12, marginBottom: 3, color: colors.text, fontSize: 15, },
  dateInputButton: { width: '100%', backgroundColor: colors.inputBackground, borderWidth: 1, borderColor: colors.borderColor, borderRadius: 8, paddingVertical: Platform.OS === 'ios' ? 14 : 12, paddingHorizontal: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3, },
  dateInputText: { fontSize: 15, color: colors.text, },
  errorText: { fontSize: 12, color: 'red', marginTop: 2, alignSelf: 'flex-start' },
  button: { marginTop: 25, backgroundColor: colors.primary, paddingVertical: 14, borderRadius: 25, width: '100%', alignItems: 'center', shadowColor: actualTheme === 'dark' ? colors.subtleText : '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3, elevation: 3, },
  buttonText: { color: colors.primaryText, fontSize: 16, fontWeight: 'bold', },
  loginLinkContainer: { marginTop: 20, paddingBottom: Platform.OS === 'ios' ? 20 : 40, },
  linkText: { color: colors.subtleText, fontSize: 14, textAlign: 'center', },
  linkActionText: { color: colors.primary, fontWeight: 'bold', textDecorationLine: 'underline', }
});

export default CadastroScreen;