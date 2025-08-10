import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, FileText, Calendar, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Deliverable {
  id: string;
  order_id: string | null;
  user_id: string;
  title: string;
  file_url: string;
  file_name: string;
  file_size: number;
  uploaded_by: string;
  delivery_notes: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  user_display_name?: string;
  uploader_display_name?: string;
}

export const DeliverableManager = () => {
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchDeliverables();
  }, []);

  const fetchDeliverables = async () => {
    try {
      const { data, error } = await supabase
        .from('deliverables')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch user profiles separately for each deliverable
      const formattedData = await Promise.all(
        (data || []).map(async (item) => {
          // Get user profile
          const { data: userProfile } = await supabase
            .from('profiles')
            .select('display_name')
            .eq('user_id', item.user_id)
            .single();

          // Get uploader profile
          const { data: uploaderProfile } = await supabase
            .from('profiles')
            .select('display_name')
            .eq('user_id', item.uploaded_by)
            .single();

          return {
            ...item,
            user_display_name: userProfile?.display_name || 'Unknown User',
            uploader_display_name: uploaderProfile?.display_name || 'Unknown Admin'
          };
        })
      );

      setDeliverables(formattedData);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch deliverables",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('deliverables')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      setDeliverables(prev => 
        prev.map(item => 
          item.id === id ? { ...item, status: newStatus } : item
        )
      );

      toast({
        title: "Success",
        description: "Status updated successfully"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive"
      });
    }
  };

  const downloadFile = async (fileUrl: string, fileName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('deliverables')
        .download(fileUrl);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to download file",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'revision_requested': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatFileSize = (bytes: number) => {
    return (bytes / 1024 / 1024).toFixed(2) + ' MB';
  };

  if (loading) {
    return <div>Loading deliverables...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Deliverables Management
        </CardTitle>
        <CardDescription>
          Manage all uploaded deliverables and their status
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Order ID</TableHead>
              <TableHead>File</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Uploaded</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deliverables.map((deliverable) => (
              <TableRow key={deliverable.id}>
                <TableCell className="font-medium">
                  {deliverable.title}
                  {deliverable.delivery_notes && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {deliverable.delivery_notes}
                    </p>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    {deliverable.user_display_name}
                  </div>
                </TableCell>
                <TableCell>
                  {deliverable.order_id ? (
                    <Badge variant="outline">{deliverable.order_id}</Badge>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <p>{deliverable.file_name}</p>
                    <p className="text-muted-foreground">
                      {formatFileSize(deliverable.file_size)}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <Select
                    value={deliverable.status}
                    onValueChange={(value) => updateStatus(deliverable.id, value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue>
                        <Badge className={getStatusColor(deliverable.status)}>
                          {deliverable.status}
                        </Badge>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="revision_requested">Revision Requested</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {new Date(deliverable.created_at).toLocaleDateString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    by {deliverable.uploader_display_name}
                  </p>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadFile(deliverable.file_url, deliverable.file_name)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {deliverables.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No deliverables found
          </div>
        )}
      </CardContent>
    </Card>
  );
};