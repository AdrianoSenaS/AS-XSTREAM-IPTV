import { useEvent } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Button, ActivityIndicator } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';




export const Player = ({ navigation, route }: any) => {
    const { urlStream } = route.params;
    const [loading, setLoading] = useState(true);
    const player = useVideoPlayer(urlStream, player => {
        setLoading(true)
        player.loop = true;
        player.play();
        const isPlayng = setInterval(() => {
            if (player.currentTime > 0) {
                setLoading(false)
                clearInterval(isPlayng)
            }
            console.log(player.currentTime)
        }, 1000);
    });



    // Forçar a orientação para paisagem
    useEffect(() => {
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);

        return () => {
            ScreenOrientation.unlockAsync();
        };
    }, []);
    return (
        <View style={styles.contentContainer}>

            <VideoView style={styles.video} player={player} allowsFullscreen allowsPictureInPicture />
            {loading && (
                <ActivityIndicator size="large" color="#fff" style={styles.loading} />
            )}

        </View>
    );
};

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000'
    },
    video: {
        width: '100%',
        height: '100%',
    },
    loading: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -25 }, { translateY: -25 }],
    },
});
