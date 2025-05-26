import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as ScreenOrientation from 'expo-screen-orientation';
import { Loanding } from '../Components/Loading';
import { useStreamData } from '../Hooks/useDataStream';
import StreamLayout from '../Components/Layout/StreamLayout';
import ListStream from '../Components/Ui/ListStream';

const Home: React.FC = ({ navigation }: any) => {
    const {
        DataCategoriesStream,
        SetDataCategoriesStream,
        DatasStream,
        SetDatasStream,
        FilterData,
        setFilterData
    } = useStreamData();

    const CountSelecao = Math.floor(Math.random() * 10)
    const [CountStream, SetCountStream] = useState(10)
    const [_Loanding, SetLoanding] = useState(true)
    const [UserNameLabelScree, SetUserNameLabelScree] = useState('')
    const [ImageBanner, SetImageBanner] = useState('');
    const [Title, SetTitle] = useState("")
    const [urlApiStream, seturlApiStream] = useState('')
    const [userApiStream, setuserApiStream] = useState('')
    const [passwordApiStream, setpasswordApiStream] = useState('')
    const [description, Setdescription] = useState('')
    const [urlhls, Seturlhls] = useState('')
    const [year, Setyear] = useState('')


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
            const StreamData = await readDataStream('movies.json,')
            const StreamDataCategories = await readDataStream('categoriesMovies.json,')
            if (StreamData !== null && StreamDataCategories !== null) {
                SetDataCategoriesStream(StreamDataCategories)
                SetDatasStream(StreamData)
                setFilterData(StreamData)
                SetLoanding(false)
                Destaque(StreamData)
                console.log('Filmes Exibido localmente')
            } else {
                let url = await AsyncStorage.getItem('url')
                let username = await AsyncStorage.getItem('username')
                let password = await AsyncStorage.getItem('password')
                if (url != null && username != null && password != null) {
                    const urlApi = `${url}/player_api.php?username=${username}&password=${password}&action=`
                    const response = await fetch(`${urlApi}get_vod_categories`)
                    const categoria = await response.json();
                    const resposeStream = await fetch(`${urlApi}get_vod_streams`)
                    const Stream = await resposeStream.json()
                    SetDataCategoriesStream(categoria)
                    SetDatasStream(Stream)
                    setFilterData(Stream)
                    SetLoanding(false)
                    Destaque(Stream)
                    saveDataStream('categoriesMovies.json', categoria)
                    saveDataStream('movies.json', Stream)

                }
            }
        } catch (e: any) {
            console.log(e.Message)
        }
    }

    const Destaque = (StreamData: any) => {
        StreamData.forEach((Stream: any) => {
            if (Stream.num === CountSelecao && Stream.stream_icon != undefined) {
                SetImageBanner(Stream.stream_icon)
                SetTitle(Stream.title)
                Setdescription(Stream.plot)
                Seturlhls(`${urlApiStream}/${Stream.item.stream_type}/${userApiStream}/${passwordApiStream}/${Stream.item.stream_id}.${Stream.item.container_extension}`)
                Setyear(Stream.release_date)
            }
        });
    }

    const GetStreamList = () => {
        SetCountStream(CountStream + 10)
        console.log("Buscando filmes")
    }
    useEffect(() => {
        const Main = async () => {
            Login()
            let url = await AsyncStorage.getItem('url')
            let username = await AsyncStorage.getItem('username')
            let password = await AsyncStorage.getItem('password')
            if (url != null && username != null && password != null) {
                seturlApiStream(url)
                setuserApiStream(username)
                setpasswordApiStream(password)
            }
            Login()
            GetUserNameLabel();
            GetCategoriesStream()
            ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
        }
        Main()
    }, [])

    return (
        <>
            {_Loanding ? (
                <Loanding />
            ) : (
                <StreamLayout
                    backGroundImage={ImageBanner}
                    navigation={navigation}
                    UserNameLabelScree={UserNameLabelScree}
                    urlApiStream={urlApiStream}
                    userApiStream={userApiStream}
                    passwordApiStream={passwordApiStream}
                    DataCategoriesStream={DataCategoriesStream}
                    DatasStream={DatasStream}
                    FilterData={FilterData}>
                    {
                        DataCategoriesStream.map((categoria: any) => (
                            <ListStream
                                navigation={navigation}
                                urlApiStream={urlApiStream}
                                userApiStream={userApiStream}
                                passwordApiStream={passwordApiStream}
                                DatasStream={DatasStream}
                                category_id={categoria.category_id}
                                category_name={categoria.category_name}
                            />
                        ))
                    }
                </StreamLayout>
            )}
        </>
    )
}

export default Home