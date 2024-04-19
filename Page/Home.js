import React, { Component } from 'react';
//import react in our code. 
import { StyleSheet, View, Text, Alert, TouchableOpacity, Image, RefreshControl, Modal, BackHandler, ToastAndroid, ActivityIndicator, TextInput, Button, ScrollView,SafeAreaView,Linking } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ResponsiveImage from 'react-native-responsive-image';
import { RFPercentage } from "react-native-responsive-fontsize";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList } from 'react-native-gesture-handler';
// import { SafeAreaView } from 'react-navigation';
import call from 'react-native-phone-call';
import { Searchbar } from 'react-native-paper';
export default class Home extends Component {
  constructor() {
    super();
    this.state = {
      employee_name: '',
      TotalPendingOrder: '',
      Role: 'Delivery Boy',
      backbuttonpresse: 0,
      DATA: [],
      MobileNumber: '',
      maxlimit: 70,
      maxlimit1: 25,
      isLoading: '',
      modalVisible: false,
      refreshing: false,
      reason:'',
      ordernumber:'',
      search:'',
      masterDataSource:''
    };

  }
  // backaction function code
  backAction = () => {

    this.state.backbuttonpresse = this.state.backbuttonpresse + 1;
    setTimeout(() => {
      this.state.backbuttonpresse = 0;
    }, 2000);
    if (this.state.backbuttonpresse == 2) {
      BackHandler.exitApp()
      this.state.backbuttonpresse = 0;
    }
    else {
      this.toastWithDurationHandler('Please click BACK againt to exit');
    }
    return true;
  };
 
  //toast code
  toastWithDurationHandler = (message) => {
    //function to make Toast With Duration
    ToastAndroid.show(`${message}`, ToastAndroid.SHORT);
  }
  // auto call function page load
  componentDidMount = async () => {
    this.fetchData();
    BackHandler.addEventListener('hardwareBackPress', this.backAction);
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.fetchData();
    });
  }
  // backaction function code

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.backAction);
    this._unsubscribe();
  }
  // fetch data
  fetchData = async () => {
    this.setState({ isLoading: true });
    var cidLogin = await AsyncStorage.getItem('cid');
    var name = await AsyncStorage.getItem('name');
    this.setState({ employee_name: name })
    var dataToSend = new FormData();
    dataToSend.append('cid', cidLogin);
    await fetch('https://www.taqumart.com/ReactDelivery/total_order.php', {
      method: 'POST',
      body: dataToSend,
      headers: {
        'Content-Type': 'multipart/form-data; ',
      }
      //Request Type 
    })
      .then((response) => response.json())
      //If response is in json then in success
      .then((responseJson) => {
        // console.log(responseJson);
        this.setState({ TotalPendingOrder: responseJson.order_details.length, DATA: responseJson.order_details,masterDataSource:responseJson.order_details })
      })
      //If response is not in json then in error
      .catch((error) => {
        //Error 
        console.log(error);
        this.toastWithDurationHandler('Please Try Again !');
      })
      .finally(() => {
        this.setState({ isLoading: false });
      });
  }
  handleSearch = (text) => {

    if (text) {
      // Inserted text is not blank
      // Filter the FriendsData
      // Update FilteredDataSource
      const newData = this.state.masterDataSource.filter(
        function (item) {
          const itemData = item.search
            ? item.search.toUpperCase()
            : ''.toUpperCase();
          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
        });
      this.setState({ DATA: newData, search: text })
    } else {
      this.setState({ search: text })
      if (text == null || text == '') {
        var data = this.state.masterDataSource
        this.setState({ DATA: data })
      }
    }
  }
  onRefresh = () => {
    this.fetchData();
  }

  // cancleorder
  cancleorder = async () => {
    if(this.state.reason==null||this.state.reason==''||this.state.reason=='null')
    {
      this.toastWithDurationHandler('Write reason For Canclelling Order!');
    }
    else{
      this.setState({ isLoading: true,modalVisible:false});
      var dataToSend = new FormData();
      var cidLogin = await AsyncStorage.getItem('cid');
      dataToSend.append('cid', cidLogin);
      dataToSend.append('order_id', this.state.ordernumber);
      dataToSend.append('canreason', this.state.reason);
      await fetch('https://www.taqumart.com/ReactDelivery/cancel.php', {
        method: 'POST',
        body: dataToSend,
        headers: {
          'Content-Type': 'multipart/form-data; ',
        }
        //Request Type 
      })
        .then((response) => response.json())
        //If response is in json then in success
        .then((responseJson) => {
          // console.log(responseJson);
        })
        //If response is not in json then in error
        .catch((error) => {
          //Error 
          this.toastWithDurationHandler('Please Try Again !');
        })
        .finally(() => {
          this.fetchData();
          this.setState({ isLoading: false ,reason:'',ordernumber:'',});

        })
      
      
    }
         
  }

  // call = (mobile) => {
  //   //handler to make a call
  //   const args = {
  //     number: mobile,
  //     prompt: false,
  //   };
  //   call(args).catch(console.error);
  // };
  dialCall = (mobile) => {
  
    let phoneNumber = '';
    if (Platform.OS === 'android') { phoneNumber = `tel:${mobile}`; }
    else {phoneNumber = `telprompt:${mobile}`; }
    Linking.openURL(phoneNumber);
 };
