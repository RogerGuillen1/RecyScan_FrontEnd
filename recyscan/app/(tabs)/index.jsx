import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Pressable, Text, View } from 'react-native';
import InfoCircleIcon from '../../assets/svg/InfoIcon';
import ModalCategories from '../../components/ModalCategories';
import categoryNames from '../../constants/categoryNames';
import get from '../../constants/get';
import url from '../../constants/url';

const index =()=>{

    const [photo, setPhoto] = useState(null);
    const [permission, setPermission] = useState(null);
    const [answer, setAnswer] = useState(null);
    const [loading, setLoading] = useState(false);
    const [categoriesList, setCategoriesList] = useState([]);
    const [health, setHealth]=useState(false)
    const [generalLoading, setGeneralLoading] = useState(false)

    const getCategories = async () => {
      try {
        const response = await get('categories');
        setCategoriesList(response.categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    }
    useEffect(() => {
        const askPermission = async()=>{
        const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
        setPermission(cameraStatus.status === 'granted');  
      }
      askPermission();
    },[]);

    useEffect(() => {
      const getHealth =async()=>{
        try{
          setGeneralLoading(true)
          const response = await get('health');
          if (!response) {
            setHealth(false);
          }
          if(response.model_status === "ready"){
            setHealth(true)
          }
        }catch{
          setHealth(false)
        }
        finally{
          setGeneralLoading(false)
        }
      }
      getHealth()
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
      const response = await fetch(`${url}predict`, {
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

const gradientColors = ['#007AFF', '#00C6FF'];
const disabledColors = ['#8aaee0', '#b9d6ef'];
const backgroundGradientColors = ['#2C3E50', '#19453eff'];

return (
  <>
    <LinearGradient
  colors={backgroundGradientColors}
  start={{ x: 0, y: 0 }}
  end={{ x: 0, y: 1 }}
  style={styles.container}
>
  {generalLoading ? (
    <ActivityIndicator size="large" color="white" style={{ transform: [{ scale:2 }] }}/>
  ) : (
    <>
      {health && (
        <Pressable onPress={getCategories} style={{ position: 'absolute', top: 100, right: 20 }}>
          <InfoCircleIcon />
        </Pressable>
      )}

      <Image source={require("../../assets/images/logorender.png")} style={styles.image} />

      {health ? (
        <>
          {/* CAMERA BUTTON */}
          <Pressable onPress={openCamera} style={styles.buttonWrapper}>
            <LinearGradient
              colors={gradientColors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientButton}
            >
              <Text style={styles.buttonText}>{!photo ? "Hacer foto" : "Repetir foto"}</Text>
            </LinearGradient>
          </Pressable>

          {/* PHOTO PREVIEW + SEND */}
          {photo && (
            <View>
              <Image source={{ uri: photo }} style={{ width: 200, height: 200, marginTop: 20 }} />
              {!answer && (
                <Pressable onPress={sendPhoto} disabled={loading} style={styles.buttonWrapper}>
                  <LinearGradient
                    colors={loading ? disabledColors : gradientColors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.gradientButton}
                  >
                    {loading ? (
                      <ActivityIndicator color="#FFFFFF" />
                    ) : (
                      <Text style={styles.buttonText}>Enviar foto</Text>
                    )}
                  </LinearGradient>
                </Pressable>
              )}
            </View>
          )}

          {/* ANSWER */}
          {answer?.contenedor ? (
            <View style={styles.answerContainer}>
              <Text style={styles.answerText}>Categoria: {answer?.nombre || categoryNames[answer.categoria]}</Text>
              <Text style={styles.answerText}>Probabilidad: {(answer.confianza * 100).toFixed(2)} %</Text>
              <Text style={styles.answerText}>Contenedor: {answer.contenedor}</Text>
            </View>
          ) : (
            <View style={styles.answerContainer}>
              <Text style={styles.answerText}>Toma una foto de un residuo</Text>
              <Text style={styles.answerText}>Nuestra IA te indicará cómo reciclarlo</Text>
            </View>
          )}
        </>
      ) : (
        <Text style={styles.answerText}>No hay conexión con el servidor</Text>
      )}
    </>
  )}
</LinearGradient>

      
      {categoriesList.length > 0 && (
        <ModalCategories
        categories={categoriesList}
        onClose={() => setCategoriesList([])}
        />
      )}
  </>
);
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
    borderRadius:5,
    minWidth: 100, // Added minWidth to maintain size during loading
    justifyContent: 'center', // Center content
},
buttonDisabled:{ // Optional style for when the button is disabled
    backgroundColor:'#8aaee0'
},
buttonWrapper: {
    marginTop: 20,
    borderRadius: 5,
    overflow: 'hidden', // Importante para que el Pressable respete el borderRadius
    minWidth: 100,
},
gradientButton:{
    padding: 10,
    minWidth: 100,
    justifyContent: 'center',
    alignItems: 'center',
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
  gap: 10,
  maxWidth: '80%',
}}