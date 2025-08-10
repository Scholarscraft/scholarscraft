import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Package, Calendar, User } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface Deliverable {
  id: string;
  title: string;
  file_name: string;
  file_url: string;
  file_size: number;
  status: string;
  delivery_notes?: string;
  created_at: string;
  order_id?: string;
}

export const DeliverablesList = () => {
  const { user } = useAuth();
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchDeliverables = async () => {
      try {
        const { data, error } = await supabase
          .from('deliverables')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        setDeliverables(data || []);
      } catch (error) {
        console.error('Error fetching deliverables:', error);
        toast.error('Failed to load your files');
      } finally {
        setLoading(false);
      }
    };

    fetchDeliverables();
  }, [user]);

  const handleDownload = async (deliverable: Deliverable) => {
    try {
      // Get the signed URL for download
      const { data, error } = await supabase.storage
        .from('deliverables')
        .createSignedUrl(deliverable.file_url.split('/').pop() || '', 60);

      if (error) throw error;

      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = data.signedUrl;
      link.download = deliverable.file_name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Download started');
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('Failed to download file');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Completed</Badge>;
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (deliverables.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-semibold text-lg mb-2">No deliverables yet</h3>
          <p className="text-muted-foreground">
            Your completed work will appear here once it's ready for download.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Files</h2>
        <Badge variant="outline">{deliverables.length} file(s)</Badge>
      </div>

      {deliverables.map((deliverable) => (
        <Card key={deliverable.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>{deliverable.title}</span>
                </CardTitle>
                <CardDescription>
                  {deliverable.order_id && (
                    <span className="inline-flex items-center space-x-1 mr-4">
                      <User className="h-3 w-3" />
                      <span>Order: {deliverable.order_id}</span>
                    </span>
                  )}
                  <span className="inline-flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>{format(new Date(deliverable.created_at), 'MMM dd, yyyy')}</span>
                  </span>
                </CardDescription>
              </div>
              {getStatusBadge(deliverable.status)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">{deliverable.file_name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(deliverable.file_size)}
                </p>
                {deliverable.delivery_notes && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {deliverable.delivery_notes}
                  </p>
                )}
              </div>
              <Button
                onClick={() => handleDownload(deliverable)}
                disabled={deliverable.status !== 'completed'}
                className="shrink-0"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};