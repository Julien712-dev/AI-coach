import React from "react";
import { FlatList, View } from "react-native";
import { Button, Title, Card, Paragraph } from "react-native-paper";
import { useNavigation } from '@react-navigation/native'

import useProfileFirebase from "../hooks/useProfileFirebase";


export default VerticalList = ({ data, screenName }) => {
  const navigation = useNavigation()
  
  return (
    <FlatList
      data={data}
      renderItem={({ item }) => (
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
              <Button onPress={() => navigation.navigate(screenName, { recipe: item })}>ADD</Button>
            </Card.Actions>
          </View>
        </View>
      </Card>
      )}
      keyExtractor={(item) => item.id.toString()}
    />
  )
}
