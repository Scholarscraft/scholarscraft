import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  FileText, 
  GraduationCap, 
  Search, 
  CheckCircle, 
  Star,
  Clock,
  Shield,
  Award,
  Users
} from "lucide-react";

const Home = () => {
  const services = [
    {
      icon: <FileText className="h-8 w-8" />,
      title: "Essay Writing",
      description: "Custom essays crafted by academic experts for all subjects and academic levels."
    },
    {
      icon: <Search className="h-8 w-8" />,
      title: "Research Papers",
      description: "In-depth research papers with proper citations and original analysis."
    },
    {
      icon: <GraduationCap className="h-8 w-8" />,
      title: "Dissertations",
      description: "Comprehensive dissertation support from proposal to final submission."
    },
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: "Editing & Proofreading",
      description: "Professional editing to polish your work to academic standards."
    }
  ];

  const features = [
    {
      icon: <Clock className="h-6 w-6" />,
      title: "24/7 Support",
      description: "Round-the-clock assistance for all your academic needs"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "100% Original",
      description: "Plagiarism-free content guaranteed with free reports"
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "Expert Writers",
      description: "PhD-qualified writers with subject expertise"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "10,000+ Students",
      description: "Trusted by students from top universities worldwide"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      university: "Harvard University",
      rating: 5,
      text: "Exceptional quality and delivered on time. The research was thorough and the writing was perfect for my graduate-level course."
    },
    {
      name: "Michael Chen",
      university: "Oxford University",
      rating: 5,
      text: "Professional service with excellent communication. My dissertation received top marks thanks to their expert guidance."
    },
    {
      name: "Emma Thompson",
      university: "University of Toronto",
      rating: 5,
      text: "Outstanding editing service! They transformed my rough draft into a polished academic paper that exceeded my expectations."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary-light to-accent py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-primary-foreground">
          <Badge variant="secondary" className="mb-6 bg-accent/20 text-accent-foreground border-accent/30">
            Trusted by 10,000+ Students Worldwide
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Excellence in
            <span className="block bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent">
              Academic Writing
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
            Professional academic writing services for essays, research papers, dissertations, and more. 
            Get expert help from PhD-qualified writers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button variant="hero" size="lg" asChild>
              <Link to="/contact">Get Free Quote</Link>
            </Button>
            <Button variant="outline" size="lg" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
              <Link to="/services">View Services</Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {features.map((feature, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-accent mb-2 flex justify-center">{feature.icon}</div>
                <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
                <p className="text-xs opacity-80">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Academic Writing Services
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From essays to dissertations, we provide comprehensive academic writing support 
              tailored to your specific requirements and academic level.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="border-border hover:border-accent transition-all duration-300 hover:shadow-lg group">
                <CardHeader className="text-center">
                  <div className="text-primary group-hover:text-accent transition-colors duration-300 mb-4 flex justify-center">
                    {service.icon}
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    {service.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button variant="academic" size="lg" asChild>
              <Link to="/services">View All Services</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-secondary/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Students Choose ScholarCraft
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We're committed to delivering exceptional academic writing services that help students succeed.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary text-primary-foreground w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Quality Guaranteed</h3>
              <p className="text-muted-foreground">
                Every paper is written from scratch by qualified experts and thoroughly checked for quality and originality.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-accent text-accent-foreground w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-4">On-Time Delivery</h3>
              <p className="text-muted-foreground">
                We understand deadlines matter. Your papers will be delivered on time, every time, without compromising quality.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary text-primary-foreground w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Confidential & Secure</h3>
              <p className="text-muted-foreground">
                Your personal information and academic details are kept completely confidential and secure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              What Our Students Say
            </h2>
            <p className="text-xl text-muted-foreground">
              Real testimonials from students who achieved academic success with our help.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-border hover:border-accent transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                    ))}
                  </div>
                  <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                  <CardDescription>{testimonial.university}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground italic">"{testimonial.text}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" asChild>
              <Link to="/testimonials">Read More Reviews</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary-light text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Excel in Your Studies?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of successful students who have achieved their academic goals with our professional writing services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" asChild>
              <Link to="/contact">Get Started Now</Link>
            </Button>
            <Button variant="outline" size="lg" className="bg-white/10 border-white/30 text-white hover:bg-white/20" asChild>
              <a href="https://wa.me/+1234567890" target="_blank" rel="noopener noreferrer">
                Chat on WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;