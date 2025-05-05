/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TaskList from './src/screens/TaskList';
import AddTask from './src/screens/AddTask';
import EditTask from './src/screens/EditTask';

export type RootStackParamList = {
  TaskList: undefined;
  AddTask: undefined;
  EditTask: { taskId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="TaskList"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTintColor: '#333',
          headerTitleStyle: {
            fontWeight: '600',
          },
        }}
      >
        <Stack.Screen
          name="TaskList"
          component={TaskList}
          options={{ title: 'My Tasks' }}
        />
        <Stack.Screen
          name="AddTask"
          component={AddTask}
          options={{ title: 'Add New Task' }}
        />
        <Stack.Screen
          name="EditTask"
          component={EditTask}
          options={{ title: 'Edit Task' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
