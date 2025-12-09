import { useState } from 'react';
import { Pressable, View, Text } from 'react-native';
import get from '../constants/get';
import ModalDetails from './ModalDetails';

const ModalCategories = ({ categories, onClose }) => {

    const [selectedCategory, setSelectedCategory] = useState(null);

    const fetchCategory = async(category) => {
        try {
            const response = await get(`info/${category}`);
            setSelectedCategory(response);
        } catch (error) {
            console.error('Error fetching category details:', error);
        }
    }

  return (
    <>
    <Pressable style={styles.background} onPress={onClose}>
      <View 
        style={styles.container}
        // Prevent touches inside the container from closing the modal
        onStartShouldSetResponder={() => true} 
        >
        <Text style={styles.title}>Categorías</Text>
        {categories.map((category, index) => (
            <Pressable key={index} style={styles.categoryItem} onPress={()=>fetchCategory(category)}>
            <Text style={styles.textCategory}>{category}</Text>
          </Pressable>
        ))}
      </View>
    </Pressable>
    {selectedCategory && <ModalDetails category={selectedCategory} onClose={() => setSelectedCategory(null)}/>}
        </>
  );
}

export default ModalCategories;

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