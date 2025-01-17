
import AsyncStorage from "@react-native-async-storage/async-storage";

export const LoginUserStream = async (username:any, user: any, password: any, url: any) => {
    try {
        const urlApi = `${url}/player_api.php?username=${user}&password=${password}`;
        const response = await fetch(urlApi);
        if (!response.ok)
            return `HTTP error! Status: ${response.status}`

        const data = await response.json();
        const userInfo = data.user_info;
        const serverInfo = data.server_info;

        if (userInfo.status === "Active") {
            AsyncStorage.setItem('name', username)
            AsyncStorage.setItem('username', user)
            AsyncStorage.setItem('password', password),
            AsyncStorage.setItem('url', url)
            AsyncStorage.setItem('userInfo', JSON.stringify(userInfo))
            AsyncStorage.setItem('serverInfo', JSON.stringify(serverInfo))
            return "Ok"
        }


    } catch (ex) {
        return ex;
    }
}