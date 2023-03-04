import { NavigationContainer } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import Realm from "realm";
// import AppLoading from "expo-app-loading";
import * as SplashScreen from "expo-splash-screen";
import Navigator from "./navigator";
import { DBContext } from "./context";

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
  const [realm, setRealm] = useState(null);
  const startLoading = async () => {
    const connection = await Realm.open({
      path: "gumnaDiaryDB",
      schema: [FeelingSchema],
    });
    // console.log("connection:", connection);
    setRealm(connection);
  };

  useEffect(() => {
    async function prepare() {
      try {
        startLoading();
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (e) {
        console.warn(e);
      } finally {
        // await SplashScreen.hideAsync();
        setReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (ready) {
      await SplashScreen.hideAsync();
    }
  }, [ready]);

  if (!ready) {
    return null;
  }
  return (
    <DBContext.Provider value={realm}>
      <NavigationContainer onReady={onLayoutRootView}>
        <Navigator />
      </NavigationContainer>
    </DBContext.Provider>
  );
}
