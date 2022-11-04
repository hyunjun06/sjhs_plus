import { StyleSheet, View, Text } from "react-native";
import { useEffect, useState } from "react";
import { useFonts, NotoSansKR_700Bold, NotoSansKR_100Thin, NotoSansKR_400Regular } from '@expo-google-fonts/noto-sans-kr';
import { theme_light } from "../components/colors";
import { getTimeTable } from "../components/Api";
import { Table, Row, Rows } from "react-native-table-component";

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
            <Table>
                <Row data={timeTable?.head ? timeTable.head : ["로딩중..."]} textStyle={styles.text}/>
                <Rows date={timeTable?.table ? timeTable.table : ["로딩중..."]} textStyle={styles.text}/>
            </Table>
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
});

export default Timetable;