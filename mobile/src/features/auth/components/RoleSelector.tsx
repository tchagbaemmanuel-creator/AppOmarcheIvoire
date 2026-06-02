import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Theme } from '@/config/constants';
import * as Haptics from 'expo-haptics';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { AuthStateType, changeRole } from '../redux/auth.slice';

export default function RoleSelector() {
    const authState = useSelector((state: RootState) => state.auth);
    const roles: AuthStateType['role'][] = ['Agent', 'Client', 'Livreur']
    const dispatch = useDispatch()
    const roleLabel = authState.role === 'Agent' ? 'Vendeur' : authState.role;
    return (
        <>
            <TouchableOpacity
                style={[styles.roleSelectorContainer]}
                onLongPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft)
                    // Cycle through roles
                    const currentIndex = roles.indexOf(authState.role)
                    const nextIndex = (currentIndex + 1) % roles.length
                    dispatch(changeRole(roles[nextIndex]))
                }}>
                <Text style={[styles.text]}>{roleLabel}</Text>
                <AntDesign name="smile-circle" size={20} color={Theme.colors.greenDark} />
            </TouchableOpacity>

        </>
    );
}

const styles = StyleSheet.create({
    roleSelectorContainer: {
        position: 'absolute',
        top: 64,
        zIndex: 999,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor: Theme.colors.greenLight,
        padding: 12,
        paddingHorizontal: 16,
        gap: 10,
        borderRadius: 999
    },
    text: {
        fontSize: 16,
        fontFamily: Theme.font.black,
        letterSpacing: -.5,
        color: Theme.colors.greenDark
    }
});