import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const WhatsAppButton = () => {
  const phoneNumber = "+14802471779";
  const message = "Hi! I'm interested in your academic writing services.";
  const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        asChild
        className="bg-[#25D366] hover:bg-[#20BA5A] text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
        title="Chat on WhatsApp"
      >
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2"
        >
          <MessageCircle className="h-5 w-5" />
          <span className="text-sm font-medium">WhatsApp Us</span>
        </a>
      </Button>
    </div>
  );
};

export default WhatsAppButton;