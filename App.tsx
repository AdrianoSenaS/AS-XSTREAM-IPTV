import React from 'react';
import Home from './App/Pages/Home';
import Login from './App/Pages/Login';
import Tv from './App/Pages/Tv';
import Series from './App/Pages/Series';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import infoStream from './App/Pages/infoStream';
import { Player } from './App/Pages/Player';



const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


const TabNavigator = () => {
  return (
    <Tab.Navigator initialRouteName='Home'
      screenOptions={{ tabBarStyle: { backgroundColor: 'rgb(0, 0, 0)', position: 'absolute' } }}>
      <Tab.Screen name="Home"
        component={Home}
        options={{
          title: "Filmes", headerShown: false, tabBarLabelStyle: { fontSize: 13 }, tabBarIcon({ focused, color, size }) {
            return <MaterialCommunityIcons name="movie-roll" size={size} color={color} />
          }, tabBarActiveTintColor: "rgba(255, 255, 255, 1)", tabBarInactiveTintColor: 'rgba(217, 217, 217, 0.7)'
        }} />
      <Tab.Screen name="Tv" component={Tv} options={{
        title: "Tv", headerShown: false, tabBarLabelStyle: { fontSize: 13 }, tabBarIcon({ focused, color, size }) {
          return <Feather name="tv" size={size} color={color} />
        }, tabBarActiveTintColor: "rgba(255, 255, 255, 1)", tabBarInactiveTintColor: 'rgba(217, 217, 217, 0.7)'
      }} />
      <Tab.Screen name="Series" component={Series} options={{
        title: "Séries", headerShown: false, tabBarLabelStyle: { fontSize: 13 }, tabBarIcon({ focused, color, size }) {
          return <MaterialCommunityIcons name="movie-open-outline" size={size} color={color} />
        }, tabBarActiveTintColor: "rgba(255, 255, 255, 1)", tabBarInactiveTintColor: 'rgba(217, 217, 217, 0.7)'
      }} />
    </Tab.Navigator>
  )
}


const App: React.FC = ({ navigation }: any) => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={'Tabs'}>
        <Stack.Screen
          name='Tabs'
          component={TabNavigator}
          options={{ headerShown: false }} />
        <Stack.Screen
          name='Login'
          component={Login}
          options={{ headerShown: false }} />
        <Stack.Screen
          name='infoStream'
          component={infoStream}
          options={{ headerShown: false }} />
        <Stack.Screen
          name='Player'
          component={Player}
          options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  )

}

export default App