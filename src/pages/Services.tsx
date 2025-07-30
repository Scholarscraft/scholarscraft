import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  FileText, 
  Search, 
  GraduationCap, 
  BookOpen, 
  BarChart3, 
  FileCheck,
  Clock,
  DollarSign,
  CheckCircle
} from "lucide-react";

const Services = () => {
  const services = [
    {
      icon: <FileText className="h-10 w-10" />,
      title: "Essay Writing",
      description: "Custom essays for all academic levels",
      features: ["Original content", "Proper citations", "All subjects", "Any deadline"],
      price: "From $12/page",
      popular: false
    },
    {
      icon: <Search className="h-10 w-10" />,
      title: "Research Papers",
      description: "In-depth research with analysis",
      features: ["Extensive research", "Statistical analysis", "Literature review", "Methodology"],
      price: "From $15/page",
      popular: true
    },
    {
      icon: <GraduationCap className="h-10 w-10" />,
      title: "Dissertations",
      description: "Complete dissertation support",
      features: ["Chapter-by-chapter", "Proposal writing", "Defense preparation", "Revisions"],
      price: "From $20/page",
      popular: false
    },
    {
      icon: <BarChart3 className="h-10 w-10" />,
      title: "Case Studies",
      description: "Business and academic case analysis",
      features: ["Problem analysis", "Solution development", "Industry research", "Recommendations"],
      price: "From $14/page",
      popular: false
    },
    {
      icon: <BookOpen className="h-10 w-10" />,
      title: "Thesis Writing",
      description: "Master's and PhD thesis support",
      features: ["Research design", "Data collection", "Analysis", "Writing"],
      price: "From $18/page",
      popular: false
    },
    {
      icon: <FileCheck className="h-10 w-10" />,
      title: "Editing & Proofreading",
      description: "Professional editing services",
      features: ["Grammar check", "Style improvement", "Structure review", "Citations"],
      price: "From $8/page",
      popular: false
    }
  ];

  const additionalServices = [
    "Literature Review",
    "Book Reports",
    "Lab Reports",
    "Coursework",
    "Annotated Bibliography",
    "PowerPoint Presentations",
    "Admission Essays",
    "Scholarship Essays"
  ];

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary-light py-20 text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Professional Academic Writing Services
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
            Expert writers delivering high-quality academic papers across all subjects and academic levels.
          </p>
          <Button variant="hero" size="lg" asChild>
            <Link to="/contact">Get Custom Quote</Link>
          </Button>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Writing Services
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Choose from our comprehensive range of academic writing services, all delivered by qualified experts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className={`relative border-border hover:border-accent transition-all duration-300 hover:shadow-xl group ${service.popular ? 'ring-2 ring-accent' : ''}`}>
                {service.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-accent text-accent-foreground">Most Popular</Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <div className="text-primary group-hover:text-accent transition-colors duration-300 mb-4 flex justify-center">
                    {service.icon}
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                  <div className="flex items-center justify-center space-x-2 mt-4">
                    <DollarSign className="h-5 w-5 text-accent" />
                    <span className="text-lg font-semibold text-accent">{service.price}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center space-x-3">
                        <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button variant="academic" className="w-full" asChild>
                    <Link to="/contact">Order Now</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-20 bg-secondary/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Additional Services We Offer
            </h2>
            <p className="text-lg text-muted-foreground">
              We cover a wide range of academic writing needs beyond our main services.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {additionalServices.map((service, index) => (
              <div key={index} className="bg-background border border-border rounded-lg p-4 text-center hover:border-accent transition-colors duration-300">
                <span className="text-sm font-medium text-foreground">{service}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground">
              Getting your academic paper written is simple and straightforward.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary text-primary-foreground w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-4">Submit Your Order</h3>
              <p className="text-muted-foreground">
                Fill out our order form with your paper requirements, deadline, and any specific instructions.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-accent text-accent-foreground w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-4">Expert Assignment</h3>
              <p className="text-muted-foreground">
                We assign your paper to a qualified writer with expertise in your subject area.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary text-primary-foreground w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-4">Receive Your Paper</h3>
              <p className="text-muted-foreground">
                Get your completed paper on time with free revisions if needed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary-light text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Get a free quote for your academic writing project today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" asChild>
              <Link to="/contact">Get Free Quote</Link>
            </Button>
            <Button variant="outline" size="lg" className="bg-white/10 border-white/30 text-white hover:bg-white/20" asChild>
              <Link to="/pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;