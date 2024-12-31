import React, { useState } from 'react';
import { StyleSheet, Text, View, StatusBar, TouchableOpacity } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';

const Series: React.FC = ({ navigation }: any) => {

    return (
        <View style={styles.container}>
            <View>
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
});

export default Series