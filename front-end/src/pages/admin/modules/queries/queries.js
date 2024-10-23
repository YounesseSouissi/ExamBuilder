
import { useQuery } from '@tanstack/react-query';
import AdminApi from '../../../../service/AdminApi';
export const useGetModules = (search) => {
  return useQuery({
    queryKey: ['modules',search],
    queryFn: async () =>AdminApi.getModules (search)
  });
};
export const useGetModulesFiltre = () => {
  return useQuery({
    queryKey: ['modulesFiltre'],
    queryFn: async () =>AdminApi.getModules (null)
  });
};
