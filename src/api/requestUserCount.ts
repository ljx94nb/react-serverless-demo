import axios from 'axios';

export async function requestUserCount(options: any) {
  try {
    const { dateStr } = options;
    const day = Number(dateStr.split('-')[2]);
    const res = await axios.get('/mock/userCount.json');
    return res.data.data[day];
  } catch (error) {
    throw error;
  }
}
