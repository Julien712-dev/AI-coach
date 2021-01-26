import React from 'react';
import { View, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { Button, Text, Title, Card, Paragraph } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons'

import { updateFavList, updateBlkList } from '../actions/userActions'

export default ShowCard = ({title, id, description, image, enableLike}) => {
  return (
    <Card>
    <Card.Cover style={{height: 140}}source={{ uri: image }} />
    <Card.Content>
      <Title>{title}</Title>
      <Paragraph>{description}</Paragraph>
    </Card.Content>
    <Card.Actions style={styles.iconContainer}>
      <Button onPress={() => {updateBlkList(id)}}>
        <Ionicons name="heart-dislike-outline" size={24} color="black" />
      </Button>
      <Button onPress={() => {updateFavList(id)}}>
        <Ionicons name="heart-outline" size={24} color="black" />
      </Button>
    </Card.Actions>
    </Card>
  )
}

const styles = StyleSheet.create({
  iconContainer: {
    position: 'absolute',
    flexDirection: 'row',
    right: 10,
    bottom: 5
  }
})
