import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useFonts, NotoSansKR_700Bold, NotoSansKR_100Thin, NotoSansKR_400Regular } from '@expo-google-fonts/noto-sans-kr';
import { theme_light } from "../components/colors";
import { useEffect, useState } from "react";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Calendar } from "react-native-calendars";
import { getMenuList, getTimeTable } from "../components/Api";

function Meal({ dimensions, setYscroll }) {
    const [date, setDate] = useState(new Date());
    const [calendarOpen, setCalendarOpen] = useState(false);
    const [menus, setMenus] = useState();

    useEffect(() => {
        (async () => {
            const menuList = await getMenuList(date);
            setMenus(menuList);
        })();
    }, [date.getDate()]);

    let [fontsLoaded] = useFonts({
        NotoSansKR_700Bold,
        NotoSansKR_100Thin,
        NotoSansKR_400Regular,
    });

    if(!fontsLoaded) return <Text>로딩중...</Text>;

    const handleDateChange = (deltaDate) => {
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() + deltaDate);
        setDate(new Date(newDate));
    };

    const handleOnScroll = (event) => {
        setYscroll(event.nativeEvent.contentOffset.y / 100);
    };
    
    // Modules

    const DateNavigatorModule = (
        <View style={{flexDirection: "row", width: dimensions.window.width - 40, justifyContent: "space-between", alignItems: "flex-start"}}>
            {<TouchableOpacity onPress={() => {calendarOpen ? null : handleDateChange(-1)}}><Icon name='chevron-left' color={calendarOpen ? theme_light.bg : theme_light.text} size={30}/></TouchableOpacity>}
            <TouchableOpacity onPress={() => {setCalendarOpen(!calendarOpen)}}>
                <View style={{flexDirection: "row", alignItems: "center"}}>
                    <Text style={{fontFamily: 'NotoSansKR_700Bold'}}>{date.getFullYear() + "년 " + (date.getMonth() + 1) + "월 " + date.getDate() + "일"}</Text>
                    <Icon name={calendarOpen ? 'chevron-up' : 'chevron-down'} color={theme_light.text} size={30}/>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {calendarOpen ? null : handleDateChange(1)}}><Icon name='chevron-right' color={calendarOpen ? theme_light.bg : theme_light.text} size={30}/></TouchableOpacity>
        </View>
    );

    const ShowCalendarModule = calendarOpen ? (
        <View style={{width: dimensions.window.width - 20, left: -10}}>
            <Calendar
            onDayPress={(day) => {
                setDate(new Date(day.dateString));
                setCalendarOpen(false);
            }}
            markedDates={{
                [date.toISOString().split("T")[0]]: { selected: true },
            }}
            theme={{
                selectedDayBackgroundColor: theme_light.ui,
                arrowColor: theme_light.ui,
            }}
            />
        </View>
    ) : null;

    const GetMealModule = (mealType) => (
        <View style={{flex: 1}}>
            <View style={{flex: 1}}>
                <Text style={{fontFamily: 'NotoSansKR_400Regular', fontSize: 25, color: theme_light.text}}>{mealType}</Text>
                <Text style={{fontFamily: 'NotoSansKR_100Thin', fontSize: 20, color: theme_light.text}}>{menus ? (menus[mealType] === "" ? "급식 없음" : menus[mealType]) : "로딩중..."}</Text>
            </View>
        </View>
    );

    return (
        <View style={{...styles.container, width: dimensions.window.width - 40}}>
            <ScrollView showsVerticalScrollIndicator={false} onScroll={handleOnScroll} scrollEventThrottle={16} contentContainerStyle={{minHeight: dimensions.window.height - 120}}>
                <Text style={{fontFamily: 'NotoSansKR_700Bold', fontSize: 30, color: theme_light.text, marginBottom: 10}}>급식</Text>
                {DateNavigatorModule}
                {ShowCalendarModule}
                {GetMealModule("아침")}
                {GetMealModule("점심")}
                {GetMealModule("저녁")}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 20,
    }
});

export default Meal;