import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard,
  ShoppingCart, 
  Users, 
  DollarSign, 
  BarChart3, 
  Target,
  Mail, 
  FileText, 
  Bell,
  MessageCircle,
  Settings
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const sidebarItems = [
  { 
    id: "dashboard", 
    title: "Dashboard", 
    icon: LayoutDashboard,
    description: "Overview & Stats"
  },
  { 
    id: "orders", 
    title: "Orders", 
    icon: ShoppingCart,
    description: "Manage Orders"
  },
  { 
    id: "users", 
    title: "Users", 
    icon: Users,
    description: "User Management"
  },
  { 
    id: "finances", 
    title: "Finances", 
    icon: DollarSign,
    description: "Revenue & Payments"
  },
  { 
    id: "analytics", 
    title: "Analytics", 
    icon: BarChart3,
    description: "Performance Data"
  },
  { 
    id: "marketing", 
    title: "Marketing", 
    icon: Target,
    description: "Campaigns & Funnels"
  },
  { 
    id: "emails", 
    title: "Bulk Email", 
    icon: Mail,
    description: "Email Marketing"
  },
  { 
    id: "support", 
    title: "Support Tickets", 
    icon: MessageCircle,
    description: "Customer Support"
  },
  { 
    id: "files", 
    title: "Files", 
    icon: FileText,
    description: "File Management"
  },
  { 
    id: "notifications", 
    title: "Notifications", 
    icon: Bell,
    description: "System Alerts"
  },
  { 
    id: "settings", 
    title: "Settings", 
    icon: Settings,
    description: "Admin Settings"
  }
];

export function AdminSidebar({ activeTab, onTabChange }: AdminSidebarProps) {
  const sidebar = useSidebar();
  const collapsed = sidebar.state === "collapsed";

  return (
    <Sidebar className="border-r border-border">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm font-semibold text-muted-foreground">
            Admin Panel
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    onClick={() => onTabChange(item.id)}
                    isActive={activeTab === item.id}
                    className="cursor-pointer"
                  >
                    <item.icon className="h-4 w-4" />
                    {!collapsed && (
                      <div className="flex flex-col items-start">
                        <span className="font-medium">{item.title}</span>
                        <span className="text-xs text-muted-foreground">{item.description}</span>
                      </div>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}