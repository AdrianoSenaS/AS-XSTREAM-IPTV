import React, { useState } from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';


const Home: React.FC = ({ navigation }: any) => {

    return (
        <View style={styles.container}>
            <Text>Teste de link de Aplicativos</Text>
            <StatusBar barStyle={'light-content'} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default Home