logout=()=>{
  Alert.alert(
    'do you want to logout ',
    '',
    [
      { text: 'no', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
      {
        text: 'yes', onPress: async () => {
          this.setState({isLoading:true});
          AsyncStorage.removeItem('cid');
          this.props.navigation.navigate('Login');
        }
      }
    ]
  )
 
}
gonextpage=(orderid,name,mobile,Order)=>{

if(Order=='New')
{
  Alert.alert(
    'Please Call this Customer?',
    '',
    [
      { text: 'Done', onPress: () => this.props.navigation.navigate('Product', { orderid:orderid, name:name })},
      {
        text: 'Call', onPress: async () => {
          this.dialCall(mobile);
        }
      }
    ]
  )
}

else{
  this.props.navigation.navigate('Product', { orderid:orderid, name:name })
}

  
}
  renderItem = ({ item }) => (
    <View style={{ width: ('100%'), marginTop: hp('1%') }}>
      <View style={styles.card1}>


        <View style={{ height: hp('17%'), width: wp('61%'), marginTop: hp('0.8%'), marginLeft: wp('2%'), marginRight: wp('2%'), }}>
          <View>
            
            <TouchableOpacity onPress={() =>this.gonextpage(item.order_number, item.name,item.mobile,item.OrderCount) }>
              
              <View style={{ width: wp('90%'), height: hp('4%'), flexDirection: 'row' }}>
                <View style={{ width: wp('55%'), height: hp('4%'), flexDirection: 'row' }}>
                  <Text style={{ fontSize: RFPercentage(2.2), fontWeight: 'bold', color: 'red' }}>
                    {item.sno}.
            </Text>
                  <Text style={{ fontSize: RFPercentage(2.2), fontWeight: 'bold', color: 'green' }}>

                    {((item.name).length > this.state.maxlimit1) ?
                      (((item.name).substring(0, this.state.maxlimit1 - 3)) + '...') :
                      item.name}
                  </Text>
                </View>
                <View style={{ width: wp('37%') }}>
                  <Text style={{ fontSize: RFPercentage(2), fontWeight: 'bold', color: 'skyblue' }}>
                    Order Count: {item.OrderCount}
                  </Text>
                </View>
              </View>


              <View style={{ width: wp('85%'), height: hp('6%'), flexDirection: 'row' }}>

                <Text style={{ fontSize: RFPercentage(2), fontWeight: 'bold' ,color:'#000'}}>
                  Address: {((item.address).length > this.state.maxlimit) ?
                    (((item.address).substring(0, this.state.maxlimit - 3)) + '...') :
                    item.address}
                </Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ width: wp('45%'), height: hp('4%'), flexDirection: 'row' }}>
                  <Text style={{ fontSize: RFPercentage(2.2), fontWeight: 'bold', color: '#45CE30' }}>
                    ORDER NO :
            </Text>
                  <Text style={{ fontSize: RFPercentage(2.2), fontWeight: 'bold', color: '#45CE30' }}>
                    {item.order_number}
                  </Text>
                </View>
                <View style={{ width: wp('50%'), height: hp('4%'), flexDirection: 'row' }}>
                  <Text style={{ fontSize: RFPercentage(2), color:'#000'}}>
                    AMOUNT :
            </Text>
                  <Text style={{ fontSize: RFPercentage(2),color:'#000' }}>
                    ₹{item.amount}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

              <TouchableOpacity onPress={() => this.dialCall(item.mobile)}>
                <View style={{ flexDirection: 'row', backgroundColor: '#45CE30', borderRadius: 10, width: wp('40%'), height: hp('4.5%'), alignItems: 'center', justifyContent: 'center' }}>
                  <ResponsiveImage source={require('../assest/Image/PhoneIcon.jpeg')} initWidth="25" initHeight="25" />
                  <Text style={{ color: '#fff', textAlign: 'center' }}>Call User</Text>
                </View>
              </TouchableOpacity>
   
       
              <TouchableOpacity onPress={() =>this.setState({modalVisible:true,ordernumber:item.order_number}) } style={{ width: wp('40%'), backgroundColor: 'red', justifyContent: 'center', alignItems: 'center', borderRadius: 10, marginLeft: wp('10%') }}>
                <View>
                  <Text style={{ fontWeight: 'bold', color: '#fff' }}>Cancel Order</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
  
    </View>
  );
  render() {
    return (
      <View style={styles.container}>
        <SafeAreaView>
          <View style={styles.card}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ width: wp('30%'), justifyContent: 'center', alignItems: 'center', height: hp('25%'), borderRightWidth: 2 }}>
                <ResponsiveImage source={require('../assest/Image/DeliveryMan.jpeg')} initWidth="140" initHeight="140"
                  style={{ borderRadius: 100, }}
                />
              </View>
              <View style={{ width: wp('64%'), height: hp('25%'), marginTop: hp('2%') }}>
                <View style={{ height: hp('6%'), flexDirection: 'row', borderBottomWidth: 1, alignItems: 'center' }}>
                  <Text style={{ fontSize: RFPercentage(2), color: 'red' }}>Employee Name:  </Text>
                  <Text style={{ fontSize: RFPercentage(2),color:'#000' }}>{this.state.employee_name}</Text>
                </View>
                <View style={{ height: hp('6%'), borderBottomWidth: 1, alignItems: 'center', flexDirection: 'row' }}>
                  <Text style={{ fontSize: RFPercentage(2), color: 'red' }}>Total Pending Order:  </Text>
                  <Text style={{ fontSize: RFPercentage(2),color:'#000' }}>{this.state.TotalPendingOrder}</Text>
                </View>

                <View style={{ height: hp('6%'), borderBottomWidth: 1, alignItems: 'center', flexDirection: 'row' }}>
                  <Text style={{ fontSize: RFPercentage(2), color: 'red' }}>Role:  </Text>
                  <Text style={{ fontSize: RFPercentage(2),color:'#000' }}>{this.state.Role}</Text>
                </View>
                <TouchableOpacity  onPress={() =>this.logout()}>
                  <View style={{width:wp('60%'),flexDirection:'row-reverse',marginTop:hp('1%'),}}>
                  <View style={{ height: hp('5%'), width:wp('20%'), alignItems: 'center',backgroundColor:'red',justifyContent:'center',borderRadius:10 }}>
                  <Text style={{ fontSize: RFPercentage(2.5), color: '#fff' }}>LogOut</Text>
                </View>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {/* <View style={styles.SearchStyle}>
              <Searchbar
                placeholder="By OrderNo/Name/Address"
                onChangeText={(text) => this.handleSearch(text)}
                value={this.state.search}
              />
            </View> */}

          {this.state.DATA.length == 0 || this.state.DATA.length == '' || this.state.DATA.length == null ?
           <ScrollView style={{height:hp('100%')}} refreshControl={
            <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />
          }>
              {this.state.isLoading ? <ActivityIndicator size="large" color="#45ce30" style={{ height: hp('60%') }} /> :
            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, backgroundColor: '#fff',height:hp('80%') }}>
              <ResponsiveImage source={require('../assest/Image/deleveryman.jpeg')} initWidth="400" initHeight="400" />
            </View>
  }
            </ScrollView>
            :
        
              <View style={{ height: hp('64%') }}>
              
                <View style={{ marginBottom: hp('3%'), }}>
                  {this.state.isLoading ? <ActivityIndicator size="large" color="#45ce30" style={{ height: hp('60%') }} /> :
                    <FlatList
                      data={this.state.DATA}
                      renderItem={this.renderItem}
                      keyExtractor={item => item.sno}
                      refreshControl={
                        <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />
                      }
                    />
                  }

                </View>
                <Modal animationType="slide"
              visible={this.state.modalVisible}
              transparent={true}
              onRequestClose={() => { console.log("Modal has been closed.") }}>
            


      {/* modal view code */}
      <View style={{
                position: 'absolute',
                bottom: 2,
                width: wp('100%'),
                height: hp('41%'),
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',

              }}>
                <View style={styles.modalView}>
                  <View style={{ height: hp('20%'), margin: hp('1%'), borderBottomWidth: 1, width: wp('90%'), borderColor: '#758283', borderWidth: 1, }}>
                    <TextInput
                      placeholder="Reason For Canclelling Order!" 
                       value={this.state.reason}
                       onChangeText={(reason) => this.setState({reason})}
                      style={{ fontSize: RFPercentage(2.4), }}
                      keyboardType='default'
                      autoCompleteType="off"
                      placeholderTextColor="#ff0000"
                      multiline={true}
                    />
                  </View>
                  <View style={{ flexDirection: 'row' }}>
                    <View style={{ margin: wp('1%'), marginRight: wp('2%') }}>
                      <Button
                        style={styles.buttonstyle}
                        title="CANCEL"
                        color="red"
                        onPress={() =>  this.setState({modalVisible:!this.state.modalVisible})}
                      />
                    </View>
                    <View style={{ margin: wp('1%'), marginLeft: wp('2%') }}>
                      <Button
                        style={styles.buttonstyle}
                        title="Submit"
                        color="#45CE30"
                        onPress={() =>this.cancleorder()}
                      />
                    </View>
                  </View>
                </View>
              </View>
            </Modal>
              </View>
          
            
            // </Content>

          }

        </SafeAreaView>


      </View>
    )
  }
}

const styles = StyleSheet.create({
  // main conatiner
  container: {

    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    height: hp('27%'),
    width: wp('100%'),
    elevation: 10,
    borderRadius: 10,
    backgroundColor: '#CAD5E2',
    flexDirection: 'column',
    marginTop: hp('1%'),
    borderWidth: 1,
    borderColor: 'black'
  },
  card1: {
    height: hp('20%'),
    width: wp('95%'),
    marginLeft: wp('2.5%'),
    marginRight: wp('2.5%'),
    elevation: 5,
    borderRadius: 10,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    marginBottom: hp('1%')
  },
  modalView: {
    flex: 1,
    position: 'absolute',
    bottom: 2,
    width: wp('95%'),
    backgroundColor: '#e6ffee',
    height: hp('28%'),
    borderRadius: 10,
    justifyContent: 'flex-start',
    alignItems: 'center',
    elevation: 10,

  },
  buttonstyle: {
    borderWidth: 5,
    height: hp('100%'),
    padding: wp('2%'),
    borderWidth: 1
  },
  SearchStyle: {
    margin: 5,
    borderRadius: 15,
    alignSelf: "center",
    backgroundColor: "white",
    shadowColor: "black",
    width: wp('95%'),

  }
})