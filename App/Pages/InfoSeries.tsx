import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, ImageBackground, Modal, FlatList } from 'react-native';
import { Image } from 'expo-image';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ScreenOrientation from 'expo-screen-orientation';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function infoSeries({ navigation, route }: any) {
    const { series_id, title, image, description, year, } = route.params
    const [urlhls, Seturlhls] = useState(null)
    const [modalVisible, setModalVisible] = useState(false);
    const [SeasonFlatList, SetSeasonFlatList] = useState<[]>([])
    const [EpisodesFlatlist, SetEpisodesFlatlist] = useState<[]>([])
    const [Season, SetSeason] = useState(String)


    const GetSeason = async ()=>{
        const url = await AsyncStorage.getItem('url')
        const username = await AsyncStorage.getItem('username')
        const password = await AsyncStorage.getItem('password')
        if (url != null && username != null && password != null) {
            const urlApi = `${url}/player_api.php?username=${username}&password=${password}&action=`
                    const response = await fetch(`${urlApi}get_series_info&series_id=${series_id}`)
            const Season = await response.json();

            Season.seasons.forEach((season: any) => {
                if (season.season_number === 1) {

                    SetSeason(season.name)
                    console.log(series_id)
                }

            })
            Object.keys(Season.episodes).forEach(season => {
                const episodes = Season.episodes[season];
                episodes.forEach((episode: any) => {
                   // console.log(`Temporada: ${season}, Episódio: ${episode.episode_num}, ID: ${episode.id}`);
                });
            });
            
            
            SetSeasonFlatList(Season.seasons)
            SetEpisodesFlatlist(Season.episodes)
           
        }
    }

    useEffect(() => {
        
        GetSeason()
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    }, [])

    return (
        <SafeAreaView style={styles.container}>
            <Modal
                animationType='slide'
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <View style={styles.centeredView}>
                    <View>
                        <FlatList
                            style={{ width: '100%', borderRadius: 5 }}
                         data={SeasonFlatList}
                        keyExtractor={(seasons:any)=>seasons.id}
                         renderItem={(seasons)=>(
                         <TouchableOpacity
                            style={styles.modalView}
                            onPress={() => setModalVisible(!modalVisible)}>
                            <Text style={styles.textStyle}>{seasons.item.name}</Text>
                        </TouchableOpacity>
                         )}/>
                    </View>
                </View>
            </Modal>
            <ImageBackground
                source={{ uri: image }}
                blurRadius={100}
                style={styles.container}>
                <ScrollView style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.76)' }}>
                    <Image source={{ uri: image }} style={styles.image} cachePolicy={'memory-disk'} />
                    <View style={styles.info}>
                        <Text style={styles.title}>{title}</Text>
                        <Text style={styles.releaseDate}>{`Lançado em: ${year} `}</Text>
                        <View style={styles.buttons}>
                            <TouchableOpacity onPress={() => navigation.navigate('Player', { urlhls: urlhls })} style={styles.btnAssitirBanner}>
                                <FontAwesome5 name="play" size={20} color="black" />
                                <Text style={styles.Textbanner}>Assistir</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => Alert.alert("NotificaÇão", "Em breve")} style={styles.btnAssitirBannerD}>
                                <FontAwesome5 name="arrow-down" size={24} color="#fff" />
                                <Text style={styles.TextbannerD}>Baixar</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.description}>{description}</Text>
                        {
                            (() => {
                                if (Season !== '') {
                                    return (
                                        <TouchableOpacity
                                            onPress={() => setModalVisible(!modalVisible)}
                                            style={styles.btnTemporadas}>
                                            <Text style={styles.TextTemporadas}>{Season}</Text>
                                        </TouchableOpacity>
                                    )
                                }
                            })()
                        }
                        
                    </View>
                </ScrollView>
            </ImageBackground>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#000',
    },
    card: {
        flex: 1,
        height: '100%',
        backgroundColor: '#fff',
    },
    image: {
        width: '100%',
        height: 300,
        resizeMode: 'stretch',
    },
    info: {
        padding: 10,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
    },
    description: {
        fontSize: 14,
        color: '#ccc',
        marginVertical: 10,
    },
    releaseDate: {
        fontSize: 14,
        color: '#aaa',
        marginBottom: 10,
    },
    buttons: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnAssitirBanner: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 5,
        width: '100%',
        marginBottom: 10,

    },
    btnAssitirBannerD: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor: 'rgb(68, 68, 68)',
        padding: 10,
        borderRadius: 5,
        width: '100%',
        marginBottom: 10,

    },
    Textbanner: {
        fontSize: 20,
        marginLeft: 10,
        fontWeight: '500',

    },
    TextbannerD: {
        fontSize: 20,
        marginLeft: 10,
        fontWeight: '500',
        color: '#fff'

    },
    btnTemporadas: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgb(68, 68, 68)',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        width: 150,
        marginBottom: 10,

    },
    TextTemporadas: {
        fontSize: 16,
        color: '#fff'

    },
    centeredView: {
        flex: 1,
        padding:10,
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.76)'
    },
    modalView: {
        padding:20,
        borderBottomWidth: 1,
        borderColor: '#2A3E48',
        backgroundColor: 'rgb(36, 36, 36)',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize:16
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
});
