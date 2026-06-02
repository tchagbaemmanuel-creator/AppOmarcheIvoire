import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { OrderDetails, useUpdateOrderStatusMutation } from '../../../(client)/redux/ordersApi.slice';
import { useDispatch, useSelector } from 'react-redux';
import { showToast } from '@/redux/slices/toast.slice';
import QRCodeScannerModal from '@/components/QRCodeScannerModal';
import { MenuContent } from './MenuContent';
import { MenuHeader } from './MenuHeader';
import { MenuActionButton } from './MenuActionButton';
import { RootState } from '@/redux/store';
import { Shipper } from '@/features/auth/redux/shipper.api';
import { Theme } from '@/config/constants';

interface MenuProps {
    data?: OrderDetails;
}

const MenuComponent: React.FC<MenuProps> = ({ data }) => {
    const [isQRCodeScannerModalVisible, setQRCodeScannerModalVisible] = useState(false);
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.auth.user) as Shipper
    const [updateOrderStatus, { isLoading }] = useUpdateOrderStatusMutation();

    const handleQRCodeScan = () => {
        if (!data) return;
        
        const actions = {
            'COLLECTING': {
                status: 'DELIVERING' as const,
                message: 'En livraison'
            },
            'DELIVERING': {
                status: 'DELIVERED' as const,
                message: 'Livrée'
            }
        };

        // @ts-ignore
        const action = actions[data.order.status];
        if (!action) return;

        updateOrderStatus({ 
            type: "shipper",
            userId: user.shipperId,
            orderId: data.order.orderId, 
            status: action.status 
        });
        dispatch(showToast({ 
            message: action.message, 
            type: 'success' 
        }));
    };

    const handleActionButtonPress = () => {
        if (!data) return;

        const actions = {
            'PROCESSED': {
                status: 'COLLECTING' as const,
                message: 'En collecte',
                action: () => {
                    updateOrderStatus({ 
                        type: "shipper",
                        userId: user.shipperId,
                        orderId: data.order.orderId, 
                        status: 'COLLECTING' 
                    });
                    dispatch(showToast({ 
                        message: 'En collecte', 
                        type: 'success' 
                    }));
                }
            },
            'COLLECTING': {
                action: () => setQRCodeScannerModalVisible(true)
            },
            'DELIVERING': {
                action: () => setQRCodeScannerModalVisible(true)
            }
        };

        // @ts-ignore
        const action = actions[data.order.status];
        if (action?.action) {
            action.action();
        }
    };

    return (
        <View style={styles.container}>
            <MenuHeader status={data?.order?.status} />
            {data && (
                <>
                    <MenuContent data={data} />
                    <MenuActionButton 
                        status={data.order.status} 
                        onPress={handleActionButtonPress} 
                        isLoading={isLoading} 
                    />
                    <QRCodeScannerModal
                        onClose={() => setQRCodeScannerModalVisible(false)}
                        isVisible={isQRCodeScannerModalVisible}
                        onScan={handleQRCodeScan}
                        validationRegex={new RegExp(`^${data.order.orderId}$`)}
                    />
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        gap: 4,
        height: 'auto',
        width: '100%',
        padding: 16,
        backgroundColor:'rgba(0,0,0,0.02)'
    },
});

export default MenuComponent;