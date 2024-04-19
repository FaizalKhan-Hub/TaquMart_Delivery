// code of import file
import React, { Component } from 'react';
import { Text, View, StyleSheet, StatusBar, ActivityIndicator, SafeAreaView,KeyboardAvoidingView, ToastAndroid, BackHandler, Vibration, Alert, Modal, TextInput, Button } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Container, Header, Footer, Content } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity, FlatList } from 'react-native-gesture-handler';
import ResponsiveImage from 'react-native-responsive-image';
import { RFPercentage, } from "react-native-responsive-fontsize";
import TrackPlayer from 'react-native-track-player';
import ProductItem from './ProductItem';

//code of data item of cart

export default class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      DATA: [],
      CartDatalength: '',
      orderid:'',
      isLoading:'',
      isLoading1:'',
      modalVisible: false,
      reason: '',
      Address:''
    }
  }
  // page load function run
  //toast code
  toastWithDurationHandler = (message) => {
    //function to make Toast With Duration
    ToastAndroid.show(`${message}`, ToastAndroid.SHORT);
  }
  // function call when open page
  backAction = () => {
    BackHandler.removeEventListener('hardwareBackPress', this.backAction);
    this.props.navigation.navigate('Home');
    return true;
  };
  componentDidMount = () => {
    this.fetchData(this.props.route.params.orderid);
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.fetchData(this.props.route.params.orderid);
    });
  };
  componentWillUnmount() {
    this._unsubscribe();
  }
  fetchData = async (orderid) => {
    this.setState({ isLoading1: true })
    var dataToSend = new FormData();
    dataToSend.append('order_id', orderid);
    await fetch('https://www.taqumart.com/ReactDelivery/order_details.php', {
      method: 'POST',
      body: dataToSend,
      headers: {
        'Content-Type': 'multipart/form-data; ',
      }
      //Request Type 
    })
      .then((response) => response.json())
      //If response is in json then in success
      .then(async(responseJson) => {
        this.setState({ DATA: responseJson.order_items,Address:responseJson.OrderInfo.Address})
        if(responseJson.order_items.length==0||responseJson.order_items.length==''||responseJson.order_items.length==null)
        {
          this.setState({ isLoading1: true });
          var dataToSend = new FormData();
          var cidLogin = await AsyncStorage.getItem('cid');
          dataToSend.append('cid', cidLogin);
          dataToSend.append('order_id', this.props.route.params.orderid);
          dataToSend.append('canreason', 'All item Remove');
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
              if (responseJson) {
                this.props.navigation.navigate('Home');
                this.setState({ isLoading1: false });
              }
            })
            //If response is not in json then in error
            .catch((error) => {
              //Error 
              this.toastWithDurationHandler('Please Try Again !');
            })
            
        }
      })
      //If response is not in json then in error
      .catch((error) => {
        //Error 
        this.toastWithDurationHandler('Please Try Again !');
      })
      .finally(() => {
        this.setState({ isLoading1: false, CartDatalength: this.state.DATA.length },)
      });
  }

  //   //  Minus To Cart
  MinusButton = (rowid) => {
    Alert.alert(
      'Are you sure you want to Minus QTY ?',
      '',
      [
        { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
        {
          text: 'Minus', onPress: async () => {
            this.setState({ isLoading1: true })
            var dataToSend = new FormData();
            var cidLogin = await AsyncStorage.getItem('cid');
            dataToSend.append('cid', cidLogin);
            dataToSend.append('rowid', rowid);

            await fetch('https://www.taqumart.com/ReactDelivery/removeqty.php', {
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

                if (responseJson) {
                  this.fetchData(this.props.route.params.orderid);
                  this.setState({ isLoading1: false });
                }
              })
              //If response is not in json then in error
              .catch((error) => {
                //Error 
                this.toastWithDurationHandler('Please Try Again !');
              })
              .finally(() => {
                this.setState({ CartDatalength: this.state.DATA.length },)
              });
          }
        },
      ],
      { cancelable: false }
    );

  }

  //   // delete handler 
  deletehandler = async (rowid) => {
    Alert.alert(
      'Are you sure you want to delete this item from your cart?',
      '',
      [
        { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
        {
          text: 'Delete', onPress: async () => {
            this.setState({ isLoading1: true, })
            var dataToSend = new FormData();
            var cidLogin = await AsyncStorage.getItem('cid');
            dataToSend.append('cid', cidLogin);
            dataToSend.append('rowid', rowid);
            await fetch('https://www.taqumart.com/ReactDelivery/deleteqty.php', {
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
                if (responseJson) {
                  
                  this.fetchData(this.props.route.params.orderid);
                  this.setState({ isLoading1: false, })
                }

              })
              //If response is not in json then in error
              .catch((error) => {
                console.log(error)
                //Error 
                this.toastWithDurationHandler('Please Try Again !');
              })
              .finally(() => {
                this.setState({ CartDatalength: this.state.DATA.length },)
              });
          }
        },
      ],
      { cancelable: false }
    );
  }
  CancelOrder = async () => {
    if(this.state.reason==''||this.state.reason==null||this.state.reason=='null')
    {
      this.toastWithDurationHandler('Write reason For Canclelling Order!');
    }
    else{
      this.setState({ isLoading1: true ,modalVisible:false});
      var dataToSend = new FormData();
      var cidLogin = await AsyncStorage.getItem('cid');
      dataToSend.append('cid', cidLogin);
      dataToSend.append('order_id', this.props.route.params.orderid);
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
          if (responseJson) {
            this.props.navigation.navigate('Home');
            this.setState({ isLoading1: false });
          }
        })
        //If response is not in json then in error
        .catch((error) => {
          //Error 
          this.toastWithDurationHandler('Please Try Again !');
        })
        .finally(() => {
          this.setState({reason:''});
        });

    }
           
     
  }
  start = async () => {
    // Set up the player
    await TrackPlayer.setupPlayer();
  
    // Add a track to the queue
    await TrackPlayer.add({
        id: 'trackId',
        url: require('../assest/Gif/iPhonnMessageTone.mp3'),
      
     
    });
  
    // Start playing it
    await TrackPlayer.play();
  };

