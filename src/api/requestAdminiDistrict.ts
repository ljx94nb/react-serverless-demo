import axios from 'axios';

export async function requestAdminiDistrict(districtName) {
  try {
    const res = await axios.get(
      process.env.NODE_ENV === 'production'
        ? 'https://restapi.amap.com/v3/config/district'
        : '/district_api/v3/config/district',
      {
        params: {
          subdistrict: 0,
          extensions: 'all',
          key: '8b5e15c15d37f2e4e987b786115a837a',
          output: 'json',
          keywords: districtName
        }
      }
    );
    return res.data;
  } catch (error) {
    throw error;
  }
}
