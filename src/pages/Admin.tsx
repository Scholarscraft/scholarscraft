import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  Mail, 
  FileText, 
  Calendar,
  Ban,
  RefreshCw,
  Download,
  Upload,
  Bell,
  BarChart3,
  Target,
  LayoutDashboard,
  Settings,
  MessageSquare,
  Headphones,
  AlertCircle,
  CheckCircle,
  Clock,
  Send,
  UserCheck,
  Eye
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from "date-fns";

interface Order {
  id: string;
  order_id: string;
  topic: string;
  status: string;
  price: number;
  deadline: string;
  created_at: string;
  user_id: string;
  profiles?: {
    display_name: string;
    avatar_url: string;
  };
}

interface Profile {
  id: string;
  user_id: string;
  display_name: string;
  avatar_url: string;
  created_at: string;
}

interface SupportTicket {
  id: string;
  user_id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
  profiles?: {
    display_name: string;
  };
}

interface AdminStats {
  totalOrders: number;
  totalRevenue: number;
  activeUsers: number;
  pendingOrders: number;
  completedOrders: number;
  overdueOrders: number;
  openTickets: number;
  totalTickets: number;
}

// Mock data for analytics
const mockTrafficData = [
  { date: 'Jan 1', visitors: 1200, pageViews: 3400 },
  { date: 'Jan 2', visitors: 1100, pageViews: 3200 },
  { date: 'Jan 3', visitors: 1300, pageViews: 3800 },
  { date: 'Jan 4', visitors: 1500, pageViews: 4200 },
  { date: 'Jan 5', visitors: 1400, pageViews: 4000 },
  { date: 'Jan 6', visitors: 1600, pageViews: 4500 },
  { date: 'Jan 7', visitors: 1800, pageViews: 5000 },
  { date: 'Jan 8', visitors: 1700, pageViews: 4800 },
  { date: 'Jan 9', visitors: 1900, pageViews: 5200 },
  { date: 'Jan 10', visitors: 2000, pageViews: 5500 },
  { date: 'Jan 11', visitors: 1850, pageViews: 5100 },
  { date: 'Jan 12', visitors: 1950, pageViews: 5300 },
  { date: 'Jan 13', visitors: 2100, pageViews: 5800 },
  { date: 'Jan 14', visitors: 2200, pageViews: 6000 },
  { date: 'Jan 15', visitors: 2150, pageViews: 5900 },
];

