import { FlatList, StyleSheet, Text, TouchableOpacity, View, Animated, ActivityIndicator } from 'react-native'
import React, { useEffect, useMemo, useRef } from 'react'
import { Theme } from '@/config/constants'
import { Entypo, FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons'
import InputGroup, { InputField } from '@/components/Input'
import { ButtonContainer, ButtonText } from '@/components/Button'
import { Market, useFetchMarketsQuery } from '../redux/marketsApi.slice'
import { RootState } from '@/redux/store'
import { useSelector } from 'react-redux'
import { computeDistance, LocationStateType } from '@/redux/slices/location.slice'
import { Image } from 'expo-image'
import { RootStackNavigation } from '@/routers/BaseRouter'
import { useNavigation } from '@react-navigation/native'

export default function MarketList() {
    const { data, isLoading } = useFetchMarketsQuery()
    const [isSortedByDistance, setIsSortedByDistance] = React.useState(false)
    const [searchTextFilter, setSearchTextFilter] = React.useState("")
    const locationState = useSelector((state: RootState) => state.location)


    const sortedData = useMemo(() => {
        if (!data) return null
        if (!locationState.latitude || !locationState.longitude) return data
        return data
            .filter((market) => market.name.toLowerCase().includes(searchTextFilter.toLowerCase()))
            .sort((a, b) => {
                if (isSortedByDistance) {
                    return computeDistance(locationState, { latitude: a.latitude, longitude: a.longitude })! - computeDistance(locationState, { latitude: b.latitude, longitude: b.longitude })!
                }
                return a.isActive === b.isActive ? 0 : a.isActive ? -1 : 1
            })
    }, [data, locationState, searchTextFilter, isSortedByDistance])

    return (
        <View style={styles.container}>
            <Header />
            <Separator />
            <SearchBar
                searchFilter={searchTextFilter}
                setSearchFilter={setSearchTextFilter}
                isSortedByDistance={isSortedByDistance}
                setIsSortedByDistance={setIsSortedByDistance}
            />
            {isLoading ? (
                <LoadingFlatList />
            ) : (
                data && (
                    <FlatList
                        data={sortedData}
                        keyExtractor={(item) => item.marketId}
                        horizontal
                        style={styles.flatList}
                        contentContainerStyle={{ gap: 8 }}
                        renderItem={({ item }) => (
                            <MarketItem item={item} locationState={locationState} />
                        )}
                    />
                )
            )}
        </View>
    )
}

function LoadingFlatList() {
    const shimmerAnim = useRef(new Animated.Value(0)).current

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(shimmerAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(shimmerAnim, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start()
    }, [shimmerAnim])

    const shimmerStyle = {
        opacity: shimmerAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0.3, 1],
        }),
    }

    return (
        <FlatList
            data={[...Array(5).keys()]}
            keyExtractor={(item) => item.toString()}
            horizontal
            style={styles.flatList}
            contentContainerStyle={{ gap: 8 }}
            renderItem={() => (
                <Animated.View style={[styles.flatListItem, shimmerStyle]}>
                    <View style={{ flex: 1, padding: 8, justifyContent: 'space-between' }}>
                        <View style={styles.skeletonText} />
                        <View style={styles.skeletonText} />
                        <View style={styles.skeletonText} />
                    </View>
                </Animated.View>
            )}
        />
    )
}

function Header() {
    return (
        <View style={styles.header}>
            <Text style={styles.title}>
                Où faire le marché<Text style={{ color: Theme.colors.green }}>?</Text>
            </Text>
            <Entypo name="shop" size={24} color="rgba(0,0,0,0.1)" />
        </View>
    )
}

function Separator() {
    return (
        <View style={{ height: 1, width: '100%', marginVertical: 4, backgroundColor: 'rgba(0,0,0,.05)' }} />
    )
}

