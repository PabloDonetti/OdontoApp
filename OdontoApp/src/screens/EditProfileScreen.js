// screens/EditProfileScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Platform,
  Alert, // Para confirmações
  ActivityIndicator, // Para feedback de carregamento
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
// Para DatePicker, você usaria algo como @react-native-community/datetimepicker
// Para ImagePicker, algo como react-native-image-picker
// Para MaskedInput, algo como react-native-mask-input

const EditProfileScreen = () => {
  const navigation = useNavigation();

  // Estado para os dados do formulário
  const [formData, setFormData] = useState({
    profilePicUri: 'https://via.placeholder.com/100', // Placeholder
    fullName: '',
    birthDate: '', // Idealmente um objeto Date, aqui string para simplicidade
    cpf: '',
    gender: '', // Pode ser 'Masculino', 'Feminino', 'Outro', 'Prefiro não informar'
    email: '',
    phone: '',
    cep: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    insuranceProvider: '',
    insuranceId: '',
    contactPreference: '', // ex: 'WhatsApp', 'Email'
  });

  const [isLoading, setIsLoading] = useState(false); // Para feedback ao salvar
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false); // Para controlar o DatePicker

  // Efeito para carregar dados do usuário ao montar a tela
  useEffect(() => {
    // TODO: Implementar lógica para buscar os dados atuais do perfil do usuário
    // Exemplo:
    // const fetchUserData = async () => {
    //   const userData = await api.getUserProfile();
    //   setFormData({
    //     profilePicUri: userData.profilePicUri || 'https://via.placeholder.com/100',
    //     fullName: userData.fullName || '',
    //     birthDate: userData.birthDateFormatted || '', // Formatar data
    //     // ... outros campos
    //   });
    // };
    // fetchUserData();

    // Dados mockados para exemplo:
    setFormData({
      profilePicUri: 'https://via.placeholder.com/150/4B3B56/FFFFFF?Text=User',
      fullName: 'Maria Silva',
      birthDate: '15/08/1990',
      cpf: '123.456.789-00',
      gender: 'Feminino',
      email: 'maria.silva@example.com',
      phone: '(34) 99999-8888',
      cep: '38700-000',
      street: 'Rua das Palmeiras',
      number: '123',
      complement: 'Apto 4B',
      neighborhood: 'Centro',
      city: 'Patos de Minas',
      state: 'MG',
      insuranceProvider: 'Uniodonto',
      insuranceId: '987654321',
      contactPreference: 'WhatsApp',
    });
  }, []);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePickImage = () => {
    // TODO: Implementar lógica para escolher imagem da galeria ou câmera
    // Usar bibliotecas como react-native-image-picker
    console.log('Abrir seletor de imagem');
    // Exemplo: ImagePicker.launchImageLibrary({}, response => { setFormData(prev => ({...prev, profilePicUri: response.uri})) });
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    // TODO: Implementar validação dos campos
    console.log('Dados para salvar:', formData);
    // TODO: Implementar chamada à API para salvar os dados
    // Exemplo:
    // try {
    //   await api.updateUserProfile(formData);
    //   Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
    // } catch (error) {
    //   Alert.alert('Erro', 'Não foi possível atualizar o perfil. Tente novamente.');
    // } finally {
    //   setIsLoading(false);
    // }
    setTimeout(() => { // Simula chamada de API
      setIsLoading(false);
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso! (Simulado)');
    }, 2000);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Excluir Conta',
      'Tem certeza que deseja excluir sua conta? Esta ação é irreversível.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            // TODO: Implementar lógica de exclusão de conta (chamar API, limpar dados, deslogar)
            console.log('Usuário confirmou exclusão da conta');
            // navigation.reset({ index: 0, routes: [{ name: 'Login' }] }); // Exemplo após exclusão
          },
        },
      ]
    );
  };

  const showDatePicker = () => {
    setIsDatePickerVisible(true);
    // Aqui você abriria o modal do DatePicker
    // No onConfirm do DatePicker: handleChange('birthDate', formattedDate); setIsDatePickerVisible(false);
    Alert.alert("DatePicker", "Aqui abriria um seletor de data. Para simplificar, digite no formato DD/MM/AAAA.");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        {/* --- Foto de Perfil --- */}
        <View style={styles.profilePicSection}>
          <Image source={{ uri: formData.profilePicUri }} style={styles.avatar} />
          <TouchableOpacity style={styles.changePhotoButton} onPress={handlePickImage}>
            <Ionicons name="camera-outline" size={20} color="#FFFFFF" style={{marginRight: 5}} />
            <Text style={styles.changePhotoText}>Alterar Foto</Text>
          </TouchableOpacity>
        </View>

        {/* --- Informações Pessoais --- */}
        <Text style={styles.sectionTitle}>Informações Pessoais</Text>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nome Completo *</Text>
          <TextInput
            style={styles.input}
            value={formData.fullName}
            onChangeText={text => handleChange('fullName', text)}
            placeholder="Seu nome completo"
            placeholderTextColor="#aaa"
          />
          <Text style={styles.label}>Data de Nascimento</Text>
          <TouchableOpacity onPress={showDatePicker} style={styles.dateInputButton}>
            <Text style={styles.dateInputText}>{formData.birthDate || 'Selecione a data'}</Text>
            <Ionicons name="calendar-outline" size={22} color="#4B3B56" />
          </TouchableOpacity>
          {/* Se o DatePicker estivesse aqui:
          {isDatePickerVisible && (
            <DateTimePicker
              value={new Date()} // ou a data atual do formData.birthDate
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setIsDatePickerVisible(false);
                if (selectedDate) {
                  // Formatar e setar a data
                  handleChange('birthDate', selectedDate.toLocaleDateString('pt-BR'));
                }
              }}
            />
          )} */}
          <Text style={styles.label}>CPF</Text>
          <TextInput
            style={styles.input}
            value={formData.cpf}
            onChangeText={text => handleChange('cpf', text)}
            placeholder="000.000.000-00"
            keyboardType="numeric"
            placeholderTextColor="#aaa"
            // TODO: Adicionar react-native-mask-input para formatação
          />
          <Text style={styles.label}>Gênero</Text>
          <TextInput // TODO: Substituir por um Picker ou Radio Buttons
            style={styles.input}
            value={formData.gender}
            onChangeText={text => handleChange('gender', text)}
            placeholder="Masculino, Feminino, Outro, etc."
            placeholderTextColor="#aaa"
          />
        </View>

        {/* --- Informações de Contato --- */}
        <Text style={styles.sectionTitle}>Informações de Contato</Text>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>E-mail *</Text>
          <TextInput
            style={styles.input}
            value={formData.email}
            onChangeText={text => handleChange('email', text)}
            placeholder="seuemail@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#aaa"
            // editable={false} // Se o e-mail não puder ser alterado
          />
          <Text style={styles.label}>Telefone Celular *</Text>
          <TextInput
            style={styles.input}
            value={formData.phone}
            onChangeText={text => handleChange('phone', text)}
            placeholder="(00) 90000-0000"
            keyboardType="phone-pad"
            placeholderTextColor="#aaa"
            // TODO: Adicionar react-native-mask-input
          />
          <Text style={styles.label}>CEP</Text>
          <TextInput style={styles.input} value={formData.cep} onChangeText={text => handleChange('cep', text)} placeholder="00000-000" keyboardType="numeric" placeholderTextColor="#aaa"/>
          <Text style={styles.label}>Rua</Text>
          <TextInput style={styles.input} value={formData.street} onChangeText={text => handleChange('street', text)} placeholder="Nome da sua rua" placeholderTextColor="#aaa"/>
          <View style={styles.row}>
            <View style={styles.rowItem}>
              <Text style={styles.label}>Número</Text>
              <TextInput style={styles.input} value={formData.number} onChangeText={text => handleChange('number', text)} placeholder="Nº" keyboardType="numeric" placeholderTextColor="#aaa"/>
            </View>
            <View style={styles.rowItem}>
              <Text style={styles.label}>Complemento</Text>
              <TextInput style={styles.input} value={formData.complement} onChangeText={text => handleChange('complement', text)} placeholder="Apto, Bloco" placeholderTextColor="#aaa"/>
            </View>
          </View>
          <Text style={styles.label}>Bairro</Text>
          <TextInput style={styles.input} value={formData.neighborhood} onChangeText={text => handleChange('neighborhood', text)} placeholder="Seu bairro" placeholderTextColor="#aaa"/>
          <View style={styles.row}>
            <View style={styles.rowItem}>
              <Text style={styles.label}>Cidade</Text>
              <TextInput style={styles.input} value={formData.city} onChangeText={text => handleChange('city', text)} placeholder="Sua cidade" placeholderTextColor="#aaa"/>
            </View>
            <View style={styles.rowItem}>
              <Text style={styles.label}>Estado</Text>
              <TextInput style={styles.input} value={formData.state} onChangeText={text => handleChange('state', text)} placeholder="UF" maxLength={2} autoCapitalize="characters" placeholderTextColor="#aaa"/>
            </View>
          </View>
        </View>

        {/* --- Convênio Odontológico --- */}
        <Text style={styles.sectionTitle}>Convênio Odontológico</Text>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nome do Convênio</Text>
          <TextInput
            style={styles.input}
            value={formData.insuranceProvider}
            onChangeText={text => handleChange('insuranceProvider', text)}
            placeholder="Nome da seguradora ou plano"
            placeholderTextColor="#aaa"
          />
          <Text style={styles.label}>Número da Carteirinha</Text>
          <TextInput
            style={styles.input}
            value={formData.insuranceId}
            onChangeText={text => handleChange('insuranceId', text)}
            placeholder="Número de identificação do plano"
            placeholderTextColor="#aaa"
          />
        </View>

        {/* --- Segurança da Conta --- */}
        <Text style={styles.sectionTitle}>Segurança da Conta</Text>
        <TouchableOpacity
          style={styles.securityButton}
          onPress={() => {
            console.log('Navegar para Alterar Senha');
            // navigation.navigate('ChangePasswordScreen'); // Crie esta tela
          }}>
          <Ionicons name="lock-closed-outline" size={20} color="#4B3B56" style={styles.securityButtonIcon} />
          <Text style={styles.securityButtonText}>Alterar Senha</Text>
          <Ionicons name="chevron-forward-outline" size={20} color="#A0A0A0" />
        </TouchableOpacity>

        {/* --- Botão Salvar --- */}
        <TouchableOpacity
          style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
          onPress={handleSaveProfile}
          disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.saveButtonText}>Salvar Alterações</Text>
          )}
        </TouchableOpacity>

        {/* --- Excluir Conta --- */}
        <TouchableOpacity style={styles.deleteAccountButton} onPress={handleDeleteAccount}>
          <Text style={styles.deleteAccountButtonText}>Excluir minha conta</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F6F8',
  },
  scrollContainer: {
    paddingBottom: 30,
  },
  profilePicSection: {
    alignItems: 'center',
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
    borderWidth: 3,
    borderColor: '#4B3B56',
  },
  changePhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4B3B56',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  changePhotoText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  inputGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginHorizontal: 15,
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginBottom: 10,
    elevation: 1, // Sombra leve para Android
    shadowColor: '#000', // Sombra para iOS
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  label: {
    fontSize: 14,
    color: '#555555',
    marginTop: 10,
    marginBottom: 3,
  },
  input: {
    backgroundColor: '#F4F6F8',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
    fontSize: 16,
    color: '#333333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  dateInputButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F4F6F8',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  dateInputText: {
    fontSize: 16,
    color: '#333333',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowItem: {
    flex: 1,
  },
  // Adicionar margem para o item da direita na linha
  rowItem: {
    flex: 1,
  },
  rowItem: {
    flex: 1,
    marginRight: 5, // Espaço entre itens na mesma linha (exceto o último)
  },
  rowItem: { // Estilo corrigido para o segundo item
    flex: 1,
    marginLeft: 5, // Espaço para o item da direita
  },
  // CORREÇÃO: A forma correta de aplicar margem entre itens em uma linha é assim:
  rowItemLeft: { // Use este para o item da esquerda
    flex: 1,
    marginRight: 5,
  },
  rowItemRight: { // Use este para o item da direita
    flex: 1,
    marginLeft: 5,
  },
  // Para a View que envolve os dois itens:
  // <View style={styles.row}>
  //   <View style={styles.rowItemLeft}> ... </View>
  //   <View style={styles.rowItemRight}> ... </View>
  // </View>
  // Se for apenas 2 itens, pode-se usar justifyContent: 'space-between' na View 'row' e
  // dar width: '48%' para cada item. Ou como está acima, com uma correção:
  // Precisa de um dos lados com margem, ou aplicar no container. Simplificando:
  // row: { flexDirection: 'row' },
  // rowItem: { flex: 1, // e adicionar marginHorizontal se houver mais de um }
  // A lógica de rowItemLeft/Right é uma forma. Outra:
  // Para <View style={styles.rowItem}> Número </View> e <View style={styles.rowItem}> Complemento </View>
  // Apenas o primeiro pode ter marginRight: 10.
  // Ou, se a View row tem justifyContent: 'space-between', dar uma largura menor que 50% para cada.
  // Vou simplificar para o exemplo:

  // (Estilos para row e rowItem simplificados para clareza, ajuste conforme necessidade)
  // Se você tiver apenas dois itens, pode dar uma largura fixa ou flex e margem em um deles
  // Ex:
  // row: { flexDirection: 'row', justifyContent: 'space-between' },
  // rowItem: { width: '48%' },
  // Vou manter como está, e você pode refinar o espaçamento:
  // [Estilo do `row` como definido antes]
  // rowItem: { flex: 1 },
  // No JSX, para o primeiro <View style={styles.rowItem}> você pode adicionar style={{marginRight: 10}}


  securityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 15,
    marginTop: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  securityButtonIcon: {
    marginRight: 10,
  },
  securityButtonText: {
    flex: 1,
    fontSize: 16,
    color: '#4B3B56',
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#28a745', // Verde para salvar
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 15,
    marginTop: 30,
    marginBottom: 15,
  },
  saveButtonDisabled: {
    backgroundColor: '#a5d6a7',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteAccountButton: {
    alignItems: 'center',
    paddingVertical: 10,
    marginHorizontal: 15,
  },
  deleteAccountButtonText: {
    color: '#c0392b', // Vermelho para ação destrutiva
    fontSize: 14,
    fontWeight: '500',
  },
});

export default EditProfileScreen;