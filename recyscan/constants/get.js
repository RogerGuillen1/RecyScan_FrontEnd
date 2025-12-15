import url from './url.js';

const get = async (endpoint) => {
  try {
    console.log(url + endpoint);

    const response = await fetch(`${url}${endpoint}`);
    if (!response.ok) {
      console.error(`Server responded with status: ${response.status}`);
      return null;
    }

    const json = await response.json();
    return json;

  } catch (error) {
    // Only triggers when server cannot be reached AT ALL
    console.log(`Error fetching ${endpoint}:`, error);
    return null;
  }
};

export default get;
 