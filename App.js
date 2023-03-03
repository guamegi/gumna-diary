import { NavigationContainer } from "@react-navigation/native";
import React, { useState } from "react";
import Realm from "realm";
import AppLoading from "expo-app-loading";
import Navigator from "./navigator";

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
    // console.log("realm:", realm);
  };
  const onFinish = () => setReady(true);
  if (!ready) {
    return (
      <AppLoading
        startAsync={startLoading}
        onFinish={onFinish}
        onError={console.error}
      />
    );
  }
  return (
    <NavigationContainer>
      <Navigator />
    </NavigationContainer>
  );
}
