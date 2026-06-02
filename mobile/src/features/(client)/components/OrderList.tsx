import React, { useState } from 'react'
import { FlatList, StyleSheet, View } from 'react-native'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { useFetchOrdersByUserIdQuery, User } from '@/features/auth/redux/user.api'
import RefreshControl from '@/components/ui/RefreshControl'
import { ButtonContainer, ButtonText } from '@/components/Button'
import { MarketInfo, OrderProductList, OrderStatusComponent } from './OrderItem'
import QRCode from 'react-native-qrcode-svg';
import Modal from 'react-native-modal';
import { Order, useGetOrderProductsByOrderIdQuery } from '../redux/ordersApi.slice'
import { useFetchMarketByIdQuery } from '../redux/marketsApi.slice'
import { useFetchSellerByIdQuery } from '../redux/sellersApi.slice'
import { useFetchProductByIdQuery } from '../redux/productsApi.slice'

const OrderList = () => {
    const auth = useSelector((state: RootState) => state.auth)
    const { data, refetch, isFetching } = useFetchOrdersByUserIdQuery((auth.user as User).userId)


    return (
        <View style={styles.orderListContainer}>
            <FlatList
                data={data}
                contentContainerStyle={{ padding: 16, gap: 16, backgroundColor: '#f1f1f1' }}
                refreshControl={
                    <RefreshControl refreshing={isFetching} onRefresh={refetch} />
                }
                keyExtractor={(item) => item.orderId}
                renderItem={({ item }) => (
                    <OrderItem data={item} />
                )}
            />
        </View>
    )
}

function OrderItem(props: { data: Order }) {
    const [isModalVisible, setModalVisible] = useState(false);
    const { data: orderProducts, isLoading: isOrderProductsLoading } = useGetOrderProductsByOrderIdQuery(props.data.orderId);
    const { data: product, isLoading: isProductLoading } = useFetchProductByIdQuery(orderProducts?.[0]?.productId ?? '', { skip: !orderProducts });
    const { data: seller, isLoading: isSellerLoading } = useFetchSellerByIdQuery(product?.sellerId ?? '', { skip: !product?.sellerId });
    const { data: market, isLoading: isMarketLoading } = useFetchMarketByIdQuery(seller?.marketId ?? '', { skip: !seller?.marketId });

    const isLoading = isOrderProductsLoading || isProductLoading || isSellerLoading || isMarketLoading

    if (isLoading || !orderProducts || !product || !seller || !market) return null

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    return (
        <View
            style={{ backgroundColor: 'white', width: '100%', borderRadius: 4 }}>
            <View style={{ padding: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)', flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                <MarketInfo marketName={market.name} orderId={props.data.orderId} />
                <OrderStatusComponent status={props.data.status} />
            </View>
            <OrderProductList orderProducts={orderProducts} />

            {props.data.status === 'DELIVERING' && (
                <View style={{ padding: 12, flexDirection: 'row', width: '100%', paddingHorizontal: 16 }}>
                    <ButtonContainer style={{ height: 48, flex: 1 }} onPress={toggleModal}>
                        <ButtonText color={"white"} style={{ fontSize: 14 }}>Afficher le QR Code</ButtonText>
                    </ButtonContainer>
                </View>
            )}

            <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
                <View style={{ backgroundColor: 'white', padding: 20, alignItems: 'center', borderRadius: 10 }}>
                    <QRCode
                        value={props.data.orderId}
                        size={200}
                    />
                    <ButtonContainer style={{ marginTop: 20, width: 100 }} onPress={toggleModal}>
                        <ButtonText color={"white"}>Fermer</ButtonText>
                    </ButtonContainer>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        backgroundColor: 'white'
    },
    orderListContainer: {
        flex: 1,
        backgroundColor: '#f1f1f1',
    }
})
export default OrderList
