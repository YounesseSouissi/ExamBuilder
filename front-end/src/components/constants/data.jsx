export const USER_DASHBOARD_ROUTE = '/home'
export const ADMIN_DASHBOARD_ROUTE = '/admin'
export const LOGIN_ROUTE = '/login'
export const navUserItems= [
    {
        title: 'Home',
        href: USER_DASHBOARD_ROUTE,
        icon: 'dashboard',
        label: 'Home'
    },
    {
        title: 'Compte',
        href:'/compte',
    },
    {
        title: 'Modules',
        href:'/module',
        icon: 'module',
        label: 'Module'
    },
    {
        title: 'Chapitres',
        href:'/chapitre',
        icon: 'chapitre',
        label: 'Chapitre'
    },
    {
        title: 'Questions',
        href:'/question',
        icon: 'question',
        label: 'Question'
    },
    {
        title: 'Examens',
        href:'/examen',
        icon: 'examen',
        label: 'Examen'
    }
];
export const navAdminItems= [
    {
        title: 'Dashboard',
        href:`${ADMIN_DASHBOARD_ROUTE}/dashboard`,
        icon: 'dashboard',
        label: 'Dashboard'
    },
    {
        title: 'Compte',
        href:`${ADMIN_DASHBOARD_ROUTE}/compte`,
    },
    {
        title: 'Users',
        href:`${ADMIN_DASHBOARD_ROUTE}/user`,
        icon: 'user',
        label: 'User'
    },
    {
        title: 'Modules',
        href:`${ADMIN_DASHBOARD_ROUTE}/module`,
        icon: 'module',
        label: 'Module'
    },
    {
        title: 'Chapitres',
        href:`${ADMIN_DASHBOARD_ROUTE}/chapitre`,
        icon: 'chapitre',
        label: 'Chapitre'
    },
    {
        title: 'Questions',
        href:`${ADMIN_DASHBOARD_ROUTE}/question`,
        icon: 'question',
        label: 'Question'
    },
    {
        title: 'Questions Non Confirme',
        href:`${ADMIN_DASHBOARD_ROUTE}/question-non-confirme`,
        icon: 'question_non_confirme',
        label: 'Questions Non Confirme'
    },
    {
        title: 'Examens',
        href:`${ADMIN_DASHBOARD_ROUTE}/examen`,
        icon: 'examen',
        label: 'Examen'
    }
];