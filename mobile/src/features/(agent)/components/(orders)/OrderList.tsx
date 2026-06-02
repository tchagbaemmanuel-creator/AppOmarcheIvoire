import React, { useEffect, useRef } from 'react'
import { FlatList, StyleSheet, View } from 'react-native'
import { useUpdateOrderStatusMutation } from '@/features/(client)/redux/ordersApi.slice'
import { useGetOrdersByMarketIdQuery } from '@/features/(client)/redux/marketsApi.slice'
import OrderItem from './OrderItem'
import { useErrorHandler } from '@/hooks/useErrorHandler'
import { useDispatch } from 'react-redux'
import { showToast } from '@/redux/slices/toast.slice'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { Agent } from '@/features/auth/redux/agent.api'

const OrderList = ({ marketId }: { marketId: string }) => {
    const dispatch = useDispatch()
    const { data, refetch, isFetching } = useGetOrdersByMarketIdQuery(marketId, {
        pollingInterval: 12_000,
    })
    const prevIdleCount = useRef<number | null>(null)
    const skipNextIdleToast = useRef(true)

    useEffect(() => {
        skipNextIdleToast.current = true
        prevIdleCount.current = null
    }, [marketId])

    useEffect(() => {
        if (!data) return
        const idleCount = data.filter((o) => o.status === 'IDLE').length
        if (skipNextIdleToast.current) {
            skipNextIdleToast.current = false
            prevIdleCount.current = idleCount
            return
        }
        if (prevIdleCount.current !== null && idleCount > prevIdleCount.current) {
            dispatch(
                showToast({
                    message: 'Nouvelle commande en attente de validation.',
                    type: 'info',
                })
            )
        }
        prevIdleCount.current = idleCount
    }, [data, dispatch])
    const [updateOrderStatus] = useUpdateOrderStatusMutation()
    const handleError = useErrorHandler()
    const user = useSelector((state: RootState) => state.auth.user) as Agent


    const handleConfirm = async (orderId: string) => {
        try {
            await updateOrderStatus({ orderId, status: 'PROCESSING', type:'agent',userId: user.agentId }).unwrap()
            dispatch(showToast({ message: "Commande confirmée avec succès.", type: "success" }))
            refetch()
        } catch (error) {
            handleError(error)
        }
    }

    const handleCancel = async (orderId: string, reason?: string) => {
        try {
            await updateOrderStatus({ orderId, status: 'CANCELED', cancellationReason: reason, type:'agent', userId: user.agentId }).unwrap()
            dispatch(showToast({ message: "Commande annulée avec succès.", type: "success" }))
            refetch()
        } catch (error) {
            handleError(error)
        }
    }

    const handleFinish = async (orderId: string) => {
        try {
            await updateOrderStatus({ orderId, status: 'PROCESSED', type:'agent', userId: user.agentId }).unwrap()
            dispatch(showToast({ message: "Commande collectée avec succès.", type: "success" }))
            refetch()
        } catch (error) {
            handleError(error)
        }
    }

    return (
        <View style={styles.orderListContainer}>
            <FlatList
                data={data}
                contentContainerStyle={styles.flatListContent}
                refreshing={isFetching}
                onRefresh={refetch}
                keyExtractor={(item) => item.orderId}
                renderItem={({ item }) => (
                    <OrderItem
                        data={item}
                        onConfirm={handleConfirm}
                        onCancel={handleCancel}
                        onFinish={handleFinish}
                    />
                )}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    orderListContainer: {
        flex: 1,
        backgroundColor: '#f1f1f1',
    },
    flatListContent: {
        padding: 16,
        gap: 16,
        backgroundColor: '#f1f1f1',
    },
})

export default OrderList