Placeorder=async()=>{
  Alert.alert(
    'Do you want to Delivered? ',
    '',
    [
      { text: 'no', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
      {
        text: 'yes', onPress: async () => {
          this.start();
    this.setState({ isLoading: true });
    var dataToSend = new FormData();
    var cidLogin = await AsyncStorage.getItem('cid');
    dataToSend.append('cid', cidLogin);
    dataToSend.append('order_id', this.props.route.params.orderid);
    await fetch('https://www.taqumart.com/ReactDelivery/delivered.php', {
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
        if (responseJson) {
          
          this.props.navigation.navigate('Home');
          this.setState({ isLoading: false });
        }
      })
      //If response is not in json then in error
      .catch((error) => {
        //Error 
        this.toastWithDurationHandler('Please Try Again !');
      })
   
  
        }
      }
    ]
  )
  
  
  }
  //   //function to make Toast With Duration
  toastWithDurationHandler = (message) => {
    ToastAndroid.show(`${message}`, ToastAndroid.SHORT);
  }


  //   // amount function find
  amount = () => {
    const { DATA } = this.state;
    if (DATA) {
      const data1 = DATA.reduce((sum, item) => sum + (item.qty * item.rate), 0);
      return data1;
    }
    return 0;
  }

  // delevery function find 

  delevery = () => {
    const { DATA } = this.state;
    const charge = [];
    const data1 = DATA.reduce((sum, item) => sum + (item.qty * item.rate), 0);
    const strData = JSON.stringify(data1);
    if (strData < 250) {
      const value = '₹15'
      charge.push(value);
    }
    else {
      const value = 'Free'
      charge.push(value);
    }
    return charge
  }


  // subtotal anount function call
  subtotal = () => {
    const { DATA } = this.state;
    const charge = [];

    const data1 = DATA.reduce((sum, item) => sum + (item.qty * item.rate), 0);
    const strData = JSON.stringify(data1);

    if (strData < 250) {
      const value = 15
      charge.push(value);
    }
    else {
      const value = 0
      charge.push(value);
    }
    const total = data1 + charge[0]
    return total

  }

  // render item of cart data
  renderItem = ({ item, index }) => (
    <ProductItem
      item={item}
      MinusButton={() => { this.setState({ selectedId: item.sno }); Vibration.vibrate(10); this.MinusButton(item.rowid); }}
      deletehandler={() => { this.setState({ selectedId: item.sno }); Vibration.vibrate(10); this.deletehandler(item.rowid); }} 
    />
  );
  render() {
    return (
      <SafeAreaView style={{height:hp('100%')}}>
      {this.state.isLoading ?  
      <View style={{ justifyContent: 'center', alignItems:'center', flex: 1, backgroundColor: '#fff' }}>
    <ResponsiveImage source={require('../assest/Gif/Delivered.gif')} initWidth="400" initHeight="350" />
  
  </View> :
      //Return of 
      <View>

        {/* Header part of this page */}
        <Header style={{ height: hp('8%'), width: wp('100%'), backgroundColor: '#45CE30', justifyContent: 'flex-start', alignItems: 'center' }}>
        
          <TouchableOpacity style={{ flexDirection: 'row' }}
            onPress={() => this.props.navigation.navigate('Home')}
          >
            <View style={{ color: 'white', marginLeft: wp('1%'), }}>

              <ResponsiveImage source={require('../assest/Image/LeftArrow.jpeg')} initWidth="40" initHeight="40" style={{ borderRadius: 100, }} />

            </View>
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: RFPercentage(3.5), marginLeft: wp('2%') }}>{this.props.route.params.name}</Text>
          </TouchableOpacity>
        </Header>

        <StatusBar barStyle="dark-content" hidden={false} backgroundColor="#45CE30" />
        {this.state.isLoading1 ? <ActivityIndicator size="large" color="#45ce30" style={{ height: hp('100%') }} /> :
          <View style={{ height: hp('100%') }}>
            <View style={{ height: hp('88%') }}>
              {/* Price view part */}

              <View style={{ justifyContent: 'center', alignItems: 'center', width: wp('100%'), height: hp('20%') }}>
                <View style={{ backgroundColor: '#F9DDA4', width: wp('95%'), height: hp('18%'), justifyContent: 'flex-start', alignItems: 'center', marginTop: hp('1%'), borderRadius: 10, }}>
                  <View style={{ flexDirection: 'row' }}>
                    {/* icon image code */}
                    <View style={{ width: wp('25%'), height: hp('18%'), alignItems: 'center', justifyContent: 'center' }}>
                      <ResponsiveImage source={require('../assest/Image/ShoppingBag.jpeg')} initWidth="120" initHeight="120" style={{ borderRadius: 100, }} />
                    </View>

                    <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column', Width: wp('70%') }}>
                      {/* this code for Pricing_details text  */}
                      <View style={{ width: wp('70%'), height: hp('2.5%'), justifyContent: 'center', alignItems: 'center', marginTop: hp('1%'), }}>
                        <Text style={{ fontWeight: 'bold', fontSize: RFPercentage(1.8) }}>
                          Pricing Details
                              </Text>
                      </View>
                      {/* this code for total text  */}
                      <View style={{ marginLeft: wp('2%'), height: hp('17%'), width: wp('68%'), }}>

                  {/* Code OF ORder ID */}
                  <View style={{ width: wp('68%'), flexDirection: 'row', }}>
                          <View style={{ width: wp('33.5%'), }}>
                            <Text style={{ color: '#45CE30', fontWeight: 'bold', fontSize: RFPercentage(2.2) }}>
                              Order ID
                                  </Text>
                          </View>
                          <View style={{ width: wp('32%'), alignItems: 'flex-end', marginRight: wp('1.5%') }}>
                            <Text style={{ color: '#45CE30', fontWeight: 'bold', fontSize: RFPercentage(2.2) }}>
                              {this.props.route.params.orderid}
                            </Text>
                          </View>

                        </View>
                         {/* Code of Total items code */}
                        <View style={{ width: wp('68%'), flexDirection: 'row', }}>
                          <View style={{ width: wp('33.5%'), }}>
                            <Text style={{ color: 'red', fontWeight: 'bold', fontSize: RFPercentage(2.2) }}>
                              Total Items
                                  </Text>
                          </View>
                          <View style={{ width: wp('32%'), alignItems: 'flex-end', marginRight: wp('1.5%') }}>
                            <Text style={{ color: 'red', fontWeight: 'bold', fontSize: RFPercentage(2.2) }}>
                              {this.state.CartDatalength}
                            </Text>
                          </View>

                        </View>
                        {/*code of Amount code  */}

                        <View style={{ width: wp('68%'), flexDirection: 'row', }}>
                          <View style={{ width: wp('33.5%'), }}>
                            <Text style={{ color: 'black', fontWeight: 'bold', fontSize: RFPercentage(2.2) }}>
                              Amount
                                  </Text>
                          </View>
                          <View style={{ width: wp('32%'), alignItems: 'flex-end', marginRight: wp('1.5%') }}>
                            <Text style={{ color: 'black', fontWeight: 'bold', fontSize: RFPercentage(2.2) }}>
                              ₹{this.amount().toFixed(2)}
                            </Text>
                          </View>

                        </View>

                        {/* code of Delivery Charge */}
                        <View style={{ width: wp('68%'), flexDirection: 'row' }}>
                          <View style={{ width: wp('33.5%'), }}>
                            <Text style={{ color: 'black', fontWeight: 'bold', fontSize: RFPercentage(2.2) }}>
                              Delivery Charge
                                  </Text>
                          </View>
                          <View style={{ width: wp('32%'), alignItems: 'flex-end', marginRight: wp('1.5%') }}>
                            <Text style={{ color: 'black', fontWeight: 'bold', fontSize: RFPercentage(2.2) }}>
                              {this.delevery()}

                            </Text>
                          </View>

                        </View>

                        {/* this code for line */}
                        <View
                          style={{
                            borderBottomColor: 'black',
                            borderBottomWidth: 1,
                          }}
                        />
                        {/* this code for sub total */}
                        <View style={{ width: wp('68%'), flexDirection: 'row', }}>
                          <View style={{ width: wp('33.5%'), }}>
                            <Text style={{ color: 'black', fontWeight: 'bold', fontSize: RFPercentage(2.2) }}>
                              SUB TOTAL
                              </Text>
                          </View>
                          <View style={{ width: wp('32%'), alignItems: 'flex-end', marginRight: wp('1.5%') }}>
                            <Text style={{ color: 'black', fontWeight: 'bold', fontSize: RFPercentage(2.2) }}>
                              ₹ {this.subtotal().toFixed(2)}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
              <FlatList
                data={this.state.DATA}
                renderItem={this.renderItem}
                keyExtractor={item => item.sno}
                scrollEnabled
                extraData={this.state.selectedId}
              />


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
                        onChangeText={(reason) => this.setState({ reason })}
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
                          onPress={() => this.setState({ modalVisible: false })}
                        />
                      </View>
                      <View style={{ margin: wp('1%'), marginLeft: wp('2%') }}>
                        <Button
                          style={styles.buttonstyle}
                          title="Submit"
                          color="#45CE30"
                          onPress={() => this.CancelOrder()}
                        />
                      </View>
                    </View>
                  </View>
                </View>
              </Modal>

              {/* process Code */}

              <Footer style={{
                backgroundColor: 'transparent', width: wp('95%'), height:
                  hp('8%'), justifyContent: 'space-between', marginLeft: wp('2.5%'), marginRight: wp('2.5%')
              }}>
                <TouchableOpacity onPress={() => { this.setState({ modalVisible: true })}}>
                  <View style={{ width: wp('42%'), backgroundColor: 'red', borderRadius: 80, height: hp('6%'), justifyContent: 'center', alignItems: 'center', flexDirection: 'row', marginTop: hp('1%') }}>
                    <ResponsiveImage source={require('../assest/Image/Close.jpeg')} initWidth="30" initHeight="30" />
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: RFPercentage(2.5) }}>Cancel Order</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() =>this.Placeorder()}>
                  <View style={{ width: wp('45%'), backgroundColor: '#45CE30', borderRadius: 80, height: hp('6%'), justifyContent: 'center', alignItems: 'center', flexDirection: 'row', marginTop: hp('1%') }}>
                    <ResponsiveImage source={require('../assest/Image/Tick.jpeg')} initWidth="30" initHeight="30" />
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: RFPercentage(2.5) }}>Delivered</Text>
                  </View>
                </TouchableOpacity>
              </Footer>
            </View>


          </View>
        }
      </View>
  }
  </SafeAreaView>

    );
  }
}

//styles
const styles = StyleSheet.create({
  // Add product cart style
  card: {
    backgroundColor: '#fefefe',
    height: hp('15%'),
    width: wp('95%'),
    borderRadius: 10,
    elevation: 5,
    margin: wp('1.5%'),

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
  }
});