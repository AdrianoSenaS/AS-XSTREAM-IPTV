import React from 'react';
import { Image } from 'expo-image';
import { StyleSheet } from "react-native"


type Props = {
    image: string
}

const ImageList: React.FC<Props> = ({ image }) => {

    return (
        <Image
            source={{ uri: image }}
            style={Style.StreamImage}
            cachePolicy={'memory-disk'}
        />
    )
}

const Style = StyleSheet.create({
    StreamImage: {
        width: 100,
        height: 150,
        borderRadius: 5,

    },
})

export default ImageList