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
          key: '5d8a8dd1fcc6c74b4f7217e311e046c0',
          s: 'rsv3',
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