const Admin = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [orders, setOrders] = useState<Order[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    totalOrders: 0,
    totalRevenue: 0,
    activeUsers: 0,
    pendingOrders: 0,
    completedOrders: 0,
    overdueOrders: 0,
    openTickets: 0,
    totalTickets: 0
  });
  const [emailContent, setEmailContent] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // Sidebar menu items
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "orders", label: "Orders", icon: ShoppingCart },
    { id: "users", label: "Users", icon: Users },
    { id: "support", label: "Support Tickets", icon: Headphones },
    { id: "finances", label: "Finances", icon: DollarSign },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "marketing", label: "Marketing", icon: Target },
    { id: "emails", label: "Bulk Email", icon: Mail },
    { id: "files", label: "Files", icon: FileText },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  // Check admin role
  useEffect(() => {
    const checkAdminRole = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      setIsAdmin(true);
      setLoading(false);
    };
    checkAdminRole();
  }, [user]);

  // Fetch all data
  useEffect(() => {
    if (!isAdmin) return;

    const fetchDashboardData = async () => {
      try {
        // Fetch orders
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });

        if (ordersError) throw ordersError;

        // Fetch profiles
        const { data: allProfiles, error: profilesError } = await supabase
          .from('profiles')
          .select('user_id, display_name, avatar_url, id, created_at');

        if (profilesError) throw profilesError;

        // Fetch support tickets
        const { data: ticketsData, error: ticketsError } = await supabase
          .from('support_tickets')
          .select('*')
          .order('created_at', { ascending: false });

        if (ticketsError) throw ticketsError;

        // Join orders with profiles
        const ordersWithProfiles = ordersData?.map(order => ({
          ...order,
          profiles: allProfiles?.find(p => p.user_id === order.user_id) || null
        })) || [];

        // Join tickets with profiles
        const ticketsWithProfiles = ticketsData?.map(ticket => ({
          ...ticket,
          profiles: allProfiles?.find(p => p.user_id === ticket.user_id) || null
        })) || [];

        setOrders(ordersWithProfiles);
        setProfiles(allProfiles || []);
        setSupportTickets(ticketsWithProfiles);

        // Calculate stats
        const totalOrders = ordersData?.length || 0;
        const totalRevenue = ordersData?.reduce((sum, order) => sum + (order.price || 0), 0) || 0;
        const activeUsers = allProfiles?.length || 0;
        const pendingOrders = ordersData?.filter(order => order.status === 'pending').length || 0;
        const completedOrders = ordersData?.filter(order => order.status === 'completed').length || 0;
        const overdueOrders = ordersData?.filter(order => 
          order.status !== 'completed' && new Date(order.deadline) < new Date()
        ).length || 0;
        const openTickets = ticketsData?.filter(ticket => ticket.status === 'open').length || 0;
        const totalTickets = ticketsData?.length || 0;

        setStats({
          totalOrders,
          totalRevenue,
          activeUsers,
          pendingOrders,
          completedOrders,
          overdueOrders,
          openTickets,
          totalTickets
        });

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast({
          title: "Error",
          description: "Failed to fetch dashboard data",
          variant: "destructive",
        });
      }
    };

    fetchDashboardData();
  }, [isAdmin, toast]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'closed':
        return 'bg-green-500';
      case 'in_progress':
        return 'bg-blue-500';
      case 'pending':
      case 'open':
        return 'bg-yellow-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));

      toast({
        title: "Success",
        description: "Order status updated successfully",
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  const updateTicketStatus = async (ticketId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('support_tickets')
        .update({ status: newStatus })
        .eq('id', ticketId);

      if (error) throw error;

      setSupportTickets(supportTickets.map(ticket => 
        ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
      ));

      toast({
        title: "Success",
        description: "Ticket status updated successfully",
      });
    } catch (error) {
      console.error('Error updating ticket status:', error);
      toast({
        title: "Error",
        description: "Failed to update ticket status",
        variant: "destructive",
      });
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Dashboard Overview</h2>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Data
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Total Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <div className="text-sm text-muted-foreground">
              {stats.pendingOrders} pending
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <DollarSign className="h-4 w-4 mr-2" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
            <div className="text-sm text-success">
              +12% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Active Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeUsers}</div>
            <div className="text-sm text-muted-foreground">
              Registered users
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Headphones className="h-4 w-4 mr-2" />
              Support Tickets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.openTickets}</div>
            <div className="text-sm text-muted-foreground">
              {stats.totalTickets} total
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {orders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{order.order_id}</div>
                    <div className="text-sm text-muted-foreground">{order.topic}</div>
                  </div>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Support Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {supportTickets.slice(0, 5).map((ticket) => (
                <div key={ticket.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{ticket.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {ticket.profiles?.display_name || 'Unknown User'}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getPriorityColor(ticket.priority)}>
                      {ticket.priority}
                    </Badge>
                    <Badge className={getStatusColor(ticket.status)}>
                      {ticket.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Order Management</h2>
      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
          <CardDescription>Manage orders, deadlines, and status updates</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Topic</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.order_id}</TableCell>
                  <TableCell>{order.profiles?.display_name || 'Unknown'}</TableCell>
                  <TableCell>{order.topic}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>${order.price?.toFixed(2) || '0.00'}</TableCell>
                  <TableCell>{format(new Date(order.deadline), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>
                    <Select onValueChange={(value) => updateOrderStatus(order.id, value)}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Update" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  const renderSupportTickets = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Support Ticket Management</h2>
      <Card>
        <CardHeader>
          <CardTitle>All Support Tickets</CardTitle>
          <CardDescription>Manage customer support requests and issues</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {supportTickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-medium">{ticket.title}</TableCell>
                  <TableCell>{ticket.profiles?.display_name || 'Unknown'}</TableCell>
                  <TableCell>{ticket.category}</TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(ticket.priority)}>
                      {ticket.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(ticket.status)}>
                      {ticket.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{format(new Date(ticket.created_at), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>
                    <Select onValueChange={(value) => updateTicketStatus(ticket.id, value)}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Update" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">User Management</h2>
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>Manage users and their accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>User ID</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {profiles.map((profile) => {
                const userOrders = orders.filter(order => order.user_id === profile.user_id);
                return (
                  <TableRow key={profile.id}>
                    <TableCell className="font-medium">{profile.display_name || 'Unknown'}</TableCell>
                    <TableCell className="font-mono text-sm">{profile.user_id}</TableCell>
                    <TableCell>{format(new Date(profile.created_at), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>{userOrders.length}</TableCell>
                    <TableCell>
                      <Button variant="destructive" size="sm">
                        <Ban className="h-4 w-4 mr-1" />
                        Ban
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  const renderBulkEmail = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Bulk Email</h2>
      <Card>
        <CardHeader>
          <CardTitle>Send Promotional Emails</CardTitle>
          <CardDescription>Create and send bulk emails to selected users</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Subject</label>
            <Input
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              placeholder="Email subject line"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Content</label>
            <Textarea
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
              placeholder="Email content..."
              rows={6}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Select Recipients</label>
            <div className="text-sm text-muted-foreground mb-2">
              Selected: {selectedUsers.length} users
            </div>
            <Button variant="outline" size="sm">
              Select All Users
            </Button>
          </div>
          <Button onClick={() => toast({ title: "Feature Coming Soon", description: "Bulk email functionality will be implemented" })}>
            <Send className="h-4 w-4 mr-2" />
            Send Email
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-8">
      {/* Core Metrics */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Core Metrics & Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Visitors</p>
                  <p className="text-3xl font-bold">24,567</p>
                  <p className="text-sm text-green-600">+12.3% from last month</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Unique Visitors</p>
                  <p className="text-3xl font-bold">18,294</p>
                  <p className="text-sm text-green-600">+8.7% from last month</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <UserCheck className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Page Views</p>
                  <p className="text-3xl font-bold">89,432</p>
                  <p className="text-sm text-green-600">+15.2% from last month</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                  <Eye className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Sessions</p>
                  <p className="text-3xl font-bold">31,205</p>
                  <p className="text-sm text-red-600">-2.1% from last month</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Traffic Overview Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Traffic Overview</CardTitle>
          <CardDescription>Daily visitors over the last 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockTrafficData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="visitors" stroke="hsl(var(--primary))" strokeWidth={2} />
                <Line type="monotone" dataKey="pageViews" stroke="hsl(var(--accent))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Traffic Sources & Geographic Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic Sources */}
        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
            <CardDescription>Where your visitors are coming from</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center space-x-3">
                  <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                  <span className="font-medium">Direct Traffic</span>
                </div>
                <div className="text-right">
                  <p className="font-bold">8,456</p>
                  <p className="text-sm text-muted-foreground">34.4%</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center space-x-3">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <span className="font-medium">Organic Search</span>
                </div>
                <div className="text-right">
                  <p className="font-bold">6,789</p>
                  <p className="text-sm text-muted-foreground">27.6%</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center space-x-3">
                  <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                  <span className="font-medium">Social Media</span>
                </div>
                <div className="text-right">
                  <p className="font-bold">4,123</p>
                  <p className="text-sm text-muted-foreground">16.8%</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center space-x-3">
                  <div className="h-3 w-3 rounded-full bg-orange-500"></div>
                  <span className="font-medium">Referrals</span>
                </div>
                <div className="text-right">
                  <p className="font-bold">3,234</p>
                  <p className="text-sm text-muted-foreground">13.2%</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center space-x-3">
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  <span className="font-medium">Paid Ads</span>
                </div>
                <div className="text-right">
                  <p className="font-bold">1,965</p>
                  <p className="text-sm text-muted-foreground">8.0%</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Geographic Data */}
        <Card>
          <CardHeader>
            <CardTitle>Geographic Data</CardTitle>
            <CardDescription>Visitor locations by country</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🇺🇸</span>
                  <span className="font-medium">United States</span>
                </div>
                <div className="text-right">
                  <p className="font-bold">12,456</p>
                  <p className="text-sm text-muted-foreground">50.7%</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🇬🇧</span>
                  <span className="font-medium">United Kingdom</span>
                </div>
                <div className="text-right">
                  <p className="font-bold">3,789</p>
                  <p className="text-sm text-muted-foreground">15.4%</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🇨🇦</span>
                  <span className="font-medium">Canada</span>
                </div>
                <div className="text-right">
                  <p className="font-bold">2,134</p>
                  <p className="text-sm text-muted-foreground">8.7%</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🇦🇺</span>
                  <span className="font-medium">Australia</span>
                </div>
                <div className="text-right">
                  <p className="font-bold">1,876</p>
                  <p className="text-sm text-muted-foreground">7.6%</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🇩🇪</span>
                  <span className="font-medium">Germany</span>
                </div>
                <div className="text-right">
                  <p className="font-bold">1,432</p>
                  <p className="text-sm text-muted-foreground">5.8%</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🌍</span>
                  <span className="font-medium">Others</span>
                </div>
                <div className="text-right">
                  <p className="font-bold">2,880</p>
                  <p className="text-sm text-muted-foreground">11.7%</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return renderDashboard();
      case "orders":
        return renderOrders();
      case "support":
        return renderSupportTickets();
      case "users":
        return renderUsers();
      case "emails":
        return renderBulkEmail();
      case "analytics":
        return renderAnalytics();
      default:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">{menuItems.find(item => item.id === activeTab)?.label}</h2>
            <Card>
              <CardHeader>
                <CardTitle>Coming Soon</CardTitle>
                <CardDescription>This feature is under development</CardDescription>
              </CardHeader>
            </Card>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <RefreshCw className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You don't have admin privileges to access this page</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 bg-card border-r border-border">
        <div className="p-6">
          <h1 className="text-xl font-bold text-primary mb-6">Admin Panel</h1>
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === item.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default Admin;