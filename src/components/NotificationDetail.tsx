import React from "react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Package, AlertCircle, CheckCircle, Info } from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
}

interface NotificationDetailProps {
  notification: Notification | null;
  isOpen: boolean;
  onClose: () => void;
  onMarkAsRead: (notificationId: string) => void;
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'deliverable':
      return <Package className="h-5 w-5 text-green-500" />;
    case 'order':
      return <FileText className="h-5 w-5 text-blue-500" />;
    case 'error':
      return <AlertCircle className="h-5 w-5 text-red-500" />;
    case 'success':
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    default:
      return <Info className="h-5 w-5 text-blue-500" />;
  }
};

const getNotificationBadge = (type: string) => {
  switch (type) {
    case 'deliverable':
      return <Badge variant="secondary" className="bg-green-100 text-green-800">Deliverable</Badge>;
    case 'order':
      return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Order</Badge>;
    case 'error':
      return <Badge variant="destructive">Error</Badge>;
    case 'success':
      return <Badge variant="secondary" className="bg-green-100 text-green-800">Success</Badge>;
    default:
      return <Badge variant="outline">Info</Badge>;
  }
};

export const NotificationDetail: React.FC<NotificationDetailProps> = ({
  notification,
  isOpen,
  onClose,
  onMarkAsRead,
}) => {
  if (!notification) return null;

  const handleMarkAsRead = () => {
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
  };

  const isDeliverable = notification.type === 'deliverable';
  const hasDownloadLink = isDeliverable && notification.message.includes('completed work is ready');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center space-x-3">
            {getNotificationIcon(notification.type)}
            <div className="flex-1">
              <DialogTitle className="text-lg">{notification.title}</DialogTitle>
              <div className="flex items-center space-x-2 mt-1">
                {getNotificationBadge(notification.type)}
                <span className="text-sm text-muted-foreground">
                  {format(new Date(notification.created_at), 'MMM dd, yyyy \'at\' h:mm a')}
                </span>
              </div>
            </div>
          </div>
        </DialogHeader>
        
        <div className="mt-4">
          <DialogDescription className="text-sm leading-relaxed whitespace-pre-wrap">
            {notification.message}
          </DialogDescription>
        </div>

        {hasDownloadLink && (
          <div className="mt-6 p-4 bg-accent/50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Download className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Your completed work is ready!</span>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Access your deliverable from the dashboard or click below to go to your files.
            </p>
            <Button 
              size="sm" 
              className="w-full"
              onClick={() => {
                window.location.href = '/dashboard';
                onClose();
              }}
            >
              <FileText className="h-4 w-4 mr-2" />
              View My Files
            </Button>
          </div>
        )}

        <div className="flex justify-between items-center mt-6">
          <div>
            {!notification.read && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAsRead}
              >
                Mark as Read
              </Button>
            )}
          </div>
          <Button onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};