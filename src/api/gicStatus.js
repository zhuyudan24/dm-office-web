import { getRequest } from '@/api/api';

// 获取好办后台与 GIC 门店同步状态
export const getGicStatus = params => getRequest('/haoban-manage-web/is-gicenterprise-related', params);
