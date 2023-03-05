import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../colors";
import { useDB } from "../context";
import { FlatList, LayoutAnimation, TouchableOpacity } from "react-native";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";

const View = styled.View`
  flex: 1;
  padding: 0px 30px;
  padding-top: 100px;
  background-color: ${colors.bgColor};
  justify-content: center;
  align-items: center;
`;
const Title = styled.Text`
  color: ${colors.textColor};
  font-size: 38px;
  font-weight: 500;
  width: 100%;
  margin-bottom: 10px;
`;
const Btn = styled.TouchableOpacity`
  position: absolute;
  bottom: 50px;
  right: 50px;
  width: 80px;
  height: 80px;
  background-color: ${colors.btnColor};
  border-radius: 40px;
  justify-content: center;
  align-items: center;
  elevation: 5;
  box-shadow: 1px 1px 3px rgba(41, 30, 95, 0.2);
`;

const Record = styled.View`
  background-color: ${colors.cardColor};
  flex-direction: row;
  align-items: center;
  padding: 10px 20px;
  border-radius: 10px;
`;
const Emotion = styled.Text`
  font-size: 24px;
  margin-right: 10px;
`;
const Message = styled.Text`
  font-size: 18px;
`;
const Separator = styled.View`
  height: 10px;
`;

const Home = ({ navigation: { navigate } }) => {
  const realm = useDB();
  const [feelings, setFeelings] = useState([]);

  useEffect(() => {
    const feelings = realm.objects("Feeling");
    feelings.addListener((feelings, changes) => {
      // setFeelings([...feelings]);
      LayoutAnimation.spring();
      setFeelings([...feelings.sorted("_id", true)]);
    });
    return () => {
      feelings.removeAllListeners();
    };
  }, []);

  const onPress = (id) => {
    realm.write(() => {
      const feeling = realm.objectForPrimaryKey("Feeling", id);
      realm.delete(feeling);
    });
  };

  return (
    <View>
      <Title>My journal</Title>
      <BannerAd sizes={[BannerAdSize.FULL_BANNER]} unitId={TestIds.BANNER} />
      <FlatList
        style={{ width: "100%", marginVertical: 10 }}
        data={feelings}
        contentContainerStyle={{ paddingVertical: 10 }}
        ItemSeparatorComponent={Separator}
        keyExtractor={(feeling) => feeling._id + ""}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => onPress(item._id)}>
            <Record>
              <Emotion>{item.emotion}</Emotion>
              <Message>{item.message}</Message>
            </Record>
          </TouchableOpacity>
        )}
      />
      <Btn onPress={() => navigate("Write")}>
        <Ionicons name="add" color="white" size={40} />
      </Btn>
    </View>
  );
};

export default Home;
