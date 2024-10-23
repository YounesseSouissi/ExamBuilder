
import { useQuery } from '@tanstack/react-query';
import AdminApi from '../../../../service/AdminApi';
export const useGetCounts = () => {
  return useQuery({
    queryKey: ['counts'],
    queryFn: async () =>AdminApi.dashboard()
  });
};
