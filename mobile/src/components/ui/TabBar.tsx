import { StyleSheet, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Theme } from '@/config/constants';


interface TabBarProps extends BottomTabBarProps {
    tabIconComponent: React.FC<{ label: string, isFocused: boolean }>
}

export default function TabBar({ state, descriptors, navigation, tabIconComponent }: TabBarProps) {
    const insets = useSafeAreaInsets();
    return (
        <View style={{ flexDirection: 'row', height: 60, gap: 48, marginBottom: insets.bottom, alignItems: 'center', justifyContent: 'center' }}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];

                const label =
                    (options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                            ? options.title
                            : route.name) as string;

                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name, route.params);
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };

                return (
                    <TouchableOpacity
                        accessibilityRole="button"
                        accessibilityState={isFocused ? { selected: true } : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarTestID}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        key={label}
                    >
                        <View style={[styles.tabIconWrapper, { backgroundColor: isFocused ? Theme.colors.greenLight : 'transparent' }]}>
                            {tabIconComponent({ label, isFocused })}
                        </View>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    tabIconWrapper: {
        height: 54,
        width: 54,
        borderRadius: 999,
        justifyContent: 'center',
        alignItems: 'center'
    }
})