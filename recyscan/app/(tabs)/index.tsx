import { View, Text, Pressable, Image, BackHandler } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';

const index =()=>{

    const [photo, setPhoto] = useState(null);
    const [permission, setPermission] = useState(null);
    const [answer, setAnswer] = useState(null);

    useEffect(() => {
        const askPermission = async()=>{
        const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
        setPermission(cameraStatus.status === 'granted');
      }
      askPermission();
    },[]);
    
  const openCamera = async () => {

    console.log("Opening camera");

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

    console.log("Preparing to send photo to server");

    
    if (!photo) return;
    
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
    }
    };

    console.log(answer)

    return <View style={styles.container}>
        <Text style={styles.title}>RecyScan</Text>
        <Pressable onPress={openCamera} style={styles.button}>
            <Text style={styles.buttonText}>Hacer foto</Text>
        </Pressable>
        {photo && (
            <View>
        <Image
          source={{ uri: photo }}
          style={{ width: 200, height: 200, marginTop: 20 }}
        />
        <Pressable onPress={sendPhoto} style={styles.button}>
            <Text style={styles.buttonText}>Enviar foto</Text>
        </Pressable>
        </View>
      )}
        {answer && 
        <View>
          <Text style={{ marginTop: 20, fontSize: 16 }}>Categoria: {answer.categoria}</Text>
          <Text style={{ marginTop: 10, fontSize: 16 }}>Probabilidad: {answer.confianza}</Text>
          <Text style={{ marginTop: 10, fontSize: 16 }}>Contenedor: {answer.contenedor}</Text>
          <Text style={{ marginTop: 10, fontSize: 16 }}>Instrucciones: {answer.instruccion}</Text>
          </View>}
        </View>
}

export default index;

const styles ={
container:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#d3d3d3'
},
title:{
    fontSize:20,
    fontWeight:'bold'
},
button:{
    marginTop:20,
    padding:10,
    backgroundColor:'#007AFF',
    borderRadius:5
},
buttonText:{
    color:'#FFFFFF',
    fontSize:16,
    textAlign:'center'},
answerText:{
    marginTop:20,
    fontSize:16
}
}