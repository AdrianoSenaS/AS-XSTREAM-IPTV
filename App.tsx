import React from 'react';
import Home from './App/Pages/Home';
import Login from './App/Pages/Login';
import {  View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function ProfileScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Profile Screen</Text>
    </View>
  );
}


const TabNavigator = ()=>{
  return(
    <Tab.Navigator initialRouteName='Home'>
      <Tab.Screen name="Home" component={Home} options={{headerShown:false}}/>
      <Tab.Screen name="Profile" component={ProfileScreen}  options={{headerShown:false}}/>
    </Tab.Navigator>
  )
}


const App: React.FC = ({ navigation }: any) => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={'Login'}>
        <Stack.Screen
          name='Tabs'
          component={TabNavigator}
          options={{ headerShown: false }} />
        <Stack.Screen
          name='Login'
          component={Login}
          options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  )

}

export default App