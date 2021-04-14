import request from '@/utils/request';
import {DeLogoPictureWaterParamsType} from "@/pages/picture/entity";
import {AnalysisParam} from "@/pages/video/analysis/entity";

export async function videoAnalysis(params: AnalysisParam) {
  return request('/api/video/analysis', {
    method: 'POST',
    data: params,
  });
}
