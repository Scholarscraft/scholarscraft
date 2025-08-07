import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const WhatsAppButton = () => {
  const phoneNumber = "+14802471779";
  const message = "Hi! I'm interested in your academic writing services.";
  const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-3">
      {/* WhatsApp Us Text */}
      <div className="bg-white dark:bg-gray-800 px-3 py-2 rounded-lg shadow-lg border">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          WhatsApp Us
        </span>
      </div>
      
      {/* WhatsApp Button */}
      <Button
        asChild
        className="h-14 w-14 rounded-full bg-[#25D366] hover:bg-[#20BA5A] shadow-lg hover:shadow-xl transition-all duration-300"
        title="Chat on WhatsApp"
      >
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </a>
      </Button>
    </div>
  );
};

export default WhatsAppButton;