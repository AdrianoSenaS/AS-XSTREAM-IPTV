import React from "react"
import { ActivityIndicator, SafeAreaView, StyleSheet } from "react-native"

export const Loanding = () => {
    return (
        <SafeAreaView style={[StyleLoading.container, StyleLoading.horizontal]}>
            <ActivityIndicator size="large" color={"#C60A0A"} />
        </SafeAreaView>
    )
}

const StyleLoading = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#000',
    },
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
    },
    
});

