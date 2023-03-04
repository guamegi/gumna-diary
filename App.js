import { NavigationContainer } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import Realm from "realm";
// import AppLoading from "expo-app-loading";
import * as SplashScreen from "expo-splash-screen";
import Navigator from "./navigator";

SplashScreen.preventAutoHideAsync();

const FeelingSchema = {
  name: "Feeling",
  properties: {
    _id: "int",
    emotion: "string",
    message: "string",
  },
  primaryKey: "_id",
};

export default function App() {
  const [ready, setReady] = useState(false);
  const startLoading = async () => {
    const realm = await Realm.open({
      path: "gumnaDiaryDB",
      schema: [FeelingSchema],
    });
    console.log("realm:", realm);
  };

  useEffect(() => {
    async function prepare() {
      try {
        startLoading();
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        await SplashScreen.hideAsync();
        setReady(true);
      }
    }

    prepare();
  }, []);

  if (!ready) {
    return null;
  }
  return (
    <NavigationContainer>
      <Navigator />
    </NavigationContainer>
  );
}
