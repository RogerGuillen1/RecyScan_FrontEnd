import { Pressable, View, Text } from 'react-native';

const ModalDetails = ({ category, onClose }) => {
    console.log("Category in ModalDetails:", category);
  return (
    <Pressable style={styles.background} onPress={onClose}>
      <View 
        style={styles.container}
        onStartShouldSetResponder={() => true} 
      >
        <Text style={styles.title}>hhh</Text>
      </View>
    </Pressable>
  );
}

export default ModalDetails;

const styles = {
    background:{
        position: 'absolute',
        top: 0,
        left: 0,
        height: "100%",
        width: "100%",
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#333b3f',
        maxHeight: '70%',
        width: '60%',
        padding: 20,
        borderRadius: 10,
    },
    title:{
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
    },
    textCategory:{
        color: '#FFFFFF',
        fontSize: 18,
    },
    categoryItem:{
        padding: 2,
        margin: 5,
        backgroundColor: '#555c60',
        width: '75%',
        borderRadius: 5,
        alignItems: 'center',
    }
}