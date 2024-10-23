
import { useQuery } from '@tanstack/react-query';
import UserApi from '../../../../service/UserApi';
export const useGetExam = () => {
  return useQuery({
    queryKey: ['examen'],
    queryFn: async () =>UserApi.getExam()
  });
};
