import React, { useState, useMemo } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Text, TextInput, ImageBackground } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Agent } from '@/features/auth/redux/agent.api';
import { useFetchSellersByMarketIdQuery } from '../../(client)/redux/marketsApi.slice';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HeaderContainer, HeaderSubtitle, HeaderTitle } from '@/components/ui/Header';
import { Theme } from '@/config/constants';
import { SellerStackNavigation } from '../routers/SellerStackRouter';
import { useNavigation } from '@react-navigation/native';
import { Iconify } from 'react-native-iconify';
import { ButtonContainer, ButtonText } from '@/components/Button';

// Icon components
const SearchIcon = () => (
    <Iconify icon="ic:round-search" size={20} color={Theme.colors.greenDark} />
);

const SortAscendingIcon = () => (
    <Iconify icon="mdi:sort-alphabetical-ascending" size={20} color={Theme.colors.greenDark} />
);

const SortDescendingIcon = () => (
    <Iconify icon="mdi:sort-alphabetical-descending" size={20} color={Theme.colors.greenDark} />
);
const DEFAULT_SELLER_IMAGE = "https://placehold.co/200x200/png?text=Vendeur";

export default function SellersScreen() {
    const auth = useSelector((state: RootState) => state.auth);
    const marketId = (auth.user as Agent).marketId;
    const { data: sellers } = useFetchSellersByMarketIdQuery(marketId);
    const navigation = useNavigation<SellerStackNavigation>();
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    const filteredAndSortedSellers = useMemo(() => {
        if (!sellers) return [];
        return sellers
            .filter(seller =>
                seller.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                seller.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                seller.tableNumber.toString().includes(searchQuery)
            )
            .sort((a, b) => {
                const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
                const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
                return sortOrder === 'asc'
                    ? nameA.localeCompare(nameB)
                    : nameB.localeCompare(nameA);
            });
    }, [sellers, searchQuery, sortOrder]);

    return (
        <View style={styles.container}>
            <Header />
            {/* <View style={styles.filterContainer}>
                <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                <SortButton sortOrder={sortOrder} setSortOrder={setSortOrder} />
            </View> */}
            <FlatList
                data={filteredAndSortedSellers}
                keyExtractor={(item) => item.sellerId}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.sellerItemContainer}
                        onPress={() => navigation.navigate('Seller', { sellerId: item.sellerId })}
                    >
                        <View style={styles.sellerInfo}>

                            <View style={styles.profilePictureCircle}>
                                <ImageBackground
                                    source={{ uri: item.pictureUrl || DEFAULT_SELLER_IMAGE }}
                                    style={styles.profilePicture}
                                />
                            </View>
                            <View style={styles.sellerItem}>
                                <Text style={styles.sellerName}>{item.firstName} {item.lastName}</Text>
                                <Text style={styles.sellerTable}>Table {item.tableNumber}</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                            <StatusChip isActive={item.isActive} />
                            <Iconify icon="mdi:chevron-right" size={16} color={Theme.colors.greenDark} />
                        </View>
                    </TouchableOpacity>
                )}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
}

function Header() {
    const insets = useSafeAreaInsets();
    return (
        <HeaderContainer style={{ backgroundColor: 'white', paddingBottom: 10, paddingTop: insets.top + 8 }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <HeaderSubtitle>Liste des</HeaderSubtitle>
                <HeaderTitle>Vendeurs</HeaderTitle>
            </View>
        </HeaderContainer>
    );
}

function SearchBar({ searchQuery, setSearchQuery }: { searchQuery: string, setSearchQuery: (query: string) => void }) {
    return (
        <View style={styles.searchBarContainer}>
            <SearchIcon />
            <TextInput
                style={styles.searchInput}
                placeholder="Rechercher par nom ou numéro de table"
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
        </View>
    );
}

function SortButton({ sortOrder, setSortOrder }: { sortOrder: 'asc' | 'desc', setSortOrder: (order: 'asc' | 'desc') => void }) {
    return (
        <ButtonContainer
            style={styles.sortButton}
            onPress={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
        >
            <ButtonText style={{ fontSize: 12 }} color={Theme.colors.greenDark}>{sortOrder === 'asc' ? 'A-Z' : 'Z-A'}</ButtonText>
            {sortOrder === 'asc' ? <SortAscendingIcon /> : <SortDescendingIcon />}
        </ButtonContainer>
    );
}

const StatusChip = ({ isActive }: { isActive: boolean }) => (
    <View style={[
        styles.statusChip,
        { backgroundColor: isActive ? Theme.colors.greenLight : Theme.colors.redLight }
    ]}>
        <Text style={[
            styles.statusText,
            { color: isActive ? Theme.colors.greenDark : Theme.colors.redDark }
        ]}>
            {isActive ? 'Ouvert' : 'Fermé'}
        </Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f1f1f1',
    },
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        alignItems: 'center',
        padding: 12,
    },
    searchBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,.05)',
        borderRadius: 25,
        height: 40,
        paddingHorizontal: 12,
        paddingVertical: 8,
        flex: 1,
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontFamily: Theme.font.extraBold,
        fontSize: 14,
        letterSpacing: -.3,
    },
    sortButton: {
        backgroundColor: Theme.colors.greenLight,
        borderRadius: 25,
        height: 40,
        gap: 8,
        width: 'auto',
        paddingHorizontal: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        backgroundColor: 'white',
    },
    sellerItem: {
    },
    sellerName: {
        fontFamily: Theme.font.black,
        letterSpacing: -.3,
        fontSize: 14,
        color: Theme.colors.black,
    },
    sellerTable: {
        fontFamily: Theme.font.regular,
        fontSize: 12,
        marginTop: 0,
    },
    sellerItemContainer: {
        padding: 12,
        borderStyle: 'solid',
        borderTopWidth: 1,
        borderColor: 'rgba(0,0,0,.05)',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    sellerInfo: {
        gap: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    statusChip: {
        borderRadius: 999,
        padding: 10,
        marginRight: 8,
    },
    statusText: {
        fontSize: 10,
        fontFamily: Theme.font.black,
    },
    profilePictureCircle: {
        overflow: 'hidden',
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Theme.colors.greenDark,
        justifyContent: 'center',
        alignItems: 'center',
    },

    profilePicture: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
});