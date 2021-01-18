import { getApp } from '@/utils';

const app = getApp();

export async function requestBikeData(currPage: number, pageSize: number) {
  try {
    const data = await app.callFunction({
      name: 'find_all_bike',
      data: {
        currPage,
        pageSize
      }
    });
    return data.result;
  } catch (error) {
    throw error;
  }
}
