import axios from 'axios';

export async function requestUserCountAndLength(options: any) {
  try {
    const { dateStr } = options;
    const day = Number(dateStr.split('-')[2]);
    const res = await axios.get('/mock/userCountAndLength.json');
    return res.data[day];
  } catch (error) {
    throw error;
  }
}
