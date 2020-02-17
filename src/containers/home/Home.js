/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import {widthPercentageToDP} from '../../utils/util';
import {TopContainerView} from '../../components/common/View';
import {TopView} from '../../components/home/View';
import {DataList} from '../../components/home/DataList';

const DATA = [
  {image: '', title: '정형외과'},
  {image: '', title: '대학병원'},
  {image: '', title: '성형외과'},
  {image: '', title: '내과'},
  {image: '', title: '외과'},
  {image: '', title: '한의원'},
  {image: '', title: '치과'},
  {image: '', title: '이비인후과'},
  {image: '', title: '정신병원'},
  {image: '', title: '약국'},
];

const Home = props => {
  return (
    <TopContainerView>
      <TopView settingLocation={'서울 광진구 자양동 7-7'} height={55} />
      {/* 클릭 시, 항목에 해당하는 병원 리스트만 보여지기 구현해야 함. */}
      <DataList data={DATA} navigation={props.navigation} />
    </TopContainerView>
  );
};

export default Home;
