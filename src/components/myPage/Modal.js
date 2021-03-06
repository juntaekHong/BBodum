/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import styled from 'styled-components/native';
import Modal from 'react-native-modal';
import {widthPercentageToDP} from '../../utils/util';
import colors from '../../configs/colors';
import {NBGText, NBGBText} from '../common/Text';
import {StandardView, BTN} from '../common/View';
import {CloseImg} from '../common/Image';
import {MyInfoTI} from './TextInput';

const ModalView = styled(StandardView)`
  width: ${({width}) =>
    width ? widthPercentageToDP(width) : widthPercentageToDP(300)};
  height: ${({height}) =>
    height ? widthPercentageToDP(height) : widthPercentageToDP(400)};
  border-radius: ${widthPercentageToDP(15)};
  background-color: white;
`;

const HeaderView = styled(StandardView)`
  align-items: flex-end;
  margin-top: ${widthPercentageToDP(20)};
  padding-right: ${widthPercentageToDP(20)};
`;

const BodyView = styled(StandardView)`
  flex: 1;
  justify-content: center;
`;

const FooterView = styled(StandardView)`
  align-items: center;
  justify-content: flex-end;
`;

export const MyInfoMdal = ({
  animate = 'fade',
  visible = false,
  width,
  height,
  closeHandler,
  title,
  myInfoColumn,
  userData,
  setUserData,
  changePass,
  passCheck,
  setPassCheck,
  valid,
  valid2,
  changeHandler,
}) => {
  return (
    <Modal
      style={{
        margin: 0,
        alignItems: 'center',
      }}
      animationType={animate}
      isVisible={visible}>
      <ModalView width={width} height={height}>
        <HeaderView>
          <BTN
            onPress={() => {
              closeHandler();
            }}>
            <CloseImg
              width={20}
              height={20}
              source={require('../../../assets/image/common/close.png')}
            />
          </BTN>
        </HeaderView>
        <NBGBText align={'center'} marginTop={15} fontSize={17}>
          {title}
        </NBGBText>
        <BodyView>
          <MyInfoTI
            secureTextEntry={changePass}
            placeholder={
              myInfoColumn === 'tel'
                ? '("-") 제외하고 입력해주세요.'
                : myInfoColumn === 'userPw'
                ? '비밀번호 입력'
                : '2글자이상 17자미만으로 입력하세요.'
            }
            borderColor={
              valid.length === 0 && userData && userData.length !== 0
                ? '#53A6EC'
                : userData && userData.length !== 0
                ? 'red'
                : '#dbdbdb'
            }
            onChangeText={text => setUserData(text)}
            keyboardType={myInfoColumn === 'tel' ? 'number-pad' : 'default'}
            value={userData ? userData : ''}
            returnKeyType={changePass ? 'next' : 'done'}
            onSubmitEditing={async () => {}}
          />
          {changePass ? (
            <MyInfoTI
              borderColor={
                valid2.length === 0 && passCheck && passCheck.length !== 0
                  ? '#53A6EC'
                  : passCheck && passCheck.length !== 0
                  ? 'red'
                  : '#dbdbdb'
              }
              marginTop={20}
              secureTextEntry={true}
              placeholder={'비밀번호 재확인'}
              onChangeText={text => setPassCheck(text)}
              value={passCheck ? passCheck : ''}
              returnKeyType={'done'}
            />
          ) : null}
          <NBGBText color={'red'} fontSize={12} marginLeft={40}>
            {valid.length !== 0
              ? valid
              : changePass &&
                passCheck &&
                passCheck.length !== 0 &&
                valid2.length !== 0
              ? valid2
              : null}
          </NBGBText>
        </BodyView>
        <FooterView>
          <BTN
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              height: widthPercentageToDP(60),
              borderBottomLeftRadius: widthPercentageToDP(15),
              borderBottomRightRadius: widthPercentageToDP(15),
              backgroundColor: colors.active,
            }}
            onPress={() => {
              changeHandler();
            }}>
            <NBGText color={'white'} fontSize={16}>
              확인
            </NBGText>
          </BTN>
        </FooterView>
      </ModalView>
    </Modal>
  );
};

// 회원탈퇴 모달
export const SecessionModal = ({
  animate = 'fade',
  visible = false,
  width,
  height,
  closeHandler,
  confirmHandler,
}) => {
  return (
    <Modal
      style={{
        margin: 0,
        alignItems: 'center',
      }}
      animationType={animate}
      isVisible={visible}>
      <ModalView width={width} height={height}>
        <HeaderView>
          <BTN
            onPress={() => {
              closeHandler();
            }}>
            <CloseImg
              width={20}
              height={20}
              source={require('../../../assets/image/common/close.png')}
            />
          </BTN>
        </HeaderView>
        <NBGBText align={'center'} marginTop={15} fontSize={17}>
          회원탈퇴
        </NBGBText>
        <BodyView
          style={{
            justifyContent: 'flex-start',
            marginTop: widthPercentageToDP(40),
            marginHorizontal: widthPercentageToDP(20),
          }}>
          <NBGText style={{lineHeight: widthPercentageToDP(20)}}>
            {
              '정말로 삭제하시겠습니까?\n삭제하시면, 모든 정보가 삭제되며\n다시 정보를 복구할 수 없습니다!'
            }
          </NBGText>
        </BodyView>
        <FooterView>
          <BTN
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              height: widthPercentageToDP(60),
              borderBottomLeftRadius: widthPercentageToDP(15),
              borderBottomRightRadius: widthPercentageToDP(15),
              backgroundColor: colors.active,
            }}
            onPress={() => {
              confirmHandler();
            }}>
            <NBGText color={'white'} fontSize={16}>
              계속
            </NBGText>
          </BTN>
        </FooterView>
      </ModalView>
    </Modal>
  );
};
