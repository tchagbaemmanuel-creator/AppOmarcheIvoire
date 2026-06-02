import { Formik } from "formik"
import * as Yup from "yup"
import { CartItemType } from "../redux/cart.slice"
import { ActivityIndicator, Animated, StyleSheet, Text, TextInput, TouchableOpacity, View, ViewProps } from "react-native"
import { Iconify } from "react-native-iconify"
import { Theme } from "@/config/constants"
import { ButtonContainer, ButtonText } from "@/components/Button"
import MapView from "react-native-maps"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import { Image } from "expo-image"
import { useEffect, useRef, useState } from "react"
import { InputError } from "@/features/auth/components/FormInput"
import { CreateOrderWithProductsInput, useCreateOrderWithProductsMutation } from "../redux/ordersApi.slice"
import { showToast } from "@/redux/slices/toast.slice"
import { useNavigation } from "@react-navigation/native"
import { getMarketCartTotal } from "../helpers/helpers"
import { User } from "@/features/auth/redux/user.api"
import { PromoCode, useValidatePromoCodeMutation } from "../redux/promoCodeApi.slice"
import { useCallback } from "react"
import { debounce } from "lodash"
import * as Haptics from "expo-haptics"
import { clearCart } from "../redux/cart.slice"
import { notifyOrderReceived } from "@/utils/notifications"

const CheckoutSchema = Yup.object().shape({
    address: Yup.string().required('Veuillez préciser votre adresse de livraison.'),
    location: Yup.object().shape({
        latitude: Yup.number().required(),
        longitude: Yup.number().required()
    }).required(),
    deliveryTime: Yup.string().oneOf(['ASAP', 'Scheduled']).required('Veuillez choisir une option de livraison.'),
    paymentMethod: Yup.string().oneOf(['Cash', 'Card']).required('Veuillez choisir un mode de paiement.'),
    promoCodeId: Yup.string().notRequired(),
})


