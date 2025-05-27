import React from "react";
import { Pressable } from "react-native";
import { Image } from 'expo-image';
import { StyleSheet } from "react-native"

type Props = {
    OnPress: () => void,
    image: string
}

const ButtonImage: React.FC<Props> = ({ OnPress, image }) => {
    return (
        <Pressable
            style={{ margin: 10 }}
            onPress={OnPress}>
            <Image
                source={{ uri: image }}
                style={Style.StreamImage}
                cachePolicy={'memory-disk'}
            />
        </Pressable>
    )
}

const Style = StyleSheet.create({
    StreamImage: {
        width: 100,
        height: 150,
        borderRadius: 5,

    },
    
})

export default ButtonImage