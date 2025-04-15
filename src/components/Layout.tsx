
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  FileText, 
  Truck, 
  BarChart3, 
  BrainCircuit, 
  ChevronLeft, 
  Menu, 
  LogOut,
  User,
  Settings,
  Bell,
  Capsule
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface NavItem {
  title: string;
  icon: React.ReactNode;
  path: string;
  roles: string[];
}

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  // Navigation items based on roles
  const navItems: NavItem[] = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      path: "/dashboard",
      roles: ["admin", "staff", "customer"],
    },
    {
      title: "Inventory",
      icon: <Package className="h-5 w-5" />,
      path: "/inventory",
      roles: ["admin", "staff"],
    },
    {
      title: "Sales & Billing",
      icon: <ShoppingCart className="h-5 w-5" />,
      path: "/sales",
      roles: ["admin", "staff", "customer"],
    },
    {
      title: "Prescriptions",
      icon: <FileText className="h-5 w-5" />,
      path: "/prescriptions",
      roles: ["admin", "staff", "customer"],
    },
    {
      title: "Suppliers",
      icon: <Truck className="h-5 w-5" />,
      path: "/suppliers",
      roles: ["admin", "staff"],
    },
    {
      title: "Reports",
      icon: <BarChart3 className="h-5 w-5" />,
      path: "/reports",
      roles: ["admin"],
    },
    {
      title: "Analytics",
      icon: <BrainCircuit className="h-5 w-5" />,
      path: "/analytics",
      roles: ["admin"],
    },
  ];

  // Filter nav items by user role
  const filteredNavItems = navItems.filter((item) => 
    user ? item.roles.includes(user.role) : false
  );

  // Handle logout confirmation
  const handleLogoutConfirm = () => {
    logout();
    setLogoutDialogOpen(false);
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 border-b bg-card">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center ml-2">
            <Capsule className="h-6 w-6 text-halomed-500 mr-2" />
            <span className="font-bold text-xl text-halomed-700">HaloMed</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-halomed-500">
              3
            </Badge>
          </Button>
          <UserDropdown user={user} onLogout={() => setLogoutDialogOpen(true)} />
        </div>
      </header>

      {/* Sidebar */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-20 flex flex-col w-64 md:w-64 bg-card border-r 
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:relative md:translate-x-0
        `}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center">
            <Capsule className="h-6 w-6 text-halomed-500 mr-2" />
            <span className="font-bold text-xl text-halomed-700">HaloMed</span>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setSidebarOpen(false)}
            className="md:hidden"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <nav className="space-y-1">
            {filteredNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  sidebar-link
                  ${location.pathname === item.path ? "active" : ""}
                `}
              >
                {item.icon}
                <span>{item.title}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t">
          <Button
            variant="outline"
            className="w-full text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
            onClick={() => setLogoutDialogOpen(true)}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen md:ml-0">
        {/* Desktop Header */}
        <header className="hidden md:flex items-center justify-between p-4 border-b bg-card">
          <h1 className="text-xl font-semibold">
            {filteredNavItems.find(item => item.path === location.pathname)?.title || "HaloMed"}
          </h1>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-halomed-500">
                3
              </Badge>
            </Button>
            <UserDropdown user={user} onLogout={() => setLogoutDialogOpen(true)} />
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-4 md:p-6 overflow-y-auto bg-background">
          {children}
        </div>
      </main>

      {/* Logout Confirmation Dialog */}
      <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to leave?</DialogTitle>
            <DialogDescription>
              You will be logged out of the HaloMed system.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button 
              variant="outline" 
              onClick={() => setLogoutDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleLogoutConfirm}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-10 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

// User dropdown component
const UserDropdown: React.FC<{ 
  user: { name: string; email: string; role: string; avatar?: string } | null;
  onLogout: () => void;
}> = ({ user, onLogout }) => {
  if (!user) return null;
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
            <Badge className="mt-1 w-fit" variant="outline">
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </Badge>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogout} className="text-red-500 focus:text-red-500">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Layout;
