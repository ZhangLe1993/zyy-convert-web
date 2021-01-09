import request from '@/utils/request';
import {DeLogoPictureWaterParamsType} from "@/pages/picture/entity";

export async function deLogoPictureWater(params: DeLogoPictureWaterParamsType) {
  return request('/api/picture/water/delogo', {
    method: 'POST',
    data: params,
  });
}
