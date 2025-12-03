import { View, Text, Pressable, Image, BackHandler, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';

const index =()=>{

    const [photo, setPhoto] = useState(null);
    const [permission, setPermission] = useState(null);
    const [answer, setAnswer] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const askPermission = async()=>{
        const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
        setPermission(cameraStatus.status === 'granted');
      }
      askPermission();
    },[]);
    
  const openCamera = async () => {
    // Clear previous photo/answer when taking a new one
    setPhoto(null);
    setAnswer(null);

    if (!permission) {
      alert('Camera permission is required');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
      console.log("Photo taken:", result.assets[0].uri);
    }
  };

  const sendPhoto = async () => {

    if (!photo) return;
    
    // 1. Set loading to true and clear previous answer
    setLoading(true);
    setAnswer(null); // <--- Clears the previous result immediately

    console.log("Preparing to send photo to server");

    const formData = new FormData();
    formData.append('file', {
      uri: photo,
      name: 'photo.jpg',
      type: 'image/jpeg',
    });

    console.log("FormData prepared:", formData);
    try {
      const response = await fetch(`${'http://192.168.1.136:5000'}/predict`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log("Sending photo to server:", photo);
      const data = await response.json();

      console.log('Server response:', data);
      setAnswer(data);
    } catch (error) {
      console.error('Error uploading photo:', error);
      // Optional: set an error message in state
    } finally{
      setLoading(false);
    }
    };

    return <View style={styles.container}>
        <Image source={require("../../assets/images/logotext.png")} style={styles.image}/>
        <Pressable onPress={openCamera} style={styles.button}>
            <Text style={styles.buttonText}>{!photo?"Hacer foto":"Repetir foto"}</Text>
        </Pressable>
        {photo && (
            <View>
        <Image
          source={{ uri: photo }}
          style={{ width: 200, height: 200, marginTop: 20 }}
        />
        {!answer && (

          <Pressable 
          onPress={sendPhoto} 
          style={[styles.button, loading && styles.buttonDisabled]} 
          disabled={loading} // Disable press while loading
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" /> // Show loading circle
            ) : (
              <Text style={styles.buttonText}>Enviar foto</Text> // Show text when not loading
            )}
        </Pressable>
            )}
        </View>
      )}
        {answer ?
        <View style={styles.answerContainer}>
          <Text style={styles.answerText}>Categoria: {answer.categoria}</Text>
          <Text style={styles.answerText}>Probabilidad: {(answer.confianza.toFixed(4)*100).toFixed(2)} %</Text>
          <Text style={styles.answerText}>Contenedor: {answer.contenedor}</Text>
          <Text style={styles.answerText}>Instrucciones: {answer.instruccion}</Text>
          </View>:
          <View style={styles.answerContainer}>
          <Text style={styles.answerText}> </Text>
          <Text style={styles.answerText}> </Text>
          <Text style={styles.answerText}> </Text>
          <Text style={styles.answerText}> </Text>
          </View>}
        </View>
}

export default index;

const styles ={
container:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#333b3f',
    marginTop: -50
},
image:{
      width: 230,
      height: 200,
      resizeMode: 'contain'
},
button:{
    marginTop:20,
    padding:10,
    backgroundColor:'#007AFF',
    borderRadius:5,
    minWidth: 100, // Added minWidth to maintain size during loading
    justifyContent: 'center', // Center content
},
buttonDisabled:{ // Optional style for when the button is disabled
    backgroundColor:'#8aaee0'
},
buttonText:{
    color:'#FFFFFF',
    fontSize:16,
    textAlign:'center'},
answerText:{
    fontSize:16,
    color:'#d7d7d7'
},
answerContainer:{
    marginTop:20,
    alignItems:'center',
  gap: 10
}}