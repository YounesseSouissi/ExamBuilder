import axiosClient from "../http/http"
const AdminApi = {
    getUsers: async (search) => {
        return await axiosClient.get('/admin/users' + (search ? `?search=${search}` : ''))
    },
    deleteUser: async (id) => {
        return await axiosClient.delete(`/admin/users/${id}`)
    },
    getModules: async (search) => {
        return await axiosClient.get('/admin/modules' + (search ? `?search=${search}` : ''))
    },
    getModuleByChapitre: async (chapitre_id) => {
        return await axiosClient.get(`/admin/getmodulebychapitre/${chapitre_id}`)
    },
    createModule: async (data) => {
        return await axiosClient.post('/admin/modules', data)
    },
    updateModule: async ({ id, data }) => {
        return await axiosClient.put(`/admin/modules/${id}`, data)
    },

    deleteModule: async (id) => {
        return await axiosClient.delete(`/admin/modules/${id}`)
    },
    getChapitres: async (search) => {
        return await axiosClient.get('/admin/chapitres' + (search ? `?search=${search}` : ''))
    },
    getChapitresByModule: async (value) => {
        return await axiosClient.get(`/admin/getchapitresbymodule/${value}`)
    },
    createChapitre: async (data) => {
        return await axiosClient.post('/admin/chapitres', data)
    },
    updateChapitre: async ({ id, data }) => {
        return await axiosClient.put(`/admin/chapitres/${id}`, data)
    },
    deleteChapitre: async (id) => {
        return await axiosClient.delete(`/admin/chapitres/${id}`)
    },
    getQuestions: async (search,module,chapitres) => {
        return await axiosClient.get('/admin/questions', {
            params: {
                search: search,
                module: module,
                chapitres: chapitres
            }
        });
        
    },
    getQuestionsNonConfirme: async (search) => {
        return await axiosClient.get('/admin/getquestions/non-confirme' + (search ? `?search=${search}` : ''))
    },
    getNumberQuestionsNonConfirme: async () => {
        return await axiosClient.get('/admin/number_question_non_confirme')
    },
    createQuestion: async (data) => {
        return await axiosClient.post('/admin/questions', data)
    },
    updateQuestion: async ({ id, data }) => {
        return await axiosClient.put(`/admin/questions/${id}`, data)
    },
    deleteQuestion: async (id) => {
        return await axiosClient.delete(`/admin/questions/${id}`)
    },
    confimeQuestion: async (id) => {
        return await axiosClient.patch(`/admin/confirme-question/${id}`)
    },
    generateExam: async (data) => {
        return await axiosClient.get('/admin/examen/generate', {
            params: data
        })
    },
    getExam: async () => {
        return await axiosClient.get('/admin/examens')
    },
    updateExam: async (ids, chapitres, idsExist) => {
        return await axiosClient.get('/admin/examen/update', {
            params: { ids, chapitres, idsExist }
        })
    },
    deleteExam: async () => {
        return await axiosClient.get('/admin/examen/delete')
    },
    dashboard: async () => {
        return await axiosClient.get('/admin/dashboard')
    }
}
export default AdminApi