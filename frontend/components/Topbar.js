import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { theme_light } from './colors';
import { useFonts, NotoSansKR_900Black } from '@expo-google-fonts/noto-sans-kr';
import { getPfpSrc } from './Api';

function Topbar({ yscroll, setActivePage, serverIp }) {
    const [pfpObj, setPfpObj] = useState();

    useEffect(() => {
        if(!pfpObj) {
            (async () => {
                const pfpSrc = await getPfpSrc(serverIp);
                if(pfpSrc) {
                    const pfp = await fetch(pfpSrc);
                    const pfpBlob = await pfp.blob();
                    setPfpObj(URL.createObjectURL(pfpBlob));
                }
            })();
        }
    }, [serverIp]);

    let [fontsLoaded] = useFonts({
        NotoSansKR_900Black,
    });

    if(!fontsLoaded) return null;

    const PfpModule = (
        <View style={{
            alignItems: 'center', justifyContent: 'center', backgroundColor: theme_light.bg
            /* FOR OUTLINE(ARCHIVED) padding: 3, borderWidth: 3, borderColor: theme_light.disabled */
        }}>
            <Image source={{uri: pfpObj}} style={{margin: 7.5, width: 35, height: 35, borderRadius: 40}}/>
        </View>
    );

    return (
        <View style={{borderBottomColor: `${theme_light.disabled_rgba} ${Math.min(yscroll, 1)})`, borderBottomWidth: 1}}>
            <View style={styles.topbar}>
                <TouchableOpacity onPress={() => setActivePage(1)}>
                    <Text style={styles.logo_text}>송죽학사+</Text>
                </TouchableOpacity>
                {PfpModule}
            </View>
        </View>
    );
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
      includeFontPadding: false,
    },
});

export default Topbar;