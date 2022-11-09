import { StyleSheet, View, Text, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { useFonts, NotoSansKR_700Bold, NotoSansKR_100Thin, NotoSansKR_400Regular } from '@expo-google-fonts/noto-sans-kr';
import { theme_light } from "../components/colors";
import { getTimeTable } from "../components/Api";

function Timetable({ dimensions, setYscroll }) {
    const [timeTable, setTimeTable] = useState();

    useEffect(() => {
        (async () => {
            const table = await getTimeTable();
            setTimeTable(table);
        })();
    }, []);

    let [fontsLoaded] = useFonts({
        NotoSansKR_700Bold,
        NotoSansKR_100Thin,
        NotoSansKR_400Regular,
    });

    if(!fontsLoaded) return <Text>로딩중...</Text>;

    const handleOnScroll = (event) => {
        setYscroll(event.nativeEvent.contentOffset.y / 100);
    };

    const TimeTableModule = (timeTable ?
        <View style={{flex: 1, marginHorizontal: 0, padding: 0}}>
            <View style={{backgroundColor: theme_light.disabled, marginHorizontal: -20, flex: 1, flexDirection: "row", paddingHorizontal: 20}}>
                {timeTable.head.map((item, index) => <Text key={index} style={{...styles.tableText, flex: 1}}>{item}</Text>)}
            </View>
            <View style={styles.tableContainer}>
                {timeTable.table.map((row, rindex) => <View key={rindex} style={styles.rowContainer}>
                    {row.map((item, cindex) => <View key={rindex * 10 + cindex} style={{...styles.tableItem, backgroundColor: cindex == 0 ? theme_light.disabled : theme_light.bg}}>
                        <Text style={styles.tableText}>{item}</Text>
                    </View>)}
                </View>)}
            </View>
        </View>
        :
        <Text>로딩중...</Text>
    );

    return (
        <View style={{...styles.container, width: dimensions.window.width, marginHorizontal: 0}}>
            <ScrollView showsVerticalScrollIndicator={false} onScroll={handleOnScroll} scrollEventThrottle={16} contentContainerStyle={{minHeight: dimensions.window.height - 120}}>
                <Text style={{fontFamily: 'NotoSansKR_700Bold', fontSize: 30, color: theme_light.text, marginBottom: 10, marginHorizontal: 20}}>시간표</Text>
                <Text style={{fontFamily: 'NotoSansKR_400Regular', fontSize: 20, color: theme_light.text, marginBottom: 10, marginLeft: 10}}>
                    {timeTable ? timeTable.studentInfo : "로딩중..."}
                </Text>
                {TimeTableModule}
            </ScrollView>  
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 20,
    },
    text: {
        margin: 6
    },
    tableContainer: {
        flexDirection: "column",
        flex: 20,
        marginHorizontal: -20,
        paddingHorizontal: 20
    },
    rowContainer: {
        flexDirection: "row",
        flex: 1
    },
    tableItem: {
        flex: 1,
        justifyContent: "center",
        padding: 1,
    },
    tableText: {
        fontFamily: 'NotoSansKR_100Thin',
        alignSelf: "center",
        textAlign: "center",
    }
});

export default Timetable;