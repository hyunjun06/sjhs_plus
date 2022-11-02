import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { theme_light } from './colors';
import { useFonts, NotoSansKR_900Black } from '@expo-google-fonts/noto-sans-kr';

function Topbar({ yscroll, setActivePage }) {
    let [fontsLoaded] = useFonts({
        NotoSansKR_900Black,
    });

    if(!fontsLoaded) return null;

    return (
        <View style={{borderBottomColor: `${theme_light.disabled_rgba} ${Math.min(yscroll, 1)})`, borderBottomWidth: 1}}>
            <View style={styles.topbar}>
                <TouchableOpacity onPress={() => setActivePage(1)}>
                    <Text style={styles.logo_text}>송죽학사+</Text>
                </TouchableOpacity>
                <Image source={require('../assets/pfp.jpeg')} style={{margin: 7.5, width: 30, height: 30, borderRadius: 40}}/>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    topbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 20,
        marginTop: 10,
        marginBottom: 5,
    },
    logo_text: {
      color: theme_light.text,
      fontSize: 30,
      fontFamily: 'NotoSansKR_900Black',
    },
});

export default Topbar;