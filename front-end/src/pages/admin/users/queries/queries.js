
import { useQuery } from '@tanstack/react-query';
import AdminApi from '../../../../service/AdminApi';
export const useGetUsers = (search) => {
  return useQuery({
    queryKey: ['users',search],
    queryFn: async () =>AdminApi.getUsers (search)
  });
};
