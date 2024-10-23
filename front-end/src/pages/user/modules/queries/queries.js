
import { useQuery } from '@tanstack/react-query';
import UserApi from '../../../../service/UserApi';
export const useGetModules = (search) => {
  return useQuery({
    queryKey: ['modules',search],
    queryFn: async () =>UserApi.getModules (search)
  });
};
