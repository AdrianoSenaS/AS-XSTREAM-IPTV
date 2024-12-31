import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, StatusBar, TouchableOpacity, ImageBackground, SafeAreaView, ActivityIndicator} from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CountSelecao = Math.floor(Math.random() * 10)
const categoriesXstream = ["get_series","get_vod_streams", "get_live_streams"]
const CountCategories = Math.floor(Math.random()* categoriesXstream.length)
const Home: React.FC = ({ navigation }: any) => {
    const [Loanding, SetLoanding] = useState(true)
const [UserNameLabelScree, SetUserNameLabelScree] = useState('')
 const [ImageBanner, SetImageBanner] = useState('');
    const [Title, SetTitle] = useState("")
 const GetUserNameLabel = async()=>{
    const user = await AsyncStorage.getItem('name')
    user != null? SetUserNameLabelScree(user): null

 }

 const GetMovieDestaques = async ()=>{
    let url = await AsyncStorage.getItem('url')
    let username = await AsyncStorage.getItem('username')
    let password = await AsyncStorage.getItem('password')
    if(url != null && username != null && password != null){
        const urlApi = `${url}/player_api.php?username=${username}&password=${password}&action=${categoriesXstream[CountCategories]}`
        const response = (await fetch(urlApi))
        const data = await response.json();
        if(response.ok){
            data.forEach((movieBanner:any) => {
              if(movieBanner.num === CountSelecao){
                if(movieBanner.backdrop_path !== undefined){
                   movieBanner.backdrop_path
                   movieBanner.backdrop_path.forEach((image:any) => {
                    SetTitle(movieBanner.name)
                    return SetImageBanner(image)
                   });
                   
                }else{
                    SetTitle(movieBanner.name)
                    SetImageBanner(movieBanner.stream_icon)
                }
              }
            });
            SetLoanding(false)
        }
    }
 }

 useEffect(()=>{
    GetUserNameLabel();
    GetMovieDestaques();
 })
 if (Loanding === true) {
        return (

            <SafeAreaView style={[StyleLoading.container, StyleLoading.horizontal]}>
                <ActivityIndicator size="large" color={'#fff'} />
            </SafeAreaView>

        )
    }
    return (
        <ImageBackground style={styles.ImageBackgroundHome}
            blurRadius={100}
            source={{ uri: ImageBanner }}>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.container}>
                    <View style={styles.navbar}>
                        <Text style={styles.textColorTitle}>Para {UserNameLabelScree}</Text>
                        <TouchableOpacity style={{ marginRight: 20 }}>
                            <AntDesign name="search1" size={30} color={'#fff'} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.ImageInicioView}>
                        <ImageBackground
                            style={styles.ImageInicio}
                            borderRadius={10}
                            source={{ uri:ImageBanner }}>
                                <Text style={styles.TxtTittleBanner}>{Title}</Text>  
                            <TouchableOpacity
                                style={styles.btnAssitirBanner}>
                                <FontAwesome5 name="play" size={20} color="black" />
                                <Text style={styles.Textbanner}>Assistir</Text>
                            </TouchableOpacity>
                        </ImageBackground>
                    </View>
                    <StatusBar barStyle={'light-content'} />
                </View>

            </SafeAreaView>
        </ImageBackground>

    );
}

const styles = StyleSheet.create({
    ImageBackgroundHome: {
        flex: 1,
        backgroundColor:"#000"
    },
    container: {
        flex: 1,
        alignItems: 'center',
        color: '#fff',
        justifyContent: 'flex-start',
    },
    navbar: {
        height: 'auto',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        margin: 20,
    },
    textColorTitle: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        marginLeft: 20
    },
    ImageInicioView: {
        paddingLeft: 20,
        paddingRight: 20,
        width: '100%',
        height: "70%",


    },
    ImageInicio: {
        width: '100%',
        height: '100%',
        borderWidth: 1,
        borderColor: 'rgba(163, 158, 158, 0.23)',
        borderRadius: 10,
        shadowColor: 'rgba(13, 12, 12, 0.54)',
        shadowRadius: 10,
        shadowOpacity: 0.4,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    btnAssitirBanner: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 5,
        width: '95%',
        marginBottom: 10,

    },
    TxtTittleBanner:{
        color:"#fff",
        fontSize:30,
        fontWeight:'bold',
        paddingBottom:30,   
        textShadowColor: 'black', 
        textShadowOffset: { width: -2, height: 2 }, 
        textShadowRadius: 2, 

    },
    Textbanner: {
        fontSize: 20,
        marginLeft: 10,
        fontWeight: '500',

    }
});


const StyleLoading = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#000',
    },
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
    },
});

export default Home