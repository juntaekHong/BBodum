/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState, useRef, useCallback} from 'react';
import {ScrollView, Platform, View, Linking} from 'react-native';
import {connect} from 'react-redux';
import Toast from 'react-native-root-toast';
import {
  TopView,
  TopContainerView,
  BTN,
  StandardView,
} from '../../components/common/View';
import {NBGText, NBGBText} from '../../components/common/Text';
import {Card, BottomView} from '../../components/home/View';
import {widthPercentageToDP, showMessage, getData} from '../../utils/util';
import {CustomModal} from '../../components/common/Modal';
import Swiper from 'react-native-swiper';
import OfficeHours from '../hospitalDetail/OfficeHours';
import {PagiNationTab} from '../../components/home/PagiNation';
import {
  CommonActions,
  ReviewActions,
  HospitalActions,
} from '../../store/actionCreator';
import HospitalMap from '../hospitalDetail/HospitalMap';
import HospitalReview from '../hospitalDetail/HospitalReview';
import RNKakaoLink from 'react-native-kakao-links';

const HospitalDetail = props => {
  const [detailData, setDetailData] = useState(
    props.navigation.state.params.object,
  );

  // myScrap 데이터
  const [myScrap, setMyScrap] = useState(false);

  const [NameEncoding, setNameEncoding] = useState();
  // 길찾기 클릭 시, 길찾기 모달(알림창) visible
  const [roadMapModal, setRoadMapModal] = useState(false);
  // 택시 모달
  const [taxiModal, setTaxiModal] = useState(false);
  // 예약 모달
  const [reservationModal, setReservationModal] = useState(false);
  // 리뷰 작성 완료 모달
  const [reviewCompleteModal, setReviewCompleteModal] = useState(false);
  // 약국 상세페이지 마스크 현황
  const [mask, setMask] = useState(
    props.navigation.state.params.mask
      ? props.navigation.state.params.mask
      : undefined,
  );

  // 병원 상세 데이터가 들어오면 네이버 길찾기에 대한 한글 인코딩 해주는 것.
  useEffect(() => {
    setNameEncoding(encodeURI(encodeURIComponent(detailData.dutyName)));
  }, [detailData]);

  useEffect(() => {
    // 즐겨찾기 유무
    const promise1 = props.subscriber_list.map(item => {
      item.hospital.hpid === detailData.hpid ? setMyScrap(true) : null;
    });

    Promise.all([promise1]).then(async () => {
      await CommonActions.getDirection(
        props.latitude,
        props.longitude,
        detailData.wgs84Lat,
        detailData.wgs84Lon,
      );

      await ReviewActions.getAllReview(detailData.hpid);
    });

    return async () => {
      await CommonActions.handlePageIndex(0);
      await CommonActions.handleTimeInfo(null);

      await CommonActions.handleAbstractMapAction(null);
      await CommonActions.handleDetailMapAction(null);

      await ReviewActions.handleReviewListInit();
    };
  }, []);

  // 탭 버튼 스와이프 연동
  const swipe = useRef();

  // 스와이프 후, 자동 상향 스크롤
  const focusing = useRef();

  const KakaoMapNaivgate = async () => {
    await Linking.openURL(
      'daummaps://search?q=' +
        detailData.dutyName +
        '&p=' +
        detailData.wgs84Lat +
        ',' +
        detailData.wgs84Lon +
        '',
    ).catch(async () => {
      await props.navigation.navigate('KakaoMap', {
        uri:
          'https://map.kakao.com/link/map/' +
          detailData.dutyName +
          ',' +
          detailData.wgs84Lat +
          ',' +
          detailData.wgs84Lon +
          '',
      });
    });
  };

  // 네이버 지도 앱 or 웹으로 길찾기 기능
  const NaverMapNavigate = async () => {
    await Linking.openURL(
      'nmap://place?lat=' +
        detailData.wgs84Lat +
        '&lng=' +
        detailData.wgs84Lon +
        '&name=' +
        detailData.dutyName +
        '&appname=클론프로젝트',
    ).catch(async () => {
      await props.navigation.navigate('NaverMap', {
        uri:
          'https://m.map.naver.com/directions/#/poiSearch/destination/' +
          NameEncoding,
      });
    });
  };

  // 카카오택시 앱 열기
  const KakaoTaxi = useCallback(async () => {
    await Linking.openURL('kakaotaxi://').catch(async () => {
      await setTaxiModal(true);
    });
  }, []);

  const openStore = useCallback(async () => {
    Platform.OS === 'android'
      ? await Linking.openURL(
          'https://play.google.com/store/apps/details?id=com.kakao.taxi',
        ).catch(() => {
          // 플레이 스토어 열기 실패 시
        })
      : await Linking.openURL(
          // 앱 스토어 테스트 불가. 일단, 모바일 웹페이지로 연결
          'https://apps.apple.com/us/app/kakao-t/id981110422',
          // 밑에는 앱스토어 url 임.
          // http://itunes.apple.com/<country>/app/<app–name>/id<app-ID>?mt=8
        ).catch(() => {
          // 앱 스토어 열기 실패 시
        });
  }, []);

  const changPageIndex = useCallback(async index => {
    await CommonActions.handlePageIndex(index);

    await focusing.current.scrollTo({
      x: 0,
      y: 0,
      animated: true,
    });
  }, []);

  return (
    <TopContainerView>
      <CustomModal
        width={300}
        height={220}
        visible={reservationModal}
        close={true}
        closeHandler={() => {
          setReservationModal(false);
        }}
        children={
          <StandardView alignItems={'center'} justifyContent={'center'}>
            <NBGBText align={'center'}>
              {
                '예약을 하시려면 로그인 후, 사용해주시기 바랍니다.\n확인을 누르시면, 마이페이지로 이동합니다!'
              }
            </NBGBText>
          </StandardView>
        }
        footerHandler={async () => {
          await setReservationModal(false);
          props.navigation.navigate('MyPage', {autoLoginModal: true});
        }}
      />
      <CustomModal
        width={300}
        height={220}
        visible={roadMapModal}
        close={false}
        children={
          <View style={{marginLeft: widthPercentageToDP(20)}}>
            <NBGBText fontSize={20}>길찾기 선택</NBGBText>
            <BTN
              onPress={async () => {
                await setRoadMapModal(false);
                await KakaoMapNaivgate();
              }}
              style={{marginTop: widthPercentageToDP(30)}}>
              <NBGText fontSize={17}>카카오맵으로 길찾기</NBGText>
            </BTN>
            <BTN
              onPress={async () => {
                await setRoadMapModal(false);
                await NaverMapNavigate();
              }}
              style={{
                marginTop: widthPercentageToDP(30),
              }}>
              <NBGText fontSize={17}>네이버지도로 길찾기</NBGText>
            </BTN>
          </View>
        }
        renderFooter={() => {
          return (
            <BTN
              style={{
                marginRight: widthPercentageToDP(30),
                marginBottom: widthPercentageToDP(20),
                justifyContent: 'flex-end',
                alignItems: 'flex-end',
              }}
              onPress={async () => {
                await setRoadMapModal(false);
              }}>
              <NBGText fontSize={15}>취소</NBGText>
            </BTN>
          );
        }}
      />
      <CustomModal
        width={300}
        height={200}
        visible={taxiModal}
        close={false}
        children={
          <View style={{marginLeft: widthPercentageToDP(20)}}>
            <NBGBText fontSize={15}>카카오택시 앱이 없습니다.</NBGBText>
            <StandardView style={{marginTop: widthPercentageToDP(30)}}>
              <NBGText fontSize={13}>
                {
                  '카카오택시 앱이\n설치되어 있지 않습니다.\n카카오택시앱을 설치 하시겠습니까?'
                }
              </NBGText>
            </StandardView>
          </View>
        }
        renderFooter={() => {
          return (
            <StandardView
              style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
              <BTN
                style={{
                  marginRight: widthPercentageToDP(30),
                  marginBottom: widthPercentageToDP(20),
                  justifyContent: 'flex-end',
                  alignItems: 'flex-end',
                }}
                onPress={async () => {
                  await setTaxiModal(false);
                }}>
                <NBGText fontSize={15}>취소</NBGText>
              </BTN>
              <BTN
                style={{
                  marginRight: widthPercentageToDP(30),
                  marginBottom: widthPercentageToDP(20),
                  justifyContent: 'flex-end',
                  alignItems: 'flex-end',
                }}
                onPress={async () => {
                  await setTaxiModal(false);
                  await openStore();
                }}>
                <NBGText fontSize={15}>설치</NBGText>
              </BTN>
            </StandardView>
          );
        }}
      />
      <CustomModal
        width={300}
        height={200}
        visible={reviewCompleteModal}
        close={false}
        children={
          <View style={{marginLeft: widthPercentageToDP(20)}}>
            <NBGBText fontSize={17}>
              {props.navigation.state.params !== null &&
              props.navigation.state.params.modify
                ? '리뷰 수정완료'
                : '리뷰 작성완료'}
            </NBGBText>
            <StandardView style={{marginTop: widthPercentageToDP(30)}}>
              <NBGText fontSize={13}>
                {props.navigation.state.params !== null &&
                props.navigation.state.params.modify
                  ? '정상적으로 리뷰가 수정되었습니다.'
                  : '작성한 리뷰를 보시겠습니까?\n 확인을 누르시면, 리뷰페이지가 보여집니다.'}
                {}
              </NBGText>
            </StandardView>
          </View>
        }
        renderFooter={() => {
          return (
            <StandardView
              style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
              <BTN
                style={{
                  marginRight: widthPercentageToDP(30),
                  marginBottom: widthPercentageToDP(20),
                  justifyContent: 'flex-end',
                  alignItems: 'flex-end',
                }}
                onPress={async () => {
                  await setReviewCompleteModal(false);
                }}>
                <NBGText fontSize={15}>
                  {props.navigation.state.params !== null &&
                  props.navigation.state.params.modify
                    ? '닫기'
                    : '취소'}
                </NBGText>
              </BTN>
              {props.navigation.state.params !== null &&
              props.navigation.state.params.modify ? null : (
                <BTN
                  style={{
                    marginRight: widthPercentageToDP(30),
                    marginBottom: widthPercentageToDP(20),
                    justifyContent: 'flex-end',
                    alignItems: 'flex-end',
                  }}
                  onPress={async () => {
                    await swipe.current.scrollBy(2);
                    await setReviewCompleteModal(false);
                  }}>
                  <NBGText fontSize={15}>확인</NBGText>
                </BTN>
              )}
            </StandardView>
          );
        }}
      />
      <TopView
        marginBottom={5}
        title={detailData.dutyName}
        backBtn={true}
        backHandler={() => {
          props.navigation.goBack(null);
        }}
        closeBtn={false}
        searchBtn={false}
        sharedBtn={true}
        sharedHandler={async () => {
          const kakaoLinkData = {
            title: detailData.dutyName,
            address: detailData.dutyAddr,
            img: detailData.img
              ? detailData.img
              : 'https://cdn.icon-icons.com/icons2/1465/PNG/512/588hospital_100778.png',
          };

          await RNKakaoLink.link({
            objectType: 'feed', //required
            content: {
              title: kakaoLinkData.title,
              desc: kakaoLinkData.address,
              link: {
                mobileWebURL: 'https://developers.kakao.com',
                androidExecutionParams: 'id=1',
                iosExecutionParams: 'id=1',
              },
              imageURL: kakaoLinkData.img,
            }, //required
          });
        }}
      />
      <ScrollView ref={focusing}>
        <Card
          type={detailData.type}
          mask={mask}
          hospitalName={detailData.dutyName}
          rating={4.0}
          reviewCount={50}
          dutyAddr={detailData.dutyAddr}
          dutyMapimg={detailData.dutyMapimg}
          hospitalId={detailData.hpid}
          isScrap={myScrap}
          loginInfo={props.user}
          autoLoginModal={() => {
            setReservationModal(true);
          }}
          phoneNumber={detailData.dutyTel}
          naviModal={async () => {
            await setRoadMapModal(true);
          }}
          taxiModal={async () => {
            await KakaoTaxi();
          }}
        />
        <PagiNationTab
          index={props.page_index}
          page1={{title: '진료시간 정보', index: 0}}
          page2={{title: '길찾기', index: 1}}
          page3={{title: '리뷰', index: 2}}
          type={detailData.type}
          onPress={async index => {
            if (props.page_index !== index) {
              await swipe.current.scrollBy(index - props.page_index);
            }
          }}
        />
        <View
          style={{
            flex: 1,
          }}>
          <Swiper
            ref={swipe}
            loadMinimal={true}
            loadMinimalSize={0}
            height={'100%'}
            index={props.page_index}
            onIndexChanged={async index => {
              await changPageIndex(index);
            }}
            loop={false}
            showsPagination={false}>
            {/* 진료시간 정보 페이지(간략 병원 소개 포함) */}
            <OfficeHours detailData={detailData} />
            {/* 길찾기 페이지 */}
            <HospitalMap
              end_address={detailData.dutyAddr}
              startLat={props.latitude}
              startLong={props.longitude}
              endLat={detailData.wgs84Lat}
              endLong={detailData.wgs84Lon}
            />
            {/* 해당 병원 리뷰 페이지 */}
            {!detailData.type ? (
              <HospitalReview
                hpId={detailData.hpid}
                ratingAvg={detailData.ratingAvg}
                user={props.user}
                navigation={props.navigation}
                reviewCompleteModal={setReviewCompleteModal}
              />
            ) : null}
          </Swiper>
        </View>
      </ScrollView>
      {/* 예약 페이지로 이동 */}
      {!detailData.type ? (
        <BottomView
          reviewBtn={props.user !== null && props.user.token ? true : false}
          reviewWrite={() => {
            // reviewListCheck이 true, medicalHistoryCheck이 true일 때, 작성 가능함.
            let reviewListCheck = true;
            let medicalHistoryCheck = false;
            // 예약날로부터 유효 기간 7일
            let timeoutDate = 7 * 24 * 60 * 60 * 1000;
            // 오늘 날짜
            let todayDate = new Date().getTime() + 540 * 60 * 1000;
            // 예약 시간
            let reservationDate;
            // 오늘 기준 진료완료 시간 갭
            let gapDate;

            if (props.my_review_list.length !== 0) {
              props.my_review_list.map(item => {
                item.hpid === detailData.hpid
                  ? (reviewListCheck = false)
                  : null;
              });
            }

            if (props.history_list.length !== 0) {
              props.history_list.map(item => {
                if (
                  item.hpid === detailData.hpid &&
                  item.status === 'TIMEOUT'
                ) {
                  reservationDate = new Date(item.reservationDate).getTime();

                  gapDate =
                    todayDate - reservationDate > 0
                      ? todayDate - reservationDate
                      : reservationDate - todayDate;

                  if (timeoutDate >= gapDate) {
                    medicalHistoryCheck = true;
                  }
                }
              });
            }

            if (reviewListCheck && medicalHistoryCheck) {
              props.navigation.navigate('ReviewWrite', {
                hpid: detailData.hpid,
                reviewCompleteModal: setReviewCompleteModal,
              });

              props.page_index === 2
                ? swipe.current.scrollBy(-2)
                : props.page_index === 1
                ? swipe.current.scrollBy(-1)
                : null;
            } else {
              !medicalHistoryCheck && reviewListCheck
                ? showMessage('진료 내역이 없어 리뷰를 작성하실 수 없습니다!', {
                    position: Toast.positions.CENTER,
                  })
                : !medicalHistoryCheck
                ? showMessage('진료한지 7일이 지나 작성하실 수 없습니다.', {
                    position: Toast.positions.CENTER,
                  })
                : showMessage('이미 작성한 리뷰가 있습니다!', {
                    position: Toast.positions.CENTER,
                  });
            }
          }}
          reservation={async () => {
            if (props.user !== null) {
              if (props.user.token) {
                if (detailData.office.length !== 0) {
                  await CommonActions.handleTimeInfo({
                    hospitalName: detailData.dutyName,
                    dutyTime1: detailData.dutyTime1,
                    dutyTime2: detailData.dutyTime2,
                    dutyTime3: detailData.dutyTime3,
                    dutyTime4: detailData.dutyTime4,
                    dutyTime5: detailData.dutyTime5,
                    dutyTime6: detailData.dutyTime6,
                    dutyTime7: detailData.dutyTime7,
                    dutyTime8: detailData.dutyTime8,
                    office: detailData.office,
                  });

                  if (props.user.userNickName === undefined) {
                    showMessage(
                      '카카오톡 로그인은 마이페이지에서\n추가 정보를 입력해야 사용할 수 있습니다.',
                      {
                        position: Toast.positions.CENTER,
                      },
                    );
                  } else {
                    props.navigation.navigate('Reservation');
                  }
                } else {
                  showMessage('현재 전화접수만 가능한 병원입니다!', {
                    position: Toast.positions.CENTER,
                  });
                }
              } else {
                showMessage('이메일 인증 후, 사용할 수 있습니다.', {
                  position: Toast.positions.CENTER,
                });
              }
            } else {
              setReservationModal(true);
            }
          }}
          navigation={props.navigation}
        />
      ) : null}
    </TopContainerView>
  );
};

export default connect(state => ({
  page_index: state.common.page_index,

  latitude: state.common.latitude,
  longitude: state.common.longitude,

  user: state.signin.user,

  subscriber_list: state.hospital.subscriber_list,
  // 리뷰 작성 버튼 클릭 시, 작성 가능한지 검사하기 위해 필요함.
  my_review_list: state.review.my_review_list,
  history_list: state.reservation.history_list,
}))(HospitalDetail);
