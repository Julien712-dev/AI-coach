import React from "react";
import { FlatList, View } from "react-native";
import { Button, Title, Card, Paragraph } from "react-native-paper";

import useProfileFirebase from "../hooks/useProfileFirebase";

const renderItem = ({ item }) => (
  <Card>
    <View style={{ flexDirection: "row" }}>
      <Card.Cover
        style={{ height: 100, width: 140 }}
        source={{ uri: item.image }}
      />
      <View style={{ flex: 1 }}>
        <Card.Content>
          <Paragraph>{item.title}</Paragraph>
        </Card.Content>
        <Card.Actions style={{ alignSelf: "flex-end" }}>
          <Button>ADD</Button>
        </Card.Actions>
      </View>
    </View>
  </Card>
);

export default VerticalList = ({ data }) => {
  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
    />
  );
};
