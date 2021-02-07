import React from 'react';
import { StyleSheet } from 'react-native';
import { Button, Title, Card, Paragraph } from 'react-native-paper';

import { updateCuisineList } from '../hooks/useProfileFirebase'

export default ShowCard = ({title, id, cuisineType, description, image, enableLike}) => {

  return (
    <Card>
      <Card.Cover style={{ height: 140 }}source={{ uri: image }} />
      <Card.Content style={{ marginBottom: 50 }}>
        <Title>{title}</Title>
        <Paragraph>{description}</Paragraph>
      </Card.Content>
      { enableLike ? 
        <Card.Actions style={styles.iconContainer}>
          <Button icon='close' onPress={() => {updateBlkList({ cuisineType, change: -1 })}}>
          </Button>
          <Button icon='heart-outline' onPress={() => {updateFavList({ cuisineType, change: 1 })}}>
          </Button>
        </Card.Actions>
        : null }
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
