import React, { useState } from "react"
import { StyleSheet, Text, View, FlatList, Pressable } from 'react-native';
import { Image } from 'expo-image';


type Props = {
    navigation: any,
    urlApiStream: any,
    userApiStream: any,
    passwordApiStream: any,
    DatasStream: any,
    category_id: any,
    category_name: any,

}


const ListStream: React.FC<Props> = ({
    navigation,
    urlApiStream,
    userApiStream,
    passwordApiStream,
    DatasStream,
    category_id,
    category_name
}) => {

    const [CountStream, SetCountStream] = useState(10)
    
        const GetStreamList = () => {
            SetCountStream(CountStream + 10)
            console.log("Buscando filmes")
        }

    const GetStreamCategorieID = (id: any) => {
        const uniqueStream = DatasStream
            .filter((Stream: any) => Stream.category_id === id).slice(0, CountStream)
        return uniqueStream;
    };

    return (
        <View key={category_id}>
            <Text style={styles.TextCategories}>{category_name}</Text>
            <FlatList
                style={styles.FlatListMain}
                data={GetStreamCategorieID(category_id) || []}
                keyExtractor={(Stream: any) => Stream.stream_id}
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
                            onPress={() =>
                                navigation.navigate('infoStream',
                                    {
                                        title: Stream.item.title,
                                        image: Stream.item.stream_icon || Stream.item.cover,
                                        description: Stream.item.plot,
                                        urlhls: `${urlApiStream}/
                                                                ${Stream.item.stream_type}/${userApiStream}
                                                                /${passwordApiStream}/
                                                                ${Stream.item.stream_id}.
                                                                ${Stream.item.container_extension}`,
                                        year: Stream.item.release_date,
                                    })}
                        >

                            <Image

                                source={{ uri: Stream.item.stream_icon || Stream.item.cover }}
                                style={styles.StreamImage}
                                cachePolicy={'memory-disk'}
                            />
                        </Pressable>
                    </View>
                )}
            />
        </View>
    )
}


export default ListStream


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
