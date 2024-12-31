import { useEffect, useState } from 'react';
import React from 'react';
import Home from './App/Pages/Home';
import Login from './App/Pages/Login';
import { ActivityIndicator, SafeAreaView, StyleSheet } from 'react-native';
import { UserLogged } from './App/Services/Login';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


const Stack = createNativeStackNavigator();


const App: React.FC = ({ navigation }: any) => {
  let [initialRoute, setInitialRout] = useState("")
  useEffect(() => {
    const login = async () => {
      const LoginUse = await UserLogged();
      LoginUse === true ? setInitialRout("Home") : setInitialRout("Login")
    }
    login()
  })
  if (initialRoute !== "") {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName={initialRoute}>
          <Stack.Screen
            name='Home'
            component={Home}
            options={{ headerShown: false }} />
          <Stack.Screen
            name='Login'
            component={Login}
            options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    )
  }
  return (

    <SafeAreaView style={[styles.container, styles.horizontal]}>
      <ActivityIndicator size="large" />
    </SafeAreaView>

  )

}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});
export default App