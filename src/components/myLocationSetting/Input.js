import React, {useState} from 'react';
import styled from 'styled-components/native';
import {TouchableWithoutFeedback, Keyboard} from 'react-native';
import {StandardView, BTN} from '../common/View';
import {NBGBText, NBGText, NBGLText} from '../common/Text';
import {widthPercentageToDP, showMessage} from '../../utils/util';
import colors from '../../configs/colors';
import {SearchBtn} from './Button';

const InputView = styled(StandardView)`
  flex-direction: row;
  margin-top: ${({marginTop}) =>
    marginTop ? widthPercentageToDP(marginTop) : 0};
`;

const Input = styled.TextInput`
  width: ${widthPercentageToDP(280)};
  height: ${widthPercentageToDP(40)};
  border-width: ${widthPercentageToDP(1)};
  border-color: #f8f8f8;
  background-color: #dbdbdb;
  padding-top: ${widthPercentageToDP(10)};
  padding-bottom: ${widthPercentageToDP(10)};
  padding-left: ${widthPercentageToDP(10)};
  padding-right: ${widthPercentageToDP(10)};
  font-size: ${({fontSize}) =>
    fontSize ? widthPercentageToDP(fontSize) : widthPercentageToDP(10)};
`;

export const SearchInput = ({marginTop, fontSize}) => {
  const [searchText, setSearchText] = useState('');

  const submit = () => {
    Keyboard.dismiss();

    if (searchText === '') {
      showMessage('검색어를 입력해주세요');
    } else {
    }
  };

  return (
    <TouchableWithoutFeedback>
      <InputView marginTop={marginTop}>
        <Input
          fontSize={fontSize}
          underlineColorAndroid="transparent"
          placeholder={'예) 병원동 12-3 또는 병원아파트'}
          placeholderTextColor={'gray'}
          returnKeyType={'search'}
          onChangeText={text => setSearchText(text)}
          value={searchText}
          onSubmitEditing={() => {
            submit();
          }}
        />
        <SearchBtn
          marginLeft={10}
          onPress={() => {
            submit();
          }}
        />
      </InputView>
    </TouchableWithoutFeedback>
  );
};
