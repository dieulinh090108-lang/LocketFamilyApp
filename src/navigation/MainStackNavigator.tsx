import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/home/HomeScreen';
import CreateGroupScreen from '../screens/group/CreateGroupScreen';
import JoinGroupScreen from '../screens/group/JoinGroupScreen';
import GroupScreen from '../screens/group/GroupScreen';
import FaceTestScreen from '../screens/faceTest/FaceTestScreen';
// import các màn hình khác ở đây

const MainStack = createNativeStackNavigator();

/**
 * MainStackNavigator quản lý các màn hình chính sau khi đăng nhập
 */
const MainStackNavigator = () => {
  return (
    <MainStack.Navigator screenOptions={{ headerShown: false }}>
      <MainStack.Screen name="Home" component={HomeScreen} />
      <MainStack.Screen name="CreateGroup" component={CreateGroupScreen} />
      <MainStack.Screen name="JoinGroup" component={JoinGroupScreen} />
      <MainStack.Screen name="GroupScreen" component={GroupScreen} />
      <MainStack.Screen name="FaceTest" component={FaceTestScreen} />
      {/* Thêm các màn hình khác ở đây */}
    </MainStack.Navigator>
  );
};

export default MainStackNavigator;
