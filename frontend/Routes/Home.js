import { useEffect, useState } from 'react';
import { theme_light } from '../components/colors';
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import { useFonts, NotoSansKR_900Black, NotoSansKR_100Thin, NotoSansKR_400Regular, NotoSansKR_700Bold } from '@expo-google-fonts/noto-sans-kr';
import { getMenuList, getTimeTable } from '../components/Api';

const BREAKFAST_TIME_END = 8 + 40 / 60, LUNCH_TIME_END = 13 + 40 / 60, DINNER_TIME_END = 19;
const SUBJECT_END = [0, 9 + 50 / 60, 10 + 50 / 60, 11 + 50 / 60, 12 + 50 / 60, 14 + 40 / 60, 15 + 40 / 60, 16 + 40 / 60];

function getMealType() {
    const now = new Date();
    const hour = now.getHours(), minute = now.getMinutes() / 60;
    if(hour + minute < BREAKFAST_TIME_END) return "아침";
    else if(hour + minute < LUNCH_TIME_END) return "점심";
    else if(hour + minute < DINNER_TIME_END) return "저녁";
    else return "아침";
}

function getActiveIndex() {
    for(let i = SUBJECT_END.length - 1; i >= 0; i--) if(new Date().getHours() + new Date().getMinutes() / 60 > SUBJECT_END[i]) return i + 1;
}

function Home({ dimensions, setYscroll }) {
    const [menus, setMenus] = useState();
    const [timeTable, settimeTable] = useState(["국어", "국어", "정보과학II", "정보과학II", "기초물리학실험II", "기초물리학실험II", "공강"]);
    
    useEffect(() => {
        if(!menus) {
            (async () => {
                const getNextDay = new Date().getHours() >= DINNER_TIME_END;
                const menuList =  await getMenuList(getNextDay);
                setMenus(menuList);
            })();
        }
    }, [menus]);

    let [fontsLoaded] = useFonts({
        NotoSansKR_900Black,
        NotoSansKR_100Thin,
        NotoSansKR_400Regular,
        NotoSansKR_700Bold,
    });

    if(!fontsLoaded) return <Text>로딩중...</Text>;

    const image_srcs = [
        {
            src: require("../assets/IMG_0790.jpg"),
            key: 1
        }, 
        {
            src: require("../assets/IMG_1220.jpg"),
            key: 2
        }, 
        {
            src: require("../assets/IMG_3429.jpg"),
            key: 3
        }
    ]

    const handleOnScroll = (event) => {
        setYscroll(event.nativeEvent.contentOffset.y / 100);
    };

    // Modules

    const ImageModule = (
        <View style={{flex: 1, marginBottom: 30}}>
            <Text style={{...styles.hashtag, marginHorizontal: 20}}>#감성샷</Text>
            <Text style={{...styles.label, marginHorizontal: 20}}>오늘부터 난 경곽 사진가</Text>
            {/* ScrollView for Images */}
            <ScrollView horizontal pagingEnabled={true} showsHorizontalScrollIndicator={false}>
                {image_srcs.map((img) => <Image key={img.key} source={img.src} style={{...styles.image, width: dimensions.window.width - 40}}/>)}
            </ScrollView>
        </View>
    );

    const ScheduleModule = (
        <View style={{flex: 1, marginBottom: 30}}>
            <Text style={{...styles.hashtag, marginHorizontal: 20}}>#집가고싶다</Text>
            <Text style={{...styles.label, marginHorizontal: 20}}>일정</Text>
            {/* ScrollView for Schdules */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {timeTable.map((subject, index) => {
                    const color = index + 1 == getActiveIndex() ? theme_light.ui : theme_light.disabled;
                    return (
                        // Schedule module
                        <View key={index} style={{
                            backgroundColor: color,
                            borderRadius: 10, 
                            marginLeft: index == 0 ? 20 : 0,
                            marginRight: index == timeTable.length - 1 ? 20 : 10, 
                            padding: 10, 
                            width: dimensions.window.width / 3,
                            height: dimensions.window.width / 3,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <Text style={{color: theme_light.text_invert, fontFamily: 'NotoSansKR_400Regular'}}>{index + 1}교시:</Text>
                            <Text style={{color: theme_light.text_invert, fontFamily: 'NotoSansKR_700Bold', fontSize: 20, textAlign: 'center'}}>{subject}</Text>
                        </View>
                    );
                })}
            </ScrollView>
        </View>
    );

    const MealModule = (
        <View style={{flex: 1, marginBottom: 30, marginHorizontal: 20}}>
            <Text style={styles.hashtag}>#배고파</Text>
            <Text style={styles.label}>다음 급식 <Text style={{fontFamily: 'NotoSansKR_100Thin'}}>{getMealType()}</Text></Text>
            <Text style={{fontSize: 20, fontFamily: 'NotoSansKR_400Regular'}}>{menus ? menus[getMealType()] : "로딩중..."}</Text>
        </View>
    );

    const LostModule = (
        <View style={{flex: 1, marginBottom: 30, marginHorizontal: 20}}>
            <Text style={styles.hashtag}>#어디갔지</Text>
            <Text style={styles.label}>분실물</Text>
            {/* TODO: 분실물 API */}
        </View>
    );

    return (
        <View style={{...styles.main, width: dimensions.window.width}}>
            {/* Vertical Scroll */}
            <ScrollView showsVerticalScrollIndicator={false} onScroll={handleOnScroll} scrollEventThrottle={16}>
                {ImageModule}
                {ScheduleModule}
                {MealModule}
                {LostModule}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        marginTop: 0,
    },
    hashtag: {
        color: theme_light.highlight,
        fontSize: 20,
        fontFamily: 'NotoSansKR_100Thin',
    },
    label: {
        color: theme_light.text,
        fontSize: 30,
        fontFamily: 'NotoSansKR_700Bold',
        marginBottom: 10,
    },
    image: {
        height: 200,
        borderRadius: 10,
        marginHorizontal: 20,
    }
});

export default Home;