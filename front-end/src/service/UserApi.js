import axiosClient from "../http/http"
const UserApi = {
    getCsrf: async () => {
        return await axiosClient.get('/sanctum/csrf-cookie', {
            baseURL: import.meta.env.VITE_BASE_URL_BACK_END_API
        })
    },
    login: async (data) => {
        return await axiosClient.post('/login', data)
    },
    register: async (data) => {
        return await axiosClient.post('/register', data)
    },
    forgotPassword: async (data) => {
        return await axiosClient.post('/forgot-password', data)
    },
    resetPassword: async (data) => {
        return await axiosClient.post('/reset-password', data)
    },
    getUser: async () => {
        return await axiosClient.get('/user')
    },
    updateProfile: async (data) => {
        return await axiosClient.patch('/profile', data)
    },
    updatePassword: async (data) => {
        return await axiosClient.put('/password', data)
    },
    updatePhoto: async (data) => {
        return await axiosClient.post('/photo', data)
    },
    logout: async () => {
        return await axiosClient.post('/logout')
    },
    getModules: async (search) => {
        return await axiosClient.get('/modules' + (search ? `?search=${search}` : ''))
    },
    getModuleByChapitre: async (chapitre_id) => {
        return await axiosClient.get(`/getmodulebychapitre/${chapitre_id}`)
    },
    getChapitres: async (search) => {
        return await axiosClient.get('/chapitres' + (search ? `?search=${search}` : ''))
    },
    getChapitresByModule: async (value) => {
        return await axiosClient.get(`/getchapitresbymodule/${value}`)
    },
    getQuestions: async (search) => {
        return await axiosClient.get('/questions' + (search ? `?search=${search}` : ''))
    },
    createQuestion: async (data) => {
        return await axiosClient.post('/questions', data)
    },
    updateQuestion: async ({ id, data }) => {
        return await axiosClient.put(`/questions/${id}`, data)
    },
    deleteQuestion: async (id) => {
        return await axiosClient.delete(`/questions/${id}`)
    },
    generateExam: async (data) => {
        return await axiosClient.get('/examen/generate', {
            params: data
        })
    },
    getExam: async () => {
        return await axiosClient.get('/examens')
    },
    updateExam: async (ids, chapitres, idsExist) => {
        return await axiosClient.get('/examen/update', {
            params: { ids, chapitres, idsExist }
        })
    },
    deleteExam: async () => {
        return await axiosClient.get('/examen/delete')
    }
}
export default UserApi