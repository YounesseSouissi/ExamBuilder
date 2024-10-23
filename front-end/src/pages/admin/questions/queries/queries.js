
import { useQuery } from '@tanstack/react-query';
import AdminApi from '../../../../service/AdminApi';
export const useGetQuestions = (search,module,chapitres) => {
  return useQuery({
    queryKey: ['questions',search,module,chapitres],
    queryFn: async () =>AdminApi.getQuestions (search,module,chapitres)
  });
};
export const useGetQuestionsNonConfirme = (search) => {
  return useQuery({
    queryKey: ['questionsNonConfime',search],
    queryFn: async () =>AdminApi.getQuestionsNonConfirme(search)
  });
};
export const useGetChapitresByModule = (value) => {
  return useQuery({
    queryKey: ['module_chapitres',value],
    queryFn: async () =>value ? AdminApi.getChapitresByModule(value):null
  });
};
export const useGetModuleByChapitre = (id) => {
  return useQuery({
    queryKey: ['module',id],
    queryFn: async () =>AdminApi.getModuleByChapitre(id)   
    });
};
