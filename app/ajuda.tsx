import {
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons
} from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import { SafeAreaView, } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function HelpScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState(null);
  const router = useRouter()

  // Categorias de ajuda
  const helpCategories = [
    {
      id: '1',
      title: 'Conexão e Servidores',
      icon: 'wifi',
      color: '#2196F3',
      questions: [
        {
          id: '1-1',
          question: 'Como conectar ao servidor?',
          answer: 'Vá em Configurações > Servidores > Adicionar Servidor. Insira a URL fornecida pelo seu provedor, usuário e senha.'
        },
        {
          id: '1-2',
          question: 'Erro "Não foi possível conectar ao servidor"',
          answer: 'Verifique sua conexão com a internet. Se estiver conectado, confirme se a URL do servidor está correta e se seu plano está ativo.'
        },
        {
          id: '1-3',
          question: 'Como testar a velocidade do servidor?',
          answer: 'Na tela principal, toque em "Testar Velocidade" no menu lateral. O app fará um teste de conexão com o servidor.'
        }
      ]
    },
    {
      id: '2',
      title: 'Reprodução e Qualidade',
      icon: 'play-circle',
      color: '#4CAF50',
      questions: [
        {
          id: '2-1',
          question: 'Vídeo travando ou bufferizando',
          answer: '1. Reduza a qualidade na configuração do player\n2. Verifique sua conexão com a internet\n3. Use a opção "Buffer Size" para aumentar o buffer'
        },
        {
          id: '2-2',
          question: 'Como mudar a qualidade do vídeo?',
          answer: 'Durante a reprodução, toque na tela e selecione o ícone de qualidade (HD/SD). Você também pode configurar no menu de opções do player.'
        },
        {
          id: '2-3',
          question: 'Áudio dessincronizado',
          answer: 'Acesse Configurações > Player > Ajuste de Áudio. Use os controles para ajustar a sincronização do áudio.'
        }
      ]
    },
    {
      id: '3',
      title: 'EPG e Guia de Programação',
      icon: 'tv-guide',
      color: '#9C27B0',
      questions: [
        {
          id: '3-1',
          question: 'EPG não está carregando',
          answer: 'Verifique se a URL do EPG está configurada corretamente. Acesse Configurações > EPG > Atualizar EPG.'
        },
        {
          id: '3-2',
          question: 'Como atualizar o guia de programação?',
          answer: 'Deslize para baixo na tela do EPG ou acesse Configurações > EPG > Atualizar Agora.'
        }
      ]
    },
    {
      id: '4',
      title: 'Playlists e Canais',
      icon: 'format-list-bulleted',
      color: '#FF9800',
      questions: [
        {
          id: '4-1',
          question: 'Como importar playlist M3U?',
          answer: 'Vá em Configurações > Playlists > Importar. Você pode importar via URL ou arquivo local.'
        },
        {
          id: '4-2',
          question: 'Canais não aparecendo',
          answer: 'Verifique se a playlist foi importada corretamente. Tente atualizar a lista na tela principal.'
        }
      ]
    },
    {
      id: '5',
      title: 'Download e Conteúdo Offline',
      icon: 'download',
      color: '#F44336',
      questions: [
        {
          id: '5-1',
          question: 'Como baixar conteúdo para assistir offline?',
          answer: 'Na lista de canais ou VOD, pressione e segure o item e selecione "Download". Configure a qualidade antes de baixar.'
        },
        {
          id: '5-2',
          question: 'Vídeos baixados não funcionam',
          answer: 'Verifique se o aplicativo tem permissão de armazenamento. Reinicie o app e tente novamente.'
        }
      ]
    },
    {
      id: '6',
      title: 'Conta e Assinatura',
      icon: 'account-circle',
      color: '#607D8B',
      questions: [
        {
          id: '6-1',
          question: 'Como renovar minha assinatura?',
          answer: 'Entre em contato com seu provedor. As renovações são feitas diretamente com o provedor do serviço.'
        },
        {
          id: '6-2',
          question: 'Mudar de dispositivo',
          answer: 'Você pode usar a mesma conta em até 3 dispositivos simultâneos. Para mudar, faça login com as mesmas credenciais.'
        }
      ]
    }
  ];

  // Tutoriais rápidos
  const quickTutorials = [
    {
      id: 't1',
      title: 'Configuração Inicial',
      duration: '3 min',
      icon: 'settings'
    },
    {
      id: 't2',
      title: 'Usar EPG',
      duration: '2 min',
      icon: 'tv'
    },
    {
      id: 't3',
      title: 'Download de Conteúdo',
      duration: '4 min',
      icon: 'download'
    },
    {
      id: 't4',
      title: 'Configurar Parental',
      duration: '2 min',
      icon: 'lock'
    }
  ];

  // Contatos de suporte
  const supportContacts = [
    {
      id: 'c1',
      type: 'WhatsApp',
      contact: '+55 (11) 99999-9999',
      icon: 'whatsapp',
      color: '#25D366'
    },
    {
      id: 'c2',
      type: 'Email',
      contact: 'suporte@asiptv.com',
      icon: 'email',
      color: '#EA4335'
    },
    {
      id: 'c3',
      type: 'Telegram',
      contact: '@as_iptv_suporte',
      icon: 'telegram',
      color: '#0088cc'
    }
  ];

  // FAQ filtrado por pesquisa
  const filteredFAQ = helpCategories.flatMap(category =>
    category.questions.filter(q =>
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleContactPress = (type: string, contact: string) => {
    let url = '';
    switch (type) {
      case 'WhatsApp':
        url = `https://wa.me/${contact.replace(/\D/g, '')}`;
        break;
      case 'Email':
        url = `mailto:${contact}`;
        break;
      case 'Telegram':
        url = `https://t.me/${contact.replace('@', '')}`;
        break;
    }

    Linking.openURL(url).catch(err =>
      Alert.alert('Erro', 'Não foi possível abrir o aplicativo')
    );
  };

  const renderQuestion = ({ item }: any) => (
    <TouchableOpacity
      style={styles.questionCard}
      onPress={() => setActiveSection(activeSection === item.id ? null : item.id)}
    >
      <View style={styles.questionHeader}>
        <Text style={styles.questionText}>{item.question}</Text>
        <MaterialIcons
          name={activeSection === item.id ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
          size={24}
          color="#ffffffff"
        />
      </View>
      {activeSection === item.id && (
        <View style={styles.answerContainer}>
          <Text style={styles.answerText}>{item.answer}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderCategory = ({ item }: any) => (
    <TouchableOpacity
      style={[styles.categoryCard, { borderLeftColor: item.color }]}
      onPress={() => setActiveSection(activeSection === item.id ? null : item.id)}
    >
      <View style={styles.categoryHeader}>
        <View style={[styles.categoryIcon, { backgroundColor: item.color }]}>
          <MaterialCommunityIcons name={item.icon} size={24} color="#fff" />
        </View>
        <View style={styles.categoryInfo}>
          <Text style={styles.categoryTitle}>{item.title}</Text>
          <Text style={styles.categoryCount}>{item.questions.length} perguntas</Text>
        </View>
        <MaterialIcons
          name={activeSection === item.id ? 'expand-less' : 'expand-more'}
          size={24}
          color="#ffffffff"
        />
      </View>

      {activeSection === item.id && (
        <View style={styles.questionsList}>
          {item.questions.map(question => (
            <TouchableOpacity
              key={question.id}
              style={styles.categoryQuestion}
              onPress={() => {
                // Implementar navegação para detalhe da pergunta
                Alert.alert(question.question, question.answer);
              }}
            >
              <MaterialIcons name="help-outline" size={18} color="#ffffffff" />
              <Text style={styles.categoryQuestionText}>{question.question}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Cabeçalho */}
          <LinearGradient
            colors={['#7e1a1aff', '#a70101ff', '#812a2aff']}
            style={styles.header}
          >
            <View style={styles.headerContent}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
              >
                <Ionicons name="arrow-back" size={24} color="#fff" />
              </TouchableOpacity>
              <View>
                <Text style={styles.headerTitle}>Central de Ajuda</Text>
                <Text style={styles.headerSubtitle}>AS IPTV - Suporte Técnico</Text>
              </View>
              <MaterialCommunityIcons name="help-circle" size={32} color="#fff" />
            </View>
          </LinearGradient>

          {/* Barra de Pesquisa */}
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Feather name="search" size={20} color="#ffffffff" />
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar na ajuda..."
                placeholderTextColor="#999"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <MaterialIcons name="close" size={20} color="#ffffffff" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Resultados da Pesquisa */}
          {searchQuery.length > 0 ? (
            <View style={styles.resultsContainer}>
              <Text style={styles.resultsTitle}>
                {filteredFAQ.length} resultado{filteredFAQ.length !== 1 ? 's' : ''} para "{searchQuery}"
              </Text>
              <FlatList
                data={filteredFAQ}
                renderItem={renderQuestion}
                keyExtractor={item => item.id}
                scrollEnabled={false}
              />
            </View>
          ) : (
            <>
              {/* Categorias de Ajuda */}
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Categorias de Ajuda</Text>
              </View>

              <FlatList
                data={helpCategories}
                renderItem={renderCategory}
                keyExtractor={item => item.id}
                scrollEnabled={false}
              />

              {/* Contatos de Suporte */}
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Contato Direto</Text>
              </View>

              <View style={styles.contactsContainer}>
                {supportContacts.map(contact => (
                  <TouchableOpacity
                    key={contact.id}
                    style={styles.contactCard}
                    onPress={() => handleContactPress(contact.type, contact.contact)}
                  >
                    <View style={[styles.contactIcon, { backgroundColor: contact.color }]}>
                      <MaterialCommunityIcons name={contact.icon} size={24} color="#fff" />
                    </View>
                    <View style={styles.contactInfo}>
                      <Text style={styles.contactType}>{contact.type}</Text>
                      <Text style={styles.contactDetail}>{contact.contact}</Text>
                    </View>
                    <MaterialIcons name="chevron-right" size={24} color="#f1f1f1ff" />
                  </TouchableOpacity>
                ))}
              </View>

              {/* Dicas Rápidas */}
              <View style={styles.tipsContainer}>
                <Text style={styles.tipsTitle}>Dicas Rápidas</Text>
                <View style={styles.tipItem}>
                  <MaterialIcons name="check-circle" size={20} color="#4CAF50" />
                  <Text style={styles.tipText}>Use conexão Wi-Fi para melhor qualidade</Text>
                </View>
                <View style={styles.tipItem}>
                  <MaterialIcons name="check-circle" size={20} color="#4CAF50" />
                  <Text style={styles.tipText}>Atualize a lista de canis semanalmente</Text>
                </View>
                <View style={styles.tipItem}>
                  <MaterialIcons name="check-circle" size={20} color="#4CAF50" />
                  <Text style={styles.tipText}>Limpe o cache do app periodicamente</Text>
                </View>
              </View>
            </>
          )}

          {/* Informações do Sistema */}
          <View style={styles.systemInfo}>
            <Text style={styles.systemTitle}>Informações do Sistema</Text>
            <View style={styles.systemRow}>
              <Text style={styles.systemLabel}>Versão do App:</Text>
              <Text style={styles.systemValue}>AS IPTV 1.0.0</Text>
            </View>
            <View style={styles.systemRow}>
              <Text style={styles.systemLabel}>Suporte até:</Text>
              <Text style={styles.systemValue}>Android 14 </Text>
            </View>
          </View>

          {/* Botão de Reportar Problema */}
          <TouchableOpacity
            style={styles.reportButton}
            onPress={() => Alert.alert('Reportar', 'Em breve você poderá reportar problemas diretamente pelo app.')}
          >
            <MaterialIcons name="bug-report" size={24} color="#fff" />
            <Text style={styles.reportButtonText}>Reportar Problema</Text>
          </TouchableOpacity>

          {/* Rodapé */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              AS IPTV © 2024 - Suporte Técnico Especializado em IPTV
            </Text>
            <Text style={styles.footerHours}>
              Horário de Atendimento: Seg-Sex 9h-18h
            </Text>
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
    paddingBottom: 30,
  },
  header: {
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#e8eaf6',
    textAlign: 'center',
    marginTop: 5,
  },
  searchContainer: {
    padding: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffffff',
  },
  seeAllText: {
    color: '#ffffffff',
    fontWeight: '500',
  },
  tutorialsScroll: {
    marginBottom: 20,
  },
  tutorialsContainer: {
    paddingHorizontal: 20,
  },
  tutorialCard: {
    backgroundColor: '#3a3a3aff',
    borderRadius: 12,
    padding: 15,
    width: 150,
    marginRight: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tutorialIcon: {
    backgroundColor: '#a70101ff',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  tutorialTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  tutorialDuration: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationText: {
    fontSize: 12,
    color: '#e2e2e2ff',
    marginLeft: 5,
  },
  resultsContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  resultsTitle: {
    fontSize: 16,
    color: '#eeeeeeff',
    marginBottom: 15,
  },
  questionCard: {
    backgroundColor: '#555353ff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  questionText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#ffffffff',
    flex: 1,
    marginRight: 10,
  },
  answerContainer: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  answerText: {
    fontSize: 14,
    color: '#ffffffff',
    lineHeight: 20,
  },
  categoryCard: {
    backgroundColor: '#555353ff',
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 4,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryInfo: {
    flex: 1,
    marginLeft: 15,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffffff',
  },
  categoryCount: {
    fontSize: 12,
    color: '#e6e3e3ff',
    marginTop: 3,
  },
  questionsList: {
    marginTop: 15,
  },
  categoryQuestion: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingLeft: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  categoryQuestionText: {
    fontSize: 14,
    color: '#fafafaff',
    marginLeft: 10,
    flex: 1,
  },
  contactsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#555353ff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  contactIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactInfo: {
    flex: 1,
    marginLeft: 15,
  },
  contactType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffffff',
  },
  contactDetail: {
    fontSize: 14,
    color: '#f3f1f1ff',
    marginTop: 3,
  },
  tipsContainer: {
    backgroundColor: '#555353ff',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffffff',
    marginBottom: 15,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipText: {
    fontSize: 14,
    color: '#dadadaff',
    marginLeft: 10,
    flex: 1,
  },
  systemInfo: {
    backgroundColor: '#555353ff',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  systemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffffff',
    marginBottom: 15,
  },
  systemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  systemLabel: {
    fontSize: 14,
    color: '#ffffffff',
  },
  systemValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffffff',
  },
  reportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F44336',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  reportButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  footer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  footerText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 5,
  },
  footerHours: {
    fontSize: 11,
    color: '#999',
    textAlign: 'center',
  },
});