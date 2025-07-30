import { Link } from "react-router-dom";
import { GraduationCap, Mail, MessageCircle, MapPin, Phone } from "lucide-react";

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
                <h3 className="text-xl font-bold">ScholarCraft</h3>
                <p className="text-sm opacity-90">Academic Writing Services</p>
              </div>
            </div>
            <p className="text-sm opacity-90 mb-4 max-w-md">
              Professional academic writing services for students worldwide. We provide high-quality essays, research papers, dissertations, and editing services with guaranteed originality and timely delivery.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://wa.me/+1234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 hover:bg-green-700 p-2 rounded-lg transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
              <a
                href="mailto:support@scholarcraft.com"
                className="bg-primary-light hover:bg-primary-light/80 p-2 rounded-lg transition-colors"
              >
                <Mail className="h-5 w-5" />
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
              <li><Link to="/contact" className="opacity-90 hover:opacity-100 hover:text-accent transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-accent" />
                <span className="opacity-90">support@scholarcraft.com</span>
              </li>
              <li className="flex items-center space-x-3">
                <MessageCircle className="h-4 w-4 text-accent" />
                <span className="opacity-90">+1 (234) 567-8900</span>
              </li>
              <li className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-accent" />
                <span className="opacity-90">Available Worldwide</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-light/20 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm opacity-90">
              © 2024 ScholarCraft. All rights reserved.
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