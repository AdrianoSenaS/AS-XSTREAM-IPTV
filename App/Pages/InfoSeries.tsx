import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, ImageBackground, Modal, FlatList } from 'react-native';
import { Image } from 'expo-image';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ScreenOrientation from 'expo-screen-orientation';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function infoSeries({ navigation, route }: any) {
    const { series_id, title, image, description, year, } = route.params
    const [urlhls, Seturlhls] = useState(String)
    const [modalVisible, setModalVisible] = useState(false);
    const [SeasonFlatList, SetSeasonFlatList] = useState<any>([])
    const [EpisodesFlatlist, SetEpisodesFlatlist] = useState<any>([])
    const [Season, SetSeason] = useState(String)
    const [user, SetUser] = useState('')
    const [Pass, SetPass] = useState('')


    const GetSeason = async ()=>{
        const url = await AsyncStorage.getItem('url')
        const username = await AsyncStorage.getItem('username')
        const password = await AsyncStorage.getItem('password')
        if (url != null && username != null && password != null) {
            const urlApi = `${url}/player_api.php?username=${username}&password=${password}&action=`
            const response = await fetch(`${urlApi}get_series_info&series_id=${series_id}`)
            SetUser(username)
            SetPass(password)
            const Season = await response.json();
            Seturlhls(url)
            let AllEp:any[] = [] 
            let AllSe:any[] =[]

            Object.keys(Season.episodes).forEach(season => {
                AllSe.push({"season":season})
                if(season === "1"){
                    SetSeason(season)
                }
                Season.episodes[season].forEach((ep:any) => {
                  
                    AllEp.push({
                        "id":ep.id,
                        "episode_num":ep.episode_num,
                        "title":ep.title,
                        "container_extension":ep.container_extension,
                         "season":ep.season
                    })
                });
               
            })
            SetSeasonFlatList(AllSe)
            SetEpisodesFlatlist(AllEp)
            console.log(AllEp)
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
                        keyExtractor={(item:any)=>item.season}
                         renderItem={(seasons)=>(
                         <TouchableOpacity
                            style={styles.modalView}
                            onPress={() => {SetSeason(seasons.item.season), setModalVisible(!modalVisible)} }>
                            <Text style={styles.textStyle}>{`${seasons.item.season}° Temporada`}</Text>
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
                       
                        <Text style={styles.description}>{description}</Text>
                        {
                            (() => {
                                if (Season !== '') {
                                    return (
                                        <TouchableOpacity
                                            onPress={() => setModalVisible(!modalVisible)}
                                            style={styles.btnTemporadas}>
                                            <Text style={styles.TextTemporadas}>{`${Season}° Temporada`}</Text>
                                        </TouchableOpacity>
                                    )
                                }
                            })()
                        }
                        <FlatList
                            style={{ width: '100%', borderRadius: 5 }}
                         data={EpisodesFlatlist}
                        keyExtractor={(item:any)=>item.id}
                         renderItem={(episodes)=>{
                            if(episodes.item.season == Season)
                            {
                                return(
                                    <TouchableOpacity
                                    onPress={()=> navigation.navigate('Player', { urlhls:`${urlhls}/series/${user}/${Pass}/${episodes.item.id}${episodes.item.container_extension}`})}
                                    style={styles.modalView}>
                                    <Text style={styles.TextTemporadas}>{episodes.item.title}</Text>
                                    </TouchableOpacity>
                                )
                            }
                            return null;
                         }}/>
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
        borderColor: 'rgb(59, 59, 59)',
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
        fontSize:16
    },
    modalText: {
        marginBottom: 15,
    },
});
