import { cn } from '../../lib/utils';
import { Link, NavLink } from 'react-router-dom';
import { Icons } from '../ui/icons';
import { useUserContext } from '../../context/UserContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { usePathname } from '../../routes/hooks/use-pathname';
import { Badge } from '../ui/badge';
import { LogOutIcon, SquareUserIcon } from 'lucide-react';
import { ADMIN_DASHBOARD_ROUTE } from '../constants/data';
import { Separator } from '../ui/separator';
import logo from '../../assets/logo.png'
import { toast } from 'sonner';

const DashboardNavItem = ({ item, setOpen, NumberQuestions, toggleClose }) => {
    const path = usePathname()
    const Icon = Icons[item.icon || 'arrowRight'];

    return (
        <>
            {!toggleClose ?
                <div
                    className="space-y-3"
                    key={item.href}
                    onClickCapture={() => {
                        if (setOpen) {
                            setOpen(false);
                        }
                    }}
                >
                    <NavLink
                        className={({ isActive }) =>
                            cn(
                                'flex transform items-center rounded-full px-3 py-2 text-muted-foreground transition-colors duration-300  hover:bg-muted  hover:text-primary',
                                isActive && 'bg-muted text-primary'

                            )
                        }

                        to={item.href}
                        end
                    >
                        <Icon className="h-5 w-5" aria-hidden="true" />
                        <span className="mx-2 text-sm font-medium">{item.label}</span>
                        {item.icon == 'question_non_confirme' &&
                            <Badge className="mx-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                                {NumberQuestions}
                            </Badge>
                        }

                    </NavLink>
                </div>
                :
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <NavLink
                                to={item.href}
                                className={`flex relative h-8 w-8 py-1.5 items-center justify-center rounded-lg text-muted-foreground transition-colors 
                                hover:bg-muted  hover:text-primary ${path == item.href && 'bg-muted text-primary'} `}
                            >
                                <Icon className="h-5 w-5  " aria-hidden="true" />
                                <span className="sr-only">{item.label}</span>
                                {item.icon == 'question_non_confirme' &&
                                    <Badge className="absolute inline-flex items-center justify-center w-4 h-4 p-2 shrink-0 rounded-full -top-1 -end-1">
                                        {NumberQuestions}
                                    </Badge>
                                }
                            </NavLink>
                        </TooltipTrigger>
                        <TooltipContent side="right">{item.label}</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            }
        </>
    );
};

export default function DashboardNav({ items, setOpen, toggleClose, margin = '' }) {
    if (!items?.length) {
        return null;
    }
    const { logout, setToken, setUser, user, NumberQuestions } = useUserContext()
    const path = usePathname()
    const handleClick = async () => {
        try {
            const { data, status } = await logout()
            if (status == 200) {
                setToken('')
                setUser({})
                toast.success(data.message)
            }

        } catch (error) {
            console.log(error)
        }
    }
    return (
        <>
            <nav className={!toggleClose ? "-mx-3 space-y-6" : "flex flex-col items-center space-y-6 gap-4 px-2"}>
                {!toggleClose ?
                    <h1 to="/" className="text-xl flex items-center px-1 pb-2">
                        <img src={logo} alt="" className='h-10 ' />
                        <span className='text-3xl text-primary md:font-semibold'>ExamBuilder</span>
                    </h1> :
                    <h1 to="/" className="text-xl flex items-center px-1 pb-2">
                        <img src={logo} alt="" className='h-10 w-10 ' />

                    </h1>
                }
                {items.map((item, index) => (
                    item.label && <DashboardNavItem key={item.href} item={item} setOpen={setOpen} NumberQuestions={NumberQuestions} toggleClose={toggleClose} />
                ))}
            </nav>
            {!toggleClose ?
                <nav className='space-y-6'>
                    <Separator className={margin} />
                    <div className='-mx-3 space-y-6'>
                        <NavLink
                            className={({ isActive }) =>
                                cn(
                                    'flex w-full transform items-center rounded-full px-3 py-2 text-muted-foreground transition-colors duration-300 hover:bg-muted  hover:text-primary',
                                    isActive && 'bg-muted text-primary'

                                )
                            }
                            to={(user.role == "admin" ? ADMIN_DASHBOARD_ROUTE : '') + '/compte'}
                            end
                        >
                            <SquareUserIcon className="h-5 w-5" aria-hidden="true" />
                            <span className="mx-2 text-sm font-medium">Account</span>

                        </NavLink>
                        <button
                            className='flex w-full  transform items-center rounded-full px-3  py-2 text-muted-foreground transition-colors duration-300 hover:bg-muted  hover:text-primary'
                            onClick={handleClick}
                        >
                            <LogOutIcon className="h-5 w-5" />
                            <span className="mx-2 text-sm font-medium">Log Out</span>
                        </button>

                    </div>
                </nav>
                :
                <nav className=" flex flex-col items-center space-y-6 mt-2 px-2">
                    <Separator />
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <NavLink
                                    to={(user.role == "admin" ? ADMIN_DASHBOARD_ROUTE : '') + '/compte'}
                                    className={`flex py-1.5 h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors 
                                hover:bg-muted  hover:text-primary 
                                ${path == (user.role == "admin" ? ADMIN_DASHBOARD_ROUTE : '') + '/compte' &&
                                        'bg-muted text-primary'} `
                                    }
                                >
                                    <SquareUserIcon className="h-5 w-5 " aria-hidden="true" />
                                    <span className="sr-only">Account</span>
                                </NavLink>
                            </TooltipTrigger>
                            <TooltipContent side="right">Account</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild >
                                <button
                                    className='flex h-8 w-8  py-1.5  items-center justify-center rounded-lg text-muted-foreground transition-colors  
                                    hover:bg-muted  hover:text-primary'
                                    onClick={handleClick}
                                >
                                    <LogOutIcon className="h-5 w-5" />
                                    <span className="sr-only">Log Out</span>
                                </button>
                            </TooltipTrigger>
                            <TooltipContent side="right" sideOffset={5}>
                                Log Out
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </nav>
            }
        </>
    );
}
