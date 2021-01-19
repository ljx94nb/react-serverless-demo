import axios from 'axios';

export async function requestAddress(options: any) {
  try {
    const { location } = options;
    const res = await axios.get('/baidu_api/reverse_geocoding/v3/', {
      params: {
        ak: 'dWGp6ifREl8vonHTEuTrcDQpG160UGfd',
        output: 'json',
        coordtype: 'wgs84ll',
        location
      }
    });
    return res.data.result.formatted_address;
  } catch (error) {
    throw error;
  }
}
