import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Seller } from '../redux/sellersApi.slice'
import { useFetchSellersByMarketIdQuery } from '../redux/marketsApi.slice'
import RefreshControl from '@/components/ui/RefreshControl'
import { Theme } from '@/config/constants'
import { Entypo } from '@expo/vector-icons'
import { Product } from '../redux/productsApi.slice'
import { Iconify } from 'react-native-iconify'
import { useNavigation } from '@react-navigation/native'
import { MarketStackNavigation } from '../routers/MarketStackRouter'
import { Image } from 'expo-image'

type SellerListProps = {
    marketId: string
    searchTextFilter: string,
    searchCategoryFilter: Product['category'] | undefined
}

export default function SellerList(props: SellerListProps) {
    const { data, isFetching, refetch } = useFetchSellersByMarketIdQuery(props.marketId)

    const filteredSellers = React.useMemo(() => {
        if (!data) return []
        return data
            .filter(seller => seller.products.some(product => product.name.toLowerCase().includes(props.searchTextFilter.toLowerCase())))
            .map(seller => ({
                ...seller,
                products: seller.products.filter(
                    product => !props.searchTextFilter || product.name.toLowerCase().includes(props.searchTextFilter.toLowerCase())
                ).filter(product => !props.searchCategoryFilter || product.category === props.searchCategoryFilter
                )
            }))
            .filter(seller => seller.products.length > 0)
    }, [data, props.searchTextFilter, props.searchCategoryFilter])

    return (
        <View style={styles.sellerListContainer}>
            <FlatList
                style={styles.flatList}
                contentContainerStyle={{ gap: 16, }}
                refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}
                data={filteredSellers}
                renderItem={({ item }) => <SellerItem seller={item} />}
                keyExtractor={item => item.sellerId}
            />
        </View>
    )
}

function SellerItem(props: { seller: Seller }) {
    return (
        <TouchableOpacity
            style={[
                styles.sellerItemContainer,
                !props.seller.isActive && styles.inactiveSellerItem
            ]}
            disabled={!props.seller.isActive}
        >
            <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', width: '100%' }}>
                <View style={{ gap: 4 }}>
                    <View style={{ gap: 8, backgroundColor: Theme.colors.greenLight, alignItems: 'center', justifyContent: 'center', borderRadius: 999, padding: 8, paddingHorizontal: 12, flexDirection: 'row' }}>
                        <Entypo name="shop" size={10} color={Theme.colors.greenDark} />
                        <Text style={{ color: Theme.colors.greenDark, fontFamily: Theme.font.black, letterSpacing: -.5, fontSize: 10 }}>Stand</Text>
                    </View>
                    <View>
                        <Text style={{ color: Theme.colors.black, fontFamily: Theme.font.black, fontSize: 16, letterSpacing: -.5 }}>
                            <Text style={{ fontSize: 10, opacity: .8, fontFamily: Theme.font.extraBold }}>
                                {props.seller.gender == "M" ? "MR" : "MME"}.  </Text>
                            {props.seller.firstName}</Text>
                        <Text style={{ marginTop: -2, color: Theme.colors.black, fontFamily: Theme.font.semiBold, opacity: .6, fontSize: 12, letterSpacing: -.5 }}>Table no. {props.seller.tableNumber}</Text>
                    </View>
                </View>

                <View style={{ width: 56, height: 56, borderRadius: 999, backgroundColor: Theme.colors.greenLight, borderWidth: 0, borderColor: 'white', position: 'relative', overflow: 'hidden' }}>
                    <Image source={props.seller.pictureUrl} contentFit='cover' style={{ flex: 1, width: '100%', height: '100%', position: 'absolute', zIndex: 2, }} />
                </View>
            </View>

            <View style={{ flex: 1, width: '100%', borderRadius: 4 }}>
                <FlatList
                    data={props.seller.products}
                    renderItem={({ item }) => (
                        <ProductItem product={item} seller={props.seller} />
                    )}
                    keyExtractor={item => item.productId}
                    style={{ marginTop: 8, borderRadius: 4, zIndex: 2 }}
                    contentContainerStyle={{ flexDirection: 'row', gap: 8 }}
                    horizontal
                />
            </View>
        </TouchableOpacity >
    )
}

function ProductLabel({ category }: { category: Product['category'] }) {
    switch (category) {
        case 'Legumes':
            return <Iconify icon="fa6-solid:carrot" size={20} color="white" />
        case 'Fruits':
            return <Iconify icon="fa6-solid:apple-whole" size={20} color="white" />
        case 'Viandes':
            return <Iconify icon="fa6-solid:drumstick-bite" size={20} color="white" />
        case 'Poissons':
            return <Iconify icon="fa6-solid:fish" size={20} color="white" />
        case 'Cereales':
            return <Iconify icon="fa6-solid:wheat-awn" size={20} color="white" />
        case 'Tubercules':
            return <Iconify icon="fa6-solid:seedling" size={20} color="white" />
        case 'Mer':
            return <Iconify icon="fa6-solid:shrimp" size={20} color="white" />
        case 'Epices':
            return <Iconify icon="fa6-solid:mortar-pestle" size={20} color="white" />
        case 'Autres':
            return <Iconify icon="fa6-solid:utensils" size={20} color="white" />
        default:
            return <Iconify icon="fa6-solid:utensils" size={20} color="white" />
    }
}

function ProductItem(props: { product: Product, seller: Seller }) {
    const navigation = useNavigation<MarketStackNavigation>()


    return (
        <TouchableOpacity style={styles.productItemContainer} onPress={() => navigation.navigate('Product', { productId: props.product.productId, marketId: props.seller.marketId })}>
            <View style={{ flex: 1, backgroundColor: Theme.colors.greenDark, position: 'relative', padding: 8, justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View style={{ position: 'absolute', backgroundColor: 'black', zIndex: 0, opacity: .6, flex: 1, top: 0, left: 0, right: 0, bottom: 0 }} />
                <Image source={props.product.pictureUrl[0]} contentFit="cover" style={{ flex: 1, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1 }} />
                <ProductLabel category={props.product.category} />
                <View>
                    <Text style={{ fontFamily: Theme.font.bold, color: 'white', fontSize: 8, letterSpacing: -.2 }}>Chez {props.seller.firstName}</Text>
                    <Text style={{ fontFamily: Theme.font.black, marginTop: -2, color: 'white', fontSize: 12, letterSpacing: -.2 }}>{props.product.name}</Text>
                </View>
            </View>
            <View style={{ height: 'auto', paddingHorizontal: 6, paddingVertical: 6, width: '100%', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
                <View style={{ borderWidth: 1, borderColor: 'white', borderRadius: 4, padding: 4, paddingHorizontal: 8 }}>
                    <Text style={{ fontFamily: Theme.font.black, color: 'white', fontSize: 8, letterSpacing: -.2 }}>{props.product.amount} {props.product.unit.toUpperCase()}</Text>
                </View>
                <Text style={{ fontFamily: Theme.font.black, color: 'white', fontSize: 12, letterSpacing: -.2 }}>{props.product.price}<Text style={{ fontSize: 8 }}>CFA</Text></Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    sellerListContainer: {
        flex: 1,
    },
    flatList: {
        backgroundColor: '#FCFCFC',
        flex: 1,
    },
    sellerItemContainer: {
        gap: 8,
        width: '100%',
        backgroundColor: 'white',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,.05)',
    },
    productItemContainer: {
        overflow: 'hidden',
        width: 150,
        height: 120,
        backgroundColor: Theme.colors.green,
        borderRadius: 4
    },
    inactiveSellerItem: {
        opacity: 0.5,
    },
})