
import AsyncStorage from "@react-native-async-storage/async-storage";

export const UserLogged = async () => {
    const json = await AsyncStorage.getItem('userInfo')
    const data = json != null ? JSON.parse(json) : null;
    const result = data != null ? true : false
    return result
}


export const LoginUserStream = async (user: any, password: any, url: any, navigation: any) => {
    try {
        const urlApi = `${url}/player_api.php?username=${user}&password=${password}`;
        const response = await fetch(urlApi);
        if (!response.ok)
            return `HTTP error! Status: ${response.status}`

        const data = await response.json();
        const userInfo = data.user_info;
        const serverInfo= data.server_info;

        if (userInfo.status === "Active")
            AsyncStorage.setItem('userInfo', JSON.stringify(userInfo))
            AsyncStorage.setItem('serverInfo', JSON.stringify(serverInfo))
            navigation.navigate('Home');
            return "Ok"

    } catch (ex) {
        return ex;
    }
}