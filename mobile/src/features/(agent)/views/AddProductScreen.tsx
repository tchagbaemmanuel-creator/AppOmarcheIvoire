import React, { useMemo, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Iconify } from "react-native-iconify";
import { StatusBar } from "expo-status-bar";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";

import { ENV, Theme } from "@/config/constants";
import InputGroup, { InputField } from "@/components/Input";
import { ButtonContainer, ButtonText } from "@/components/Button";
import {
  ProductCategory,
  ProductUnit,
  useCreateProductMutation,
} from "../../(client)/redux/productsApi.slice";
import { showToast } from "@/redux/slices/toast.slice";
import { useDispatch, useSelector } from "react-redux";
import { SellerStackParamList } from "../routers/SellerStackRouter";
import { RootState } from "@/redux/store";
import { useErrorHandler } from "@/hooks/useErrorHandler";

type AddProductRouteProp = RouteProp<SellerStackParamList, "AddProduct">;
type AddProductNavigationProp = NativeStackNavigationProp<
  SellerStackParamList,
  "AddProduct"
>;

const DEFAULT_IMAGE = "https://placehold.co/600x400/png?text=Produit";
const PRODUCT_UNITS: ProductUnit[] = [
  ProductUnit.KG,
  ProductUnit.DEMI_KG,
  ProductUnit.LITRE,
  ProductUnit.TAS,
  ProductUnit.SAC,
  ProductUnit.BOITE,
  ProductUnit.MORCEAUX,
  ProductUnit.UNIT,
  ProductUnit.AUTRE,
];
const PRODUCT_CATEGORIES: ProductCategory[] = [
  ProductCategory.Legumes,
  ProductCategory.Fruits,
  ProductCategory.Viandes,
  ProductCategory.Poissons,
  ProductCategory.Cereales,
  ProductCategory.Tubercules,
  ProductCategory.Mer,
  ProductCategory.Epices,
  ProductCategory.Autres,
];

