let url 
let localhost = false; // Set to true to use local server

if (localhost) {
    url = "http://192.168.1.136:5000/";
} else {
    url = "https://recyscan-backend.onrender.com/";
}

export default url;