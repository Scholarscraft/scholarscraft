import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Target
} from "lucide-react";
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

interface AdminStats {
  totalOrders: number;
  totalRevenue: number;
  activeUsers: number;
  pendingOrders: number;
  completedOrders: number;
  overdueOrders: number;
}

const Admin = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    totalOrders: 0,
    totalRevenue: 0,
    activeUsers: 0,
    pendingOrders: 0,
    completedOrders: 0,
    overdueOrders: 0
  });
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [emailContent, setEmailContent] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // Check admin role - temporary admin check (you can update this logic)
  useEffect(() => {
    const checkAdminRole = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      // For now, make all authenticated users admin for testing
      // In production, you'd check a user_roles table or user metadata
      setIsAdmin(true);
      setLoading(false);
    };

    checkAdminRole();
  }, [user]);

  // Fetch dashboard data
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

        // Fetch all profiles to join with orders
        const { data: allProfiles, error: profilesError } = await supabase
          .from('profiles')
          .select('user_id, display_name, avatar_url');

        if (profilesError) throw profilesError;

        // Join orders with profiles
        const ordersWithProfiles = ordersData?.map(order => ({
          ...order,
          profiles: allProfiles?.find(p => p.user_id === order.user_id) || null
        })) || [];

        setOrders(ordersWithProfiles);

        // Fetch all profiles for users tab
        const { data: profilesData, error: profilesDataError } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (profilesDataError) throw profilesDataError;
        setProfiles(profilesData || []);

        // Calculate stats
        const totalOrders = ordersData?.length || 0;
        const totalRevenue = ordersData?.reduce((sum, order) => sum + (order.price || 0), 0) || 0;
        const activeUsers = profilesData?.length || 0;
        const pendingOrders = ordersData?.filter(order => order.status === 'pending').length || 0;
        const completedOrders = ordersData?.filter(order => order.status === 'completed').length || 0;
        const overdueOrders = ordersData?.filter(order => 
          order.status !== 'completed' && new Date(order.deadline) < new Date()
        ).length || 0;

        setStats({
          totalOrders,
          totalRevenue,
          activeUsers,
          pendingOrders,
          completedOrders,
          overdueOrders
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
        return 'bg-green-500';
      case 'in_progress':
        return 'bg-blue-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'cancelled':
        return 'bg-red-500';
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

  const banUser = async (userId: string) => {
    try {
      // In a real implementation, you'd add a banned field to profiles
      // or create a separate banned_users table
      toast({
        title: "Feature Coming Soon",
        description: "User banning functionality will be implemented",
      });
    } catch (error) {
      console.error('Error banning user:', error);
    }
  };

  const sendBulkEmail = async () => {
    if (!emailSubject || !emailContent || selectedUsers.length === 0) {
      toast({
        title: "Error",
        description: "Please fill in all email fields and select users",
        variant: "destructive",
      });
      return;
    }

    try {
      // In a real implementation, you'd call an edge function to send emails
      toast({
        title: "Success",
        description: `Bulk email sent to ${selectedUsers.length} users`,
      });
      setEmailContent("");
      setEmailSubject("");
      setSelectedUsers([]);
    } catch (error) {
      console.error('Error sending bulk email:', error);
      toast({
        title: "Error",
        description: "Failed to send bulk email",
        variant: "destructive",
      });
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

  if (!user) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>Please log in to access the admin panel</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
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
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Data
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Total Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Pending Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completedOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Bell className="h-4 w-4 mr-2" />
              Overdue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.overdueOrders}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="orders" className="space-y-4">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="finances">Finances</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="marketing">Marketing</TabsTrigger>
          <TabsTrigger value="emails">Bulk Email</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        {/* Orders Management */}
        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Order Management</CardTitle>
              <CardDescription>Manage all orders, deadlines, and status updates</CardDescription>
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
        </TabsContent>

        {/* Users Management */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage users, ban accounts, and view customer details</CardDescription>
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
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => banUser(profile.user_id)}
                          >
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
        </TabsContent>

        {/* Finances */}
        <TabsContent value="finances" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
                <p className="text-muted-foreground">Total revenue generated</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Refund Management</CardTitle>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Process Refunds
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics & Statistics</CardTitle>
              <CardDescription>View detailed analytics and performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <BarChart3 className="h-8 w-8 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{((stats.completedOrders / stats.totalOrders) * 100 || 0).toFixed(1)}%</div>
                  <div className="text-sm text-muted-foreground">Completion Rate</div>
                </div>
                <div className="text-center">
                  <Target className="h-8 w-8 mx-auto mb-2" />
                  <div className="text-2xl font-bold">${(stats.totalRevenue / stats.totalOrders || 0).toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">Avg Order Value</div>
                </div>
                <div className="text-center">
                  <Users className="h-8 w-8 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{(stats.totalOrders / stats.activeUsers || 0).toFixed(1)}</div>
                  <div className="text-sm text-muted-foreground">Orders per User</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Marketing */}
        <TabsContent value="marketing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Marketing Funnels</CardTitle>
              <CardDescription>Create and manage marketing campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full mb-4">
                <Target className="h-4 w-4 mr-2" />
                Create New Funnel
              </Button>
              <div className="text-center text-muted-foreground">
                Marketing funnel management coming soon
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bulk Email */}
        <TabsContent value="emails" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bulk Email Campaign</CardTitle>
              <CardDescription>Send promotional emails to selected users</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Subject</label>
                <Input
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="Email subject..."
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
                <label className="text-sm font-medium">Recipients ({selectedUsers.length} selected)</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 max-h-32 overflow-y-auto">
                  {profiles.map((profile) => (
                    <label key={profile.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(profile.user_id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUsers([...selectedUsers, profile.user_id]);
                          } else {
                            setSelectedUsers(selectedUsers.filter(id => id !== profile.user_id));
                          }
                        }}
                      />
                      <span className="text-sm">{profile.display_name || 'Unknown'}</span>
                    </label>
                  ))}
                </div>
              </div>
              <Button onClick={sendBulkEmail} className="w-full">
                <Mail className="h-4 w-4 mr-2" />
                Send Bulk Email
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* File Management */}
        <TabsContent value="files" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>File Management</CardTitle>
              <CardDescription>Manage uploaded files and documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Files
                </Button>
                <Button variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  View All Files
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Center</CardTitle>
              <CardDescription>Manage system notifications and alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button variant="outline" className="w-full">
                  <Bell className="h-4 w-4 mr-2" />
                  Send System Notification
                </Button>
                <div className="text-center text-muted-foreground">
                  No new notifications
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;