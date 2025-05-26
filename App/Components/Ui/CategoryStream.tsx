import React, { useState } from "react";
import { FlatList, TouchableOpacity, View, Text, StyleSheet, Modal, ScrollView } from "react-native";
import { useCategory } from "../../Hooks/UseCategory";
import { useModal } from "../../Hooks/useModal";
import ListStreamVertical from "./ListStreamVertical";
import AntDesign from '@expo/vector-icons/AntDesign';

type Props = {
    DataCategoriesStream: any,
    children: React.ReactNode,
    DatasStream: any,
    navigation: any,
    urlApiStream: any,
    userApiStream: any,
    passwordApiStream: any,
}
const CategoryStream: React.FC<Props> = ({
    DataCategoriesStream,
    children,
    DatasStream,
    navigation,
    urlApiStream,
    userApiStream,
    passwordApiStream,
}) => {
    const {
        categoriaModalID,
        SetcategoriaModalID,
        SetcategoriaModalName,
        SetcategoriaSelected,
        categoriaSelected,
        categoriaModalName,

    } = useCategory();
    const {
        modalVisible,
        setModalVisible
    } = useModal()
    const [CountStream, SetCountStream] = useState(10)

    const GetStreamList = () => {
        SetCountStream(CountStream + 10)
        console.log("Buscando filmes")
    }

    const GetStreamCategorieID = (id: any) => {
        const uniqueStream = DatasStream
            .filter((Stream: any) => Stream.category_id === id).slice(0)
        return uniqueStream;
    };

    return (
        <>
            <View style={styles.selecaoItens}>
                {categoriaSelected ? (
                    <>
                        <TouchableOpacity style={styles.btnSelecaoItens}
                            onPress={() => SetcategoriaSelected(false)}>
                            <AntDesign name="close" size={20} color={'#fff'} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btnSelecaoItens}
                            onPress={() => setModalVisible(!modalVisible)}>
                            <Text style={styles.TextSelecaoItens}>Categorias</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <TouchableOpacity style={styles.btnSelecaoItens}
                        onPress={() => setModalVisible(!modalVisible)}>
                        <Text style={styles.TextSelecaoItens}>Categorias</Text>
                    </TouchableOpacity>
                )}
            </View>
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
                                    onPress={() => {
                                        SetcategoriaModalID(categoria.item.category_id),
                                            SetcategoriaModalName(categoria.item.category_name),
                                            setModalVisible(!modalVisible),
                                            SetcategoriaSelected(true)
                                    }}>
                                    <Text style={styles.textStyle}>{categoria.item.category_name}</Text>
                                </TouchableOpacity>
                            )} />
                    </View>
                </View>
            </Modal>
            {categoriaSelected ? (
                <ScrollView style={{ flex: 1, width: '100%' }}>
                    <View style={styles.ViewFlatLisr}>
                        <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={styles.TextCategories}>{categoriaModalName}</Text>
                            <ListStreamVertical
                                data={GetStreamCategorieID(categoriaModalID) || []}
                                navigation={navigation}
                                urlApiStream={urlApiStream}
                                userApiStream={userApiStream}
                                passwordApiStream={passwordApiStream}
                            />
                        </View>
                    </View>
                </ScrollView>
            ) : (
                <ScrollView style={{ flex: 1, width: '100%' }}>
                    <View style={styles.ViewFlatLisr}>
                        {children}
                    </View>
                </ScrollView>
            )}
        </>
    )
}

const styles = StyleSheet.create({
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
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
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
    TextSelecaoItens: {
        color: "#fff",
        fontSize: 16
    },
    ViewFlatLisr: {
        zIndex: 4,
        marginTop: 0,
        marginBottom: 60
    },
    TextCategories: {
        fontSize: 17,
        marginLeft: 10,
        fontWeight: 'bold',
        color: '#fff',
        paddingBottom: 5,
        marginTop: 40
    },
    selecaoItens: {
        flexDirection: 'row',
        width: '100%',
        marginLeft: 20,
        marginBottom: 15,
        justifyContent: 'flex-start',
    },
})

export default CategoryStream