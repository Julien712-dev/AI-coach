import React from 'react';
import { View, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { Button, Text, Title, Card, Paragraph } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons'

import { updateFavList, updateBlkList } from '../actions/userActions'

export default ShowCard = ({title, id, description, image, enableLike}) => {
  return (
    <Card>
      <Card.Cover style={{ height: 140 }}source={{ uri: image }} />
      <Card.Content style={{ marginBottom: 50 }}>
        <Title>{title}</Title>
        <Paragraph>{description}</Paragraph>
      </Card.Content>
      <Card.Actions style={styles.iconContainer}>
          <Button icon='close' onPress={() => {updateBlkList(id)}}>
          </Button>
          <Button icon='heart-outline' onPress={() => {updateFavList(id)}}>
          </Button>
      </Card.Actions>
    </Card>
  )
}

const styles = StyleSheet.create({
  iconContainer: {
    height: 30,
    marginTop: 10,
    marginBottom: 5,
    position: 'absolute',
    flexDirection: 'row',
    right: 0,
    bottom: 0
  }
})
