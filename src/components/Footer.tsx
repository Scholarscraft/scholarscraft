import { Link } from "react-router-dom";
import { GraduationCap, Mail, MessageCircle, MapPin, Facebook, Instagram, Send } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-accent p-2 rounded-lg">
                <GraduationCap className="h-6 w-6 text-accent-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-bold">ScholarsCraft</h3>
                <p className="text-sm opacity-90">Academic Writing Services</p>
              </div>
            </div>
            <p className="text-sm opacity-90 mb-4 max-w-md">
              Professional academic writing services for students worldwide. We provide high-quality essays, research papers, dissertations, and editing services with guaranteed originality and timely delivery.
            </p>
            <div className="flex space-x-3">
              <a
                href="https://wa.me/+1234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 hover:bg-green-700 p-2 rounded-lg transition-colors"
                title="WhatsApp"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
              <a
                href="mailto:support@scholarscraft.com"
                className="bg-blue-600 hover:bg-blue-700 p-2 rounded-lg transition-colors"
                title="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
              <a
                href="https://facebook.com/scholarcraft"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-800 hover:bg-blue-900 p-2 rounded-lg transition-colors"
                title="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com/scholarcraft"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-pink-600 hover:bg-pink-700 p-2 rounded-lg transition-colors"
                title="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://t.me/scholarcraft"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-500 hover:bg-blue-600 p-2 rounded-lg transition-colors"
                title="Telegram"
              >
                <Send className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/services" className="opacity-90 hover:opacity-100 hover:text-accent transition-colors">Our Services</Link></li>
              <li><Link to="/pricing" className="opacity-90 hover:opacity-100 hover:text-accent transition-colors">Pricing</Link></li>
              <li><Link to="/samples" className="opacity-90 hover:opacity-100 hover:text-accent transition-colors">Sample Work</Link></li>
              <li><Link to="/testimonials" className="opacity-90 hover:opacity-100 hover:text-accent transition-colors">Testimonials</Link></li>
              <li><Link to="/testimonials#faq" className="opacity-90 hover:opacity-100 hover:text-accent transition-colors">FAQs</Link></li>
              <li><Link to="/contact" className="opacity-90 hover:opacity-100 hover:text-accent transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Social Media & Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <p className="text-sm opacity-90 mb-4">
              Stay updated with our latest news and updates
            </p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <a
                href="https://reddit.com/r/scholarcraft"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 p-2 rounded hover:bg-primary-light/20 transition-colors"
              >
                <div className="w-4 h-4 bg-orange-600 rounded"></div>
                <span>Reddit</span>
              </a>
              <a
                href="https://discord.gg/scholarcraft"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 p-2 rounded hover:bg-primary-light/20 transition-colors"
              >
                <div className="w-4 h-4 bg-indigo-600 rounded"></div>
                <span>Discord</span>
              </a>
              <a
                href="https://facebook.com/scholarcraft"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 p-2 rounded hover:bg-primary-light/20 transition-colors"
              >
                <Facebook className="h-4 w-4 text-blue-400" />
                <span>Facebook</span>
              </a>
              <a
                href="https://instagram.com/scholarcraft"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 p-2 rounded hover:bg-primary-light/20 transition-colors"
              >
                <Instagram className="h-4 w-4 text-pink-400" />
                <span>Instagram</span>
              </a>
              <a
                href="https://t.me/scholarcraft"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 p-2 rounded hover:bg-primary-light/20 transition-colors"
              >
                <Send className="h-4 w-4 text-blue-400" />
                <span>Telegram</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-light/20 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm opacity-90">
              © 2024 ScholarsCraft. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-sm opacity-90 hover:opacity-100 hover:text-accent transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-sm opacity-90 hover:opacity-100 hover:text-accent transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;