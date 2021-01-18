import axios from 'axios';

export async function requestAddress(options: any) {
  try {
    const { location } = options;
    const res = await axios.get('http://api.map.baidu.com/reverse_geocoding/v3/', {
      params: {
        ak: 'dWGp6ifREl8vonHTEuTrcDQpG160UGfd',
        output: 'json',
        coordtype: 'wgs84ll',
        location
      }
    });
    return res;
  } catch (error) {
    throw error;
  }
}
