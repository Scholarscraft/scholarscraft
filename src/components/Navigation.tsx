import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import SmoothLink from "./SmoothLink";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ThemeToggle";
import { supabase } from "@/integrations/supabase/client";
import { Menu, X, GraduationCap, MessageCircle, User, LogOut, Settings, Shield } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import NotificationBell from "@/components/NotificationBell";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [profileData, setProfileData] = useState<{avatar_url?: string; display_name?: string} | null>(null);
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { isAdmin } = useUserRole();
  const { toast } = useToast();

  // Fetch profile data when user changes
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setProfileData(null);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('avatar_url, display_name')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching profile:', error);
          return;
        }

        setProfileData(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [user]);

  // Real-time subscription to profile changes
  useEffect(() => {
    if (!user) return;

    const subscription = supabase
      .channel('profile-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'profiles',
          filter: `user_id=eq.${user.id}`
        }, 
        (payload) => {
          if (payload.new) {
            setProfileData(payload.new as any);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Pricing", path: "/pricing" },
    { name: "Samples", path: "/samples" },
    { name: "Testimonials", path: "/testimonials" },
    { name: "Contact", path: "/contact" },
  ];

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out successfully",
      description: "You have been signed out of your account.",
    });
  };

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-background/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <SmoothLink to="/" className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-primary to-primary-light p-2 rounded-lg">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary">ScholarsCraft</h1>
              <p className="text-xs text-muted-foreground">Academic Writing Services</p>
            </div>
          </SmoothLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <SmoothLink
                key={item.name}
                to={item.path}
                className={`text-sm font-medium transition-all duration-300 hover:text-primary story-link ${
                  isActivePath(item.path)
                    ? "text-primary border-b-2 border-accent"
                    : "text-foreground"
                }`}
              >
                {item.name}
              </SmoothLink>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            {user && <NotificationBell />}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="h-8 w-8 cursor-pointer">
                    <AvatarImage src={profileData?.avatar_url} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {profileData?.display_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <SmoothLink to="/dashboard" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Dashboard
                    </SmoothLink>
                  </DropdownMenuItem>
                  {isAdmin() && (
                    <DropdownMenuItem asChild>
                      <SmoothLink to="/admin" className="flex items-center">
                        <Shield className="mr-2 h-4 w-4" />
                        Admin Panel
                      </SmoothLink>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="flex items-center">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-3">
                <Button variant="outline" size="sm" asChild>
                  <SmoothLink to="/auth">
                    <User className="h-4 w-4" />
                    Sign In
                  </SmoothLink>
                </Button>
                <Button variant="premium" size="sm" asChild>
                  <SmoothLink to="/contact">Get Quote</SmoothLink>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-foreground hover:text-primary transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden bg-background border-t border-border">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <SmoothLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 text-sm font-medium transition-all duration-300 hover:text-primary story-link ${
                    isActivePath(item.path)
                      ? "text-primary bg-accent/10"
                      : "text-foreground"
                  }`}
                >
                  {item.name}
                </SmoothLink>
              ))}
              <div className="pt-4 pb-2 space-y-2">
                <div className="flex justify-center mb-2">
                  <ThemeToggle />
                </div>
                {user ? (
                  <div className="space-y-2">
                    <div className="flex justify-center mb-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={profileData?.avatar_url} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {profileData?.display_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <SmoothLink to="/dashboard">
                        <User className="h-4 w-4" />
                        Dashboard
                      </SmoothLink>
                    </Button>
                    {isAdmin() && (
                      <Button variant="outline" size="sm" className="w-full" asChild>
                        <SmoothLink to="/admin">
                          <Shield className="h-4 w-4" />
                          Admin Panel
                        </SmoothLink>
                      </Button>
                    )}
                    <Button variant="outline" size="sm" className="w-full" onClick={handleSignOut}>
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <SmoothLink to="/auth">
                        <User className="h-4 w-4" />
                        Sign In
                      </SmoothLink>
                    </Button>
                    <Button variant="premium" size="sm" className="w-full" asChild>
                      <SmoothLink to="/contact">Get Quote</SmoothLink>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;