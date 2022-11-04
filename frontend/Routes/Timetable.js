import { StyleSheet, View, Text } from "react-native";
import { useEffect, useState } from "react";
import { useFonts, NotoSansKR_700Bold, NotoSansKR_100Thin, NotoSansKR_400Regular } from '@expo-google-fonts/noto-sans-kr';
import { theme_light } from "../components/colors";
import { getTimeTable } from "../components/Api";

function Timetable({ dimensions }) {
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

    return (
        <View style={{...styles.container, width: dimensions.window.width - 40}}>
            <Text style={{fontFamily: 'NotoSansKR_700Bold', fontSize: 30, color: theme_light.text, marginBottom: 10}}>시간표</Text>
            <View style={styles.tableContainer}>
                {timeTable ? timeTable.table.map((row, rindex) => <View key={rindex} style={styles.rowContainer}>
                    {row.map((item, cindex) => <View key={rindex * 10 + cindex} style={{...styles.tableItem, backgroundColor: cindex == 0 ? theme_light.disabled : theme_light.bg}}>
                        <Text style={styles.tableText}>{item}</Text>
                    </View>)}
                </View>) : <Text>로딩중...</Text>}
            </View>
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
        flex: 1,
        marginHorizontal: -20,
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