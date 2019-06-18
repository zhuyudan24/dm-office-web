import { getRequest } from '@/api/api';

// 月指标-列表筛选-年份接口
export const apiYearList = params => getRequest('/haoban-app-performance-web/performance/get-years', params);

// 月指标-列表筛选-列表接口
export const apiMonthPerformanceList = params => getRequest('/haoban-app-performance-web/performance/query-month-performance', params);
