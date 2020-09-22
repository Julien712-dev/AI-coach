import * as React from "react";
import { Platform, StyleSheet, Navigator } from "react-native";
import { StackViewStyleInterpolator } from "react-navigation-stack";
import { Scene, Router, Stack, ActionConst } from "react-native-router-flux";

// import screens
import HomeScreen from "./screens/HomeScreen.jsx";
import LoginScreen from "./screens/LoginScreen.jsx";
import UserInfoScreen from "./screens/UserInfoScreen.jsx";

// on Android, the URI prefix typically contains a host in addition to scheme
const prefix = Platform.OS === "android" ? "rbMobile://rbMobile/" : "rbMobile://";

function Routers() {
    return (
        <Router hideNavBar={true}>
            <Stack>
                <Scene key="tabBar" tabs={true} tabBarStyle={styles.tabBar} default="home" headerBackTitle=" " renderLeftButton={()=> null}>
                    <Scene key="home" component={HomeScreen} hideNavBar={true} title="Home" headerBackTitle=" " renderLeftButton={()=> null} />
                    <Scene key="user" component={UserInfoScreen} hideNavBar={true} title="User" />
                </Scene>
                <Scene key="login" initial={true} component={LoginScreen} hideTabBar={true} hideNavBar={true} title="Login"  />
            </Stack>
        </Router>
    )
}

const styles = StyleSheet.create({
    tabBar: {
        height: 50,
        borderTopColor: "darkgrey",
        borderTopWidth: 1,
        opacity: 0.98,
        justifyContent: "space-between"
    }
});
export default Routers;