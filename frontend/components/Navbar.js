import { View } from "react-native";
import { StyleSheet, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme_light } from "./colors";

function Navbar({ dimensions, activePage, setActivePage }) {
    const [page, setPage] = useState(1);

    useEffect(() => {
        if(activePage != page) setActivePage(page);
    }, [setActivePage, page]);

    const Indicator = <Icon name='circle-small' style={{...styles.icon, fontSize: dimensions.window.width / 15, marginTop: -dimensions.window.width / 50}} color="#fff"/>;

    return (
        <View style={{...styles.container, height: dimensions.window.width / 5 - 30}}>
            <View style={{...styles.menu, height: dimensions.window.width / 5 - 20}}>
                <TouchableOpacity onPress={() => {setPage(1)}}>
                    <Icon name='home-variant-outline' style={{...styles.icon, fontSize: dimensions.window.width / 15}} color="#fff"/>
                    {activePage == 1 ? Indicator : null}
                </TouchableOpacity>
            </View>
            <View style={{...styles.menu, height: dimensions.window.width / 5 - 20}}>
                <TouchableOpacity onPress={() => {setPage(2)}}>
                    <Icon name='food-outline' style={{...styles.icon, fontSize: dimensions.window.width / 15}} color="#fff"/>
                    {activePage == 2 ? Indicator : null}
                </TouchableOpacity>
            </View>
            <View style={{...styles.menu, height: dimensions.window.width / 5 - 20}}>
                <TouchableOpacity onPress={() => {setPage(3)}}>
                    <Icon name='calendar-blank-outline' style={{...styles.icon, fontSize: dimensions.window.width / 15}} color="#fff"/>
                    {activePage == 3 ? Indicator : null}
                </TouchableOpacity> 
            </View>
            <View style={{...styles.menu, height: dimensions.window.width / 5 - 20}}>
                <TouchableOpacity onPress={() => {setPage(4)}}>
                    <Icon name='contacts-outline' style={{...styles.icon, fontSize: dimensions.window.width / 15}} color="#fff"/>
                    {activePage == 4 ? Indicator : null}
                </TouchableOpacity>
            </View>
            <View style={{...styles.menu, height: dimensions.window.width / 5 - 20}}>
                <TouchableOpacity onPress={() => {setPage(5)}}>
                    <Icon name='file-edit-outline' style={{...styles.icon, fontSize: dimensions.window.width / 15}} color="#fff"/>
                    {activePage == 5 ? Indicator : null}
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: theme_light.bg,
        borderTopColor: theme_light.disabled,
        borderTopWidth: 1,
        marginBottom: 10
    },
    menu: {
        flex: 1,
        margin: 10,
        marginBottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        flex: 1,
        color: theme_light.text,
    },
    active: {
        backgroundColor: theme_light.disabled,
        borderRadius: 100,
    }
});

export default Navbar;