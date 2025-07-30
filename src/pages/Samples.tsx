import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Download, Eye, FileText, Star, GraduationCap, Clock } from "lucide-react";

const Samples = () => {
  const samples = [
    {
      title: "The Impact of Social Media on Modern Marketing Strategies",
      type: "Research Paper",
      level: "Graduate",
      pages: 15,
      subject: "Marketing",
      grade: "A+",
      excerpt: "This comprehensive research paper examines how social media platforms have revolutionized marketing strategies in the digital age. The study analyzes various case studies from Fortune 500 companies and their social media campaigns, demonstrating the correlation between social media engagement and brand loyalty...",
      features: ["APA Format", "15 Sources", "Statistical Analysis", "Case Studies"]
    },
    {
      title: "Climate Change Policy: A Comparative Analysis of International Approaches",
      type: "Essay",
      level: "Undergraduate",
      pages: 8,
      subject: "Environmental Science",
      grade: "A",
      excerpt: "This analytical essay explores different international approaches to climate change policy, comparing the strategies employed by developed and developing nations. The paper examines the effectiveness of various policy instruments including carbon pricing, renewable energy incentives...",
      features: ["MLA Format", "12 Sources", "Comparative Analysis", "Policy Evaluation"]
    },
    {
      title: "Artificial Intelligence in Healthcare: Opportunities and Challenges",
      type: "Case Study",
      level: "Graduate",
      pages: 12,
      subject: "Computer Science",
      grade: "A+",
      excerpt: "This case study investigates the implementation of artificial intelligence technologies in healthcare systems, focusing on diagnostic imaging and patient care optimization. The analysis includes real-world examples from leading medical institutions and examines both the benefits and potential risks...",
      features: ["IEEE Format", "20 Sources", "Technical Analysis", "Real Case Studies"]
    },
    {
      title: "The Evolution of Democratic Institutions in Post-Colonial Africa",
      type: "Thesis Chapter",
      level: "PhD",
      pages: 25,
      subject: "Political Science",
      grade: "Excellent",
      excerpt: "This thesis chapter provides a comprehensive examination of democratic institution building in post-colonial African states, analyzing the factors that have contributed to both successful democratization and institutional failures. The research draws on extensive fieldwork...",
      features: ["Chicago Style", "50+ Sources", "Primary Research", "Field Studies"]
    },
    {
      title: "Financial Risk Management in Global Banking",
      type: "Dissertation Chapter",
      level: "PhD",
      pages: 30,
      subject: "Finance",
      grade: "Outstanding",
      excerpt: "This dissertation chapter analyzes contemporary approaches to financial risk management in the global banking sector, with particular emphasis on the lessons learned from the 2008 financial crisis. The study employs quantitative analysis to evaluate risk assessment models...",
      features: ["Harvard Style", "80+ Sources", "Quantitative Analysis", "Economic Models"]
    },
    {
      title: "Sustainable Urban Development: Smart City Initiatives",
      type: "Research Paper",
      level: "Graduate",
      pages: 18,
      subject: "Urban Planning",
      grade: "A",
      excerpt: "This research paper examines sustainable urban development through the lens of smart city initiatives, analyzing how technology integration can address environmental challenges while improving quality of life for urban residents. The study includes case studies from Barcelona, Singapore...",
      features: ["APA Format", "25 Sources", "Urban Case Studies", "Sustainability Metrics"]
    }
  ];

  const subjects = [
    "Business & Management",
    "Computer Science",
    "Psychology",
    "Literature",
    "History",
    "Economics",
    "Biology",
    "Engineering",
    "Law",
    "Medicine",
    "Education",
    "Sociology"
  ];

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary-light py-20 text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Sample Academic Work
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
            Explore examples of our high-quality academic writing across various subjects and levels.
          </p>
          <Button variant="hero" size="lg" asChild>
            <Link to="/contact">Request Custom Sample</Link>
          </Button>
        </div>
      </section>

      {/* Quality Assurance */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="bg-secondary/50 rounded-lg p-6">
              <Star className="h-8 w-8 text-accent mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Grade A+ Quality</h3>
              <p className="text-sm text-muted-foreground">All samples achieved top grades</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-6">
              <FileText className="h-8 w-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Original Content</h3>
              <p className="text-sm text-muted-foreground">100% plagiarism-free writing</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-6">
              <GraduationCap className="h-8 w-8 text-accent mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Academic Standards</h3>
              <p className="text-sm text-muted-foreground">Proper formatting and citations</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-6">
              <Clock className="h-8 w-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Timely Delivery</h3>
              <p className="text-sm text-muted-foreground">Delivered before deadline</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sample Papers */}
      <section className="py-20 bg-secondary/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Featured Sample Papers
            </h2>
            <p className="text-xl text-muted-foreground">
              Browse through our collection of high-quality academic writing samples.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {samples.map((sample, index) => (
              <Card key={index} className="border-border hover:border-accent transition-all duration-300 hover:shadow-xl">
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <Badge variant="outline" className="mb-2">{sample.type}</Badge>
                      <CardTitle className="text-lg leading-tight">{sample.title}</CardTitle>
                    </div>
                    <div className="flex items-center space-x-1 bg-accent/10 px-2 py-1 rounded">
                      <Star className="h-4 w-4 text-accent" />
                      <span className="text-sm font-semibold text-accent">{sample.grade}</span>
                    </div>
                  </div>
                  <CardDescription className="space-y-2">
                    <div className="flex flex-wrap gap-2 text-sm">
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded">{sample.level}</span>
                      <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded">{sample.subject}</span>
                      <span className="bg-muted text-muted-foreground px-2 py-1 rounded">{sample.pages} pages</span>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-4">
                    {sample.excerpt}
                  </p>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold mb-2">Features:</h4>
                    <div className="flex flex-wrap gap-2">
                      {sample.features.map((feature, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-4 w-4" />
                      Preview
                    </Button>
                    <Button variant="academic" size="sm" className="flex-1" asChild>
                      <Link to="/contact">Order Similar</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Subjects We Cover */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Subjects We Cover
            </h2>
            <p className="text-lg text-muted-foreground">
              Our expert writers cover all academic disciplines and subjects.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {subjects.map((subject, index) => (
              <div key={index} className="bg-secondary/50 border border-border rounded-lg p-4 text-center hover:border-accent hover:bg-accent/5 transition-all duration-300 cursor-pointer">
                <span className="text-sm font-medium text-foreground">{subject}</span>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">
              Don't see your subject? We cover many more academic areas.
            </p>
            <Button variant="outline" asChild>
              <Link to="/contact">Ask About Your Subject</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary-light text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready for Your Own High-Quality Paper?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Get the same level of quality and professionalism for your academic project.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" asChild>
              <Link to="/contact">Order Your Paper</Link>
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

export default Samples;