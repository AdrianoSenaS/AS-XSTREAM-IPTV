import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
export default function infoStream({ navigation, route }: any) {
    const { streamId, title, image, description, urlStream } = route.params;
    console.log(urlStream)

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.card}>
                <Image source={{ uri: image }} style={styles.image} />
                <View style={styles.info}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.description}>{description}</Text>
                    <Text style={styles.releaseDate}>{`Lançado em: `}</Text>
                    <View style={styles.buttons}>
                        <TouchableOpacity onPress={() => navigation.navigate('Player', { urlStream: urlStream })} style={styles.btnAssitirBanner}>
                            <FontAwesome5 name="play" size={20} color="black" />
                            <Text style={styles.Textbanner}>Assistir</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => Alert.alert("NotificaÇão", "Em breve")} style={styles.btnAssitirBannerD}>
                            <FontAwesome5 name="arrow-down" size={24} color="#fff" />
                            <Text style={styles.TextbannerD}>Baixar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ScrollView>

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

    },
    image: {
        width: '100%',
        height: 300,
        resizeMode: 'cover',
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
        width: '95%',
        marginBottom: 10,

    },
    btnAssitirBannerD: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor: '#212121',
        padding: 10,
        borderRadius: 5,
        width: '95%',
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

    }
});
