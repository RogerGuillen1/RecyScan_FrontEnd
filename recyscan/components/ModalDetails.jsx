import { Pressable, View, Text } from 'react-native';
import categoryNames from '@/constants/categoryNames';

const ModalDetails = ({ category, onClose }) => {
    console.log("Category in ModalDetails:", category);
  return (
    <Pressable style={styles.background} onPress={onClose}>
      <View 
        style={styles.container}
        onStartShouldSetResponder={() => true} 
      >
        <Text style={styles.title}>{categoryNames[category.category] || category.category}</Text>
        <View>
          <Text style={styles.textCategory}>Objectos comunes: </Text>
          <View>
            {category.data.common_items.map((item, index) => (
              <Text style={styles.iterableText} key={index}>- {item}</Text>
            ))}
          </View>
          <Text style={styles.textCategory}>Descripción: </Text>
          <Text style={styles.normalText} >
            {category.data.description}
          </Text>
          <Text style={styles.textCategory}>Instrucciones de reciclaje: </Text>
          <Text style={styles.normalText} >
            {category.data.container}
            </Text>

        </View>
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
        maxHeight: '65%',
        width: '65%',
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
        fontWeight: 'bold',
        marginTop: 10,
    },
    categoryItem:{
        padding: 2,
        margin: 5,
        backgroundColor: '#555c60',
        width: '75%',
        borderRadius: 5,
        alignItems: 'center',
    },
    normalText:{
        color: '#FFFFFF',
        fontSize: 16,
        marginVertical: 10,
    },
    iterableText:{
        color: '#FFFFFF',
        fontSize: 16,
        marginVertical: 4
    }
}