function SearchBar({ searchFilter, setSearchFilter, isSortedByDistance, setIsSortedByDistance }: {
    searchFilter: string,
    setSearchFilter: React.Dispatch<React.SetStateAction<string>>,
    isSortedByDistance: boolean,
    setIsSortedByDistance: React.Dispatch<React.SetStateAction<boolean>>
}) {
    return (
        <View style={styles.searchBar}>
            <InputGroup style={{ height: '100%', width: 'auto', flex: 1 }}>
                <FontAwesome5 name="search" size={16} color="rgba(0,0,0,.2)" />
                <InputField
                    value={searchFilter}
                    onChangeText={(text) => setSearchFilter(text)}
                    placeholder='Rechercher'
                />
            </InputGroup>
            <ButtonContainer
                onPress={() => setIsSortedByDistance(prev => !prev)}
                style={{
                    backgroundColor: isSortedByDistance ? Theme.colors.greenDark : Theme.colors.greenLight,
                    height: '100%',
                    width: 'auto',
                    paddingHorizontal: 16,
                    gap: 8
                }}>
                <ButtonText
                    color={isSortedByDistance ? 'white' : Theme.colors.greenDark}
                    style={{ fontFamily: Theme.font.black, fontSize: 14 }}>
                    Distance
                </ButtonText>
                <Ionicons
                    name="filter-sharp"
                    size={16}
                    color={isSortedByDistance ? 'white' : Theme.colors.greenDark}
                    style={{
                        transform: [
                            {
                                rotate: isSortedByDistance ? "180deg" : "0deg"
                            }
                        ]
                    }}
                />
            </ButtonContainer>
        </View>
    )
}

function MarketItem({ item, locationState }: { item: Market, locationState: LocationStateType }) {
    const navigation = useNavigation<RootStackNavigation>()
    return (
        <TouchableOpacity
            onPress={() => { if (item.isActive) navigation.navigate('Market', { screen: 'Sellers', params: { name: item.name, marketId: item.marketId } }) }}
            style={[styles.flatListItem, { opacity: item.isActive ? 1 : .5 }]}>
            <View style={{ flex: 1, zIndex: 1, padding: 8, justifyContent: 'space-between' }}>
                <Entypo name="shop" size={20} color="white" />
                <View style={{ gap: -2 }}>
                    <Text style={styles.flatListItemSubtitle}>Marché de</Text>
                    <Text style={styles.flatListItemTitle}>{item.name}</Text>
                </View>
                {locationState ?
                    <Text style={styles.flatListItemTitle}>
                        {computeDistance(locationState, { latitude: item.latitude, longitude: item.longitude })}
                        <Text style={styles.flatListItemSubtitle}>km</Text>
                    </Text>
                    : <ActivityIndicator size="small" color="white" />
                }
            </View>
            <View style={[styles.flatListeItemOpenIcon, { backgroundColor: item.isActive ? Theme.colors.green : Theme.colors.red }]}>
                <MaterialIcons name="arrow-right-alt" size={20} color="white" />
            </View>
            <View style={{ backgroundColor: 'black', position: 'absolute', zIndex: 0, flex: 1, opacity: .6, height: '100%', width: '100%' }} />
            <Image
                contentFit="cover"
                source={item.pictureUrl}
                style={{
                    flex: 1,
                    height: '100%',
                    width: '100%',
                    position: 'absolute',
                    zIndex: -1
                }}
            />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        padding: 16,
        gap: 4,
    },
    header: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontFamily: Theme.font.black,
        letterSpacing: -.7,
        color: Theme.colors.black
    },
    searchBar: {
        width: '100%',
        height: 40,
        flexDirection: 'row',
        gap: 8,
    },
    flatList: {
        width: '100%'
    },
    flatListWrapper: {

    },
    flatListItem: {
        width: 130,
        height: 120,
        backgroundColor: 'rgba(0,0,0,.05)',
        borderRadius: 8,
        overflow: 'hidden',
        position: 'relative',
        marginTop: 6,
        justifyContent: 'space-between',
        alignItems: 'flex-start'
    },
    flatListeItemOpenIcon: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        right: 8,
        top: 8,
        zIndex: 3,
        borderRadius: 999,
        width: 24,
        height: 24,
    },
    flatListItemSubtitle: {
        marginBottom: -1,
        fontFamily: Theme.font.bold,
        fontSize: 10,
        letterSpacing: -.5,
        color: 'white'
    },
    flatListItemTitle: {
        fontFamily: Theme.font.black,
        fontSize: 14,
        letterSpacing: -.5,
        color: 'white'
    },
    skeletonText: {
        height: 10,
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 4,
        marginBottom: 4,
    }
})