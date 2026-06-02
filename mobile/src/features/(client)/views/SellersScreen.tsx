import { FlatList, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ButtonContainer, ButtonText } from '@/components/Button'
import { Theme } from '@/config/constants'
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons'
import InputGroup, { InputField } from '@/components/Input'
import SellerList from '../../(client)/components/SellerList'
import { Iconify } from 'react-native-iconify'
import { Product, ProductCategory } from '../../(client)/redux/productsApi.slice'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { RouteProp } from '@react-navigation/native'
import { MarketStackParamList } from '../routers/MarketStackRouter'

export default function SellersScreen(props: NativeStackScreenProps<MarketStackParamList, 'Sellers'>) {
    const [searchTextFilter, setSearchTextFilter] = React.useState("")
    const [searchCategoryFilter, setSearchCategoryFilter] = React.useState<Product['category'] | undefined>()
    const insets = useSafeAreaInsets()
    return (
        <View
            style={{ flex: 1, paddingTop: insets.top + 8, backgroundColor: 'white' }}
        >
            <Header name={props.route.params.name} navigation={props.navigation} route={props.route} />
            <SearchBar searchFilter={searchTextFilter} setSearchFilter={setSearchTextFilter} />
            <FilterBar searchCategoryFilter={searchCategoryFilter} setSearchCategoryFilter={setSearchCategoryFilter} />
            <SellerList marketId={props.route.params.marketId} searchTextFilter={searchTextFilter} searchCategoryFilter={searchCategoryFilter} />
        </View>
    )
}


function FilterBar(props: { searchCategoryFilter: Product['category'] | undefined, setSearchCategoryFilter: React.Dispatch<React.SetStateAction<Product['category'] | undefined>> }) {
    return (
        <View style={styles.filterBar}>
            <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: Theme.colors.black, fontFamily: Theme.font.extraBold, fontSize: 14, letterSpacing: -.5 }}>Catégories</Text>
                <Iconify icon="ion:filter" size={16} color={Theme.colors.green} />
            </View>
            <FlatList
                data={Object.keys(ProductCategory)}
                keyExtractor={(item) => item}
                horizontal
                style={{ marginTop: 8 }}
                contentContainerStyle={{ gap: 8 }}
                renderItem={({ item }) => (
                    <ButtonContainer
                        onPress={() => props.searchCategoryFilter === item ? props.setSearchCategoryFilter(undefined) : props.setSearchCategoryFilter(item as Product['category'])}
                        style={{
                            backgroundColor: props.searchCategoryFilter === item ? Theme.colors.greenDark : Theme.colors.greenLight,
                            height: 28,
                            paddingHorizontal: 12,
                            borderRadius: 4,
                            gap: 4,
                        }}>
                        <ButtonText
                            color={props.searchCategoryFilter === item ? 'white' : Theme.colors.greenDark}
                            style={{ fontFamily: Theme.font.extraBold, fontSize: 10 }}>
                            {item}
                        </ButtonText>
                        {props.searchCategoryFilter === item && (
                            <MaterialCommunityIcons name="close" size={12} color="white" />
                        )}
                    </ButtonContainer>
                )}
            />
        </View>
    )
}
function Header({ name, route, navigation }: { name: string, navigation: NativeStackNavigationProp<MarketStackParamList, 'Sellers'>, route: RouteProp<MarketStackParamList, 'Sellers'> }) {
    const cart = useSelector((state: RootState) => state.cart)
    return (
        <View style={[styles.headerContainer]}>
            <ButtonContainer
                style={{ backgroundColor: Theme.colors.greenLight, width: 42, height: 42 }}
                onPress={() => navigation.goBack()}>
                <MaterialCommunityIcons name="arrow-left" size={20} color={Theme.colors.greenDark} />
            </ButtonContainer>

            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={styles.headerSubtitle}>Marché de</Text>
                <Text style={styles.headerTitle}>{name}</Text>
            </View>
            <ButtonContainer
                onPress={() => navigation.navigate('Cart', { marketId: route.params.marketId, marketName: name })}
                style={{ backgroundColor: Theme.colors.greenLight, height: 42, paddingHorizontal: 12, width: 'auto' }} >
                <MaterialCommunityIcons name="cart-outline" size={16} color={Theme.colors.greenDark} />
                <ButtonText color={Theme.colors.greenDark} style={{ fontFamily: Theme.font.black, fontSize: 14 }}>{cart[route.params.marketId] ? cart[route.params.marketId].length : 0}</ButtonText>
            </ButtonContainer>
        </View>
    )
}

function SearchBar(props: { searchFilter: string, setSearchFilter: React.Dispatch<React.SetStateAction<string>> }) {
    return (
        <View style={styles.searchBar}>
            <InputGroup style={{ height: 40, width: 'auto', }}>
                <FontAwesome5 name="search" size={16} color="rgba(0,0,0,.2)" />
                <InputField
                    value={props.searchFilter}
                    onChangeText={(text) => props.setSearchFilter(text)}
                    placeholder='Rechercher un produit'
                />
            </InputGroup>

        </View>
    )
}

const styles = StyleSheet.create({
    searchBar: {
        width: '100%',
        paddingHorizontal: 16,
        marginTop: 8,
    },
    filterBar: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 16,
        marginTop: 8,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,.05)',
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginTop: 8,
    },
    headerSubtitle: {
        fontFamily: Theme.font.bold,
        color: 'gray',
        letterSpacing: -.5,
        fontSize: 10,
        marginBottom: -2
    },
    headerTitle: {
        fontFamily: Theme.font.black,
        color: Theme.colors.greenDark,
        letterSpacing: -.5,
        fontSize: 16
    },

})