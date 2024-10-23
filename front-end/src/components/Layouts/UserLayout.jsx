import { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { LOGIN_ROUTE } from '../../components/constants/data'
import { useUserContext } from '../../context/UserContext'
import { AlignLeft, AlignRight, MenuIcon } from 'lucide-react';
import MobileSidebar from '../shared/mobile-sidebar';
import Sidebar from '../shared/sidebar';
import Header from '../shared/header';
import UserApi from '../../service/UserApi';
import { navUserItems } from '../constants/data';
import { redirectToDashboard } from '../../routes';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';
export default function UserLayout() {
    const { token, setUser, user } = useUserContext()
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [toggleClose, setToggleClose] = useState(false);
    const navigate = useNavigate()
    useEffect(() => {
        if (token) {
            UserApi.getUser()
                .then(({ data }) => {
                    setUser(data)
                    if (data.role != 'user') {
                        navigate(redirectToDashboard(data.role))
                    }
                }
                )
            window.addEventListener('storage', (event) => {
                if (event.key === 'token' && !event.newValue) {
                    navigate(LOGIN_ROUTE)
                }
            });
        }
        else {
            navigate(LOGIN_ROUTE)
        }
    }, [token])
    return (
        <>
            <div className="flex h-screen overflow-hidden bg-muted/30 ">
                <MobileSidebar
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                    navItems={navUserItems}
                />
                <Sidebar navItems={navUserItems} toggleClose={toggleClose} />
                <div className="flex w-0 flex-1 flex-col overflow-hidden ">
                    <div className="relative z-10 flex h-20 flex-shrink-0 border-b shadow">
                        <button
                            className="pl-4 text-gray-500 focus:outline-none lg:hidden"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <span className="sr-only">Open sidebar</span>
                            <MenuIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                        <button
                            className="pl-4 text-gray-500 focus:outline-none hidden lg:block"
                            onClick={() => setToggleClose(!toggleClose)}
                        >
                            <span className="sr-only">Open sidebar</span>
                            {!toggleClose ?
                                <AlignRight className="h-6 w-6" aria-hidden="true" />
                                :
                                <AlignLeft className="h-6 w-6" aria-hidden="true" />
                            }
                        </button>
                        <Header navItems={navUserItems} />
                    </div>
                    <main className="relative flex-1 bg-background focus:outline-none ">
                        <ScrollArea className="h-[80dvh] px-6  ">
                            <Outlet />
                            <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                    </main>
                </div>
            </div>
        </>
    )
}
