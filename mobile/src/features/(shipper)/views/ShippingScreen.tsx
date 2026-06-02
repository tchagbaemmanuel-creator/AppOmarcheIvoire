import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MapComponent from '../components/(shipping)/MapComponent';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import MenuComponent from '../components/(shipping)/MenuComponent';
import { Shipper } from '@/features/auth/redux/shipper.api';
import { setCurrentOrderId, WebSocketMessage } from '../redux/delivery.slice';
import { ENV } from '@/config/constants';
import { useGetOrderDetailsByIdQuery } from '@/features/(client)/redux/ordersApi.slice';
import { showToast } from '@/redux/slices/toast.slice';
import * as Haptics from 'expo-haptics';

export default function ShippingScreen() {
    const currentOrderId = useSelector((state: RootState) => state.delivery.currentOrderId);
    const {data} = useGetOrderDetailsByIdQuery(currentOrderId as string, {skip: !currentOrderId, pollingInterval: 5000});
    const dispatch = useDispatch();

    const auth = useSelector((state: RootState) => state.auth);
    const user = auth.user as Shipper;
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const wsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        let reconnectInterval: ReturnType<typeof setInterval> | undefined;

        const connectWebSocket = () => {
            try {
                const parsed = new URL(ENV.API_URL);
                const protocol = parsed.protocol === 'https:' ? 'wss:' : 'ws:';
                const wsUrl = `${protocol}//${parsed.host}/ws/${user.shipperId}`;
                const newWs = new WebSocket(wsUrl);
                wsRef.current = newWs;

                newWs.onopen = () => {
                    setIsConnected(true);
                    if (reconnectInterval !== undefined) {
                        clearInterval(reconnectInterval);
                        reconnectInterval = undefined;
                    }
                };

                newWs.onmessage = (event) => {
                    try {
                        const message = JSON.parse(event.data) as WebSocketMessage;
                        if (message?.orderId) {
                            dispatch(setCurrentOrderId(message.orderId));
                        }
                        if (message.type === 'NEW_ORDER') {
                            void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                            dispatch(
                                showToast({
                                    message: 'Nouvelle commande assignée. Ouvrez la fiche pour la livrer.',
                                    type: 'info',
                                })
                            );
                        } else if (message.type === 'CURRENT_ORDER') {
                            dispatch(
                                showToast({
                                    message: 'Synchronisation : commande active mise à jour.',
                                    type: 'info',
                                })
                            );
                        }
                    } catch {
                        /* message non JSON */
                    }
                };

                newWs.onclose = () => {
                    setIsConnected(false);
                    reconnectInterval = setInterval(() => {
                        connectWebSocket();
                    }, 5000);
                };

            } catch {
                setIsConnected(false);
            }
        };

        connectWebSocket();

        return () => {
            if (reconnectInterval !== undefined) {
                clearInterval(reconnectInterval);
            }
            wsRef.current?.close();
            wsRef.current = null;
        };
    }, [user.shipperId, dispatch]);

    return (
        <View style={styles.container}>
            <MapComponent data= {data} />
            <MenuComponent data={data} />
            <Text style={styles.wsStatus}>
                Status: {isConnected ? 'Connected' : 'Disconnected'}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    wsStatus: {
        position: 'absolute',
        top: 40,
        left: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        padding: 5,
        borderRadius: 5,
    },
});
