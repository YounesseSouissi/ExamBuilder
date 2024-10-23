import { ScrollArea, ScrollBar } from '../ui/scroll-area';
import DashboardNav from './dashboard-nav';
export default function Sidebar({ navItems, toggleClose }) {
  return (
    <>
      <ScrollArea className="h-[100dvh] ">
        {!toggleClose ?
          <aside className="hidden h-screen w-64 flex-col overflow-y-hidden overflow-x-hidden rounded-tr-[90px] border-r   pb-8 pl-5 dark:bg-background lg:flex ease-in-out duration-300 ">
            <div className="mt-6 flex flex-1 flex-col justify-between">
              <DashboardNav items={navItems} toggleClose={toggleClose} margin={'-mx-3'} />
            </div>
          </aside>
          :
          <aside className="inset-y-0 h-screen left-0 z-10 hidden w-16  pb-8 flex-col border-r dark:bg-background lg:flex  ease-in-out duration-300 ">
            <div className="mt-6 flex flex-1 flex-col justify-between">
              <DashboardNav items={navItems} toggleClose={toggleClose} />
            </div>
          </aside>
        }
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </>
  );
}