export default function CheckoutForm(props: { cart: CartItemType[], marketId: string }) {
    const total = getMarketCartTotal(props.cart)
    const auth = useSelector((state: RootState) => state.auth)
    const location = useSelector((state: RootState) => state.location)
    const [createOrderWithProducts, { isLoading }] = useCreateOrderWithProductsMutation()
    const [validatePromoCode, { isLoading: isValidatePromoCodeLoading }] = useValidatePromoCodeMutation()
    const [promoCode, setPromoCode] = useState<PromoCode | undefined>(undefined)
    const shippingFee = 1500
    const servicesFee = 200
    const dispatch = useDispatch()
    const navigation = useNavigation()

    const initialValues: Yup.InferType<typeof CheckoutSchema> = {
        address: '',
        location: {
            latitude: 0,
            longitude: 0
        },
        deliveryTime: 'ASAP',
        paymentMethod: 'Cash',
        promoCodeId: undefined
    }

    const handleValidatePromoCode = useCallback(
        debounce(async (code: string) => {
            if (code.length > 0) {
                try {
                    const result = await validatePromoCode(code).unwrap()
                    setPromoCode(result)
                    dispatch(showToast({ message: "Code promo valide", type: "success" }))
                } catch (error) {
                    console.log(error)
                    dispatch(showToast({ message: "Code promo invalide", type: "warning" }))
                }
            }
        }, 2000),
        [validatePromoCode, dispatch]
    )
    return (
        <Formik
            validationSchema={CheckoutSchema}
            initialValues={initialValues}
            onSubmit={values => {
                if (!props.cart?.length) {
                    dispatch(showToast({ message: "Votre panier est vide.", type: "warning" }))
                    return
                }
                if (!location.latitude || !location.longitude) {
                    dispatch(showToast({ message: "Veuillez activer votre localisation.", type: "warning" }))
                    return
                }
                const payload: CreateOrderWithProductsInput = {
                    order: {
                        userId: (auth.user as User).userId,
                        address: values.address,
                        deliveryTime: values.deliveryTime,
                        locationX: location.latitude,
                        locationY: location.longitude,
                        promoCodeId: promoCode?.promoCodeId ?? undefined,
                        paymentMethod: values.paymentMethod,
                        status: "IDLE",
                    },
                    orderProducts: props.cart.map(item => ({ productId: item.product.productId, quantity: item.quantity })),
                }
                console.log(payload)
                createOrderWithProducts(payload).then((response) => {
                    if (!response.error) {
                        dispatch(clearCart({ marketId: props.marketId }))
                        navigation.goBack()
                        void notifyOrderReceived()
                        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
                        setTimeout(() => {
                            dispatch(
                                showToast({
                                    message: "Commande enregistrée. Vous serez notifié à chaque étape.",
                                    type: "success",
                                })
                            )
                        }, 120)
                    }
                })
            }}>
            {({ handleChange, handleSubmit, values, errors, touched, isValid, setFieldValue }) => (
                <View>
                    <View style={[styles.formSectionContainer]}>
                        <View style={styles.formHeaderContainer}>
                            <Text style={styles.formSectionTitle}>Détails de livraison</Text>
                            <Iconify icon="healthicons:paved-road" size={24} color="rgba(0,0,0,.1)" />
                        </View>

                        <MapPreview setValue={setFieldValue} />

                        {/* <View style={{ position: "relative", flexDirection: 'row', width: '100%', gap: 16 }}>
                            <View style={styles.formIconContainer}>
                                <Iconify icon="ic:sharp-house" size={14} color={Theme.colors.greenDark} />
                            </View>
                            <TouchableOpacity style={{ width: '100%', gap: 0, justifyContent: 'center' }}>
                                <Text style={styles.formFieldText}>En face de la pharmacie</Text>
                                <Text style={styles.formFieldSubtext}>Changer votre adresse de livraison</Text>
                            </TouchableOpacity>
                            <Iconify color="rgba(0,0,0,.1)" icon="icon-park-outline:right" size={16} style={styles.formMoreIcon} />
                        </View> */}
                        <View style={{ position: "relative", flexDirection: 'row', width: '100%', gap: 16 }}>
                            <View style={styles.formIconContainer}>
                                <Iconify icon="ic:sharp-house" size={14} color={Theme.colors.greenDark} />
                            </View>
                            <View style={{ gap: 0, justifyContent: 'center', width: '100%' }}>
                                <TextInput
                                    value={values.address}
                                    style={styles.formInput}
                                    onChangeText={handleChange('address')}
                                    placeholder="Veuillez préciser votre adresse" />
                            </View>
                        </View>
                        {errors.address && touched.address && <InputError error={errors.address} />}
                        <View style={{ flexDirection: 'row', gap: 8, height: 56, width: '100%' }}>
                            <TouchableOpacity style={[styles.formSelectContainer, styles.formActiveSelectContainer]}>
                                <Text style={[styles.formSelectText]}>45-50 min.</Text>
                                <Text style={[styles.formSelectSubText]}>Livré dès que possible</Text>
                            </TouchableOpacity>
                            <TouchableOpacity disabled style={[styles.formSelectContainer]}>
                                <Text style={[{ fontFamily: Theme.font.black, fontSize: 13, letterSpacing: -.5, color: "rgba(0,0,0,0.5)" }]}>Programmer</Text>
                                <Text style={[{ fontFamily: Theme.font.medium, fontSize: 10, color: "rgba(0,0,0,0.5)" }]}>Bientôt disponible</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={[styles.formSectionContainer]}>
                        <View style={styles.formHeaderContainer}>
                            <Text style={styles.formSectionTitle}>Moyen de paiement</Text>
                            <Iconify icon="solar:card-bold" size={24} color="rgba(0,0,0,.1)" />
                        </View>
                        <View style={{ flexDirection: 'row', gap: 8, height: 56, width: '100%' }}>
                            <TouchableOpacity style={[styles.formSelectContainer, styles.formActiveSelectContainer]}>
                                <Text style={[styles.formSelectText]}>En espèces</Text>
                                <Text style={[styles.formSelectSubText, {}]}>À la livraison</Text>
                            </TouchableOpacity>
                            <TouchableOpacity disabled style={[styles.formSelectContainer]}>
                                <Text style={[styles.formSelectText, { color: "rgba(0,0,0,0.5)" }]}>Carte / Mobile Money</Text>
                                <Text style={[styles.formSelectSubText, { color: "rgba(0,0,0,0.5)" }]}>Bientôt disponible</Text>
                            </TouchableOpacity>
                        </View>
                        {errors.paymentMethod && touched.paymentMethod && <InputError error={errors.paymentMethod} />}

                        <View style={{ position: "relative", flexDirection: 'row', width: '100%', gap: 16 }}>
                            <View style={styles.formIconContainer}>
                                {isValidatePromoCodeLoading ? <ActivityIndicator size="small" color={Theme.colors.greenDark} /> :
                                    <Iconify icon="mdi:percent" size={14} color={Theme.colors.greenDark} />}
                            </View>
                            <View style={{ gap: 0, justifyContent: 'center', width: '100%' }}>
                                <TextInput style={styles.formInput} placeholder="Code promotionnel" onChangeText={(text) => { handleChange('promoCodeId')(text); handleValidatePromoCode(text); }} />
                            </View>
                        </View>
                        {errors.promoCodeId && touched.promoCodeId && <InputError error={errors.promoCodeId} />}
                    </View>

                    <View style={[styles.formSectionContainer, { backgroundColor: "rgba(0,0,0,.05)", gap: 8, paddingBottom: 80 }]}>
                        <View style={[styles.formHeaderContainer, { marginBottom: 8 }]}>
                            <Text style={styles.formSectionTitle}>Récapitulatif</Text>
                            <Iconify icon="mdi:cart" size={24} color="rgba(0,0,0,.1)" />
                        </View>
                        <View style={{ flexDirection: "row", width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={{ fontFamily: Theme.font.medium, letterSpacing: -.2, fontSize: 16, }}>Produits</Text>
                            <Text style={{ fontFamily: Theme.font.extraBold, fontSize: 16, letterSpacing: -.5, color: Theme.colors.greenDark }}>
                                {total}<Text style={{ fontSize: 10 }}>CFA</Text>
                            </Text>
                        </View>
                        <View style={{ flexDirection: "row", width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={{ fontFamily: Theme.font.medium, letterSpacing: -.2, fontSize: 16, }}>Livraison</Text>
                            <Text style={{ fontFamily: Theme.font.extraBold, fontSize: 16, letterSpacing: -.5, color: Theme.colors.greenDark }}>
                                {shippingFee}<Text style={{ fontSize: 10 }}>CFA</Text>
                            </Text>
                        </View>
                        <View style={{ flexDirection: "row", width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={{ fontFamily: Theme.font.medium, letterSpacing: -.2, fontSize: 16, }}>Services</Text>
                            <Text style={{ fontFamily: Theme.font.extraBold, fontSize: 16, letterSpacing: -.5, color: Theme.colors.greenDark }}>
                                {servicesFee}<Text style={{ fontSize: 10 }}>CFA</Text>
                            </Text>
                        </View>
                        {promoCode && <View style={{ flexDirection: "row", width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={{ fontFamily: Theme.font.medium, letterSpacing: -.2, fontSize: 16, }}>Réduction</Text>
                            <Text style={{ fontFamily: Theme.font.extraBold, fontSize: 16, letterSpacing: -.5, color: Theme.colors.greenDark }}>
                                {(promoCode.discountType === "PERCENTAGE" ? promoCode.amount / 100 * total : promoCode.amount)}<Text style={{ fontSize: 10 }}>CFA</Text>
                            </Text>
                        </View>}
                        <View style={{ flexDirection: "row", width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={{ fontFamily: Theme.font.medium, letterSpacing: -.2, fontSize: 16, }}>Total</Text>
                            <Text style={{ fontFamily: Theme.font.extraBold, fontSize: 16, letterSpacing: -.5, color: Theme.colors.greenDark }}>
                                {total + shippingFee + servicesFee - (promoCode ? (promoCode.discountType === "PERCENTAGE" ? promoCode.amount / 100 * total : promoCode.amount) : 0)}<Text style={{ fontSize: 10 }}>CFA</Text>
                            </Text>
                        </View>
                    </View>

                    <View style={{ position: "absolute", width: '100%', bottom: 0, padding: 16 }}>
                        <ButtonContainer
                            onPress={() => handleSubmit()}
                            disabled={!isValid || props.cart.length === 0}
                            style={{ backgroundColor: Theme.colors.green }}>
                            <ButtonText loading={isLoading} color={"white"}>Finaliser ma commande</ButtonText>
                        </ButtonContainer>
                    </View>
                </View>
            )
            }
        </Formik>
    )
}

interface MapPreviewProps extends ViewProps {
    setValue: (key: string, location: { latitude: number, longitude: number }) => void
}
function MapPreview(props: MapPreviewProps) {
    const location = useSelector((state: RootState) => state.location)
    const mapRef = useRef<MapView>(null)
    const [elevated, setElevated] = useState(false)

    useEffect(() => {
        if (location.latitude && location.longitude)
            props.setValue('location', { latitude: location.latitude, longitude: location.longitude })
    }, [])
    if (!location.latitude || !location.longitude) return
    return <View style={{ position: 'relative', overflow: 'hidden', width: '100%', height: 250, backgroundColor: "rgba(0,0,0,.05)", borderRadius: 8, }}>
        <View
            pointerEvents="box-none"
            style={{ zIndex: 2, position: 'absolute', alignItems: 'center', justifyContent: 'center', top: 0, left: 0, right: 0, bottom: 0 }}>
            <MapUserCursor elevated={elevated} />
            <ButtonContainer
                onPress={() => location.latitude && location.longitude && mapRef.current?.animateCamera({ center: { latitude: location.latitude, longitude: location.longitude }, zoom: 15 })}
                style={{ width: 48, position: 'absolute', bottom: 16, right: 16, padding: 12, backgroundColor: 'white', borderRadius: 999 }}>
                <Iconify icon="gis:location" size={24} color={Theme.colors.greenDark} />
            </ButtonContainer>
        </View>
        <MapView
            ref={mapRef}
            onRegionChange={() => setElevated(true)}
            onRegionChangeComplete={(region) => {
                setElevated(false)
                props.setValue('location', { latitude: region.latitude, longitude: region.longitude })
            }}
            camera={{ pitch: 8, heading: 0, altitude: 500, center: { latitude: location.latitude, longitude: location.longitude }, zoom: 15 }}
            style={{ width: '100%', height: '100%', borderRadius: 8 }}>
        </MapView>
    </View>
}

interface MapCursorProps extends ViewProps {
    elevated?: boolean
}

function MapUserCursor(props: MapCursorProps) {
    const translateValue = new Animated.Value(1)

    useEffect(() => {
        if (props.elevated) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(translateValue, { toValue: -8, duration: 500, useNativeDriver: true }),
                    Animated.timing(translateValue, { toValue: 1, duration: 500, useNativeDriver: true })
                ])
            ).start()
        }
    }, [props.elevated])

    return <Animated.View style={[
        { borderRadius: 999, width: 36, height: 36, backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center' },
        { transform: [{ translateY: translateValue }] },
        props.style]}>
        <Image source={require("@/../assets/img/location-pin.png")} style={{ width: 36, height: 36, transform: [{ translateY: -12 }] }} />
    </Animated.View>
}



const styles = StyleSheet.create({
    formFieldText: { fontFamily: Theme.font.bold, fontSize: 13, letterSpacing: -.5, color: Theme.colors.black },
    formFieldSubtext: { fontFamily: Theme.font.medium, fontSize: 10, letterSpacing: -.2, color: "rgba(0,0,0,.5)" },
    formIconContainer: { alignItems: 'center', justifyContent: 'center', height: 28, width: 28, borderRadius: 999, backgroundColor: Theme.colors.greenLight },
    formMoreIcon: { position: 'absolute', right: 0, alignSelf: 'center' },
    formSectionTitle: { fontFamily: Theme.font.black, fontSize: 18, letterSpacing: -.5, color: Theme.colors.black },
    formSectionContainer: { padding: 16, gap: 16 },
    formHeaderContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    formInput: { fontFamily: Theme.font.bold, fontSize: 13, letterSpacing: -.5, color: Theme.colors.black, flex: 1, width: '100%' },
    formSelectContainer: { flex: 1, borderRadius: 4, justifyContent: 'center', alignItems: 'flex-start', padding: 12, backgroundColor: "rgba(0,0,0,0.05)" },
    formActiveSelectContainer: { backgroundColor: Theme.colors.greenLight },
    formSelectText: { fontFamily: Theme.font.black, fontSize: 13, letterSpacing: -.5, color: Theme.colors.greenDark },
    formSelectSubText: { fontFamily: Theme.font.medium, fontSize: 10, color: Theme.colors.greenDark }
})