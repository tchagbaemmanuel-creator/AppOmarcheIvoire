import { Theme } from '@/config/constants';
import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { Order, OrderProduct } from '../redux/ordersApi.slice';
import { useFetchProductByIdQuery } from '../redux/productsApi.slice';
import { useFetchSellerByIdQuery } from '../redux/sellersApi.slice';

export function MarketInfo({ marketName, orderId }: { marketName: string, orderId: string }) {
    return (
        <View style={{ gap: 2, justifyContent: 'center' }}>
            <Text style={{ fontFamily: Theme.font.extraBold, letterSpacing: -.5, color: Theme.colors.black, fontSize: 16 }}>{marketName}</Text>
            <Text style={{ fontFamily: Theme.font.bold, fontSize: 10, color: "rgba(0,0,0,0.4)" }}>#{orderId.substring(0, 8).toUpperCase()}</Text>
        </View>
    );
}

export function OrderProductItem({ item }: { item: OrderProduct }) {
    const { data: product } = useFetchProductByIdQuery(item.productId)
    const { data: seller } = useFetchSellerByIdQuery(product?.sellerId ?? '', { skip: !product?.sellerId })
    if (!product || !seller) return null
    return (
        <View style={{ padding: 12, flexDirection: 'row', justifyContent: 'flex-start', gap: 16, alignItems: 'center', paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)', }}>
            <View style={{ gap: 0, justifyContent: 'center', backgroundColor: "rgba(0,0,0,0.1)", padding: 8, borderRadius: 4 }}>
                <Text style={{ fontFamily: Theme.font.extraBold, letterSpacing: -.5, color: Theme.colors.black, fontSize: 14 }}>x{item.quantity}</Text>
            </View>
            <View style={{ gap: 0, justifyContent: 'center' }}>
                <Text style={{ fontFamily: Theme.font.extraBold, letterSpacing: -.5, color: Theme.colors.black, fontSize: 14 }}>{product.name}</Text>
                <Text style={{ fontFamily: Theme.font.bold, fontSize: 10, color: "rgba(0,0,0,0.4)", letterSpacing: -.4 }}>Chez {seller.firstName} {seller.lastName} - Table no. {seller.tableNumber}</Text>
            </View>
            <View style={{ gap: 0, justifyContent: 'center', marginLeft: 'auto' }}>
                <Text style={{ fontFamily: Theme.font.extraBold, letterSpacing: -.5, color: Theme.colors.black, fontSize: 16 }}>{product.price * item.quantity}<Text style={{ fontSize: 8 }}>CFA</Text></Text>
            </View>
        </View>
    );
}

export function OrderProductList({ orderProducts }: { orderProducts: OrderProduct[] }) {
    return (
        <FlatList
            data={orderProducts}
            contentContainerStyle={{ padding: 16, gap: 16 }}
            keyExtractor={(item) => item.orderProductId}
            renderItem={({ item }) => <OrderProductItem item={item} />}
        />
    );
};

const statusMapping: Record<Order['status'], { text: string, subtext: string, backgroundColor: string, textColor: string }> = {
    IDLE: { text: 'Attente', subtext: 'Panier en attente', backgroundColor: '#f0f0f0', textColor: '#7d7d7d' }, // Light gray
    PROCESSING: { text: 'En cours', subtext: 'Traitement en cours', backgroundColor: '#ffe5b5', textColor: '#ff8c00' }, // Light orange
    PROCESSED: { text: 'Collecté', subtext: 'En attente d\' un livreur', backgroundColor: '#d4edda', textColor: '#155724' }, // Light green
    COLLECTING: { text: 'En collecte', subtext: 'Un livreur est en route', backgroundColor: '#ffe5b5', textColor: '#ff8c00' }, // Light orange
    DELIVERING: { text: 'En livraison', subtext: 'En cours de livraison', backgroundColor: '#fff3cd', textColor: '#856404' }, // Light yellow
    DELIVERED: { text: 'Livré', subtext: 'Commande livrée', backgroundColor: '#c3e6cb', textColor: '#155724' }, // Light green
    CANCELED: { text: 'Annulé', subtext: 'Commande annulée', backgroundColor: '#f8d7da', textColor: '#721c24' }, // Light red
};

export function OrderStatusComponent(props: { status: Order['status'] }) {
    const { text, subtext, backgroundColor, textColor } = statusMapping[props.status];

    return (
        <View style={{ marginLeft: 'auto', alignItems: 'flex-end', gap: 4 }}>
            <View style={{ padding: 8, backgroundColor, borderRadius: 4 }}>
                <Text style={{ color: textColor, letterSpacing: -.3, fontFamily: Theme.font.extraBold, fontSize: 14 }}>{text}</Text>
            </View>
            <View style={{ justifyContent: 'flex-end', alignItems: 'center', gap: 4, flexDirection: 'row' }}>
                <View style={{ height: 4, width: 4, backgroundColor: textColor, borderRadius: 999 }} />
                <Text style={{ color: Theme.colors.black, letterSpacing: -.3, fontFamily: Theme.font.semiBold, fontSize: 12 }}>{subtext}</Text>
            </View>
        </View>
    );
}