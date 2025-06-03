import React from 'react';
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../service/firebase';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';

// Mude o nome da função para LoginScreen
export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('')
  // Função para lidar com o login
  const handleLogin = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate('MainApp'); // Navega para a tela principal após o login
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      // Aqui você pode adicionar lógica para exibir um alerta ou mensagem de erro ao usuário
      alert('Erro ao fazer login. Verifique suas credenciais e tente novamente.');
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image
          // Adicione uma source para sua logo aqui, se tiver uma específica para login
          source={{ uri: 'https://via.placeholder.com/96' }} // Exemplo
          style={styles.logo}
          resizeMode="cover"
        />
        <Text style={styles.welcomeText}>SEJA BEM-VINDO</Text>


        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#A38F8F"
          autoCapitalize="none"
          keyboardType="email-address"
          onChangeText={setEmail}
          value={email}
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#A38F8F"
          secureTextEntry
          onChangeText={setPassword}
          value={password}
        />

        <TouchableOpacity style={styles.button} onPress={() => handleLogin(email, password)}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Ainda não é cliente?
          <Text style={styles.link} onPress={() => navigation.navigate('Cadastro')}>
            {' '}Registrar
          </Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAEBD9',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#FAEBD9',
    borderRadius: 24,
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  logo: {
    width: 96,
    height: 96,
    borderRadius: 24,
    marginBottom: 32,
    backgroundColor: '#ccc', // Placeholder color se a imagem não carregar
  },
  welcomeText: {
    fontSize: 16,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: '#4B3B4F',
    textTransform: 'uppercase',
    marginBottom: 32,
  },
  input: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#4B3B4F',
    fontSize: 14,
    color: '#A38F8F', // Cor do texto digitado
    marginBottom: 24,
    paddingVertical: 8, // Adicionado para melhor toque
    // fontVariant: ['small-caps'], // Removido se não suportado por todas as fontes/plataformas
  },
  button: {
    width: '100%',
    backgroundColor: '#4B3B4F',
    borderRadius: 999,
    paddingVertical: 10,
    marginTop: 16,
    alignItems: 'center', // Garante que o texto dentro do botão esteja centralizado
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
    // fontFamily: 'monospace', // Removido se não for uma fonte padrão ou importada
    fontWeight: 'bold',
  },
  footerText: {
    marginTop: 32,
    fontSize: 12,
    color: '#A38F8F',
    textTransform: 'uppercase',
  },
  link: {
    color: '#4B3B4F',
    textDecorationLine: 'underline',
    fontWeight: 'bold', // Adicionado para destaque
    // textTransform: 'none', // Removido pois o pai já tem uppercase, e queremos sobrescrever
  },
});