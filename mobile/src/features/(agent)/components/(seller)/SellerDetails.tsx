import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Theme } from '@/config/constants';
import { SellerDetails } from '@/features/(client)/redux/sellersApi.slice';
import { StatusChip } from './StatusChip';

interface SellerDetailsViewProps {
    data: SellerDetails;
    isActive: boolean;
}

const SellerDetailsView: React.FC<SellerDetailsViewProps> = ({ data, isActive }) => {
    return (
        <View style={styles.container}>
            <StatusChip isActive={isActive} />
            <View style={styles.info}>
                <Text style={styles.name}>Chez {data.lastName}</Text>
                <View style={styles.marketInfo}>
                    <Text style={styles.marketText}>Marché de {data.market.name}</Text>
                    <Text style={styles.tableText}>Table #{data.tableNumber}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    info: {
        marginTop: 16,
    },
    name: {
        fontFamily: Theme.font.black,
        color: Theme.colors.black,
        fontSize: 24,
        letterSpacing: -0.7,
    },
    marketInfo: {
        marginTop: 4,
        alignItems: 'center',
    },
    marketText: {
        fontFamily: Theme.font.bold,
        color: Theme.colors.black,
        fontSize: 12,
        letterSpacing: -0.2,
    },
    tableText: {
        fontFamily: Theme.font.semiBold,
        color: Theme.colors.black,
        fontSize: 12,
        opacity: 0.7,
        letterSpacing: -0.2,
    },
});

export default SellerDetailsView;