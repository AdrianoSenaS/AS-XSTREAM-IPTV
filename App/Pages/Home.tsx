import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, StatusBar, TouchableOpacity, ImageBackground, SafeAreaView, ActivityIndicator, FlatList, ScrollView, Image } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Home: React.FC = ({ navigation }: any) => {
    const CountSelecao = Math.floor(Math.random() * 10)
    const [Loanding, SetLoanding] = useState(true)
    const [UserNameLabelScree, SetUserNameLabelScree] = useState('')
    const [ImageBanner, SetImageBanner] = useState('');
    const [Title, SetTitle] = useState("")
    const [DataCategoriesMovies, SetDataCategoriesMovies] = useState<[]>([])
    const [DatasMovies, SetDatasMovies] = useState<[]>([])


    const Login = async () => {
        const userDb = await AsyncStorage.getItem('username')
        if (userDb === null) {
            return navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }]
            })
        }
    }
    const GetUserNameLabel = async () => {
        const user = await AsyncStorage.getItem('name')
        user != null ? SetUserNameLabelScree(user) : null

    }

    const GetCategoriesMovies = async () => {
        try {
            let url = await AsyncStorage.getItem('url')
            let username = await AsyncStorage.getItem('username')
            let password = await AsyncStorage.getItem('password')
            if (url != null && username != null && password != null) {
                const urlApi = `${url}/player_api.php?username=${username}&password=${password}&action=`
                const response = await fetch(`${urlApi}get_vod_categories`)
                const categoria = await response.json();
                const resposeMovie = await fetch(`${urlApi}get_vod_streams`)
                const movie = await resposeMovie.json()
                SetDataCategoriesMovies(categoria)
                SetDatasMovies(movie)
                Destaque(movie)
                SetLoanding(false)
            }
        } catch (e: any) {
            console.log(e.Message)
        }
    }

    const Destaque = (movieData:any) => {
        movieData.forEach((movie: any) => {
            if (movie.num === CountSelecao) {
                SetImageBanner(movie.stream_icon)
                SetTitle(movie.title)
                console.log(movie)
            }
        });
    }

    const GetMoviesCategorieID = (id: string) => {
        const uniqueMovies = DatasMovies
            .filter((movie: any) => movie.category_id === id)
                
        return uniqueMovies;
    };
    

    useEffect(() => {
        const Main = async () => {
            Login()
            GetUserNameLabel();
            GetCategoriesMovies()
        }
        Main()
    }, [])

    if (Loanding === true)
        return (
            <SafeAreaView style={[StyleLoading.container, StyleLoading.horizontal]}>
                <ActivityIndicator size="large" color={'#fff'} />
            </SafeAreaView>
        )
    return (
        <ImageBackground style={styles.ImageBackgroundHome}
            blurRadius={100}
            source={{ uri: ImageBanner }}>
            <SafeAreaView style={{ flex: 1 }}>
                <StatusBar barStyle={'light-content'} />
                <View style={styles.container}>
                    <View style={styles.navbar}>
                        <Text style={styles.textColorTitle}>Para {UserNameLabelScree}</Text>
                        <TouchableOpacity style={{ marginRight: 20 }}>
                            <AntDesign name="search1" size={30} color={'#fff'} />
                        </TouchableOpacity>
                    </View>
                    <ScrollView style={{ flex: 1, width: '100%' }}>
                        <View style={styles.ViewFlatLisr}>
                            <View
                                style={styles.ImageInicioView}>
                                <ImageBackground
                                    style={styles.ImageInicio}
                                    borderRadius={10}
                                    source={{ uri: ImageBanner }}>
                                    <Text style={styles.TxtTittleBanner}>{Title}</Text>
                                    <TouchableOpacity
                                        style={styles.btnAssitirBanner}>
                                        <FontAwesome5 name="play" size={20} color="black" />
                                        <Text style={styles.Textbanner}>Assistir</Text>
                                    </TouchableOpacity>
                                </ImageBackground>
                            </View>
                            {
                                DataCategoriesMovies.map((categoria: any) => (
                                    <View key={categoria.category_id}>
                                        <Text style={styles.TextCategories}>{categoria.category_name}</Text>
                                        <FlatList
                                            style={styles.FlatListMain}
                                            data={GetMoviesCategorieID(categoria.category_id)|| []}
                                            keyExtractor={(movie: any) => movie.stream_id}
                                            renderItem={(movie) => (
                                                <View style={styles.movieCard}>
                                                    <Image
                                                        source={{ uri: movie.item.stream_icon }}
                                                        style={styles.movieImage}

                                                    />
                                                </View>
                                            )} 
                                            horizontal={true}
                                            showsHorizontalScrollIndicator={false}
                                            nestedScrollEnabled={true}/>
                                    </View>
                                ))
                            }
                        </View>
                    </ScrollView>
                </View>
            </SafeAreaView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    ImageBackgroundHome: {
        flex: 1,
        backgroundColor: "#000"
    },
    container: {
        flex: 1,
        alignItems: 'center',
        color: '#fff',
        justifyContent: 'flex-start',
    },
    navbar: {
        zIndex: 4,
        height: 'auto',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        margin: 20,
        backgroundColor: "rgba(0, 0, 0, 0)"
    },
    textColorTitle: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        marginLeft: 20
    },
    ImageInicioView: {
        zIndex: 1,
        paddingLeft: 30,
        paddingRight: 30,
        height: 500,
        borderRadius:10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    ImageInicio: {
        zIndex: 3,
        width: '100%',
        height: '100%',
        borderWidth: 1,
        borderColor: 'rgba(163, 158, 158, 0.23)',
        borderRadius: 10,
        justifyContent: 'flex-end',
        alignItems: 'center',
        shadowOffset: { width: 0, height: 20 },
        shadowColor: 'rgba(0, 0, 0, 0.4)',
        shadowRadius: 20,
        shadowOpacity: 1,
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
    TxtTittleBanner: {
        color: "#fff",
        fontSize: 30,
        fontWeight: 'bold',
        paddingBottom: 30,
        textShadowColor: 'black',
        textShadowOffset: { width: -2, height: 2 },
        textShadowRadius: 2,

    },
    Textbanner: {
        fontSize: 20,
        marginLeft: 10,
        fontWeight: '500',

    },
    ViewFlatLisr: {
        zIndex: 4,
        marginTop: 20,
        marginBottom:60
    },
    FlatListMain: {
        marginTop: 10,
        paddingLeft: 7,
    },
    TextCategories: {
        fontSize: 17,
        marginLeft: 10,
        fontWeight: 'bold',
        color: '#fff',
        paddingBottom: 5,
        marginTop: 40
    },
    categoryContainer: {
        marginVertical: 10,
    },
    categoryTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#fff",
        marginHorizontal: 10,
        marginBottom: 5,
    },
    movieCard: {
        marginHorizontal: 3,
        alignItems: "center",
    },
    movieImage: {
        width: 100,
        height: 150,
        borderRadius: 5,
        backgroundColor: "rgba(0, 0, 0, 0.75)"
    },
});


const StyleLoading = StyleSheet.create({
    container: {
        top:0,
        bottom:0,
        left:0,
        right:0,
        justifyContent: 'center',
        alignItems:'center',
        backgroundColor: '#000',
        position:'absolute'

    },
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
    },

});

export default Home