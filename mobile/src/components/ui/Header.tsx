import { ButtonContainer } from "@/components/Button";
import { Theme } from "@/config/constants";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View, ViewProps, TextProps } from "react-native";

interface BackButtonProps extends ViewProps {
    navigation: NativeStackNavigationProp<any>
}
export function BackButton(props: BackButtonProps) {
    return <ButtonContainer
        {...props}
        style={[{ backgroundColor: Theme.colors.greenLight, width: 42, height: 42 }, props.style]}
        onPress={() => props.navigation.goBack()}>
        <MaterialCommunityIcons name="arrow-left" size={20} color={Theme.colors.greenDark} />
    </ButtonContainer>
}

interface HeaderSubtitleProps extends TextProps { }
export function HeaderSubtitle(props: HeaderSubtitleProps) {
    return <Text {...props} style={[styles.headerSubtitle, props.style]} />
}

interface HeaderTitleProps extends TextProps { }
export function HeaderTitle(props: HeaderTitleProps) {
    return <Text {...props} style={[styles.headerTitle, props.style]} />
}

interface HeaderContainerProps extends ViewProps { }
export function HeaderContainer(props: HeaderContainerProps) {
    return <View {...props} style={[styles.headerContainer, props.style]} />
}

const styles = StyleSheet.create({
    headerContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 16,
        marginTop: 8,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    headerTitle: {
        fontFamily: Theme.font.black,
        color: Theme.colors.greenDark,
        letterSpacing: -.5,
        fontSize: 18
    },
    headerSubtitle: {
        fontFamily: Theme.font.bold,
        color: 'gray',
        letterSpacing: -.5,
        fontSize: 10,
        marginBottom: -2
    },
    headerMarketName: {
        fontFamily: Theme.font.bold,
        color: 'gray',
        letterSpacing: -.5,
        fontSize: 14,
        marginRight: 8
    },
})