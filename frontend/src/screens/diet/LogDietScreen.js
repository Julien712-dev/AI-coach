import React, { useState } from "react";
import { View, ScrollView, SafeAreaView } from "react-native";
import { Text, Searchbar, Button, Divider } from "react-native-paper";
import Ionicons from "react-native-vector-icons/Ionicons";

// edit
import searchRecipe from "~/src/hooks/searchRecipe";
import VerticalList from "~/src/components/VerticalList";

// Overriding the header
DetailsScreen["navigationOptions"] = (screenProps) => ({
  title: "",
  headerLeft: () => (
    <Ionicons
      name={"ios-arrow-back"}
      size={30}
      color={"dodgerblue"}
      style={{ paddingLeft: 10 }}
      onPress={() => screenProps.navigation.goBack()}
    />
  ),
});

// screen for demo purpose
export default function DetailsScreen({ navigation }) {
  const { recipeResults, searchByName, fakeSearch } = searchRecipe();
  const [query, setQuery] = React.useState("");

  const onChangeSearch = (query) => setQuery(query);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ padding: 20 }}>
        <Searchbar
          style={{ marginBottom: 15 }}
          placeholder="Search for a food item"
          onChangeText={onChangeSearch}
          value={query}
          onIconPress={() => searchByName({ query })}
        />
        <Divider />
        <Text style={{ fontSize: 16, alignSelf: "center", marginVertical: 5 }}>
          Can't find your diet?
        </Text>
        <Button
          icon="pencil"
          mode="contained"
          style={{ width: 200, alignSelf: "center", marginTop: 10 }}
          onPress={() => navigation.navigate("Log Diet Details")}
        >
          Log Manually
        </Button>
      </View>
      <SafeAreaView style={{ flex: 1, paddingHorizontal: 20 }}>
        <VerticalList data={recipeResults} />
      </SafeAreaView>
    </SafeAreaView>
  );
}
