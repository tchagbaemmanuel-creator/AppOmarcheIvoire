import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Button, { ButtonContainer, ButtonText } from '@/components/Button'
import { useNavigation } from '@react-navigation/native'
import { AuthStackNavigation } from '../../routers/AuthStackRouter'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { Theme } from '@/config/constants'

export default function RegistrationHeader() {
    const navigation = useNavigation<AuthStackNavigation>()
    return (
        <View style={styles.container}>
            <ButtonContainer
                style={{ backgroundColor: Theme.colors.greenLight, width: 48, height: 48 }}
                onPress={() => navigation.goBack()}>
                <MaterialCommunityIcons name="arrow-left" size={24} color={Theme.colors.greenDark} />
            </ButtonContainer>

            <ButtonContainer
                style={{ backgroundColor: Theme.colors.greenLight, paddingHorizontal: 16, width: 'auto' }} >
                <ButtonText color={Theme.colors.greenDark} style={{ fontFamily: Theme.font.black }}>Inscription</ButtonText>
            </ButtonContainer>


        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 32
    }
})