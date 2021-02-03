import axios from 'axios';

export async function requestOperateArea() {
  try {
    const res = await axios.get('/mock/yunyingqu.json');
    return res.data.data;
  } catch (error) {
    throw error;
  }
}
