import React, { useEffect } from "react";
import { Modal, TextInput, View, StyleSheet, TouchableOpacity } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import { SearchType } from "../../Types/SearchType";
import { useSearch } from "../../Hooks/UseSearch";
import ListStreamVertical from "./ListStreamVertical";

export function SearchAll({
    navigation,
    urlApiStream,
    userApiStream,
    DatasStream,
    passwordApiStream }: SearchType) {
    const {
        searchText,
        setSearchText,
        filteredData,
        setFilteredData,
        modalVisible1,
        setModalVisible1,
    } = useSearch()

    const handleSearch = (text: string) => {
        setSearchText(text);
        const filtered: any = DatasStream.filter((item: any) =>
            item.title.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredData(filtered);
    };

    return (
        <>
            <TouchableOpacity style={{ marginRight: 20 }}
                onPress={() => { setModalVisible1(!modalVisible1); setSearchText(""); setFilteredData(DatasStream); }}>
                <AntDesign name="search1" size={30} color={'#fff'} />
            </TouchableOpacity>
            <Modal
                style={{ flex: 1 }}
                animationType='slide'
                transparent={true}
                visible={modalVisible1}
                onRequestClose={() => {
                    setModalVisible1(!modalVisible1);
                }}>
                <View style={styles.centeredView}>
                    <View style={{ height: '100%' }}>
                        <View style={styles.selecaoItens}>
                            <TextInput
                                style={{ width: '80%', height: 45, backgroundColor: '#fff', color: '#000', paddingLeft: 20, borderRadius: 20, marginBottom: 10 }}
                                placeholder="Pesquisar..."
                                value={searchText}
                                onChangeText={handleSearch}
                            />
                            <TouchableOpacity style={styles.btnSelecaoItens}
                                onPress={() => setModalVisible1(!modalVisible1)}>
                                <AntDesign name="close" size={20} color={'#fff'} />
                            </TouchableOpacity>
                        </View>
                        <ListStreamVertical
                            data={filteredData}
                            navigation={navigation}
                            urlApiStream={urlApiStream}
                            userApiStream={userApiStream}
                            passwordApiStream={passwordApiStream}
                        />
                    </View>
                </View>
            </Modal>
        </>
    )
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
        marginTop: 20,
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
        justifyContent: 'center',
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
        paddingRight: 15,
        height: 35,
        marginTop: 6,
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
