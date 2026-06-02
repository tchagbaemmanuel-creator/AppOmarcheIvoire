import { ButtonContainer, ButtonText } from '@/components/Button';
import { Theme } from '@/config/constants';
import { OrderDetails } from '@/features/(client)/redux/ordersApi.slice';
import React from 'react';
import { View, Text, Linking, StyleSheet } from 'react-native';
import { Iconify } from 'react-native-iconify';

interface LocationRowProps {
    title: string;
    distance: string;
    step?: 1 | 2;
}

const LocationRow: React.FC<LocationRowProps> = ({ title, distance, step }) => (
    <View style={styles.ordersContainerRow}>
        <Iconify icon="mdi:map-marker" size={28} color={Theme.colors.orange} />
        <View>
            <Text style={styles.ordersContainerRowTitle}>{title}</Text>
            <Text style={styles.ordersContainerRowSubtitle}>Distance: {distance}</Text>
        </View>
        {step && (
            step === 1 ? (
                <Iconify 
                    icon="healthicons:1-negative" 
                    style={{ marginLeft: 'auto' }} 
                    size={20} 
                    color={Theme.colors.green} 
                />
            ) : (    
                <Iconify 
                    icon="healthicons:2-negative" 
                    style={{ marginLeft: 'auto' }} 
                    size={20} 
                    color={Theme.colors.green} 
                />
            )
        )}
    </View>
);

interface ContactRowProps {
    type: 'Agent' | 'Client';
    firstName?: string;
    lastName?: string;
    phone?: string;
}

const ContactRow: React.FC<ContactRowProps> = ({ type, firstName, lastName, phone }) => (
    <View style={styles.ordersContainerRow}>
        <View style={styles.avatar} />
        <View>
            <Text style={styles.ordersContainerRowSubtitle}>{type === 'Agent' ? 'Vendeur' : type}</Text>
            <Text style={styles.ordersContainerRowTitle}>{firstName} {lastName}</Text>
        </View>
        <ButtonContainer style={styles.callButton} onPress={() => phone && Linking.openURL(`tel:${phone}`)}>
            <ButtonText color={Theme.colors.black} style={styles.callButtonText}>Appeler</ButtonText>
            <Iconify icon="mdi:phone" size={16} color={Theme.colors.black} />
        </ButtonContainer>
    </View>
);

export const MenuContent: React.FC<{ data: OrderDetails }> = ({ data }) => {
    function getMenuContent() {
        switch (data.order.status) {
            case 'PROCESSED':
                return <>
                    <LocationRow 
                        title={`Marché de ${data.marketName}`}
                        distance="5.1km"
                        step={1}
                    />
                    <LocationRow 
                        title={data.order.address}
                        distance="1.2 km"
                        step={2}
                    />
                </>;
            case 'COLLECTING':
                return <>
                    <LocationRow 
                        title={`Marché de ${data.marketName}`}
                        distance="5.1km"
                    />
                    <ContactRow 
                        type="Agent"
                        firstName={data.agent?.firstName}
                        lastName={data.agent?.lastName}
                        phone={data.agent?.phone}
                    />
                </>;
            case 'DELIVERING':
                return <>
                    <LocationRow 
                        title={data.order.address}
                        distance="1.2 km"
                    />
                    <ContactRow 
                        type="Client"
                        firstName={data.client?.firstName}
                        lastName={data.client?.lastName}
                        phone={data.client?.phone}
                    />
                </>;
            default:
                return null;
        }
    }
    
    return <>{getMenuContent()}</>;
};

const styles = StyleSheet.create({
    ordersContainerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    ordersContainerRowTitle: {
        fontSize: 16,
        letterSpacing: -0.3,
        fontFamily: Theme.font.black,
    },
    ordersContainerRowSubtitle: {
        fontSize: 14,
        letterSpacing: -0.3,
        fontFamily: Theme.font.bold,
        color: 'rgba(0,0,0,0.5)',
    },
    avatar: {
        height: 32,
        width: 32,
        borderRadius: 999,
        backgroundColor: 'black',
    },
    callButton: {
        marginLeft: 'auto',
        backgroundColor: 'rgba(0,0,0,0.05)',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    callButtonText: {
        fontSize: 14,
        fontWeight: '600',
    },
});
