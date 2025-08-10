import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CalendarDays, Clock, DollarSign, FileText, Settings, User, Upload, Download, CheckCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Navigate } from "react-router-dom";

interface Order {
  id: string;
  order_id: string;
  topic: string;
  subject: string;
  service: string;
  academic_level: string;
  pages: number;
  deadline: string;
  price: number;
  status: string;
  instructions: string;
  created_at: string;
  updated_at: string;
}

interface Profile {
  id: string;
  user_id: string;
  display_name: string;
  avatar_url: string;
  bio: string;
  created_at: string;
  updated_at: string;
}

interface Deliverable {
  id: string;
  title: string;
  file_name: string;
  file_url: string;
  file_size: number;
  order_id: string | null;
  status: string;
  delivery_notes: string | null;
  uploaded_by: string;
  created_at: string;
  updated_at: string;
  uploader?: {
    display_name: string;
  } | null;
}

const Dashboard = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingDeliverables, setLoadingDeliverables] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  // Redirect if not authenticated
  if (!loading && !user) {
    return <Navigate to="/auth" replace />;
  }

  useEffect(() => {
    if (user) {
      fetchOrders();
      fetchDeliverables();
      fetchProfile();
      setupRealtimeSubscriptions();
    }
  }, [user]);

  const setupRealtimeSubscriptions = () => {
    if (!user) return;

    // Real-time subscription for deliverables
    const deliverablesChannel = supabase
      .channel('deliverables-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'deliverables',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Deliverable change received:', payload);
          
          if (payload.eventType === 'INSERT') {
            toast({
              title: "New Deliverable Available!",
              description: `${payload.new.title} has been uploaded for you.`,
            });
            fetchDeliverables();
          } else if (payload.eventType === 'UPDATE') {
            fetchDeliverables();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(deliverablesChannel);
    };
  };

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive",
      });
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchDeliverables = async () => {
    try {
      const { data, error } = await supabase
        .from('deliverables')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Fetch uploader info separately to avoid complex join issues
      const deliverablesWithUploaders = await Promise.all(
        (data || []).map(async (deliverable) => {
          const { data: uploaderData } = await supabase
            .from('profiles')
            .select('display_name')
            .eq('user_id', deliverable.uploaded_by)
            .maybeSingle();
          
          return {
            ...deliverable,
            uploader: uploaderData
          };
        })
      );
      
      setDeliverables(deliverablesWithUploaders);
    } catch (error) {
      console.error('Error fetching deliverables:', error);
      toast({
        title: "Error",
        description: "Failed to load deliverables",
        variant: "destructive",
      });
    } finally {
      setLoadingDeliverables(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setProfile(data);
        setDisplayName(data.display_name || "");
        setBio(data.bio || "");
        setAvatarUrl(data.avatar_url || "");
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive",
      });
    } finally {
      setLoadingProfile(false);
    }
  };

  const updateProfile = async () => {
    try {
      const profileData = {
        user_id: user?.id,
        display_name: displayName,
        bio: bio,
        avatar_url: avatarUrl,
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(profileData, { onConflict: 'user_id' });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      
      fetchProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const changePassword = async () => {
    if (!newPassword || !confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all password fields",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    setChangingPassword(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Password updated successfully",
      });

      // Clear password fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      console.error('Error changing password:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update password",
        variant: "destructive",
      });
    } finally {
      setChangingPassword(false);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({
        title: "Error", 
        description: "Image must be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    setUploadingAvatar(true);

    try {
      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Update avatar URL
      setAvatarUrl(data.publicUrl);

      toast({
        title: "Success",
        description: "Avatar uploaded successfully",
      });

      // Reset file input
      event.target.value = '';
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Error",
        description: "Failed to upload avatar",
        variant: "destructive",
      });
    } finally {
      setUploadingAvatar(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-accent/20 text-accent-foreground border-accent/30';
      case 'in-progress':
        return 'bg-primary/20 text-primary-foreground border-primary/30';
      case 'completed':
        return 'bg-secondary text-secondary-foreground border-border';
      case 'delivered':
        return 'bg-muted text-muted-foreground border-border';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getDaysUntilDeadline = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const downloadFile = async (fileUrl: string, fileName: string, deliverableId: string) => {
    try {
      // Update status to indicate user accessed the file
      await supabase
        .from('deliverables')
        .update({ status: 'downloaded' })
        .eq('id', deliverableId);

      // Download the file
      const { data, error } = await supabase.storage
        .from('deliverables')
        .download(fileUrl.split('/').pop() || '');

      if (error) throw error;

      // Create download link
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // Refresh deliverables to show updated status
      fetchDeliverables();

      toast({
        title: "Download Started",
        description: `${fileName} is downloading...`,
      });
    } catch (error) {
      console.error('Error downloading file:', error);
      toast({
        title: "Download Failed",
        description: "Failed to download the file. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const getDeliverableStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-accent/20 text-accent-foreground border-accent/30';
      case 'delivered':
        return 'bg-secondary text-secondary-foreground border-border';
      case 'downloaded':
        return 'bg-muted text-muted-foreground border-border';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  if (loading || loadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Offers Banner */}
        <div className="mb-8 bg-gradient-to-r from-primary to-primary-light rounded-xl p-8 text-primary-foreground shadow-lg border border-primary/20 animate-fade-in hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
          <div className="text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-4 animate-scale-in">🎯 Special Course Offer!</h3>
            <p className="text-lg md:text-xl opacity-95 leading-relaxed animate-bounce-gentle">
              Order assignments for the whole course at once, save up <span className="font-bold text-accent-light">25%</span>, and enjoy your free time.
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Manage your orders and profile</p>
          </div>
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={avatarUrl} alt={displayName || "User"} />
              <AvatarFallback>
                {displayName ? displayName.charAt(0).toUpperCase() : <User className="h-4 w-4" />}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-foreground">{displayName || "User"}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Completed Work
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{orders.length}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {orders.filter(order => order.status === 'in-progress').length}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completed</CardTitle>
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {orders.filter(order => ['completed', 'delivered'].includes(order.status)).length}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${orders.reduce((sum, order) => sum + (order.price || 0), 0).toFixed(2)}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Your Orders</CardTitle>
                <CardDescription>Track the progress of your academic writing orders</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingOrders ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No orders found. Start by requesting a quote!</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order ID</TableHead>
                          <TableHead>Topic</TableHead>
                          <TableHead>Subject</TableHead>
                          <TableHead>Pages</TableHead>
                          <TableHead>Deadline</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Price</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.map((order) => {
                          const daysLeft = getDaysUntilDeadline(order.deadline);
                          return (
                            <TableRow key={order.id}>
                              <TableCell className="font-medium">{order.order_id}</TableCell>
                              <TableCell className="max-w-[200px] truncate" title={order.topic}>
                                {order.topic}
                              </TableCell>
                              <TableCell>{order.subject}</TableCell>
                              <TableCell>{order.pages}</TableCell>
                              <TableCell>
                                <div className="flex flex-col">
                                  <span>{format(new Date(order.deadline), 'MMM dd, yyyy')}</span>
                                  <span className={`text-xs ${daysLeft < 0 ? 'text-destructive' : daysLeft <= 3 ? 'text-accent' : 'text-muted-foreground'}`}>
                                    {daysLeft < 0 ? `${Math.abs(daysLeft)} days overdue` : 
                                     daysLeft === 0 ? 'Due today' : 
                                     `${daysLeft} days left`}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge className={getStatusColor(order.status)}>
                                  {order.status.replace('-', ' ')}
                                </Badge>
                              </TableCell>
                              <TableCell>${order.price?.toFixed(2) || '0.00'}</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="completed" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Deliverables</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{deliverables.length}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">New Deliverables</CardTitle>
                  <Download className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {deliverables.filter(d => d.status === 'pending').length}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Downloaded</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {deliverables.filter(d => d.status === 'downloaded').length}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Your Deliverables</CardTitle>
                <CardDescription>Download your completed assignments and papers</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingDeliverables ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  </div>
                ) : deliverables.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No deliverables available yet.</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Completed work will appear here when ready for download.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Order ID</TableHead>
                          <TableHead>File Info</TableHead>
                          <TableHead>Uploaded By</TableHead>
                          <TableHead>Upload Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {deliverables.map((deliverable) => (
                          <TableRow key={deliverable.id}>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="font-medium">{deliverable.title}</span>
                                {deliverable.delivery_notes && (
                                  <span className="text-sm text-muted-foreground">
                                    {deliverable.delivery_notes}
                                  </span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="font-mono text-sm">
                                {deliverable.order_id || 'N/A'}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="text-sm">{deliverable.file_name}</span>
                                <span className="text-xs text-muted-foreground">
                                  {formatFileSize(deliverable.file_size)}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm">
                                {deliverable.uploader?.display_name || 'Admin'}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm">
                                {format(new Date(deliverable.created_at), 'MMM dd, yyyy HH:mm')}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Badge className={getDeliverableStatusColor(deliverable.status)}>
                                {deliverable.status === 'pending' ? 'New' : 
                                 deliverable.status === 'downloaded' ? 'Downloaded' : 
                                 deliverable.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                onClick={() => downloadFile(
                                  deliverable.file_url,
                                  deliverable.file_name,
                                  deliverable.id
                                )}
                                className="flex items-center gap-2"
                              >
                                <Download className="h-4 w-4" />
                                Download
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal information and avatar</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={avatarUrl} alt={displayName || "User"} />
                    <AvatarFallback className="text-lg">
                      {displayName ? displayName.charAt(0).toUpperCase() : <User className="h-8 w-8" />}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Label htmlFor="avatar-upload">Profile Picture</Label>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        disabled={uploadingAvatar}
                        onClick={() => document.getElementById('avatar-upload')?.click()}
                        className="h-10 w-10"
                        title={uploadingAvatar ? "Uploading..." : "Upload Image"}
                      >
                        <Upload className="h-4 w-4" />
                      </Button>
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">JPG, PNG up to 5MB</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={user?.email || ""}
                      disabled
                      className="bg-muted"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="display-name">Display Name</Label>
                    <Input
                      id="display-name"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Enter your display name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself..."
                    rows={4}
                  />
                </div>

                <Button onClick={updateProfile} className="w-full md:w-auto">
                  Update Profile
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your account password for better security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                  />
                </div>

                <Button 
                  onClick={changePassword} 
                  disabled={changingPassword || !newPassword || !confirmPassword}
                  className="w-full md:w-auto"
                >
                  {changingPassword ? "Changing..." : "Change Password"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;