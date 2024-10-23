
import { useQuery } from '@tanstack/react-query';
import UserApi from '../../../../service/UserApi';
export const useGetQuestions = (search) => {
  return useQuery({
    queryKey: ['questions',search],
    queryFn: async () =>UserApi.getQuestions (search)
  });
};
export const useGetChapitresByModule = (value) => {
  return useQuery({
    queryKey: ['module_chapitres',value],
    queryFn: async () =>value ? UserApi.getChapitresByModule(value):null
  });
};
export const useGetModuleByChapitre = (id) => {
  return useQuery({
    queryKey: ['module',id],
    queryFn: async () =>UserApi.getModuleByChapitre(id)   
    });
};
