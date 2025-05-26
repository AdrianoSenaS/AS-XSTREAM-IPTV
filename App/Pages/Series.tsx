import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, StatusBar, TouchableOpacity, ImageBackground, SafeAreaView, ActivityIndicator, FlatList, ScrollView, Modal, TextInput, Pressable } from 'react-native';
import { Image } from 'expo-image';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { SearchAll } from '../Components/Ui/Search';
import { Loanding } from '../Components/Loading';

const Series: React.FC = ({ navigation }: any) => {
    const CountSelecao = Math.floor(Math.random() * 10)
    const [CountStream, SetCountStream] = useState(10)
    const [_Loanding, SetLoanding] = useState(true)
    const [UserNameLabelScree, SetUserNameLabelScree] = useState('')
    const [ImageBanner, SetImageBanner] = useState('');
    const [Title, SetTitle] = useState("")
    const [DataCategoriesStream, SetDataCategoriesStream] = useState<[]>([])
    const [DatasStream, SetDatasStream] = useState<[]>([])
    const [categoriaSelected, SetcategoriaSelected] = useState(false)
    const [categoriaModalID, SetcategoriaModalID] = useState('')
    const [categoriaModalName, SetcategoriaModalName] = useState('')
    const [searchText, setSearchText] = useState('');
    const [filteredData, setFilteredData] = useState();
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisible1, setModalVisible1] = useState(false);
    const [urlApiStream, seturlApiStream] = useState('')
    const [userApiStream, setuserApiStream] = useState('')
    const [passwordApiStream, setpasswordApiStream] = useState('')
    const [streamId, SetstreamId] = useState('')
    const [description, Setdescription] = useState('')
    const [urlhls, Seturlhls] = useState('')
    const [typeUrl, SettypeUrl] = useState('')
    const [streamType, SetstreamType] = useState('')
    const [year, Setyear] = useState('')
    const [container_extension, Setcontainer_extension] = useState('')
    const [SerieId, SetSerieId] = useState('')


    const getFileUri = (fileName: string) => `${FileSystem.documentDirectory}${fileName}`;
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

    const readDataStream = async (fileName: string) => {
        try {
            const fileUri = getFileUri(fileName);
            const dataString = await FileSystem.readAsStringAsync(fileUri);
            const dataObject = JSON.parse(dataString);
            return dataObject
        } catch (error) {
            return null
        }
    };

    // Função de pesquisa
    const handleSearch = (text: string) => {
        setSearchText(text);
        // Filtra os itens que contêm o texto da pesquisa
        const filtered: any = DatasStream.filter((item: any) =>
            item.title.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredData(filtered); // Atualiza o estado com os itens filtrados
    };

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
        user != null ? SetUserNameLabelScree(`Para ${user}`) : null
    }

    const GetCategoriesStream = async () => {
        try {
            const StreamData = await readDataStream('Series.json,')
            const StreamDataCategories = await readDataStream('categoriesSeries.json,')
            if (StreamData !== null && StreamDataCategories !== null) {
                SetDataCategoriesStream(StreamDataCategories)
                SetDatasStream(StreamData)
                setFilteredData(StreamData)
                Destaque(StreamData)
                console.log('Filmes Exibido localmente')
                SetLoanding(false)
            } else {
                let url = await AsyncStorage.getItem('url')
                let username = await AsyncStorage.getItem('username')
                let password = await AsyncStorage.getItem('password')
                if (url != null && username != null && password != null) {
                    const urlApi = `${url}/player_api.php?username=${username}&password=${password}&action=`
                    const response = await fetch(`${urlApi}get_series_categories`)
                    const categoria = await response.json();
                    const resposeStream = await fetch(`${urlApi}get_series`)
                    const Stream = await resposeStream.json()
                    SetDataCategoriesStream(categoria)
                    SetDatasStream(Stream)
                    setFilteredData(Stream)
                    Destaque(Stream)
                    saveDataStream('categoriesSeries.json', categoria)
                    saveDataStream('Series.json', Stream)
                    SetLoanding(false)
                }
            }

        } catch (e: any) {
            console.log(e.Message)
        }
    }

    const Destaque = (StreamData: any) => {
        StreamData.forEach((Stream: any) => {
            if (Stream.num === CountSelecao && Stream.cover != undefined ) {
                SetImageBanner(Stream.cover)
                SetTitle(Stream.title)
                Setdescription(Stream.plot)
                Setyear(Stream.year)
                SetSerieId(Stream.series_id)
            }
        });
    }

    const GetStreamCategorieID = (id: any) => {
        const uniqueStream = DatasStream
            .filter((Stream: any) => Stream.category_id === id).slice(0, CountStream)
        return uniqueStream;
    };

    const GetStreamList = () => {
        SetCountStream(CountStream + 10)
        console.log("Buscando filmes")
    }

    useEffect(() => {
        const Main = async () => {
            Login()
            GetUserNameLabel();
            GetCategoriesStream()
        }
        Main()
    }, [])

    if (_Loanding === true)
        return (
             <Loanding/>
        )
    if (categoriaSelected === true) {
        return (
            <ImageBackground style={styles.ImageBackgroundHome}
                blurRadius={100}
                source={{ uri: ImageBanner }}>
                <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.76)' }}>
                    <StatusBar barStyle={'light-content'} />
                    <Modal
                        style={{ flex: 1 }}
                        animationType='slide'
                        transparent={true}
                        visible={modalVisible1}
                        onRequestClose={() => {
                            setModalVisible1(!modalVisible1);
                        }}>
                         <SearchAll
                                                navigation={navigation}
                                                GetStreamList={GetStreamList}
                                                urlApiStream={urlApiStream}
                                                userApiStream={userApiStream}
                                                DatasStream={DatasStream}
                                                passwordApiStream={passwordApiStream}
                                                filteredData={filteredData}
                                               
                                                />
                    </Modal>
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
                                    data={DataCategoriesStream}
                                    keyExtractor={(item: any) => item.category_id}
                                    renderItem={(categoria) => (
                                        <TouchableOpacity
                                            style={styles.modalView}
                                            onPress={() => { SetcategoriaModalID(categoria.item.category_id), SetcategoriaModalName(categoria.item.category_name), setModalVisible(!modalVisible), SetcategoriaSelected(true) }}>
                                            <Text style={styles.textStyle}>{categoria.item.category_name}</Text>
                                        </TouchableOpacity>
                                    )} />
                            </View>
                        </View>
                    </Modal>
                    <View style={styles.container}>
                        <View style={styles.navbar}>
                            <Text style={styles.textColorTitle}>{UserNameLabelScree}</Text>
                            <TouchableOpacity style={{ marginRight: 20 }}
                                onPress={() => setModalVisible1(!modalVisible1)}>
                                <AntDesign name="search1" size={30} color={'#fff'} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.selecaoItens}>
                            <TouchableOpacity style={styles.btnSelecaoItens}
                                onPress={() => SetcategoriaSelected(false)}>
                                <AntDesign name="close" size={20} color={'#fff'} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.btnSelecaoItens}
                                onPress={() => setModalVisible(!modalVisible)}>
                                <Text style={styles.TextSelecaoItens}>Categorias</Text>
                            </TouchableOpacity>

                        </View>
                        <ScrollView style={{ flex: 1, width: '100%' }}>
                            <View style={styles.ViewFlatLisr}>
                                <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={styles.TextCategories}>{categoriaModalName}</Text>
                                    <FlatList

                                        data={GetStreamCategorieID(categoriaModalID) || []}
                                        keyExtractor={(Stream: any) => Stream.num}
                                        horizontal={false}
                                        numColumns={3}
                                        nestedScrollEnabled={true}
                                        onEndReached={GetStreamList}
                                        onEndReachedThreshold={0.1}
                                        initialNumToRender={5}
                                        maxToRenderPerBatch={10}
                                        removeClippedSubviews={true}
                                        renderItem={(Stream) => (
                                            <View
                                                style={{ justifyContent: 'center', alignItems: 'flex-start' }}
                                            >
                                                <Pressable
                                                    style={{ margin: 10 }}
                                                    onPress={() => navigation.navigate('infoSeries',
                                                        {
                                                            series_id: Stream.item.series_id,
                                                            title: Stream.item.title,
                                                            image:Stream.item.stream_icon || Stream.item.cover,
                                                            description: Stream.item.plot,
                                                            year: Stream.item.year
                                                        }

                                                    )}>
                                                    <View style={styles.StreamCard}>
                                                        <Image
                                                            source={{ uri:Stream.item.stream_icon || Stream.item.cover }}
                                                            style={styles.StreamImage}
                                                            cachePolicy={'memory-disk'}
                                                        />
                                                    </View>

                                                </Pressable>
                                            </View>
                                        )}
                                    />
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                </SafeAreaView>
            </ImageBackground>
        )
    }
    return (
        <ImageBackground style={styles.ImageBackgroundHome}
            blurRadius={100}
            source={{ uri: ImageBanner }}>
            <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.76)' }}>
                <StatusBar barStyle={'light-content'} />
                <Modal
                    style={{ flex: 1 }}
                    animationType='slide'
                    transparent={true}
                    visible={modalVisible1}
                    onRequestClose={() => {
                        setModalVisible1(!modalVisible1);
                    }}>
                     <SearchAll
                                            navigation={navigation}
                                            GetStreamList={GetStreamList}
                                            urlApiStream={urlApiStream}
                                            userApiStream={userApiStream}
                                            DatasStream={DatasStream}
                                            passwordApiStream={passwordApiStream}
                                            filteredData={filteredData}
                                           
                                            />
                </Modal>
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
                                data={DataCategoriesStream}
                                keyExtractor={(item: any) => item.category_id}
                                renderItem={(categoria) => (
                                    <TouchableOpacity
                                        style={styles.modalView}
                                        onPress={() => { SetcategoriaModalID(categoria.item.category_id), SetcategoriaModalName(categoria.item.category_name), setModalVisible(!modalVisible), SetcategoriaSelected(true) }}>
                                        <Text style={styles.textStyle}>{categoria.item.category_name}</Text>
                                    </TouchableOpacity>
                                )} />
                        </View>
                    </View>
                </Modal>
                <View style={styles.container}>
                    <View style={styles.navbar}>
                        <Text style={styles.textColorTitle}>{UserNameLabelScree}</Text>
                        <TouchableOpacity style={{ marginRight: 20 }}
                            onPress={() => setModalVisible1(!modalVisible1)}>
                            <AntDesign name="search1" size={30} color={'#fff'} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.selecaoItens}>
                        <TouchableOpacity style={styles.btnSelecaoItens}
                            onPress={() => setModalVisible(!modalVisible)}>
                            <Text style={styles.TextSelecaoItens}>Categorias</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView style={{ flex: 1, width: '100%' }}>
                        <View style={styles.ViewFlatLisr}>
                           
                            {
                                DataCategoriesStream.map((categoria: any) => (
                                    <View key={categoria.category_id}>
                                        <Text style={styles.TextCategories}>{categoria.category_name}</Text>
                                        <FlatList
                                            style={styles.FlatListMain}
                                            data={GetStreamCategorieID(categoria.category_id) || []}
                                            keyExtractor={(Stream: any) => Stream.num}
                                            horizontal={true}
                                            showsHorizontalScrollIndicator={false}
                                            nestedScrollEnabled={true}
                                            onEndReached={GetStreamList}
                                            onEndReachedThreshold={0.1}
                                            initialNumToRender={5}
                                            maxToRenderPerBatch={10}
                                            removeClippedSubviews={true}
                                            renderItem={(Stream) => (
                                                <View style={styles.StreamCard}
                                                >
                                                    <Pressable
                                                        onPress={() => navigation.navigate('infoSeries',
                                                            {
                                                                series_id: Stream.item.series_id,
                                                                title: Stream.item.title,
                                                                image:Stream.item.stream_icon || Stream.item.cover,
                                                                description: Stream.item.plot,
                                                                year: Stream.item.year
                                                            }

                                                        )}>
                                                        <View style={styles.StreamCard}>
                                                            <Image
                                                                source={{ uri:Stream.item.stream_icon || Stream.item.cover }}
                                                                style={styles.StreamImage}
                                                                cachePolicy={'memory-disk'}
                                                            />
                                                        </View>

                                                    </Pressable>
                                                </View>
                                            )}
                                        />
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
        marginTop: 10,
        marginBottom: 10,
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
        borderRadius: 10,
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
        marginTop: 0,
        marginBottom: 60
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
    StreamCard: {
        marginHorizontal: 3,
        alignItems: "center",
    },
    StreamImage: {
        width: 100,
        height: 150,
        borderRadius: 5,

    },
    selecaoItens: {
        flexDirection: 'row',
        width: '100%',
        marginLeft: 20,
        marginBottom: 15,
        justifyContent: 'flex-start',
    },
    TextSelecaoItens: {
        color: "#fff",
        fontSize: 16
    },
    btnSelecaoItens: {
        marginLeft: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#fff",
        paddingTop: 6,
        paddingBottom: 6,
        paddingLeft: 15,
        paddingRight: 15
    },
    centeredView: {
        flex: 1,
        padding: 10,
        justifyContent: 'center',
        backgroundColor: 'rgb(41, 41, 41)'
    },
    modalView: {
        padding: 20,
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
        fontSize: 16
    },
    modalText: {
        marginBottom: 15,
    },
});

const StyleLoading = StyleSheet.create({
    container: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
        position: 'absolute'

    },
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
    },

});

export default Series