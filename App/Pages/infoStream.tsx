import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, ImageBackground } from 'react-native';
import { Image } from 'expo-image';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function infoStream({ navigation, route }: any) {
    const { streamId, title, image, description, urlhls, streamType, year,container_extension } = route.params

    return (
        <SafeAreaView style={styles.container}>
<ScrollView >
            <ImageBackground
            source={{ uri: image }}
            blurRadius={100}
             style={styles.card}>
                <Image source={{ uri: image }} style={styles.image} cachePolicy={'memory-disk'} />
                <View style={styles.info}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.description}>{description}</Text>
                    <Text style={styles.releaseDate}>{`Lançado em: ${year} `}</Text>
                    <View style={styles.buttons}>
                        <TouchableOpacity onPress={() => navigation.navigate('Player', { urlhls: urlhls, streamType:streamType, container_extension:container_extension })} style={styles.btnAssitirBanner}>
                            <FontAwesome5 name="play" size={20} color="black" />
                            <Text style={styles.Textbanner}>Assistir</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => Alert.alert("NotificaÇão", "Em breve")} style={styles.btnAssitirBannerD}>
                            <FontAwesome5 name="arrow-down" size={24} color="#fff" />
                            <Text style={styles.TextbannerD}>Baixar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>
        </ScrollView>
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
        backgroundColor: '#000',
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
