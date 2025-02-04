import * as React from 'react';
import { Rating } from 'react-native-elements';
import styled from 'styled-components/native';
import BottomWrapper from '../components/BottomWrapper';
import OrderMap from '../components/OrderMap';
import OrderList from '../components/OrderList';
import OButton from '../components/shared/OButton';
import { colors } from '../theme';
import { OText } from '../components/shared';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IMAGES } from '../config/constants';
import orders from '../assets/json/orders.json'
import ApiProvider from '../providers/ApiProvider';
import { RequestOptionsProps } from 'ordering-api-sdk/lib/interfaces/RequestOptionsProps';
import { accessToken } from '../providers/Utilities';

const Wrapper = styled.View`
    flex: 1;
    flex-direction: column;
    justify-content: space-between;
`
const ContentWrap = styled.View`
    flex: 1;
`
const TopActions = styled.View`
    position: absolute;
    width: 100%;
    min-height: 80px;
    background-color: transparent;
    padding: 40px 16px 0;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    top: 0;
    z-index: 5;
`
const InnerWrapper = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`
const NameView = styled.View`
    flex-shrink: 1;
    align-items: flex-start;
`
const UserInfoView = styled.View`
    flex-direction: row;
    align-items: center;
    padding-right: 5px;
`
const Avatar = styled.Image`
    width: 60px;
    height: 60px; 
    margin-right: 6px;
    border-radius: 8px;
`
const FindingBtn = styled.TouchableOpacity`
    margin-top: 16px;
    margin-bottom: 10px;
    align-items: center;
`

let markers = [
    {
        latlng: { latitude: 37.78825, longitude: -122.4324 },
        image: IMAGES.marker
    },
    {
        latlng: { latitude: 37.79825, longitude: -122.4524 },
        image: IMAGES.marker
    },
    {
        latlng: { latitude: 37.78925, longitude: -122.3324 },
        image: IMAGES.marker
    }
]

const MapOrders = ({ navigation, route }: any) => {
    
    const ordering = ApiProvider();
    const safeAreaInset = useSafeAreaInsets();

    const [is_online, updateStatus] = React.useState(route.params.is_online)
    const [show_map, updateView] = React.useState(!route.params.order_view)

    const onOffStatus = () => {
        getOrders()
        updateStatus(!is_online)
    }

    const onChangeView = () => {
        updateView(!show_map)
    }

    const getOrders = () => {
        let options: RequestOptionsProps = { 
            query: [{ attribute: 'business_id', value: 1 },{
                attribute: "status",
                value: [1, 2, 5, 6, 10, 11, 12]
            }]
        }
        ordering.orders().get(options).then(res => {
            console.log(res)
        }).catch(err => {
            console.log(err)
        })
    }
    
    return (
        <Wrapper>
            <ContentWrap>
                <TopActions style={{paddingTop: safeAreaInset.top || 16}}>
                    <OButton
                        isCircle={true}
                        onClick={() => { navigation.openDrawer() }}
                        imgRightSrc={null}
                        imgLeftSrc={IMAGES.menu} 
                    />
                    <OButton 
                        onClick={onChangeView} 
                        imgRightSrc={null}
                        imgLeftSrc={show_map ? IMAGES.lunch : IMAGES.map} 
                        text={show_map ? 'Order View' : 'Map View'} 
                    />
                </TopActions>
                {show_map
                    ? (
                        <OrderMap       
                            region={{
                                latitude: 37.78825,
                                longitude: -122.4324,
                                latitudeDelta: 0.0922,
                                longitudeDelta: 0.0421,
                            }}
                            markers={markers}
                        /> 
                    )
                    : (
                        <OrderList orders={orders} navigation={navigation} isOnline={is_online}></OrderList>
                    )
                }
            </ContentWrap>
            <BottomWrapper>
                <InnerWrapper>
                    <UserInfoView style={{ flexShrink: 1 }}>
                        <Avatar source={IMAGES.avatar}></Avatar>
                        <NameView>
                            <OText size={17} weight={'700'} style={{marginBottom: 4}}>{'Smeeth Jhone Bailang'}</OText>
                            <Rating imageSize={12} readonly></Rating>
                        </NameView>
                    </UserInfoView>
                    <OButton
                        onClick={onOffStatus}
                        imgLeftSrc={IMAGES.arrow_up}
                        imgRightSrc={null}
                        imgLeftStyle={{ tintColor: 'white', width: 15, height: 15, marginRight: -5 }}
                        style={{ paddingLeft: 10, paddingRight: 4}}
                        text={'You\'re offline'}
                        bgColor={is_online ? colors.primary : colors.backgroundDark} 
                        borderColor={is_online ? colors.primary : colors.backgroundDark}
                        textStyle={{ color: 'white' }}
                    />
                </InnerWrapper>
                {is_online ? (
                    <FindingBtn>
                        <OText>{'FINDING TRIPS'}</OText>
                    </FindingBtn>
                ) : null}
            </BottomWrapper>
        </Wrapper>
    );
}

export default MapOrders;