import React, { Component } from 'react';
import { StyleSheet, View, TextInput, Text, TouchableOpacity, ToastAndroid, BackHandler, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ResponsiveImage from 'react-native-responsive-image';
import { RFPercentage } from "react-native-responsive-fontsize";

export default class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      isLoading: false,
      backbuttonpressed: 0,
    };
  }

  componentDidMount = async () => {
    BackHandler.addEventListener('hardwareBackPress', this.backAction);
  }

  backAction = () => {
    this.setState({ backbuttonpressed: this.state.backbuttonpressed + 1 });
    setTimeout(() => {
      this.setState({ backbuttonpressed: 0 });
    }, 2000);
    if (this.state.backbuttonpressed === 2) {
      BackHandler.exitApp();
      this.setState({ backbuttonpressed: 0 });
    } else {
      this.showToast('Please click BACK again to exit');
    }
    return true;
  };

  showToast = (message) => {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  };

  submitButton = () => {
    if (this.state.email === '' || this.state.email === null) {
        this.showToast('Enter Your Valid Employee ID!');
    } else {
        this.setState({ isLoading: true });
        const formData = new FormData();
        formData.append('UserID', this.state.email + '@taqumart.com');

        fetch('https://www.taqumart.com/ReactDelivery/login.php', {
            method: 'POST',
            body: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text(); // Parse response as text
        })
        .then(text => {
            try {
                const responseJson = JSON.parse(text); // Attempt to parse as JSON
                if (responseJson && responseJson.auth === 'yes') {
                    AsyncStorage.setItem('cid', responseJson.cid);
                    AsyncStorage.setItem('EmployeeID', responseJson.EmployeeID);
                    AsyncStorage.setItem('name', responseJson.name);
                    this.props.navigation.navigate('Home');
                } else {
                    this.showToast('Invalid Employee ID!');
                }
            } catch (error) {
                console.error('Error parsing JSON:', error);
                this.showToast('Error parsing server response!');
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            this.showToast('Please Try Again!');
        })
        .finally(() => {
            this.setState({ isLoading: false });
        });
    }
};



  render() {
    return (
      <View style={styles.container}>
        {this.state.isLoading ? (
          <ActivityIndicator size="large" color="#45ce30" />
        ) : (
          <View>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <ResponsiveImage source={require('../assest/Image/Delivery.jpeg')} initWidth="350" initHeight="350" />
            </View>
            <View style={styles.card}>
              <View style={{ width: wp('95%'), justifyContent: 'center', alignItems: 'center', marginTop: hp('2%'), flexDirection: 'row' }}>
                <View style={styles.inputView}>
                  <View style={{ borderBottomWidth: 2 }}>
                    <TextInput
                      placeholder="Employee ID"
                      value={this.state.email}
                      onChangeText={(email) => this.setState({ email })}
                      style={styles.inputText}
                      keyboardType='default'
                      autoCompleteType="off"
                      placeholderTextColor={'#000'}
                    />
                  </View>
                </View>
              </View>
              <TouchableOpacity onPress={this.submitButton}>
                <View style={{ width: wp('95%'), justifyContent: 'center', alignItems: 'center' }}>
                  <View style={styles.loginBtn}>
                    <Text style={styles.loginText}>SUBMIT</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputView: {
    width: wp('90%'),
    backgroundColor: 'white',
    borderRadius: 25,
    height: hp('7%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputText: {
    width: wp('90%'),
    color: 'black',
    fontSize: RFPercentage(2.8),
  },
  loginBtn: {
    width: '80%',
    backgroundColor: '#45CE30',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    height: hp('7%'),
    marginTop: hp('1.5%'),
  },
  loginText: {
    color: 'white',
    fontSize: RFPercentage(2.8),
  },
  card: {
    height: hp('20%'),
    width: wp('95%'),
    elevation: 10,
    borderRadius: 10,
    backgroundColor: '#FFF',
    flexDirection: 'column',
  },
});
