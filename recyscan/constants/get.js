const get=async (endpoint)=>{
    try{

        const url = 'https://recyscan-backend.onrender.com/';
        console.log(url+endpoint)
        const response = await fetch(`${url}${endpoint}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    const json = await response.json();
    return json;
} catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return null
}}

export default get;