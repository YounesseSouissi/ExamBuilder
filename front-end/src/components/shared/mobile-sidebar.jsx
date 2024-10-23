import { Sheet, SheetContent } from '../ui/sheet';
import DashboardNav from './dashboard-nav';
export default function MobileSidebar({
    setSidebarOpen,
    sidebarOpen,
    navItems
}) {
    return (
        <>
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetContent side="left" className="bg-background !px-0 flex  flex-col ">
            
                            <div className="space-y-4 py-4  px-5 flex flex-1  flex-col justify-between">
                                <DashboardNav items={navItems} setOpen={setSidebarOpen} />
                            </div>
                </SheetContent>
            </Sheet>

        </>
    );
}