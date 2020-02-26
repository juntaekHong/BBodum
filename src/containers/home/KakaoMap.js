/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native';
import {WebView} from 'react-native-webview';
import {connect} from 'react-redux';
import {TopView, TopContainerView} from '../../components/common/View';
import {widthPercentageToDP} from '../../utils/util';
import {UIActivityIndicator} from 'react-native-indicators';

const KakaoMap = props => {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <TopView
        marginBottom={5}
        title={'카카오 지도'}
        backHandler={() => {
          props.navigation.goBack();
        }}
        closeBtn={false}
        searchBtn={false}
      />
      <WebView source={{uri: props.navigation.state.params.uri}} />
    </SafeAreaView>
  );
};

export default KakaoMap;