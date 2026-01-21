import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView, } from 'react-native-safe-area-context';

import * as FileSystem from 'expo-file-system/legacy';

import { useRouter } from 'expo-router';

// Função da API 
const api = async (value: string) => {
    try {
        let url = await AsyncStorage.getItem('url');
        const username = await AsyncStorage.getItem('username');
        const password = await AsyncStorage.getItem('password');
        const urlApi = `${url}/player_api.php?username=${username}&password=${password}&action=${value}`;
        console.log('API URL:', urlApi);
        const result = await (await fetch(urlApi)).json();
        return result;
    } catch (e) {
        console.log("Erro ao buscar dados " + e);
        throw e;
    }
};

export default function LoadingScreen() {

    const router = useRouter();
    const [connectionStatus, setConnectionStatus] = useState({
        server: 'Conectando...',
        progress: 0,
        status: 'Conectando ao servidor...'
    });

    const [downloads, setDownloads] = useState({
        liveCategories: {
            name: 'Categorias TV Ao Vivo',
            total: 0,
            downloaded: 0,
            progress: 0,
            status: 'Aguardando...',
            data: []
        },
        liveStreams: {
            name: 'Canais TV Ao Vivo',
            total: 0,
            downloaded: 0,
            progress: 0,
            status: 'Aguardando...',
            data: []
        },
        vodCategories: {
            name: 'Categorias de Filmes',
            total: 0,
            downloaded: 0,
            progress: 0,
            status: 'Aguardando...',
            data: []
        },
        vodStreams: {
            name: 'Filmes (VOD)',
            total: 0,
            downloaded: 0,
            progress: 0,
            status: 'Aguardando...',
            data: []
        },
        seriesCategories: {
            name: 'Categorias de Séries',
            total: 0,
            downloaded: 0,
            progress: 0,
            status: 'Aguardando...',
            data: []
        },
        series: {
            name: 'Séries',
            total: 0,
            downloaded: 0,
            progress: 0,
            status: 'Aguardando...',
            data: []
        },
        epg: {
            name: 'Guia de Programação',
            total: 0,
            downloaded: 0,
            progress: 0,
            status: 'Aguardando...',
            data: []
        }
    });

    const [currentStep, setCurrentStep] = useState(0);
    const [overallProgress, setOverallProgress] = useState(0);
    const [logMessages, setLogMessages] = useState([]);
    const [error, setError] = useState(null);
    const [retryCount, setRetryCount] = useState(0);

    const steps = [
        { id: 0, name: 'Teste de Conexão', icon: 'wifi', action: 'testConnection' },
        { id: 1, name: 'Categorias TV', icon: 'format-list-bulleted', action: 'get_live_categories' },
        { id: 2, name: 'Canais TV', icon: 'live-tv', action: 'get_live_streams' },
        { id: 3, name: 'Categorias Filmes', icon: 'movie-filter', action: 'get_vod_categories' },
        { id: 4, name: 'Filmes', icon: 'movie', action: 'get_vod_streams' },
        { id: 5, name: 'Categorias Séries', icon: 'tv', action: 'get_series_categories' },
        { id: 6, name: 'Séries', icon: 'theaters', action: 'get_series' },
        { id: 7, name: 'EPG', icon: 'schedule', action: 'get_epg' }
    ];


    const saveDataStream = async (fileName: string, data: object) => {
        try {
            const fileUri = `${FileSystem.documentDirectory}${fileName}`;
            const dataString = JSON.stringify(data);
            await FileSystem.writeAsStringAsync(fileUri, dataString);
            console.log(`Arquivo salvo com sucesso em: ${fileUri}`);
        } catch (error) {
            console.error('Erro ao salvar o arquivo:', error);
        }
    };
    

    const addLog = (message, type = 'info') => {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = `[${timestamp}] ${message}`;

        setLogMessages(prev => {
            const newLogs = [...prev, { message: logEntry, type }];
            return newLogs.slice(-10);
        });

        console.log(`[${type.toUpperCase()}] ${message}`);
    };

    const updateDownloadProgress = (category, progress, status, data = null) => {
        setDownloads(prev => {
            const updated = { ...prev };
            if (data) {
                updated[category] = {
                    ...updated[category],
                    progress,
                    status,
                    data,
                    total: Array.isArray(data) ? data.length : 1,
                    downloaded: progress === 100 ? (Array.isArray(data) ? data.length : 1) : 0
                };
            } else {
                updated[category] = {
                    ...updated[category],
                    progress,
                    status
                };
            }
            return updated;
        });
    };

    const calculateOverallProgress = () => {
        const totalSteps = steps.length;
        const completedSteps = steps.filter((_, index) => index < currentStep).length;
        const currentStepProgress = downloads[getDownloadCategory(currentStep)]?.progress || 0;

        const stepWeight = 100 / totalSteps;
        const progress = (completedSteps * stepWeight) + ((currentStepProgress / 100) * stepWeight);

        return Math.min(progress, 100);
    };

    const getDownloadCategory = (stepIndex) => {
        switch (stepIndex) {
            case 0: return null; 
            case 1: return 'liveCategories';
            case 2: return 'liveStreams';
            case 3: return 'vodCategories';
            case 4: return 'vodStreams';
            case 5: return 'seriesCategories';
            case 6: return 'series';
            case 7: return 'epg';
            default: return null;
        }
    };

    const testConnection = async () => {
        try {
            addLog('Testando conexão com o servidor...');
            setConnectionStatus({
                server: 'Conectando...',
                progress: 25,
                status: 'Validando credenciais...'
            });

            // Primeiro, testamos com uma chamada simples
            const testResult = await api('get_live_categories');

            if (testResult && !testResult.error) {
                addLog('✅ Conexão estabelecida com sucesso!', 'success');
                setConnectionStatus({
                    server: 'Conectado',
                    progress: 100,
                    status: 'Servidor pronto'
                });
                return true;
            } else {
                throw new Error('Resposta inválida do servidor');
            }
        } catch (error) {
            addLog(`❌ Falha na conexão: ${error.message}`, 'error');
            setConnectionStatus({
                server: 'Falha',
                progress: 0,
                status: 'Erro de conexão'
            });
            throw error;
        }
    };

    const fetchData = async (action, category) => {
        try {
            addLog(`Baixando ${downloads[category].name}...`);
            updateDownloadProgress(category, 25, 'Baixando...');

            const data = await api(action);

            if (data && !data.error) {
                updateDownloadProgress(category, 100, 'Concluído', data);
                addLog(`✅ ${downloads[category].name}: ${Array.isArray(data) ? data.length : 1} itens`, 'success');

                // Salvar no AsyncStorage para uso futuro
                saveDataStream(`iptv_${category}.json`, data)
                // await AsyncStorage.setItem(`iptv_${category}`, JSON.stringify(data));
                   
                return data;
            } else {
                throw new Error(data?.error || 'Dados inválidos');
            }
        } catch (error) {
            updateDownloadProgress(category, 0, 'Falha');
            addLog(`❌ Erro ao baixar ${downloads[category].name}: ${error.message}`, 'error');
            throw error;
        }
    };

    const processStep = async (stepIndex) => {
        const step = steps[stepIndex];
        setCurrentStep(stepIndex);

        switch (step.action) {
            case 'testConnection':
                await testConnection();
                break;

            case 'get_live_categories':
                await fetchData('get_live_categories', 'liveCategories');
                break;

            case 'get_live_streams':
                await fetchData('get_live_streams', 'liveStreams');
                break;

            case 'get_vod_categories':
                await fetchData('get_vod_categories', 'vodCategories');
                break;

            case 'get_vod_streams':
                await fetchData('get_vod_streams', 'vodStreams');
                break;

            case 'get_series_categories':
                await fetchData('get_series_categories', 'seriesCategories');
                break;

            case 'get_series':
                await fetchData('get_series', 'series');
                break;

            case 'get_epg':
                await fetchData('get_epg', 'epg');
                break;

            default:
                addLog(`Ação desconhecida: ${step.action}`, 'warning');
        }
    };

    const startLoadingProcess = async () => {
        try {
            setError(null);
            addLog('🚀 Iniciando processo de carregamento do AS IPTV...');

            // Verificar se temos credenciais salvas
            const url = await AsyncStorage.getItem('url');
            const username = await AsyncStorage.getItem('username');
            const password = await AsyncStorage.getItem('password');

            if (!url || !username || !password) {
                addLog('❌ Credenciais não encontradas. Redirecionando para login...', 'error');
                setTimeout(() => {
                    router.replace('/login');
                }, 2000);
                return;
            }

            addLog(`Conectando em: ${url}`, 'info');
            addLog(`Usuário: ${username}`, 'info');

            // Processar cada etapa sequencialmente
            for (let i = 0; i < steps.length; i++) {
                await processStep(i);

                // Atualizar progresso geral
                setOverallProgress(calculateOverallProgress());
            }

            // Todas as etapas concluídas com sucesso
            addLog('🎉 Todos os dados foram carregados com sucesso!', 'success');
            addLog('Preparando interface...', 'info');

            // Salvar timestamp da última atualização
            await AsyncStorage.setItem('lastUpdate', new Date().toISOString());

            // Navegar para a tela principal após 2 segundos
            setTimeout(() => {
                router.replace('/(tabs)');
            }, 2000);

        } catch (error) {
            addLog(`❌ Erro no processo de carregamento: ${error.message}`, 'error');
            setError(error.message);
        }
    };

    const retryConnection = () => {
        if (retryCount < 3) {
            addLog(`Tentativa ${retryCount + 1} de 3...`, 'warning');
            setRetryCount(prev => prev + 1);
            startLoadingProcess();
        } else {
            Alert.alert(
                'Erro de Conexão',
                'Não foi possível conectar ao servidor após várias tentativas. Verifique suas credenciais e conexão.',
                [
                    {
                        text: 'Configurar Novamente',
                        onPress: () => router.replace('/login')
                    },
                    {
                        text: 'Tentar Novamente',
                        onPress: () => {
                            setRetryCount(0);
                            startLoadingProcess();
                        }
                    }
                ]
            );
        }
    };

    useEffect(() => {
        startLoadingProcess();
    }, []);

    useEffect(() => {
        const progress = calculateOverallProgress();
        setOverallProgress(progress);
    }, [currentStep, downloads]);

    const getStepIcon = (stepIndex) => {
        if (stepIndex < currentStep) return 'check-circle';
        if (stepIndex === currentStep) return 'progress-clock';
        return 'clock-outline';
    };

    const getStepColor = (stepIndex) => {
        if (stepIndex < currentStep) return '#4CAF50';
        if (stepIndex === currentStep) return '#a70101ff';
        return '#666';
    };

    const getTotalItems = () => {
        const totals = {
            live: downloads.liveStreams.total || 0,
            movies: downloads.vodStreams.total || 0,
            series: downloads.series.total || 0,
            epg: downloads.epg.total || 0
        };

        return {
            ...totals,
            total: totals.live + totals.movies + totals.series
        };
    };

    const totals = getTotalItems();

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar
                barStyle="light-content"
                backgroundColor="#7e1a1aff"
            />

            <LinearGradient
                colors={['#7e1a1aff', '#a70101ff', '#812a2aff']}
                style={styles.header}
            >
                <View style={styles.headerContent}>
                    <MaterialIcons name="live-tv" size={40} color="#fff" />
                    <View style={styles.headerText}>
                        <Text style={styles.appName}>AS IPTV</Text>
                        <Text style={styles.appTagline}>
                            {error ? 'Erro de Conexão' : 'Sincronizando com o servidor...'}
                        </Text>
                    </View>
                </View>
            </LinearGradient>

            <ScrollView style={styles.content}>
                {error ? (
                    <View style={styles.errorContainer}>
                        <MaterialIcons name="error-outline" size={60} color="#FF5252" />
                        <Text style={styles.errorTitle}>Erro de Conexão</Text>
                        <Text style={styles.errorMessage}>{error}</Text>

                        <TouchableOpacity
                            style={styles.retryButton}
                            onPress={retryConnection}
                        >
                            <MaterialIcons name="refresh" size={24} color="#fff" />
                            <Text style={styles.retryButtonText}>
                                {retryCount < 3 ? 'TENTAR NOVAMENTE' : 'VERIFICAR CREDENCIAIS'}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => router.replace('/login')}
                        >
                            <Text style={styles.backButtonText}>Voltar para Login</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <>
                        {/* Status da Conexão */}
                        <View style={styles.connectionCard}>
                            <View style={styles.cardHeader}>
                                <MaterialCommunityIcons
                                    name={connectionStatus.server === 'Conectado' ? 'server-network' : 'server-off'}
                                    size={24}
                                    color={connectionStatus.server === 'Conectado' ? '#4CAF50' : '#FFA000'}
                                />
                                <Text style={styles.cardTitle}>Status do Servidor</Text>
                            </View>

                            <View style={styles.connectionInfo}>
                                <View style={styles.connectionStatus}>
                                    <View style={[
                                        styles.statusDot,
                                        {
                                            backgroundColor: connectionStatus.server === 'Conectado' ? '#4CAF50' :
                                                connectionStatus.server === 'Falha' ? '#FF5252' : '#FFA000'
                                        }
                                    ]} />
                                    <Text style={styles.statusText}>{connectionStatus.status}</Text>
                                </View>

                                <View style={styles.connectionProgress}>
                                    <View style={styles.progressBar}>
                                        <View
                                            style={[
                                                styles.progressFill,
                                                { width: `${connectionStatus.progress}%` }
                                            ]}
                                        />
                                    </View>
                                    <Text style={styles.progressText}>{connectionStatus.progress}%</Text>
                                </View>
                            </View>
                        </View>

                        {/* Progresso Geral */}
                        <View style={styles.overallProgressCard}>
                            <View style={styles.cardHeader}>
                                <MaterialIcons name="dashboard" size={24} color="#fff" />
                                <Text style={styles.cardTitle}>Progresso Geral</Text>
                            </View>

                            <View style={styles.progressContainer}>
                                <View style={styles.progressBar}>
                                    <View
                                        style={[
                                            styles.progressFill,
                                            { width: `${overallProgress}%` }
                                        ]}
                                    />
                                </View>
                                <Text style={styles.progressText}>{Math.round(overallProgress)}%</Text>
                            </View>

                            <Text style={styles.progressSubtext}>
                                {currentStep === steps.length - 1 && overallProgress >= 100 ?
                                    'Sincronização concluída!' :
                                    `Etapa ${currentStep + 1} de ${steps.length}`}
                            </Text>
                        </View>

                        {/* Etapas de Sincronização */}
                        <View style={styles.stepsCard}>
                            <View style={styles.cardHeader}>
                                <MaterialIcons name="sync" size={24} color="#fff" />
                                <Text style={styles.cardTitle}>Etapas de Sincronização</Text>
                            </View>

                            {steps.map((step, index) => (
                                <View key={step.id} style={styles.stepItem}>
                                    <View style={styles.stepIconContainer}>
                                        <MaterialCommunityIcons
                                            name={getStepIcon(index)}
                                            size={22}
                                            color={getStepColor(index)}
                                        />
                                    </View>
                                    <Text style={[
                                        styles.stepText,
                                        { color: getStepColor(index) }
                                    ]}>
                                        {step.name}
                                    </Text>
                                    {index < currentStep && (
                                        <MaterialIcons name="check" size={20} color="#4CAF50" />
                                    )}
                                </View>
                            ))}
                        </View>

                        {/* Downloads em Progresso */}
                        <View style={styles.downloadsCard}>
                            <View style={styles.cardHeader}>
                                <MaterialIcons name="cloud-download" size={24} color="#fff" />
                                <Text style={styles.cardTitle}>Downloads em Andamento</Text>
                            </View>

                            {Object.entries(downloads).map(([key, item]) => (
                                item.progress > 0 && (
                                    <View key={key} style={styles.downloadItem}>
                                        <View style={styles.downloadInfo}>
                                            <MaterialCommunityIcons
                                                name={key.includes('live') ? 'satellite-variant' :
                                                    key.includes('vod') ? 'movie' :
                                                        key.includes('series') ? 'television' : 'calendar-text'}
                                                size={18}
                                                color="#a70101ff"
                                            />
                                            <View style={styles.downloadDetails}>
                                                <Text style={styles.downloadName}>{item.name}</Text>
                                                <Text style={styles.downloadStatus}>{item.status}</Text>
                                            </View>
                                        </View>

                                        <View style={styles.downloadProgress}>
                                            <View style={styles.downloadBar}>
                                                <View
                                                    style={[
                                                        styles.downloadFill,
                                                        { width: `${item.progress}%` }
                                                    ]}
                                                />
                                            </View>
                                            <Text style={styles.downloadStats}>
                                                {item.total > 0 ? `${item.total} itens` : 'Processando...'}
                                            </Text>
                                        </View>
                                    </View>
                                )
                            ))}
                        </View>

                        {/* Estatísticas */}
                        <View style={styles.statsCard}>
                            <View style={styles.cardHeader}>
                                <MaterialIcons name="insert-chart" size={24} color="#fff" />
                                <Text style={styles.cardTitle}>Estatísticas</Text>
                            </View>

                            <View style={styles.statsGrid}>
                                <View style={styles.statBox}>
                                    <MaterialIcons name="live-tv" size={28} color="#FF5252" />
                                    <Text style={styles.statNumber}>{totals.live}</Text>
                                    <Text style={styles.statLabel}>Canais TV</Text>
                                </View>

                                <View style={styles.statBox}>
                                    <MaterialIcons name="movie" size={28} color="#4CAF50" />
                                    <Text style={styles.statNumber}>{totals.movies}</Text>
                                    <Text style={styles.statLabel}>Filmes</Text>
                                </View>

                                <View style={styles.statBox}>
                                    <MaterialIcons name="tv" size={28} color="#2196F3" />
                                    <Text style={styles.statNumber}>{totals.series}</Text>
                                    <Text style={styles.statLabel}>Séries</Text>
                                </View>

                                <View style={styles.statBox}>
                                    <MaterialIcons name="schedule" size={28} color="#FF9800" />
                                    <Text style={styles.statNumber}>{totals.epg}</Text>
                                    <Text style={styles.statLabel}>EPG</Text>
                                </View>
                            </View>
                        </View>

                        {/* Log do Sistema */}
                        <View style={styles.logCard}>
                            <View style={styles.cardHeader}>
                                <MaterialIcons name="history" size={24} color="#fff" />
                                <Text style={styles.cardTitle}>Log do Sistema</Text>
                            </View>

                            <View style={styles.logContent}>
                                {logMessages.slice().reverse().map((log, index) => (
                                    <Text
                                        key={index}
                                        style={[
                                            styles.logMessage,
                                            log.type === 'error' && styles.logError,
                                            log.type === 'success' && styles.logSuccess,
                                            log.type === 'warning' && styles.logWarning
                                        ]}
                                    >
                                        {log.message}
                                    </Text>
                                ))}
                            </View>
                        </View>
                    </>
                )}
            </ScrollView>

            {/* Rodapé */}
            <View style={styles.footer}>
                <View style={styles.footerContent}>
                    <MaterialIcons
                        name={error ? "error" : "info"}
                        size={16}
                        color={error ? "#FF5252" : "#888"}
                    />
                    <Text style={[styles.footerText, error && styles.footerError]}>
                        {error ? 'Erro detectado' : 'Sincronizando com o servidor...'}
                    </Text>
                </View>
                <Text style={styles.version}>Xtream Codes API</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000ff',
    },
    header: {
        paddingTop: StatusBar.currentHeight + 20,
        paddingBottom: 20,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerText: {
        marginLeft: 15,
    },
    appName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
    },
    appTagline: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 2,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    // Cards Gerais
    connectionCard: {
        backgroundColor: '#1a1a1aff',
        borderRadius: 15,
        padding: 20,
        marginBottom: 15,
    },
    overallProgressCard: {
        backgroundColor: '#1a1a1aff',
        borderRadius: 15,
        padding: 20,
        marginBottom: 15,
    },
    stepsCard: {
        backgroundColor: '#1a1a1aff',
        borderRadius: 15,
        padding: 20,
        marginBottom: 15,
    },
    downloadsCard: {
        backgroundColor: '#1a1a1aff',
        borderRadius: 15,
        padding: 20,
        marginBottom: 15,
    },
    statsCard: {
        backgroundColor: '#1a1a1aff',
        borderRadius: 15,
        padding: 20,
        marginBottom: 15,
    },
    logCard: {
        backgroundColor: '#1a1a1aff',
        borderRadius: 15,
        padding: 20,
        marginBottom: 20,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginLeft: 10,
    },
    // Status da Conexão
    connectionInfo: {
        marginTop: 10,
    },
    connectionStatus: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    statusDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 10,
    },
    statusText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '500',
    },
    connectionProgress: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    progressBar: {
        flex: 1,
        height: 8,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 4,
        overflow: 'hidden',
        marginRight: 15,
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#a70101ff',
        borderRadius: 4,
    },
    progressText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        minWidth: 40,
    },
    progressSubtext: {
        fontSize: 12,
        color: '#888',
        marginTop: 5,
    },
    // Progresso Geral
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    // Etapas
    stepItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    stepIconContainer: {
        width: 40,
    },
    stepText: {
        flex: 1,
        fontSize: 14,
        fontWeight: '500',
    },
    // Downloads
    downloadItem: {
        marginBottom: 20,
    },
    downloadInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    downloadDetails: {
        marginLeft: 10,
        flex: 1,
    },
    downloadName: {
        fontSize: 14,
        fontWeight: '500',
        color: '#fff',
        marginBottom: 2,
    },
    downloadStatus: {
        fontSize: 12,
        color: '#888',
    },
    downloadProgress: {
        marginLeft: 30,
    },
    downloadBar: {
        height: 6,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 3,
        overflow: 'hidden',
        marginBottom: 5,
    },
    downloadFill: {
        height: '100%',
        backgroundColor: '#a70101ff',
        borderRadius: 3,
    },
    downloadStats: {
        fontSize: 11,
        color: '#888',
        textAlign: 'right',
    },
    // Estatísticas
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    },
    statBox: {
        width: '48%',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginVertical: 5,
    },
    statLabel: {
        fontSize: 12,
        color: '#888',
        textTransform: 'uppercase',
    },
    // Log
    logContent: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 8,
        padding: 15,
        maxHeight: 200,
    },
    logMessage: {
        fontSize: 11,
        color: '#aaa',
        fontFamily: 'monospace',
        marginBottom: 5,
        lineHeight: 16,
    },
    logError: {
        color: '#FF5252',
    },
    logSuccess: {
        color: '#4CAF50',
    },
    logWarning: {
        color: '#FF9800',
    },
    // Erro
    errorContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
    },
    errorTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 20,
        marginBottom: 10,
    },
    errorMessage: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.7)',
        textAlign: 'center',
        marginBottom: 30,
        paddingHorizontal: 20,
    },
    retryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#a70101ff',
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 25,
        marginBottom: 15,
    },
    retryButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 10,
    },
    backButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    backButtonText: {
        color: '#a70101ff',
        fontWeight: '500',
    },
    // Rodapé
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderTopWidth: 1,
        borderTopColor: '#333',
        backgroundColor: '#0a0a0aff',
    },
    footerContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    footerText: {
        fontSize: 12,
        color: '#888',
        marginLeft: 8,
    },
    footerError: {
        color: '#FF5252',
    },
    version: {
        fontSize: 12,
        color: '#666',
    },
});