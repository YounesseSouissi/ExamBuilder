
import { useQuery } from '@tanstack/react-query';
import UserApi from '../../../../service/UserApi';
export const useGetChapitres = (search) => {
  return useQuery({
    queryKey: ['chapitres',search],
    queryFn: async () =>UserApi.getChapitres (search)
  });
};
