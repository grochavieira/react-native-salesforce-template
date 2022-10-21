import React, { useState, useEffect } from "react";
import "react-native-gesture-handler";
import { ThemeProvider } from "styled-components";

import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";

import { GlobalModal } from "./src/components/GlobalModal";
import { Loading } from "./src/components/Loading";

import { AuthProvider } from "./src/hooks/auth";
import { SyncProvider } from "./src/hooks/sync";
import { Routes } from "./src/routes";
import theme from "./src/global/styles/theme";

export default function App() {
  // carrega as fontes do aplicativo
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return <></>;
  }

  return (
    <>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <SyncProvider>
            <GlobalModal />
            <Loading/>
            <Routes />
          </SyncProvider>
        </AuthProvider>
      </ThemeProvider>
    </>
  );
}
