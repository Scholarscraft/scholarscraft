import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";
import { AuthProvider } from "./hooks/useAuth";
import { lazy, Suspense } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import useScrollToTop from "./hooks/useScrollToTop";

// Lazy load pages for better performance
const Home = lazy(() => import("./pages/Home"));
const Services = lazy(() => import("./pages/Services"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Samples = lazy(() => import("./pages/Samples"));
const SampleDetail = lazy(() => import("./pages/SampleDetail"));
const Testimonials = lazy(() => import("./pages/Testimonials"));
const Contact = lazy(() => import("./pages/Contact"));
const Auth = lazy(() => import("./pages/Auth"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Admin = lazy(() => import("./pages/Admin"));
const NotFound = lazy(() => import("./pages/NotFound"));

const AppContent = () => {
  useScrollToTop();
  
  return (
    <>
      <Navigation />
      <main className="min-h-screen">
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-fade-in">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        }>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/samples" element={<Samples />} />
            <Route path="/samples/:id" element={<SampleDetail />} />
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
};

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider defaultTheme="light" storageKey="scholarcraft-theme">
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppContent />
            </BrowserRouter>
          </TooltipProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
