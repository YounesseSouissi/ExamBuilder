
import { useQuery } from '@tanstack/react-query';
import AdminApi from '../../../../service/AdminApi';
export const useGetChapitres = (search) => {
  return useQuery({
    queryKey: ['chapitres',search],
    queryFn: async () =>AdminApi.getChapitres (search)
  });
};
