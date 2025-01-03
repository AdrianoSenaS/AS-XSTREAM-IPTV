import React, { useEffect, useState } from 'react';
import { StyleSheet, View,  ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import * as ScreenOrientation from 'expo-screen-orientation';




export const Player = ({ navigation, route }: any) => {
    const { urlhls, streamType,container_extension } = route.params;
    const [loading, setLoading] = useState(true);
    const [typeStream, stream_type]=  useState('')

    // Forçar a orientação para paisagem
    useEffect(() => {
       if(streamType==='movie'){
        stream_type(`video/${container_extension}`)
       }
      console.log(urlhls)
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
        return () => {
            ScreenOrientation.unlockAsync();
        };
    }, []);

    const htmlContent = `
    <html>
      <head>
        <style>
          #loading {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 20px;
            color: #fff;
            background-color: rgba(0, 0, 0, 0.5);
            padding: 10px;
            border-radius: 5px;
          }
          #videoPlayer {
            display: none;
          }
        </style>
      </head>
      <body>
        <!-- Loading Spinner -->
        <div id="loading">Carregando vídeo...</div>
  
        <!-- Video -->
        <video id="videoPlayer" width="100%" controls>
          <source src="${urlhls}" type="${typeStream}">
          Seu navegador não suporta a tag de vídeo.
        </video>
  
        <script>
          const video = document.getElementById('videoPlayer');
  
          // Evento que indica que o vídeo começou a carregar
          video.addEventListener('loadstart', () => {
            window.ReactNativeWebView.postMessage('O vídeo começou a carregar...');
          });
  
          // Evento que indica que o vídeo foi carregado e está pronto para reprodução
          video.addEventListener('loadeddata', () => {
            window.ReactNativeWebView.postMessage('O vídeo foi carregado e está pronto para ser reproduzido!');
          });
  
          // Evento que indica que o vídeo começou a ser reproduzido
          video.addEventListener('play', () => {
            window.ReactNativeWebView.postMessage('O vídeo começou a reproduzir');
            document.getElementById('loading').style.display = 'none';  // Remove o loading
            video.style.display = 'block';  // Exibe o vídeo
          });
  
          // Configura o autoplay e desativa o mudo
          video.autoplay = true;
          video.muted = false;
          video.load();
        </script>
      </body>
    </html>
  `;
  
   
    return (
        <View style={styles.contentContainer}>

        <WebView style={styles.contentContainer}
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        injectedJavaScript={htmlContent} // Injeta o HTML + JS na WebView
        onMessage={(event) => {
            if(event.nativeEvent.data == "O vídeo começou a reproduzir"){
                setLoading(false)
            }
          console.log(event.nativeEvent.data); // Mensagens enviadas do HTML para o React Native
        }}
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
        height: '50%',
    },
    loading: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -25 }, { translateY: -25 }],
    },
});