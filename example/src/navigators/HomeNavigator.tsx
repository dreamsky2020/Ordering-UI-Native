import * as React from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import { useOrder, useSession } from 'ordering-components/native'
// import MapOrders from '../pages/MapOrders';
// import OrderDetail from '../pages/OrderDetail';
// import Forgot from '../pages/ForgotPassword';
// import Reject from '../pages/Reject';
// import Accept from '../pages/Accept';
// import MapBusiness from '../pages/MapBusiness';
// import Chat from '../pages/Chat';
// import Supports from '../pages/Supports';
import AddressList from '../pages/AddressList'
import AddressForm from '../pages/AddressForm'
import SpinnerLoader from '../pages/SpinnerLoader'
import BottomNavigator from '../navigators/BottomNavigator'
import RootNavigator from '../navigators/RootNavigator'

const Stack = createStackNavigator();

const HomeNavigator = () => {

  const [orderState] = useOrder()
  const [{ auth }] = useSession()

  return (
    <Stack.Navigator>
      {(!orderState.loading || orderState.options?.address?.location) ? (
        <>
          {auth ? (
            orderState.options?.address?.location ? (
              <>
                <Stack.Screen
                  name='BottomTab'
                  component={BottomNavigator}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="AddressList"
                  component={AddressList}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="AddressForm"
                  component={AddressForm}
                  options={{ headerShown: false }}
                />
              </>
            ) : (
              <>
                <Stack.Screen
                  name="AddressList"
                  component={AddressList}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="AddressForm"
                  component={AddressForm}
                  options={{ headerShown: false }}
                />
              </>
            )
          ) : (
            <Stack.Screen
              name='root'
              component={RootNavigator}
              options={{ headerShown: false }}
            />
          )}
        </>
      ) : (
        <Stack.Screen
          name="SpinnerLoader"
          component={SpinnerLoader}
          options={{ headerShown: false }}
        />
      )}
      {/* <Stack.Screen
        name="MapOrders"
        component={MapOrders}
        options={{ title: 'Recieve Order', headerShown: false }}
        initialParams={{ is_online: is_online }}
      /> */}
      {/* <Stack.Screen
        name="OrderDetail"
        component={OrderDetail}
        options={{ title: 'Order Detail', headerShown: false }}
      /> */}
      {/* <Stack.Screen
        name="Reject"
        component={Reject}
        options={{ title: 'Reject Order', headerShown: false }}
      /> */}
      {/* <Stack.Screen
        name="Accept"
        component={Accept}
        options={{ title: 'Accept Order', headerShown: false }}
      /> */}
      {/* <Stack.Screen
        name="MapBusiness"
        component={MapBusiness}
        options={{ title: 'Map Business', headerShown: false }}
      /> */}
      {/* <Stack.Screen
        name="Chat"
        component={Chat}
        options={{ title: 'Chat Screen', headerShown: false }}
      /> */}

      {/* <Stack.Screen
        name="Supports"
        component={Supports}
        options={{ title: 'FAQ and Supports', headerShown: false }}
      /> */}
    </Stack.Navigator>
  );
}

export default HomeNavigator;
