import { ButtonContainer, ButtonText } from '@/components/Button';
import { Theme } from '@/config/constants';
import { Order } from '@/features/(client)/redux/ordersApi.slice';
import React from 'react';
import { StyleSheet } from 'react-native';

const statusActionButtonMap: Record<Order['status'], string> = {
    IDLE: 'Commencer la commande',
    PROCESSING: 'Commencer la commande',
    PROCESSED: 'Prendre la commande',
    COLLECTING: 'Récupérer le panier',
    DELIVERING: 'Confirmer la livraison',
    DELIVERED: 'Commencer la commande',
    CANCELED: 'Commencer la commande',
};

interface MenuActionButtonProps {
    onPress: () => void;
    status: Order['status'];
    isLoading: boolean;
}

export const MenuActionButton: React.FC<MenuActionButtonProps> = ({ onPress, status, isLoading }) => {
    const active = status === "PROCESSED" || status === "COLLECTING" || status === "DELIVERING";
    if (!active) return null;

    return (
        <ButtonContainer 
            holdDuration={2000} 
            style={styles.button} 
            onPress={onPress} 
            disabled={isLoading}
        >
            <ButtonText 
                secure 
                color="white" 
                style={styles.buttonText} 
                loading={isLoading}
            >
                {statusActionButtonMap[status]}
            </ButtonText>
        </ButtonContainer>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: Theme.colors.orange,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
    },
});
