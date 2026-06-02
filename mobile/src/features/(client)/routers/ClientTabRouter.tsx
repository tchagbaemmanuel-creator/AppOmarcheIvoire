
import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TabBar from '../../../components/ui/TabBar';
import MapScreen from '../views/MapScreen';
import OrdersScreen from '../views/OrdersScreen';
import ProfileScreen from '../views/ProfileScreen';
import { FontAwesome6, Entypo } from '@expo/vector-icons'
import { Theme } from '@/config/constants';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { User } from '@/features/auth/redux/user.api';
import { ENV } from '@/config/constants';
import { showToast } from '@/redux/slices/toast.slice';
import * as Haptics from 'expo-haptics';
import { notifyOrderReceived } from '@/utils/notifications';

export type ClientTabParamList = {
    Map: undefined;
    Orders: undefined;
    Settings: undefined;
};

const Tab = createBottomTabNavigator()

function TabIcon({ label, isFocused }: { label: string, isFocused: boolean }) {
    const size = 24;
    if (label === 'Map') return <FontAwesome6 name="basket-shopping" color={isFocused ? Theme.colors.green : 'rgba(0,0,0,.2)'} size={size} />
    if (label === 'Orders') return <FontAwesome6 name="receipt" color={isFocused ? Theme.colors.green : 'rgba(0,0,0,.2)'} size={size} />
    else return <Entypo name="menu" color={isFocused ? Theme.colors.green : 'rgba(0,0,0,.2)'} size={size} />
}

export default function ClientTabRouter() {
    const dispatch = useDispatch()
    const user = useSelector((state: RootState) => state.auth.user) as User
    const wsRef = React.useRef<WebSocket | null>(null)

    React.useEffect(() => {
        let reconnectTimeout: ReturnType<typeof setTimeout> | undefined
        let closedByCleanup = false

        const formatStatus = (status: string) => {
            if (status === 'IDLE') return 'enregistree'
            if (status === 'PROCESSING') return 'en cours de traitement'
            if (status === 'PROCESSED') return 'collectee'
            if (status === 'COLLECTING') return 'en collecte'
            if (status === 'DELIVERING') return 'en livraison'
            if (status === 'DELIVERED') return 'livree'
            if (status === 'CANCELED') return 'annulee'
            return status
        }

        const connectWebSocket = () => {
            try {
                const parsed = new URL(ENV.API_URL)
                const protocol = parsed.protocol === 'https:' ? 'wss:' : 'ws:'
                const wsUrl = `${protocol}//${parsed.host}/ws/client/${user.userId}`
                const ws = new WebSocket(wsUrl)
                wsRef.current = ws

                ws.onmessage = (event) => {
                    try {
                        const message = JSON.parse(event.data) as {
                            type: 'ORDER_CREATED' | 'ORDER_STATUS_UPDATED'
                            orderId: string
                            status?: string
                        }

                        if (message.type === 'ORDER_CREATED') {
                            void notifyOrderReceived()
                            void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
                            dispatch(showToast({ message: 'Votre commande a bien ete enregistree.', type: 'success' }))
                            return
                        }

                        if (message.type === 'ORDER_STATUS_UPDATED' && message.status) {
                            void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
                            dispatch(showToast({
                                message: `Commande ${message.orderId.slice(0, 6)}: ${formatStatus(message.status)}.`,
                                type: 'info'
                            }))
                        }
                    } catch {
                        // no-op
                    }
                }

                ws.onclose = () => {
                    if (closedByCleanup) return
                    reconnectTimeout = setTimeout(connectWebSocket, 5000)
                }
            } catch {
                reconnectTimeout = setTimeout(connectWebSocket, 5000)
            }
        }

        if (user?.userId) connectWebSocket()

        return () => {
            closedByCleanup = true
            if (reconnectTimeout !== undefined) clearTimeout(reconnectTimeout)
            wsRef.current?.close()
            wsRef.current = null
        }
    }, [dispatch, user?.userId])

    return (
        <Tab.Navigator
            tabBar={props => <TabBar tabIconComponent={TabIcon} {...props} />}
            screenOptions={
                { headerShown: false }
            }>
            <Tab.Screen name="Map" component={MapScreen} />
            <Tab.Screen name="Orders" component={OrdersScreen} />
            <Tab.Screen name="Settings" component={ProfileScreen} />
        </Tab.Navigator>
    );
}
