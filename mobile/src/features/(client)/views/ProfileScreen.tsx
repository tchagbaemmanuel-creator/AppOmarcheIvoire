import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { HeaderContainer, HeaderSubtitle, HeaderTitle } from '../../../components/ui/Header'
import { MenuContainer, MenuText } from '@/components/MenuButton'
import { useDispatch, useSelector } from 'react-redux'
import { logOut } from '@/features/auth/redux/auth.slice'
import { useNavigation } from '@react-navigation/native'
import { RootStackNavigation } from '@/routers/BaseRouter'
import QRCodeScannerModal from '@/components/QRCodeScannerModal'
import { showToast } from '@/redux/slices/toast.slice'
import { GiftCard, useAssignGiftCardMutation } from '../redux/giftCardApi.slice'
import { useChangeMyPasswordMutation, useFetchGiftCardByUserIdQuery, User } from '@/features/auth/redux/user.api'
import { RootState } from '@/redux/store'
import { Theme } from '@/config/constants'
import { Formik } from 'formik'
import { FormInputContainer, InputError, PasswordInputField } from '@/features/auth/components/FormInput'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import * as Yup from 'yup'
import { ButtonContainer, ButtonText } from '@/components/Button'
import { useErrorHandler } from '@/hooks/useErrorHandler'

export default function ProfileScreen() {
    const dispatch = useDispatch()
    const [isQRCodeScannerVisible, setQRCodeScannerVisible] = useState(false)
    const user = useSelector((state: RootState) => state.auth.user) as User
    const [assignGiftCardToUser] = useAssignGiftCardMutation()
    const { data: giftCard, isLoading, refetch } = useFetchGiftCardByUserIdQuery(user.userId)
    const [changeMyPassword, { isLoading: isChangingPassword }] = useChangeMyPasswordMutation()
    const handleError = useErrorHandler()

    const handleQRCodeScan = async (code: string) => {
        try {
            await assignGiftCardToUser({ giftCardId: code, userId: user.userId }).unwrap()
            dispatch(showToast({ message: "Carte de fidélité assignée avec succès!", type: "success" }))
            refetch()
        } catch (error) {
            dispatch(showToast({ message: "Erreur lors de l'assignation de la carte de fidélité.", type: "warning" }))
        }
        setQRCodeScannerVisible(false)
    }

    if (isLoading) return <ActivityIndicator />
    return (
        <View style={{ flex: 1 }}>
            <Header giftCard={giftCard} />
            <View style={styles.content}>
                <ClientInfoCard user={user} />
                <ChangePasswordCard
                    loading={isChangingPassword}
                    onSubmit={async (values) => {
                        try {
                            await changeMyPassword({
                                currentPassword: values.currentPassword,
                                newPassword: values.newPassword,
                            }).unwrap()
                            dispatch(showToast({ message: "Mot de passe modifié avec succès.", type: "success" }))
                        } catch (error) {
                            handleError(error)
                        }
                    }}
                />
                <Menu onScanPress={() => setQRCodeScannerVisible(true)} />
            </View>
            <QRCodeScannerModal
                isVisible={isQRCodeScannerVisible}
                onClose={() => setQRCodeScannerVisible(false)}
                onScan={handleQRCodeScan}
            />
        </View>
    )
}

function ClientInfoCard({ user }: { user: User }) {
    return (
        <View style={styles.card}>
            <Text style={styles.cardTitle}>Informations du compte</Text>
            <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Nom</Text>
                <Text style={styles.infoValue}>{user.lastName || "-"}</Text>
            </View>
            <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Prénom</Text>
                <Text style={styles.infoValue}>{user.firstName || "-"}</Text>
            </View>
            <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{user.email || "-"}</Text>
            </View>
        </View>
    )
}

const ChangePasswordSchema = Yup.object().shape({
    currentPassword: Yup.string().required("Veuillez entrer votre ancien mot de passe."),
    newPassword: Yup.string().min(8, "Votre mot de passe doit avoir au moins 8 caractères.").required("Veuillez entrer un nouveau mot de passe."),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword")], "Les mots de passe doivent correspondre.")
        .required("Veuillez confirmer le nouveau mot de passe."),
})

