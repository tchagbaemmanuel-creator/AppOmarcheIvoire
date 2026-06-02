import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { Iconify } from "react-native-iconify";

import { Theme } from "@/config/constants";
import { RootState } from "@/redux/store";
import { Agent, useFetchAgentByIdQuery } from "@/features/auth/redux/agent.api";
import { ButtonContainer } from "@/components/Button";
import { HeaderContainer, HeaderSubtitle, HeaderTitle } from "@/components/ui/Header";

export default function SellerInfoScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const authUser = useSelector((state: RootState) => state.auth.user) as Agent | undefined;
  const agentId = authUser?.agentId ?? "";

  const { data, isLoading } = useFetchAgentByIdQuery(agentId, {
    skip: !agentId,
  });

  const seller = data ?? authUser;

  return (
    <View style={styles.container}>
      <HeaderContainer style={{ paddingTop: insets.top + 8, paddingBottom: 10 }}>
        <ButtonContainer style={styles.backButton} onPress={() => navigation.goBack()}>
          <Iconify icon="material-symbols:arrow-back-rounded" size={22} color={Theme.colors.black} />
        </ButtonContainer>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <HeaderSubtitle>Informations</HeaderSubtitle>
          <HeaderTitle>Vendeur</HeaderTitle>
        </View>
      </HeaderContainer>

      <View style={styles.content}>
        {isLoading ? (
          <Text style={styles.loadingText}>Chargement...</Text>
        ) : !seller ? (
          <Text style={styles.loadingText}>Impossible de recuperer les informations du vendeur.</Text>
        ) : (
          <View style={styles.card}>
            <InfoRow label="Nom complet" value={`${seller.firstName} ${seller.lastName}`} />
            <InfoRow label="Telephone" value={seller.phone} />
            <InfoRow label="Email" value={seller.email} />
          </View>
        )}
      </View>
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value?: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value || "-"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  backButton: {
    position: "absolute",
    left: 16,
    top: 10,
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
    flex: 1,
    padding: 16,
  },
  loadingText: {
    fontFamily: Theme.font.semiBold,
    color: Theme.colors.black,
    opacity: 0.7,
  },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
    padding: 16,
    gap: 12,
    backgroundColor: "rgba(0,0,0,0.015)",
  },
  infoRow: {
    gap: 4,
  },
  label: {
    fontFamily: Theme.font.bold,
    color: Theme.colors.black,
    fontSize: 12,
    opacity: 0.6,
  },
  value: {
    fontFamily: Theme.font.black,
    color: Theme.colors.black,
    fontSize: 15,
    letterSpacing: -0.3,
  },
});
