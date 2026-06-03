// RegisterForm.tsx
import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Theme } from '@/config/constants'
import { Formik } from 'formik'
import { FormInputContainer, InputError, FormInputField, PasswordInputField } from './FormInput'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { ButtonContainer, ButtonText } from '@/components/Button'
import * as Yup from 'yup'
import { useNavigation } from '@react-navigation/native'
import { AuthStackNavigation } from '../routers/AuthStackRouter'
import RegistrationHeader from './layout/RegistrationHeader'
import { useRegisterMutation } from '../redux/auth.api'
import { useDispatch } from 'react-redux'
import { showToast } from '@/redux/slices/toast.slice'
import { normalizePhone } from '@/utils/phone'

export default function RegisterForm() {
    return (
        <View style={styles.container}>
            <RegistrationHeader />
            <Text style={styles.sectionTitle}>Profil</Text>

            <View style={styles.formContainer}>
                <Form />
            </View>
        </View>
    )
}

const RegisterSchema = Yup.object().shape({
    firstName: Yup.string().required('Veuillez entrer votre prénom.'),
    lastName: Yup.string().required('Veuillez entrer votre nom.'),
    birthDay: Yup.string().matches(/^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/, 'Veuillez entrer une date de naissance valide.').required('Veuillez entrer votre date de naissance.'),
    phone: Yup.string().length(10, "Veuillez entrer un numéro à 10 chiffres.").required('Veuillez entrer votre numéro de téléphone.'),
    address: Yup.string().required('Veuillez entrer votre quartier.'),
    email: Yup.string().email('Veuillez entrer une adresse email valide.'),
    password: Yup.string().min(8, 'Votre mot de passe doit avoir au moins 8 caractères.').required('Veuillez entrer un mot de passe.'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Les mots de passe doivent correspondre.').required('Veuillez confirmer votre mot de passe.')
})


function Form() {
    const navigation = useNavigation<AuthStackNavigation>()
    const [register, { isLoading }] = useRegisterMutation()
    const dispatch = useDispatch()

    return <Formik
        initialValues={{ firstName: '', lastName: '', birthDay: '', phone: '', address: '', email: '', password: '', confirmPassword: '' }}
        onSubmit={values => {
            const phone = normalizePhone(values.phone)
            register({
                address: values.address,
                birthDay: values.birthDay,
                email: values.email,
                firstName: values.firstName,
                lastName: values.lastName,
                password: values.password,
                phone,
            }).then(() => {
                navigation.navigate('Login', { phone })
                dispatch(showToast({ message: "Votre compte a été créé avec succès.", type: "success" }))
            })
        }}
        validationSchema={RegisterSchema}
    >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isValid }) => (
            <>
                <FormInputContainer>
                    <MaterialCommunityIcons name="account" size={20} color="rgba(0,0,0,0.2)" />
                    <FormInputField
                        placeholder="Entrer votre prénom"
                        onChangeText={handleChange('firstName')}
                        onBlur={handleBlur('firstName')}
                        value={values.firstName}
                    />
                </FormInputContainer>
                {errors.firstName && touched.firstName && <InputError error={errors.firstName} />}

                <FormInputContainer>
                    <MaterialCommunityIcons name="account" size={20} color="rgba(0,0,0,0.2)" />
                    <FormInputField
                        placeholder="Entrer votre nom"
                        onChangeText={handleChange('lastName')}
                        onBlur={handleBlur('lastName')}
                        value={values.lastName}
                    />
                </FormInputContainer>
                {errors.lastName && touched.lastName && <InputError error={errors.lastName} />}

                <FormInputContainer>
                    <MaterialCommunityIcons name="calendar" size={20} color="rgba(0,0,0,0.2)" />
                    <FormInputField
                        placeholder="Date de naissance (JJ-MM-AAAA)"
                        onChangeText={handleChange('birthDay')}
                        onBlur={handleBlur('birthDay')}
                        keyboardType='numbers-and-punctuation'
                        value={values.birthDay}
                    />
                </FormInputContainer>
                {errors.birthDay && touched.birthDay && <InputError error={errors.birthDay} />}

                <FormInputContainer>
                    <MaterialCommunityIcons name="phone" size={20} color="rgba(0,0,0,0.2)" />
                    <FormInputField
                        placeholder="Entrer votre numéro de téléphone"
                        onChangeText={handleChange('phone')}
                        onBlur={handleBlur('phone')}
                        value={values.phone}
                        keyboardType='phone-pad'
                    />
                </FormInputContainer>
                {errors.phone && touched.phone && <InputError error={errors.phone} />}

                <FormInputContainer style={{ marginTop: 16 }}>
                    <MaterialCommunityIcons name="city" size={20} color="rgba(0,0,0,0.2)" />
                    <FormInputField
                        placeholder="Abidjan"
                        value="Abidjan"
                        editable={false}
                    />
                </FormInputContainer>

                <FormInputContainer>
                    <MaterialCommunityIcons name="home" size={20} color="rgba(0,0,0,0.2)" />
                    <FormInputField
                        placeholder="Entrer votre quartier"
                        onChangeText={handleChange('address')}
                        onBlur={handleBlur('quartier')}
                        value={values.address}
                    />
                </FormInputContainer>
                {errors.address && touched.address && <InputError error={errors.address} />}

                <FormInputContainer style={{ marginTop: 16 }}>
                    <MaterialCommunityIcons name="email" size={20} color="rgba(0,0,0,0.2)" />
                    <FormInputField
                        placeholder="Entrer votre adresse email"
                        onChangeText={handleChange('email')}
                        autoCapitalize='none'
                        onBlur={handleBlur('email')}
                        value={values.email}
                    />
                </FormInputContainer>
                {errors.email && touched.email && <InputError error={errors.email} />}

                <FormInputContainer>
                    <MaterialCommunityIcons name="form-textbox-password" size={20} color="rgba(0,0,0,0.2)" />
                    <PasswordInputField
                        placeholder="Entrer votre mot de passe"
                        onChangeText={handleChange('password')}
                        onBlur={handleBlur('password')}
                        value={values.password}
                    />
                </FormInputContainer>
                {errors.password && touched.password && <InputError error={errors.password} />}

                <FormInputContainer>
                    <MaterialCommunityIcons name="form-textbox-password" size={20} color="rgba(0,0,0,0.2)" />
                    <PasswordInputField
                        placeholder="Confirmer votre mot de passe"
                        onChangeText={handleChange('confirmPassword')}
                        onBlur={handleBlur('confirmPassword')}
                        value={values.confirmPassword}
                    />
                </FormInputContainer>
                {errors.confirmPassword && touched.confirmPassword && <InputError error={errors.confirmPassword} />}

                <View style={styles.buttonGroup}>
                    <ButtonContainer onPress={handleSubmit} disabled={!isValid}>
                        <ButtonText color="white" loading={isLoading}>Créer mon compte</ButtonText>
                    </ButtonContainer>
                </View>
            </>
        )}
    </Formik>
}

const styles = StyleSheet.create({
    container: {
        marginTop: 32,
        gap: 16,
        width: '100%',
        padding: 32,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    formContainer: {
        gap: 8,
        width: '100%'
    },
    sectionTitle: {
        fontSize: 36,
        letterSpacing: -1,
        color: Theme.colors.orange,
        fontFamily: Theme.font.black
    },
    buttonGroup: {
        width: '100%',
        marginTop: 16,
        gap: 8,
    }
})