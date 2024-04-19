//  Import Packages
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
// Import Files 
import Login from './Process/Login';
import Home from './Page/Home';
import Product from './Page/Product';
import Logincheck from './Process/Logincheck';

const Stack = createStackNavigator();

function App() {
 
  return (
    <NavigationContainer >
      <Stack.Navigator initialRouteName="Logincheck"
        screenOptions={{
          headerShown: false
        }}
      >
           <Stack.Screen name="Logincheck" component={Logincheck} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Product" component={Product} />

      </Stack.Navigator>
    </NavigationContainer>

  );
}

export default App;