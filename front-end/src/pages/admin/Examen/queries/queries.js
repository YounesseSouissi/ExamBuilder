
import { useQuery } from '@tanstack/react-query';
import AdminApi from '../../../../service/AdminApi';
export const useGetExam = () => {
  return useQuery({
    queryKey: ['examen'],
    queryFn: async () =>AdminApi.getExam()
  });
};
