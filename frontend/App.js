import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, SafeAreaView, ScrollView, Dimensions, Text, TextInput } from 'react-native';
import Navbar from './components/Navbar';
import { theme_light } from './components/colors';
import { Fragment, useState, useEffect, useRef } from 'react';

import Topbar from './components/Topbar';
import Home from './Routes/Home';
import Meal from './Routes/Meal';
import Timetable from './Routes/Timetable';
import Contacts from './Routes/Contacts';
import Pass from './Routes/Pass';

const window = Dimensions.get("window");
const screen = Dimensions.get("screen");

export default function App() {
  const [activePage, setActivePage] = useState(1);
  const [dimensions, setDimensions] = useState({ window, screen });
  const [yscroll, setYscroll] = useState(0);
  const [serverIp, setServerIp] = useState("");
  const scrollView = useRef(null);

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window, screen }) => {
        setDimensions({ window, screen });
    });
    return () => subscription?.remove();
  });

  useEffect(() => {
    scrollView.current.scrollTo({x: dimensions.window.width * (activePage - 1), y: 0, animated: true});
  }, [activePage]);

  const handleOnScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    if(scrollPosition == 0) setActivePage(1);
    else if(scrollPosition == dimensions.window.width * 1) setActivePage(2);
    else if(scrollPosition == dimensions.window.width * 2) setActivePage(3);
    else if(scrollPosition == dimensions.window.width * 3) {
      setActivePage(4);
      setYscroll(0);
    } else if(scrollPosition == dimensions.window.width * 4) setActivePage(5);
  };

  const MainContentModule = (
    // Horizontal Page Scroll
    <ScrollView horizontal pagingEnabled={true} showsHorizontalScrollIndicator={false} onScroll={handleOnScroll} scrollEventThrottle={16} ref={scrollView}>
      <Home dimensions={dimensions} setYscroll={setYscroll} serverIp={serverIp}/>
      <Meal dimensions={dimensions} setYscroll={setYscroll} serverIp={serverIp}/>
      <Timetable dimensions={dimensions} setYscroll={setYscroll} serverIp={serverIp}/>
      <Contacts dimensions={dimensions} serverIp={serverIp}/>
      <Pass dimensions={dimensions}/>
    </ScrollView>
  );

  // FOR TESTING PURPOSES
  const TestModule = (
    <View style={{backgroundColor: theme_light.disabled, paddingHorizontal: 20, paddingVertical: 10}}>
        <Text>FOR TESTING PURPOSES** SERVER IP:</Text>
        <TextInput onChangeText={setServerIp} value={serverIp} style={{borderBottomWidth: 1, borderBottomColor: theme_light.text}}/>
    </View>
  );

  return (
    <Fragment>
      <StatusBar style="dark"/>
      <SafeAreaView style={{flex: 1, backgroundColor: theme_light.bg}}>
        <View style={styles.container}>
          <Topbar yscroll={yscroll} setActivePage={setActivePage} serverIp={serverIp}/>
          {MainContentModule}
          {/* Will delete this later */}
          {TestModule}
        </View>
        <Navbar dimensions={dimensions} activePage={activePage} setActivePage={setActivePage}/>
      </SafeAreaView>
    </Fragment>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
