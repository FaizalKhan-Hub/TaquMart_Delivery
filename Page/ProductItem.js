import React, { Component } from 'react';
import { Text, StyleSheet, TextInput, TouchableOpacity,Image,View } from 'react-native';
// import { View } from 'native-base';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFPercentage } from "react-native-responsive-fontsize";
import PlaceHolderImage from 'react-native-placeholderimage';
import ResponsiveImage from 'react-native-responsive-image';
export default class ProductItem extends Component {

  shouldComponentUpdate(prevProps) {
    if (prevProps.selectedId != null) {
      if (prevProps.selectedId == this.props.item.sno) {
        return true;
      }
      else {

        return false;
      }
    }
    else {
      return true;
    }


  }
  constructor(props) {
    super(props);
    this.state = {
      maxlimit: 70,
    }
  };
  render() {
    return (
      <View style={{ width: ('100%'), justifyContent: 'center' , alignItems: 'center' , marginTop: hp('1%') }}>
  <View style={styles.card1}>
    {/* Code for image */}
    <View style={{flexDirection:'row' }}>


      <View style={{flexDirection:'column',borderRightWidth:1,borderRightColor:'red'}}>
        {/* Rate*/}
        <View style={{ width: wp('35%'), flexDirection: "row" ,height:hp('3.2%'),marginLeft:hp('1%')}}>
          <View style={{ width: 'auto' , height: hp('3%'), alignItems: 'flex-start' ,justifyContent:'center' }}>
            <Text style={{ fontSize:RFPercentage(2.5), color: '#45CE30' , fontWeight: "bold" , }}>₹{this.props.item.rate}
            </Text>
          </View>
          {/* MRP */}
          <View style={{ width: 'auto' , height: hp('3%'), alignItems: 'flex-end' , marginLeft:
            wp('1%'),justifyContent:'center' }}>
            <Text style={{ fontSize: RFPercentage(1.8), textDecorationLine: 'line-through' ,
              textDecorationStyle: 'solid',color:'#000' }}>
              ₹{this.props.item.mrp}
            </Text>
          </View>
        </View>
        <View style={{width:wp('45%'),}}>
          <View style={{marginTop:hp('0.5%'),marginLeft:hp('1%')}}>
            <Text style={{fontWeight:'bold',fontSize:RFPercentage(2),color:'#000'}}>
  
              {((this.props.item.product_name).length > this.state.maxlimit) ?
            (((this.props.item.product_name).substring(0, this.state.maxlimit - 3)) + '...') :
            this.props.item.product_name}
            </Text>
          </View>
          <View style={{marginTop:hp('0.5%'),marginLeft:hp('1%')}}>
            <Text style={{fontWeight:'bold',fontSize:RFPercentage(2),color:'#000'}}>
              {this.props.item.size}
            </Text>
          </View>
     
          <View style={{marginTop:hp('0.5%'),marginLeft:hp('1%')}}>
            <Text style={{fontWeight:'bold',color:'red',fontSize:RFPercentage(2.5)}}>
               QTY: {this.props.item.qty}
            </Text>
          </View>
          <TouchableOpacity  onPress={this.props.MinusButton} >
          <View style={{marginTop:hp('0.5%'),width:wp('30%'),backgroundColor:'red',justifyContent:'center',alignItems:'center',borderRadius:10,height:hp('4%'),marginLeft:hp('1%')}}>
       <Text style={{fontWeight:'bold',textAlign:'center',color:'#fff'}}>
              Minus Items
           </Text>
       </View>
       </TouchableOpacity>
        </View>
      </View>
      {/* Product Image Code */}
      <View style={{ height: hp('23%'), width: wp('48%'),justifyContent:'center',alignItems:'center'}}>
      <TouchableOpacity onPress={this.props.deletehandler}>
        <View style={{height:hp('4%'),alignItems:'flex-end',width:wp('45%')}}>
      <ResponsiveImage source={require('../assest/Image/DeleteIcon.jpeg')} initWidth="30" initHeight="30"  />
      </View>
      </TouchableOpacity>
        

          <PlaceHolderImage
            style={styles.ImageStyle}
            source={{ uri: `${this.props.item.image}` }} 
            placeHolderURI={require('../assest/Image/AvtarImage.jpeg')}
            placeHolderStyle={{ height: 80, width: 80 }}
            resizeMethod='resize'
          />


        <View style={{marginTop:hp('0.5%')}}>
            <Text style={{fontWeight:'bold', color:'#45CE30'}}>
              Avilable Stock: {this.props.item.available_stock}
            </Text>
          </View>
      </View>


    </View>
  </View>
</View>

    );
  }
};
const styles = StyleSheet.create({
  card1: {
    height: hp('25%'),
    width: wp('95%'),
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp('1%')

  },
  ImageStyle: {
    height: hp('14%'),
    width: wp('25%')
  },
  container: {
    flex: 1
  },
});