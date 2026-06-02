import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Theme } from '@/config/constants';
import { Iconify } from 'react-native-iconify';
interface StatusChipProps {
    isActive: boolean;
}

const CheckCircleIcon = () => <Iconify icon="mdi:check-circle" size={20} color={Theme.colors.green} />;
const CloseCircleIcon = () => <Iconify icon="mdi:close-circle" size={20} color={Theme.colors.red} />;

export const StatusChip: React.FC<StatusChipProps> = ({ isActive }) => {
    return (
        <View style={[styles.chip, { backgroundColor: isActive ? Theme.colors.greenLight : Theme.colors.redLight }]}>
            <Text style={[styles.text, { color: isActive ? Theme.colors.green : Theme.colors.red }]}>
                {isActive ? "Ouvert" : "Fermé"}
            </Text>
            {isActive ? <CheckCircleIcon /> : <CloseCircleIcon />}
        </View>
    );
};

const styles = StyleSheet.create({
    chip: {
        flexDirection: 'row',
        borderRadius: 999,
        gap: 4,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        paddingHorizontal: 14,
    },
    text: {
        fontFamily: Theme.font.black,
        fontSize: 14,
        letterSpacing: -0.5,
    },
});