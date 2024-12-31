import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, Alert, StatusBar, TouchableOpacity, SafeAreaView, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { LoginUserStream } from '../Services/Login';
import { UserLogged } from '../Services/Login';


const Login: React.FC = ({ navigation }: any) => {
    const [usuario, SetUsuario] = useState("")
    const [senha, SetSenha] = useState("")
    const [url, SetUrl] = useState("")
    const [Loanding, SetLoading] = useState(false)


    useEffect(()=>{
     const Login = async ()  =>{
        const user = await UserLogged();
        SetLoading(true)
        if(user === true){
            return  navigation.reset({
                index:0,
                routes:[{name:'Tabs'}]
            })
        }
        return SetLoading(false)
     }
     Login()
    })

    const BtnLogin = async () => {
        if (usuario === "" || senha === "" || url === "") {
            return Alert.alert('Notificação', 'Preencha todos os dado!')
        }
        SetLoading(true)
        const result = LoginUserStream(usuario, senha, url);
        if (await result !== "Ok") {
            Alert.alert('Notificação', 'Erro ao conectar!')
            SetLoading(false)
            return
        }
        SetLoading(false)
        navigation.reset({
            index:0,
            routes:[{name:'Tabs'}]
        })
    }

    if (Loanding === true) {
        return (

            <SafeAreaView style={[StyleLoading.container, StyleLoading.horizontal]}>
                <ActivityIndicator size="large" color={'#fff'} />
            </SafeAreaView>

        )
    }
    return (
        <SafeAreaView
            style={{ flex: 1, backgroundColor: '#000' }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}>
                <Text
                    style={styles.textTitle}>
                    AS XSTREAM IPTV
                </Text>
                <Text
                    style={styles.text}>
                    O MELHOR APP DE IPTV
                </Text>
                <Text
                    style={styles.text}>
                    ASSISTA SEUS CONTEÚDOS SEM INTERRUPÇÕES
                </Text>
                <Text
                    style={styles.text}>
                    GERENCIE SEUS CONTEÚDOS PELO APP
                </Text>
                <TextInput
                    style={styles.inputInitial}
                    keyboardAppearance='dark'
                    placeholder='USUÁRIO'
                    placeholderTextColor={'#C5C4C4'}
                    value={usuario}
                    onChangeText={SetUsuario} />
                <TextInput
                    style={styles.inputInitial}
                    keyboardAppearance='dark'
                    placeholder='SENHA'
                    placeholderTextColor={'#C5C4C4'}
                    secureTextEntry={true}
                    value={senha}
                    onChangeText={SetSenha} />
                <TextInput
                    style={styles.inputInitial}
                    keyboardAppearance='dark'
                    placeholder='URl http://xstreamexample.com'
                    placeholderTextColor={'#C5C4C4'}
                    value={url}
                    onChangeText={SetUrl} />
                <TouchableOpacity
                    onPress={BtnLogin}
                    style={styles.buttonInitial}>
                    <Text
                        style={styles.textButtom}>
                        ENTRAR
                    </Text>
                </TouchableOpacity>
                <StatusBar
                    barStyle={'light-content'} />
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textTitle: {
        color: '#fff',
        fontSize: 25,
        fontWeight: 'bold'
    },
    text: {
        color: '#fff',
        fontSize: 16,
        marginTop: 10
    },
    textButtom: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold'
    },
    buttonInitial: {
        margin: 10,
        backgroundColor: '#C60A0A',
        width: '100%',
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10
    },
    inputInitial: {
        margin: 10,
        backgroundColor: '#333333',
        color: '#fff',
        width: '100%',
        height: 50,
        textAlign: 'center',
        justifyContent: 'center',
        borderRadius: 10
    }

});


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

export default Login