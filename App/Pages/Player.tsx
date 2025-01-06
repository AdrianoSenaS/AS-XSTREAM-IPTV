import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { ResizeMode, Video } from 'expo-av';

export const Player = ({ navigation, route }: any) => {
  const { urlhls} = route.params;
  const [loading, setLoading] = useState(true);
  const videoRef = useRef<Video>(null)

  const AutoPLay =()=>{
      videoRef.current?.playAsync()
      videoRef.current?._setFullscreen(true)
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
      setLoading(false)
  }


  // Forçar a orientação para paisagem
  useEffect(() => {
    console.log(urlhls)
  }, []);

  return (
    <View style={styles.contentContainer}>
     <Video
     ref={videoRef}
     onLoad={()=>AutoPLay()}
     style={styles.video}
     source={{uri:urlhls}}
     useNativeControls
     resizeMode={ResizeMode.STRETCH}
     shouldPlay
     onPlaybackStatusUpdate={()=>{}}
     />
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