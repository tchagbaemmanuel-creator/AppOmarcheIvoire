import { Theme } from '@/config/constants';
import { Order } from '@/features/(client)/redux/ordersApi.slice';
import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Iconify } from 'react-native-iconify';

const statusTitleMap: Record<Order['status'], string> = {
    IDLE: 'En attente',
    PROCESSING: 'En collecte',
    PROCESSED: 'Nouvelle commande',
    COLLECTING: 'Collecte en cours',
    DELIVERING: 'Livraison en cours',
    DELIVERED: 'En attente',
    CANCELED: 'En attente',
};

interface MenuHeaderProps {
    status?: Order['status'];
}

export const MenuHeader: React.FC<MenuHeaderProps> = ({ status }) => {
    const delivering = status === 'PROCESSED' || status === 'COLLECTING' || status === 'DELIVERING';
    const title = status ? statusTitleMap[status] : 'En attente';
    
    return (
        <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            {delivering ? (
                <Iconify icon="mdi:shop-outline" size={32} color="rgba(0,0,0,0.1)" />
            ) : (
                <ActivityIndicator size="small" color={Theme.colors.orange} />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    },
    title: {
        fontSize: 24,
        letterSpacing: -0.5,
        fontFamily: Theme.font.black,
        fontWeight: '600',
    },
});
