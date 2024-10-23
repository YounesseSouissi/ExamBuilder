import { Navigate, createBrowserRouter } from 'react-router-dom'
import Login from '../pages/signin-signup/Login'
import Register from '../pages/signin-signup/Register'
import GuestLayout from '../components/Layouts/GuestLayout'
import UserLayout from '../components/Layouts/UserLayout'
import AdminLayout from '../components/Layouts/AdminLayout'
import NotFound from '../pages/not-found/NotFound'
import { ADMIN_DASHBOARD_ROUTE, USER_DASHBOARD_ROUTE, LOGIN_ROUTE } from '../components/constants/data'
import UserList from '../pages/admin/users/UsersList'
import ModulesList from '../pages/admin/modules/ModulesList'
import ChapitresList from '../pages/admin/chapitres/ChapitresList'
import QuestionsList from '../pages/admin/questions/QuestionsList'
import QuestionsListNonConfirmer from '../pages/admin/questions/QuestionsListNonConfirmer'
import ExamenCreate from '../pages/admin/Examen/ExamenCreate'
import ListModules from '../pages/user/modules/ListModules'
import ListChapitres from '../pages/user/chapitres/ListChapitres'
import ListQuestions from '../pages/user/questions/ListQuestions'
import CreateExamen from '../pages/user/Examen/CreateExamen'
import Dashboard from '../pages/admin/dashboard/Dashboard'
import ForgotPassword from '../pages/signin-signup/ForgotPassword'
import ResetPassword from '../pages/signin-signup/ResetPassword.jsx'
import Compte from '../pages/compte/Compte.jsx'
import Home from '../pages/user/home/Home'
export const redirectToDashboard = (roleType) => {
    switch (roleType) {
        case 'admin':
            return (ADMIN_DASHBOARD_ROUTE)
        case 'user':
            return (USER_DASHBOARD_ROUTE)
    }
}
const router = createBrowserRouter([
    {
        element: <GuestLayout />,
        children: [
            {
                path: LOGIN_ROUTE,
                element: <Login />
            },
            {
                path: '/register',
                element: <Register />
            },
            {
                path: '/forgot-password',
                element: <ForgotPassword />
            },
            {
                path: '/password-reset/:token',
                element: <ResetPassword />
            },
            {
                path: '/',
                element: <Login />
            }
        ]
    },
    {
        element: <UserLayout />,
        children: [
            {
                path: USER_DASHBOARD_ROUTE,
                element: <Home/>
            },
            {
                path: '/compte',
                element: <Compte />
            },
            {
                path: '/module',
                element: <ListModules />,
            },
            {
                path: '/chapitre',
                element: <ListChapitres />,
            },
            {
                path: '/question',
                element: <ListQuestions />,
            },
            {
                path: '/examen',
                element: <CreateExamen />
            }
        ]
    },
    {
        element: <AdminLayout />,
        children: [
            {
                path: ADMIN_DASHBOARD_ROUTE + '/dashboard',
                element: <Dashboard />
            },
            {
                path: ADMIN_DASHBOARD_ROUTE + '/compte',
                element: <Compte />
            },
            {
                path: ADMIN_DASHBOARD_ROUTE + '/user',
                element: <UserList />,
            },
            {
                path: ADMIN_DASHBOARD_ROUTE + '/module',
                element: <ModulesList />,
            },
            {
                path: ADMIN_DASHBOARD_ROUTE + '/chapitre',
                element: <ChapitresList />,
            },
            {
                path: ADMIN_DASHBOARD_ROUTE + '/question',
                element: <QuestionsList />,
            },
            {
                path: ADMIN_DASHBOARD_ROUTE + '/question-non-confirme',
                element: <QuestionsListNonConfirmer />,
            },
            {
                path: ADMIN_DASHBOARD_ROUTE + '/examen',
                element: <ExamenCreate />,
            }
        ]
    },
    {
        path: '/admin',
        element: <Navigate to={ADMIN_DASHBOARD_ROUTE + '/dashboard'} replace />
    },
    {
        path: '/404',
        element: <NotFound />
    },
    {
        path: '*',
        element: <Navigate to="/404" replace />
    }
])
export default router
