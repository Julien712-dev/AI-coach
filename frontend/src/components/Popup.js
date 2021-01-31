import * as React from 'react';
import { View } from 'react-native';
import { Button, Paragraph, Dialog, Portal } from 'react-native-paper';

const Popup = ({ title, message, yesCallback, noCallback}) => {
  const [visible, setVisible] = React.useState(true);

  const hideDialog = () => {
    setVisible(false);
  }

  return (
    <View>
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>{title}</Dialog.Title>
          <Dialog.Content>
            <Paragraph>{message}</Paragraph>
          </Dialog.Content>
          <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
            <Dialog.Actions>
              <Button onPress={hideDialog}>Yes</Button>
            </Dialog.Actions>
            <Dialog.Actions>
              <Button onPress={hideDialog}>No</Button>
            </Dialog.Actions>
          </View>
        </Dialog>
      </Portal>
    </View>
  );
};

export default Popup;