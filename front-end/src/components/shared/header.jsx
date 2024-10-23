import Heading from './heading';
import UserNav from './user-nav';
import { ModeToggle } from './theme-toggle';
import { usePathname } from '../../routes/hooks/use-pathname';

// Custom hook to find the matched path
const useMatchedPath = (pathname,navItems) => {
  const matchedPath =
    navItems.find((item) => item.href === pathname) ||
    navItems.find(
      (item) => pathname.startsWith(item.href + '/') && item.href !== '/'
    );
  return matchedPath?.title || '';
};

export default function Header({navItems}) {
  const pathname = usePathname();
  const headingText = useMatchedPath(pathname,navItems);

  return (
    <div className="flex flex-1 items-center  justify-between px-4">
      <Heading title={headingText} />
      <div className="ml-4 flex items-center md:ml-6 space-x-1">
        <UserNav />
        <ModeToggle />
      </div>
    </div>
  );
}