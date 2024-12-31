import React, { useState } from 'react';
import { StyleSheet, Text, View, StatusBar, TouchableOpacity, SafeAreaView } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';

const Movies: React.FC = ({ navigation }: any) => {

    return (
        <View style={styles.container}>
            <View style={styles.navbar}>
                <Text>Para Adriano Sena</Text>
                <TouchableOpacity>
                <AntDesign name="search1" size={24} color="black" />
                </TouchableOpacity>
            </View>
            <StatusBar barStyle={'light-content'} />
        </View>
    );
}  

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        alignItems: 'center',
        color:'#fff',
        justifyContent: 'center',
    },
    navbar:{
        height:50,
        width:'100%',
        justifyContent:'space-between',
        color:'#fff',
        padding:20
    }
});

export default Movies