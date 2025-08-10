import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, User, FileText, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UserPreview {
  id: string;
  display_name: string;
  email?: string;
}

interface OrderPreview {
  order_id: string;
  topic: string;
  user_id: string;
}

export const DeliverableUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [identificationMethod, setIdentificationMethod] = useState<"email" | "order_id">("email");
  const [emailInput, setEmailInput] = useState("");
  const [orderIdInput, setOrderIdInput] = useState("");
  const [userPreview, setUserPreview] = useState<UserPreview | null>(null);
  const [orderPreview, setOrderPreview] = useState<OrderPreview | null>(null);
  const [uploading, setUploading] = useState(false);
  const [searching, setSearching] = useState(false);

  const { toast } = useToast();

  const searchUser = async () => {
    if (!emailInput.trim() && !orderIdInput.trim()) return;
    
    setSearching(true);
    try {
      if (identificationMethod === "email") {
        // Search by email - call edge function to find user by email
        const { data: userData, error: userError } = await supabase.functions.invoke('get-user-by-email', {
          body: { email: emailInput.trim() }
        });

        if (userError || !userData?.user) {
          toast({
            title: "User not found",
            description: "No user found with that email address",
            variant: "destructive"
          });
          return;
        }

        const user = userData.user;
        
        // Get user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('display_name')
          .eq('user_id', user.id)
          .maybeSingle();
          
        setUserPreview({
          id: user.id,
          display_name: profile?.display_name || user.email || 'Unknown User',
          email: user.email
        });
        setOrderPreview(null); // Clear any previous order preview
      } else {
        // Search by order ID
        const { data: orders, error } = await supabase
          .from('orders')
          .select('order_id, topic, user_id')
          .eq('order_id', orderIdInput.trim());

        if (error) throw error;

        if (orders && orders.length > 0) {
          const order = orders[0];
          
          // Get user profile for the order
          const { data: profiles } = await supabase
            .from('profiles')
            .select('display_name')
            .eq('user_id', order.user_id)
            .single();
          
          // Get user's auth email via edge function
          const { data: userData } = await supabase.functions.invoke('get-user-by-id', {
            body: { userId: order.user_id }
          });
          
          setOrderPreview({
            order_id: order.order_id,
            topic: order.topic,
            user_id: order.user_id
          });
          setUserPreview({
            id: order.user_id,
            display_name: profiles?.display_name || 'Unknown User',
            email: userData?.user?.email
          });
        } else {
          toast({
            title: "Order not found",
            description: "No order found with that ID",
            variant: "destructive"
          });
        }
      }
    } catch (error: any) {
      toast({
        title: "Search failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setSearching(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      
      if (!allowedTypes.includes(selectedFile.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF or Word document",
          variant: "destructive"
        });
        return;
      }

      // Validate file size (10MB limit)
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 10MB",
          variant: "destructive"
        });
        return;
      }

      setFile(selectedFile);
      if (!title) {
        setTitle(selectedFile.name.replace(/\.[^/.]+$/, ""));
      }
    }
  };

  const uploadDeliverable = async () => {
    if (!file || !userPreview || !title.trim()) {
      toast({
        title: "Missing information",
        description: "Please select a file, identify a user, and provide a title",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    try {
      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${userPreview.id}/${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('deliverables')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Create deliverable record
      const { error: dbError } = await supabase
        .from('deliverables')
        .insert({
          order_id: orderPreview?.order_id || null,
          user_id: userPreview.id,
          title: title.trim(),
          file_url: uploadData.path,
          file_name: file.name,
          file_size: file.size,
          uploaded_by: (await supabase.auth.getUser()).data.user?.id,
          delivery_notes: deliveryNotes.trim() || null,
          status: 'pending'
        });

      if (dbError) throw dbError;

      // Send notification email
      try {
        await supabase.functions.invoke('send-deliverable-notification', {
          body: {
            userId: userPreview.id,
            title: title.trim(),
            orderNumber: orderPreview?.order_id,
            deliveryNotes: deliveryNotes.trim()
          }
        });
      } catch (emailError) {
        console.warn('Failed to send notification email:', emailError);
        // Don't fail the whole operation if email fails
      }

      toast({
        title: "Success",
        description: "Deliverable uploaded successfully and user notified"
      });

      // Reset form
      setFile(null);
      setTitle("");
      setDeliveryNotes("");
      setEmailInput("");
      setOrderIdInput("");
      setUserPreview(null);
      setOrderPreview(null);
      
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Completed Work
          </CardTitle>
          <CardDescription>
            Upload completed papers and deliver them to specific users
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* User Identification */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Identify User By</Label>
              <Select value={identificationMethod} onValueChange={(value: "email" | "order_id") => setIdentificationMethod(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email Address</SelectItem>
                  <SelectItem value="order_id">Order ID</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              {identificationMethod === "email" ? (
                <div className="flex-1">
                  <Input
                    placeholder="Enter user email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                  />
                </div>
              ) : (
                <div className="flex-1">
                  <Input
                    placeholder="Enter order ID (e.g., SCH-123456)"
                    value={orderIdInput}
                    onChange={(e) => setOrderIdInput(e.target.value)}
                  />
                </div>
              )}
              <Button onClick={searchUser} disabled={searching}>
                {searching ? "Searching..." : "Search"}
              </Button>
            </div>

            {/* User/Order Preview */}
            {userPreview && (
              <Card className="bg-muted/50">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{userPreview.display_name}</p>
                      {userPreview.email && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {userPreview.email}
                        </p>
                      )}
                      {orderPreview && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          Order: {orderPreview.order_id} - {orderPreview.topic}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="file">Select File</Label>
            <Input
              id="file"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
            />
            {file && (
              <p className="text-sm text-muted-foreground">
                Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter deliverable title"
            />
          </div>

          {/* Delivery Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Delivery Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={deliveryNotes}
              onChange={(e) => setDeliveryNotes(e.target.value)}
              placeholder="Any additional notes for the user..."
              rows={3}
            />
          </div>

          {/* Upload Button */}
          <Button 
            onClick={uploadDeliverable} 
            disabled={uploading || !file || !userPreview || !title.trim()}
            className="w-full"
          >
            {uploading ? "Uploading..." : "Upload & Deliver"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};