export default function AddProductScreen() {
  const route = useRoute<AddProductRouteProp>();
  const navigation = useNavigation<AddProductNavigationProp>();
  const dispatch = useDispatch();
  const handleError = useErrorHandler();
  const token = useSelector((state: RootState) => state.auth.token);
  const { sellerId } = route.params;
  const [createProduct, { isLoading }] = useCreateProductMutation();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [amount, setAmount] = useState("1");
  const [description, setDescription] = useState("");
  const [pictureUrl, setPictureUrl] = useState("");
  const [unit, setUnit] = useState<ProductUnit>(ProductUnit.KG);
  const [category, setCategory] = useState<ProductCategory>(ProductCategory.Legumes);
  const [isInStock, setIsInStock] = useState(true);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const parsedPrice = useMemo(() => Number(price), [price]);
  const parsedAmount = useMemo(() => Number(amount), [amount]);

  const validate = () => {
    if (!name.trim()) {
      return "Le nom du produit est requis.";
    }
    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      return "Le prix doit etre un nombre positif.";
    }
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return "La quantite doit etre un nombre positif.";
    }
    return null;
  };

  const uploadImageToApi = async (localUri: string) => {
    const formData = new FormData();
    formData.append("image", {
      uri: localUri,
      name: `product_${Date.now()}.jpg`,
      type: "image/jpeg",
    } as any);

    const uploadHeaders: Record<string, string> = {};
    if (token) uploadHeaders.Authorization = `Bearer ${token}`;
    if (ENV.API_URL.includes("ngrok")) {
      uploadHeaders["ngrok-skip-browser-warning"] = "true";
    }

    const uploadResponse = await fetch(`${ENV.API_URL}/images/upload`, {
      method: "POST",
      body: formData,
      headers: Object.keys(uploadHeaders).length ? uploadHeaders : undefined,
    });

    if (!uploadResponse.ok) {
      const body = await uploadResponse.json().catch(() => null);
      const message = body?.message || body?.error || "Image upload failed";
      throw new Error(message);
    }

    const uploadResult = await uploadResponse.json();
    const uploadedUrl =
      uploadResult?.url || uploadResult?.secure_url || uploadResult?.data?.url;

    if (!uploadedUrl) {
      throw new Error("No image URL returned");
    }

    return uploadedUrl as string;
  };

  const pickAndUploadImage = async (source: "camera" | "gallery") => {
    try {
      if (source === "camera") {
        const cameraPermission =
          await ImagePicker.requestCameraPermissionsAsync();
        if (cameraPermission.status !== "granted") {
          Alert.alert("Permission", "La permission camera est requise.");
          return;
        }
      } else {
        const mediaPermission =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (mediaPermission.status !== "granted") {
          Alert.alert(
            "Permission",
            "La permission galerie est requise."
          );
          return;
        }
      }

      const result =
        source === "camera"
          ? await ImagePicker.launchCameraAsync({
              allowsEditing: true,
              quality: 0.7,
            })
          : await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              quality: 0.7,
            });

      if (result.canceled || !result.assets?.length) return;

      setIsUploadingImage(true);
      const localUri = result.assets[0].uri;
      const uploadedUrl = await uploadImageToApi(localUri);
      setPictureUrl(uploadedUrl);
      dispatch(
        showToast({
          message: "Image du produit telechargee.",
          type: "success",
        })
      );
    } catch (error) {
      handleError(error);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleCreateProduct = async () => {
    const error = validate();
    if (error) {
      Alert.alert("Validation", error);
      return;
    }

    try {
      await createProduct({
        sellerId,
        name: name.trim(),
        description: description.trim() || null,
        amount: parsedAmount,
        price: parsedPrice,
        unit,
        category,
        pictureUrl: [pictureUrl.trim() || DEFAULT_IMAGE],
        isInStock,
      }).unwrap();

      dispatch(
        showToast({
          message: "Produit ajoute avec succes.",
          type: "success",
        })
      );
      navigation.goBack();
    } catch (e) {
      handleError(e);
    }
  };

  return (
    <KeyboardAwareScrollView style={styles.container}>
      <StatusBar style="dark" />
      <ButtonContainer style={styles.backButton} onPress={() => navigation.goBack()}>
        <Iconify icon="material-symbols:arrow-back-rounded" size={22} color={Theme.colors.black} />
      </ButtonContainer>

      <View style={styles.content}>
        <Text style={styles.title}>Nouveau produit</Text>
        <Text style={styles.subtitle}>Ajoutez un produit et son prix pour ce vendeur.</Text>

        <View style={styles.photoActions}>
          <ButtonContainer
            style={styles.photoButton}
            onPress={() => pickAndUploadImage("camera")}
            disabled={isUploadingImage}
          >
            <ButtonText color="white" loading={isUploadingImage}>
              Prendre une photo
            </ButtonText>
          </ButtonContainer>
          <ButtonContainer
            style={[styles.photoButton, { backgroundColor: Theme.colors.blackLight }]}
            onPress={() => pickAndUploadImage("gallery")}
            disabled={isUploadingImage}
          >
            <ButtonText color="white" loading={isUploadingImage}>
              Choisir de la galerie
            </ButtonText>
          </ButtonContainer>
        </View>

        <Image source={{ uri: pictureUrl || DEFAULT_IMAGE }} style={styles.preview} contentFit="cover" />

        <InputGroup style={styles.inputGroup}>
          <InputField
            value={name}
            onChangeText={setName}
            placeholder="Nom du produit"
            placeholderTextColor="rgba(0,0,0,0.35)"
          />
        </InputGroup>

        <InputGroup style={styles.inputGroup}>
          <InputField
            value={price}
            onChangeText={setPrice}
            placeholder="Prix (CFA)"
            keyboardType="numeric"
            placeholderTextColor="rgba(0,0,0,0.35)"
          />
        </InputGroup>

        <InputGroup style={styles.inputGroup}>
          <InputField
            value={amount}
            onChangeText={setAmount}
            placeholder="Quantite"
            keyboardType="numeric"
            placeholderTextColor="rgba(0,0,0,0.35)"
          />
        </InputGroup>

        <InputGroup style={styles.inputGroup}>
          <InputField
            value={description}
            onChangeText={setDescription}
            placeholder="Description (optionnel)"
            placeholderTextColor="rgba(0,0,0,0.35)"
          />
        </InputGroup>

        <View style={styles.chipsContainer}>
          {PRODUCT_UNITS.map((item) => (
            <ButtonContainer
              key={item}
              style={[
                styles.chipButton,
                unit === item && styles.chipButtonActive,
              ]}
              onPress={() => setUnit(item)}
            >
              <ButtonText color={unit === item ? "white" : Theme.colors.black}>
                {item}
              </ButtonText>
            </ButtonContainer>
          ))}
        </View>

        <View style={styles.chipsContainer}>
          {PRODUCT_CATEGORIES.map((item) => (
            <ButtonContainer
              key={item}
              style={[
                styles.chipButton,
                category === item && styles.chipButtonActive,
              ]}
              onPress={() => setCategory(item)}
            >
              <ButtonText color={category === item ? "white" : Theme.colors.black}>
                {item}
              </ButtonText>
            </ButtonContainer>
          ))}
        </View>

        <ButtonContainer
          style={[
            styles.stockButton,
            {
              backgroundColor: isInStock
                ? Theme.colors.greenDark
                : Theme.colors.redDark,
            },
          ]}
          onPress={() => setIsInStock((prev) => !prev)}
        >
          <ButtonText color="white">
            {isInStock ? "Produit en stock" : "Produit en rupture"}
          </ButtonText>
        </ButtonContainer>

        <InputGroup style={styles.inputGroup}>
          <InputField
            value={pictureUrl}
            onChangeText={setPictureUrl}
            placeholder="URL image (optionnel)"
            placeholderTextColor="rgba(0,0,0,0.35)"
            autoCapitalize="none"
          />
        </InputGroup>

        <ButtonContainer style={styles.submitButton} onPress={handleCreateProduct} disabled={isLoading}>
          <ButtonText color="white" loading={isLoading}>
            Ajouter le produit
          </ButtonText>
        </ButtonContainer>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  backButton: {
    marginTop: 56,
    marginLeft: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 10,
  },
  title: {
    fontFamily: Theme.font.black,
    color: Theme.colors.black,
    fontSize: 24,
    letterSpacing: -0.6,
  },
  subtitle: {
    fontFamily: Theme.font.medium,
    color: Theme.colors.black,
    opacity: 0.7,
    marginBottom: 8,
  },
  inputGroup: {
    height: 50,
    borderRadius: 14,
  },
  submitButton: {
    height: 50,
    marginTop: 8,
  },
  photoActions: {
    gap: 8,
    marginBottom: 6,
  },
  photoButton: {
    height: 44,
    backgroundColor: Theme.colors.greenDark,
  },
  preview: {
    width: "100%",
    height: 170,
    borderRadius: 12,
    backgroundColor: Theme.colors.greenLight,
    marginBottom: 6,
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chipButton: {
    height: 34,
    width: "auto",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.12)",
    backgroundColor: "white",
    paddingHorizontal: 12,
  },
  chipButtonActive: {
    backgroundColor: Theme.colors.black,
  },
  stockButton: {
    height: 44,
  },
});
