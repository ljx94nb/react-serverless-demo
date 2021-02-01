import axios from 'axios';

export async function requestUserCountAndLength(options: any) {
  try {
    const { dateStr } = options;
    const numArr = dateStr.split('-');
    const day = Number(numArr[numArr.length - 1]);
    const res = await axios.get('/mock/userCountAndLength.json');
    return res.data[day];
  } catch (error) {
    throw error;
  }
}
