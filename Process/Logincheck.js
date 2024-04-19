import React, { useEffect } from 'react';
import { View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ResponsiveImage from 'react-native-responsive-image';
const Loading = ({ navigation }) => {
  useEffect(() => {
    checkLogin();
  }, []);

  
  // check function to login or not login
   const checkLogin = async () => {
    var cidLogin = await AsyncStorage.getItem('cid');
  if(cidLogin)
  {
      navigation.navigate('Home');
  }
    else {
      navigation.navigate('Login');
    }
  }
 
  return (
    <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, backgroundColor: '#fff' }}>
      <ResponsiveImage source={require('../assest/Gif/reachedgif.gif')} initWidth="300" initHeight="300" />
    </View>
  );
};
export default Loading;
