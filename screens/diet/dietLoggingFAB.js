import * as React from 'react';
import { StyleSheet } from 'react-native';
import { FAB, Portal, Provider } from 'react-native-paper';

const MyComponent = () => {
  const [state, setState] = React.useState({ open: false });

  const onStateChange = ({ open }) => setState({ open });

  const { open } = state;

  return (
    <Provider>
      <Portal>
        <FAB.Group
          open={open}
          style={styles}
          icon={open ? 'minus' : 'plus'}
          actions={[
            // { icon: 'plus', onPress: () => console.log('Pressed add') },
            {
              icon: 'pencil',
              label: 'Log Manually',
              onPress: () => console.log('Pressed star'),
            },
            {
              icon: 'camera',
              label: 'Log by Food Snap',
              onPress: () => console.log('Pressed email'),
            },
          ]}
          onStateChange={onStateChange}
          onPress={() => {
            if (open) {
              // do something if the speed dial is open
            }
          }}
        />
      </Portal>
    </Provider>
  );
};

const styles = StyleSheet.create({
    fab: {
      position: 'absolute',
      alignSelf: 'flex-end',
      margin: 16,
      right: 0,
      bottom: 0,
    },
  })

export default MyComponent;