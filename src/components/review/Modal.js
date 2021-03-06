import React from 'react';
import styled from 'styled-components/native';
import Modal from 'react-native-modal';
import {widthPercentageToDP} from '../../utils/util';
import {NBGText} from '../common/Text';
import {BTN, StandardView} from '../common/View';

const DivisionView = styled.View`
  width: 100%;
  height: ${widthPercentageToDP(1)};
  background-color: gray;
`;

const BottomModalView = styled.View`
  position: absolute;
  bottom: 0;
  width: ${({width}) => widthPercentageToDP(width)};
  border-radius: ${widthPercentageToDP(14)};
  background-color: transparent;
  align-self: center;
`;

// 해당 유저 리뷰 보기 버튼
const UserReviewBtn = styled(BTN)`
  width: 100%;
  height: ${({height}) =>
    height ? widthPercentageToDP(height) : widthPercentageToDP(60)};
  justify-content: center;
  border-top-width: ${({borderTop}) =>
    borderTop ? widthPercentageToDP(1) : 0};
  border-top-left-radius: ${({borderTop}) =>
    borderTop ? widthPercentageToDP(10) : 0};
  border-top-right-radius: ${({borderTop}) =>
    borderTop ? widthPercentageToDP(10) : 0};
  border-bottom-width: ${({borderBottom}) =>
    borderBottom ? widthPercentageToDP(1) : 0};
  border-bottom-left-radius: ${({borderBottom}) =>
    borderBottom ? widthPercentageToDP(10) : 0};
  border-bottom-right-radius: ${({borderBottom}) =>
    borderBottom ? widthPercentageToDP(10) : 0};
  background-color: #f6f7f9;
`;

//수정 버튼
const ModifyBtn = styled(UserReviewBtn)``;

// 삭제 버튼
const DeleteBtn = styled(UserReviewBtn)``;

// 취소 버튼
const CancelBtn = styled(UserReviewBtn)``;

export const BottomMenuModal = ({
  animate = 'fade',
  visible = false,
  width = 295,
  padding,
  user,
  reviewUser,
  modifyHandler,
  DeleteHandler,
  ReviewHandler,
  closeHandler,
}) => {
  return (
    <Modal style={{margin: 0}} animationType={animate} isVisible={visible}>
      <BottomModalView padding={padding} width={width}>
        {reviewUser !== undefined &&
        user.userNickName === reviewUser.user.userNickName ? (
          <StandardView>
            <ModifyBtn
              borderTop={true}
              onPress={() => {
                modifyHandler();
              }}>
              <NBGText fontSize={17} align={'center'}>
                수정
              </NBGText>
            </ModifyBtn>
            <DivisionView />
            <DeleteBtn
              onPress={() => {
                DeleteHandler();
              }}>
              <NBGText fontSize={17} align={'center'}>
                삭제
              </NBGText>
            </DeleteBtn>
          </StandardView>
        ) : (
          <UserReviewBtn
            borderTop={true}
            onPress={() => {
              ReviewHandler();
            }}>
            <NBGText fontSize={17} align={'center'}>
              {reviewUser !== undefined ? reviewUser.user.userNickName : ''}님의
              모든 리뷰 보기
            </NBGText>
          </UserReviewBtn>
        )}
        <DivisionView />
        <CancelBtn
          borderBottom={true}
          onPress={() => {
            closeHandler();
          }}>
          <NBGText fontSize={17} align={'center'}>
            취소
          </NBGText>
        </CancelBtn>
      </BottomModalView>
    </Modal>
  );
};
