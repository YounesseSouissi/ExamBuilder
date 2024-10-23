import { toast } from 'sonner';
import { useUserContext } from '../../context/UserContext';
import { Avatar, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '../ui/dropdown-menu';
import { Link } from 'react-router-dom'
import { ADMIN_DASHBOARD_ROUTE, USER_DASHBOARD_ROUTE } from '../constants/data';
export default function UserNav() {
  const { logout, setToken, user, setUser } = useUserContext()
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-14 w-14 rounded-full">
          <Avatar className="h-10 w-10 border-black border-2">
            <AvatarImage
              src={user.photo ?
                'import.meta.env.VITE_BASE_URL_BACK_END_API/storage/' + user.photo
                :'https://png.pngtree.com/png-clipart/20230927/original/pngtree-man-avatar-image-for-profile-png-image_13001882.png'
              }
              alt={''}
            />
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.firstname} {user.lastname}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link to={(user.role == "admin" ? ADMIN_DASHBOARD_ROUTE : USER_DASHBOARD_ROUTE) + '/compte'}>
            <DropdownMenuItem>
              Account
              <DropdownMenuShortcut>⇧⌘A</DropdownMenuShortcut>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleClick}>
          Log out
          <DropdownMenuShortcut>⇧⌘L</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}