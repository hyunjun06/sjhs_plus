import { StyleSheet, View, Text, TextInput, ScrollView, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import { useFonts, NotoSansKR_700Bold, NotoSansKR_100Thin, NotoSansKR_400Regular } from '@expo-google-fonts/noto-sans-kr';
import { theme_light } from "../components/colors";
import { getContacts } from "../components/Api";

function Contacts({ dimensions }) {
    const [studentContacts, setStudentContacts] = useState();
    const [teacherContacts, setTeacherContacts] = useState();
    const [contacts, setContacts] = useState();
    const [searchValue, setSearchValue] = useState("");
    const [activeType, setActiveType] = useState("student");

    useEffect(() => {
        (async () => {
            const studentContactsList = await getContacts("student");
            setStudentContacts(studentContactsList);
            const teacherContatsList = await getContacts("teacher");
            setTeacherContacts(teacherContatsList);
        })();
    }, []);

    useEffect(() => {
        if(activeType == "student") setContacts(studentContacts);
        else setContacts(teacherContacts);
    }, [activeType, studentContacts, teacherContacts]);
    

    let [fontsLoaded] = useFonts({
        NotoSansKR_700Bold,
        NotoSansKR_100Thin,
        NotoSansKR_400Regular,
    });

    if(!fontsLoaded) return <Text>로딩중...</Text>;

    const ContactTypeSelectorModule = (
        <View style={{flexDirection: "row", marginBottom: 10}}>
            <TouchableOpacity style={activeType == "student" ? styles.button : styles.buttonDisabled} onPress={() => {setActiveType("student")}}>
                <Text style={activeType == "student" ? styles.buttonText : styles.buttonDisabledText}>학생</Text>
            </TouchableOpacity>
            <TouchableOpacity style={activeType == "teacher" ? styles.button : styles.buttonDisabled} onPress={() => {setActiveType("teacher")}}>
                <Text style={activeType == "teacher" ? styles.buttonText : styles.buttonDisabledText}>교사</Text>
            </TouchableOpacity>
        </View>
    );

    const ContactListStudentModule = () => {
        let gradeClass = "";

        return (contacts ? <ScrollView>
            {contacts.list.filter((item) => `${item.name}${item.number}`.includes(searchValue) && item.class != 0).map((item, index) => <View key={index}>
                {gradeClass != `${item.grade}-${item.class}` ? <Text style={styles.contactGradeClass}>{gradeClass = `${item.grade}-${item.class}`}</Text> : null}
                <View style={styles.contactItem}>
                    <View style={{flexDirection: "row"}}>
                        <Text style={styles.contactName}>{item.name}</Text>
                        <Text style={styles.contactNumber}>{item.number}</Text>
                    </View>
                    <Text style={styles.contactContact}>{item.contact}</Text>
                </View>
            </View>)}
        </ScrollView>
        :
        <Text>로딩중...</Text>
        );
    };

    const ContactListTeacherModule = () => {
        return (contacts ? <ScrollView>
            {contacts.list.filter((item) => `${item.name}${item.subject}`.includes(searchValue)).map((item, index) => <View key={index}>
                <View style={styles.contactItem}>
                    <View style={{flexDirection: "row"}}>
                        <Text style={styles.contactName}>{item.name}</Text>
                        <Text style={styles.contactNumber}>{item.subject}</Text>
                        <Text style={styles.contactNumber}>({item.grade}-{item.class})</Text>
                    </View>
                    <Text style={{...styles.contactContact, marginTop: 20}}>{item.contact}</Text>
                </View>
            </View>)}
        </ScrollView>
        :
        <Text>로딩중...</Text>
        );
    };

    return (
        <View style={{...styles.container, width: dimensions.window.width - 40}}>
            <Text style={{fontFamily: 'NotoSansKR_700Bold', fontSize: 30, color: theme_light.text, marginBottom: 5}}>연락처</Text>
            {ContactTypeSelectorModule}
            <TextInput style={{...styles.searchBox, width: dimensions.window.width - 40}} placeholder="학생 이름을 검색하세요" onChangeText={setSearchValue} value={searchValue}/>
            {activeType == "student" ? ContactListStudentModule() : ContactListTeacherModule()}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 20
    },
    searchBox: {
        borderBottomWidth: 2,
        borderBottomColor: theme_light.text,
        fontFamily: 'NotoSansKR_100Thin',
        includeFontPadding: false,
        fontSize: 20,
        marginBottom: 20,
    },
    contactItem: {
        flexDirection: "row",
        borderBottomColor: theme_light.text,
        marginBottom: 15,
        alignItems: "center",
        justifyContent: "space-between",
    },
    contactGradeClass: {
        fontFamily: 'NotoSansKR_700Bold',
        includeFontPadding: false,
        fontSize: 30,
        color: theme_light.ui,
        marginBottom: 10,
    },
    contactName: {
        fontFamily: 'NotoSansKR_400Regular',
        includeFontPadding: false,
        fontSize: 20,
        color: theme_light.text,
        marginRight: 5,
    },
    contactNumber: {
        fontFamily: 'NotoSansKR_100Thin',
        includeFontPadding: false,
        fontSize: 15,
        marginTop: 5,
    },
    contactContact: {
        fontFamily: 'NotoSansKR_100Thin',
        includeFontPadding: false,
        fontSize: 15,
    },
    buttonText: {
        fontFamily: 'NotoSansKR_700Bold',
        includeFontPadding: false,
        fontSize: 20,
        color: theme_light.text,
        marginRight: 10
    },
    button: {
        marginRight: 10,
    },
    buttonDisabledText: {
        fontFamily: 'NotoSansKR_700Bold',
        includeFontPadding: false,
        fontSize: 20,
        color: theme_light.disabled,
        marginRight: 10
    },
    buttonDisabled: {
        marginRight: 10,
    },
});

export default Contacts;