function ChangePasswordCard(props: {
    loading: boolean
    onSubmit: (values: { currentPassword: string; newPassword: string; confirmPassword: string }) => Promise<void>
}) {
    return (
        <View style={styles.card}>
            <Text style={styles.cardTitle}>Modifier mon mot de passe</Text>
            <Formik
                initialValues={{ currentPassword: "", newPassword: "", confirmPassword: "" }}
                validationSchema={ChangePasswordSchema}
                onSubmit={async (values, helpers) => {
                    await props.onSubmit(values)
                    helpers.resetForm()
                }}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isValid }) => (
                    <>
                        <FormInputContainer style={{ marginTop: 8 }}>
                            <MaterialCommunityIcons name="form-textbox-password" size={20} color="rgba(0,0,0,0.2)" />
                            <PasswordInputField
                                placeholder="Ancien mot de passe"
                                onChangeText={handleChange("currentPassword")}
                                onBlur={handleBlur("currentPassword")}
                                value={values.currentPassword}
                            />
                        </FormInputContainer>
                        {errors.currentPassword && touched.currentPassword && <InputError error={errors.currentPassword} />}

                        <FormInputContainer style={{ marginTop: 8 }}>
                            <MaterialCommunityIcons name="form-textbox-password" size={20} color="rgba(0,0,0,0.2)" />
                            <PasswordInputField
                                placeholder="Nouveau mot de passe"
                                onChangeText={handleChange("newPassword")}
                                onBlur={handleBlur("newPassword")}
                                value={values.newPassword}
                            />
                        </FormInputContainer>
                        {errors.newPassword && touched.newPassword && <InputError error={errors.newPassword} />}

                        <FormInputContainer style={{ marginTop: 8 }}>
                            <MaterialCommunityIcons name="form-textbox-password" size={20} color="rgba(0,0,0,0.2)" />
                            <PasswordInputField
                                placeholder="Confirmer le nouveau mot de passe"
                                onChangeText={handleChange("confirmPassword")}
                                onBlur={handleBlur("confirmPassword")}
                                value={values.confirmPassword}
                            />
                        </FormInputContainer>
                        {errors.confirmPassword && touched.confirmPassword && <InputError error={errors.confirmPassword} />}

                        <View style={{ marginTop: 12 }}>
                            <ButtonContainer onPress={handleSubmit} disabled={!isValid || props.loading}>
                                <ButtonText color="white" loading={props.loading}>Mettre à jour</ButtonText>
                            </ButtonContainer>
                        </View>
                    </>
                )}
            </Formik>
        </View>
    )
}

function Menu({ onScanPress }: { onScanPress: () => void }) {
    const dispatch = useDispatch()
    const navigation = useNavigation<RootStackNavigation>()

    const handleLogout = () => {
        dispatch(logOut())
        navigation.navigate('Auth', { screen: 'Login', params: { phone: '' } })
    }

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <MenuContainer onPress={onScanPress}>
                <MenuText>Scanner une carte de fidélité</MenuText>
            </MenuContainer>
            <MenuContainer onPress={handleLogout}>
                <MenuText>Se déconnecter</MenuText>
            </MenuContainer>
        </View>
    )
}

function Header({ giftCard }: { giftCard: GiftCard | undefined }) {
    const insets = useSafeAreaInsets()
    return (
        <HeaderContainer style={{ paddingBottom: 10, paddingTop: insets.top + 8 }}>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <HeaderSubtitle>Mon</HeaderSubtitle>
                <HeaderTitle>Profil</HeaderTitle>
            </View>
            <View style={[styles.statusChip, { backgroundColor: giftCard ? Theme.colors.orangeDark : Theme.colors.greenDark }]}>
                <Text style={{ color: 'white', fontFamily: Theme.font.black, letterSpacing: -0.5 }}>{giftCard ? "Premium" : "Standard"}</Text>
            </View>
        </HeaderContainer>
    )
}

const styles = StyleSheet.create({
    statusChip: {
        padding: 8,
        borderRadius: 8,
    }
    ,
    content: {
        flex: 1,
        backgroundColor: 'white',
        padding: 16,
        gap: 12,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 12,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,.06)',
    },
    cardTitle: {
        fontFamily: Theme.font.black,
        letterSpacing: -0.5,
        fontSize: 16,
        marginBottom: 8,
        color: 'rgba(0,0,0,.85)',
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 6,
    },
    infoLabel: {
        fontFamily: Theme.font.semiBold,
        color: 'rgba(0,0,0,.45)',
        fontSize: 12,
    },
    infoValue: {
        fontFamily: Theme.font.bold,
        color: 'rgba(0,0,0,.85)',
        fontSize: 13,
        maxWidth: '65%',
        textAlign: 'right',
    },
})
