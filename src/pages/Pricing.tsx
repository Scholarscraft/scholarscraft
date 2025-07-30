import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { CheckCircle, Calculator, DollarSign, Clock } from "lucide-react";

const Pricing = () => {
  const [pages, setPages] = useState("5");
  const [deadline, setDeadline] = useState("7");
  const [academicLevel, setAcademicLevel] = useState("undergraduate");
  const [serviceType, setServiceType] = useState("essay");

  const calculatePrice = () => {
    const baseRates = {
      essay: { undergraduate: 12, graduate: 15, phd: 18 },
      research: { undergraduate: 15, graduate: 18, phd: 22 },
      dissertation: { undergraduate: 20, graduate: 25, phd: 30 },
      editing: { undergraduate: 8, graduate: 10, phd: 12 }
    };

    const urgencyMultiplier = {
      "3": 2.0,
      "6": 1.8,
      "12": 1.5,
      "24": 1.3,
      "48": 1.2,
      "3-days": 1.1,
      "7": 1.0,
      "14": 0.9
    };

    const baseRate = baseRates[serviceType as keyof typeof baseRates][academicLevel as keyof typeof baseRates.essay] || 12;
    const multiplier = urgencyMultiplier[deadline as keyof typeof urgencyMultiplier] || 1.0;
    const total = baseRate * parseInt(pages) * multiplier;
    
    return Math.round(total);
  };

  const pricingTiers = [
    {
      name: "Standard",
      description: "Perfect for regular assignments",
      features: [
        "Original content guaranteed",
        "Free unlimited revisions",
        "24/7 customer support",
        "On-time delivery",
        "Plagiarism report"
      ],
      priceRange: "$12-18",
      popular: false
    },
    {
      name: "Premium",
      description: "Enhanced service with priority",
      features: [
        "Everything in Standard",
        "Priority customer support",
        "Advanced quality checks",
        "Direct writer communication",
        "Progressive delivery"
      ],
      priceRange: "$15-22",
      popular: true
    },
    {
      name: "VIP",
      description: "Top-tier service for important papers",
      features: [
        "Everything in Premium",
        "Top 10% expert writers",
        "1-hour response time",
        "Multiple quality reviews",
        "SMS updates"
      ],
      priceRange: "$20-30",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary-light py-20 text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Transparent Pricing
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
            Quality academic writing at affordable prices. No hidden fees, no surprises.
          </p>
        </div>
      </section>

      {/* Price Calculator */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Price Calculator
            </h2>
            <p className="text-lg text-muted-foreground">
              Get an instant quote for your academic writing project.
            </p>
          </div>

          <Card className="border-accent shadow-lg">
            <CardHeader className="text-center">
              <div className="bg-accent text-accent-foreground w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calculator className="h-8 w-8" />
              </div>
              <CardTitle className="text-2xl">Calculate Your Price</CardTitle>
              <CardDescription>
                Adjust the parameters below to get an accurate quote
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="service-type">Service Type</Label>
                  <Select value={serviceType} onValueChange={setServiceType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="essay">Essay Writing</SelectItem>
                      <SelectItem value="research">Research Paper</SelectItem>
                      <SelectItem value="dissertation">Dissertation</SelectItem>
                      <SelectItem value="editing">Editing & Proofreading</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="academic-level">Academic Level</Label>
                  <Select value={academicLevel} onValueChange={setAcademicLevel}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="undergraduate">Undergraduate</SelectItem>
                      <SelectItem value="graduate">Graduate/Master's</SelectItem>
                      <SelectItem value="phd">PhD/Doctoral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="pages">Number of Pages</Label>
                  <Input
                    id="pages"
                    type="number"
                    min="1"
                    value={pages}
                    onChange={(e) => setPages(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="deadline">Deadline</Label>
                  <Select value={deadline} onValueChange={setDeadline}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 Hours</SelectItem>
                      <SelectItem value="6">6 Hours</SelectItem>
                      <SelectItem value="12">12 Hours</SelectItem>
                      <SelectItem value="24">24 Hours</SelectItem>
                      <SelectItem value="48">2 Days</SelectItem>
                      <SelectItem value="3-days">3 Days</SelectItem>
                      <SelectItem value="7">1 Week</SelectItem>
                      <SelectItem value="14">2 Weeks</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="bg-secondary/50 rounded-lg p-6 text-center">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <DollarSign className="h-8 w-8 text-accent" />
                  <span className="text-4xl font-bold text-accent">${calculatePrice()}</span>
                </div>
                <p className="text-muted-foreground mb-4">
                  Estimated total for {pages} pages
                </p>
                <Button variant="premium" size="lg" asChild>
                  <Link to="/contact">Order Now</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="py-20 bg-secondary/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Choose Your Service Level
            </h2>
            <p className="text-xl text-muted-foreground">
              All plans include our quality guarantee and unlimited revisions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingTiers.map((tier, index) => (
              <Card key={index} className={`relative border-border hover:border-accent transition-all duration-300 hover:shadow-xl ${tier.popular ? 'ring-2 ring-accent scale-105' : ''}`}>
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-accent text-accent-foreground">Most Popular</Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{tier.name}</CardTitle>
                  <CardDescription className="mb-4">{tier.description}</CardDescription>
                  <div className="text-3xl font-bold text-accent">{tier.priceRange}<span className="text-sm text-muted-foreground">/page</span></div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center space-x-3">
                        <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    variant={tier.popular ? "premium" : "academic"} 
                    className="w-full" 
                    asChild
                  >
                    <Link to="/contact">Get Started</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Factors Affecting Price */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              What Affects Your Price?
            </h2>
            <p className="text-lg text-muted-foreground">
              Understanding our transparent pricing structure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary text-primary-foreground w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold mb-4">Deadline</h3>
              <p className="text-muted-foreground text-sm">
                Shorter deadlines require higher rates due to urgency.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-accent text-accent-foreground w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold">PhD</span>
              </div>
              <h3 className="text-lg font-semibold mb-4">Academic Level</h3>
              <p className="text-muted-foreground text-sm">
                Higher academic levels require more specialized writers.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary text-primary-foreground w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold">10</span>
              </div>
              <h3 className="text-lg font-semibold mb-4">Number of Pages</h3>
              <p className="text-muted-foreground text-sm">
                More pages mean more research and writing work required.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-accent text-accent-foreground w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold">+</span>
              </div>
              <h3 className="text-lg font-semibold mb-4">Service Type</h3>
              <p className="text-muted-foreground text-sm">
                Different services require varying levels of expertise.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary-light text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Need a Custom Quote?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            For complex projects or bulk orders, contact us for a personalized pricing plan.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" asChild>
              <Link to="/contact">Get Custom Quote</Link>
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

export default Pricing;