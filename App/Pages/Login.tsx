import React from 'react';
import { StyleSheet, Text, Alert, StatusBar, TouchableOpacity, SafeAreaView, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { LoginUserStream } from '../Services/Login';
import { Loanding } from '../Components/Loading';
import { useLogin } from '../Hooks/UseLogin';

const Login: React.FC = ({ navigation }: any) => {
    const { _Name,
        SetName,
        _Usuario,
        SetUsuario,
        _Senha,
        SetSenha,
        _Url,
        SetUrl,
        _Loanding,
        SetLoading
    } = useLogin();

    const BtnLogin = async () => {
        SetLoading(true)
        if (_Name === "" || _Usuario === "" || _Senha === "" || _Url === "") {
            SetLoading(false)
            return Alert.alert('Notificação', 'Preencha todos os dado!')
        }
        const result = LoginUserStream(_Name, _Usuario, _Senha, _Url);
        if (await result !== "Ok") {
            Alert.alert('Notificação', 'Erro ao conectar!')
            SetLoading(false)
            return
        }
        navigation.reset({
            index: 0,
            routes: [{ name: 'Tabs' }]
        })
    }

    if (_Loanding === true) {
        return (
            <Loanding/>
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
                    ASSISTA SEUS CONTEÚDOS
                </Text>
                <Text
                    style={styles.text}>
                    GERENCIE SEUS CONTEÚDOS PELO APP
                </Text>
                <TextInput
                    style={styles.inputInitial}
                    keyboardAppearance='dark'
                    placeholder='SEU NOME'
                    placeholderTextColor={'#C5C4C4'}
                    value={_Name}
                    onChangeText={SetName} />
                <TextInput
                    style={styles.inputInitial}
                    keyboardAppearance='dark'
                    placeholder='USUÁRIO'
                    placeholderTextColor={'#C5C4C4'}
                    value={_Usuario}
                    onChangeText={SetUsuario} />
                <TextInput
                    style={styles.inputInitial}
                    keyboardAppearance='dark'
                    placeholder='SENHA'
                    placeholderTextColor={'#C5C4C4'}
                    secureTextEntry={true}
                    value={_Senha}
                    onChangeText={SetSenha} />
                <TextInput
                    style={styles.inputInitial}
                    keyboardAppearance='dark'
                    placeholder='URl http://xstreamexample.com'
                    placeholderTextColor={'#C5C4C4'}
                    value={_Url}
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
        marginTop: 10,
        marginBottom: 10,
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


export default Login