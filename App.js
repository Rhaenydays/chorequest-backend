// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import MyTabs from './navigation/tabs'; // make sure tabs.js is here

export default function App() {
  return (
    <NavigationContainer>
      <MyTabs />
    </NavigationContainer>
  );
}