import { Feather, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import { SafeAreaView, } from 'react-native-safe-area-context';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useLogin } from '../hooks/UseLogin';
import { LoginUserStream } from '../services/login';

export default function LoginScreen() {
 
  const [showPassword, setShowPassword] = useState(false);
  const { _Name,
    SetName,
    _Usuario,
    SetUsuario,
    _Senha,
    SetSenha,
    _Url,
    SetUrl,
    _Loanding,
    SetLoading
  } = useLogin();

  const router = useRouter()


  const Login = async () => {
    const userDb = await AsyncStorage.getItem('username')
    if (userDb === null) {
      console.log(userDb)
    } else {
      router.replace('/loading')
    }
    
  }

  const handleLogin = async () => {
    // Validação básica
    if (!_Name || !_Usuario || !_Senha || !_Url) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos!');
      return;
    }

    SetLoading(true);

    if (_Name === "" || _Usuario === "" || _Senha === "" || _Url === "") {
      SetLoading(false)
      return Alert.alert('Notificação', 'Preencha todos os dado!')
    }
    const result = LoginUserStream(_Name, _Usuario, _Senha, _Url);
    if (await result !== "Ok") {
      Alert.alert('Notificação', 'Erro ao conectar!')
      SetLoading(false)
      return
    }

    router.replace('/(tabs)')
  };

    useEffect(()=>{
      Login();
    }, [])

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Cabeçalho com gradiente */}
          <LinearGradient
            colors={['#7e1a1aff', '#a70101ff', '#812a2aff']}
            style={styles.header}
          >
            <View style={styles.logoContainer}>
              <MaterialIcons name="live-tv" size={60} color="#fff" />
              <Text style={styles.appTitle}>AS IPTV</Text>
              <Text style={styles.appSubtitle}>Sua Melhor Experiência em Streaming</Text>
            </View>
          </LinearGradient>

          {/* Mensagem de boas-vindas */}
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeTitle}>Bem-vindo de volta!</Text>
            <Text style={styles.welcomeText}>
              Acesse milhares de canais, filmes e séries com a melhor qualidade do mercado.
            </Text>
          </View>

          {/* Formulário de Login */}
          <View style={styles.formContainer}>
            <Text style={styles.sectionTitle}>Login</Text>

            {/* Node da Conta */}
            <View style={styles.inputContainer}>
              <View style={styles.inputLabel}>
                <MaterialIcons name="dns" size={20} color="#ff0000ff" />
                <Text style={styles.label}
                >Nome da Conta</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Ex: asdry"
                placeholderTextColor="#999"
                value={_Name}
                onChangeText={SetName}
                autoCapitalize="none"
              />
            </View>

            {/* Usuário */}
            <View style={styles.inputContainer}>
              <View style={styles.inputLabel}>
                <MaterialIcons name="person" size={20} color="#ff0000ff" />
                <Text style={styles.label}>Usuário</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Digite seu usuário"
                placeholderTextColor="#999"
                value={_Usuario}
                onChangeText={SetUsuario}
                autoCapitalize="none"
              />
            </View>

            {/* Senha */}
            <View style={styles.inputContainer}>
              <View style={styles.inputLabel}>
                <MaterialIcons name="lock" size={20} color="#ff0000ff" />
                <Text style={styles.label}>Senha</Text>
              </View>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Digite sua senha"
                  placeholderTextColor="#999"
                  secureTextEntry={!showPassword}
                  value={_Senha}
                  onChangeText={SetSenha}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Feather
                    name={showPassword ? "eye-off" : "eye"}
                    size={24}
                    color="#666"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* URL do Servidor */}
            <View style={styles.inputContainer}>
              <View style={styles.inputLabel}>
                <MaterialIcons name="link" size={20} color="#ff0000ff" />
                <Text style={styles.label}>URL do Servidor</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="https://seuservidor.com"
                placeholderTextColor="#999"
                value={_Url}
                onChangeText={SetUrl}
                autoCapitalize="none"
                keyboardType="url"
              />
            </View>



            {/* Botão de Continuar */}
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              disabled={_Loanding}
            >
              <LinearGradient
                colors={['#ff0000ff', '#111111ff']}
                style={styles.gradientButton}
              >
                {_Loanding ? (
                  <ActivityIndicator color="#ffffffff" />
                ) : (
                  <>
                    <Text style={styles.loginButtonText}>Continuar</Text>
                    <MaterialIcons name="arrow-forward" size={24} color="#fff" />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Recursos do App */}
          <View style={styles.featuresContainer}>
            <Text style={styles.featuresTitle}>Recursos AS IPTV</Text>

            <View style={styles.featuresGrid}>
              <View style={styles.featureCard}>
                <MaterialIcons name="download" size={30} color="#ff0000ff" />
                <Text style={styles.featureTitle}>Download</Text>
                <Text style={styles.featureDesc}>Baixe conteúdos para assistir offline</Text>
              </View>

              <View style={styles.featureCard}>
                <MaterialIcons name="speed" size={30} color="#ff0000ff" />
                <Text style={styles.featureTitle}>Otimização</Text>
                <Text style={styles.featureDesc}>Streaming adaptável à sua conexão</Text>
              </View>

              <View style={styles.featureCard}>
                <MaterialIcons name="high-quality" size={30} color="#ff0000ff" />
                <Text style={styles.featureTitle}>Qualidade 4K</Text>
                <Text style={styles.featureDesc}>Suporte a até 4K HDR</Text>
              </View>

              <View style={styles.featureCard}>
                <MaterialIcons name="library-books" size={30} color="#ff0000ff" />
                <Text style={styles.featureTitle}>EPG Completo</Text>
                <Text style={styles.featureDesc}>Guia de programação detalhado</Text>
              </View>
            </View>
          </View>

          {/* Informações Adicionais */}
          <View style={styles.infoContainer}>
            <Link href={"/ajuda"} style={styles.infoLink}>
              <MaterialIcons name="help-outline" size={20} color="#ff0000ff" />
              <Text style={styles.infoLinkText}>Precisa de ajuda?</Text>
            </Link>


          </View>

          {/* Rodapé */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>AS IPTV v2.4.1</Text>
            <Text style={styles.footerSubtext}>© 2025 AS IPTV - Todos os direitos reservados</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000ff',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
  },
  appSubtitle: {
    fontSize: 14,
    color: '#e8eaf6',
    marginTop: 5,
  },
  welcomeContainer: {
    padding: 20,
    backgroundColor: '#272626ff',
    margin: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffffff',
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 14,
    color: '#d3d2d2ff',
    lineHeight: 20,
  },
  formContainer: {
    backgroundColor: '#272626ff',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffffff',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffffff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#fafafa',
    paddingRight: 15,
  },
  quickServersContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  quickServersTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  serversGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  serverButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8eaf6',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    flex: 1,
    minWidth: '45%',
  },
  serverText: {
    marginLeft: 8,
    fontSize: 12,
    color: '#ff0000ff',
    flex: 1,
  },
  loginButton: {
    marginTop: 10,
    borderRadius: 12,
    overflow: 'hidden',
  },
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  featuresContainer: {
    backgroundColor: '#272626ff',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#494747ff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffffff',
    marginBottom: 15,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 3,
  },
  featureCard: {
    width: '48%',
    backgroundColor: '#000000ff',
    padding: 15,
    margin: 2,
    borderRadius: 12,
    alignItems: 'center',
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ff0000ff',
    marginTop: 8,
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  infoLink: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  infoLinkText: {
    marginLeft: 8,
    color: '#ff0000ff',
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#a70101ff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 10,
  },
  footerText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footerSubtext: {
    color: '#e8eaf6',
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },
});