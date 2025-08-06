import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Link } from "react-router-dom";
import { Star, Quote, GraduationCap, Award, Users, Gift } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import { useEffect, useState, useRef } from "react";

const CountingNumber = ({ end, suffix = "", duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    let startTime;
    let animationFrame;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      setCount(Math.floor(progress * end));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isVisible, end, duration]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  );
};

const SkylinePattern = () => (
  <svg className="w-full h-20" viewBox="0 0 1200 80" preserveAspectRatio="none">
    <path
      d="M0,80 L0,60 L20,60 L20,40 L40,40 L40,20 L60,20 L60,35 L80,35 L80,15 L100,15 L100,45 L120,45 L120,25 L140,25 L140,50 L160,50 L160,30 L180,30 L180,55 L200,55 L200,10 L220,10 L220,40 L240,40 L240,60 L260,60 L260,35 L280,35 L280,20 L300,20 L300,45 L320,45 L320,25 L340,25 L340,50 L360,50 L360,15 L380,15 L380,40 L400,40 L400,30 L420,30 L420,55 L440,55 L440,35 L460,35 L460,20 L480,20 L480,45 L500,45 L500,25 L520,25 L520,50 L540,50 L540,30 L560,30 L560,60 L580,60 L580,40 L600,40 L600,20 L620,20 L620,45 L640,45 L640,25 L660,25 L660,50 L680,50 L680,15 L700,15 L700,35 L720,35 L720,55 L740,55 L740,30 L760,30 L760,45 L780,45 L780,25 L800,25 L800,50 L820,50 L820,35 L840,35 L840,60 L860,60 L860,40 L880,40 L880,20 L900,20 L900,45 L920,45 L920,25 L940,25 L940,50 L960,50 L960,30 L980,30 L980,55 L1000,55 L1000,35 L1020,35 L1020,20 L1040,20 L1040,45 L1060,45 L1060,25 L1080,25 L1080,50 L1100,50 L1100,30 L1120,30 L1120,60 L1140,60 L1140,40 L1160,40 L1160,20 L1180,20 L1180,45 L1200,45 L1200,80 Z"
      fill="white"
    />
  </svg>
);

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      university: "Harvard University",
      course: "MBA Program",
      rating: 5,
      service: "Research Paper",
      text: "Exceptional quality and delivered on time. The research was thorough and the writing was perfect for my graduate-level course. I received an A+ and my professor complimented the depth of analysis.",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "Michael Chen",
      university: "Oxford University",
      course: "PhD in Economics",
      rating: 5,
      service: "Dissertation",
      text: "Professional service with excellent communication. My dissertation received top marks thanks to their expert guidance. The writer was knowledgeable about my field and provided valuable insights throughout the process.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "Emma Thompson",
      university: "University of Toronto",
      course: "Master's in Psychology",
      rating: 5,
      service: "Editing & Proofreading",
      text: "Outstanding editing service! They transformed my rough draft into a polished academic paper that exceeded my expectations. The attention to detail and suggestions for improvement were invaluable.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "James Rodriguez",
      university: "Stanford University",
      course: "Computer Science",
      rating: 5,
      service: "Case Study",
      text: "The case study analysis was comprehensive and well-structured. The writer demonstrated deep understanding of the subject matter and delivered exactly what I needed for my advanced course.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "Lisa Park",
      university: "Cambridge University",
      course: "Law School",
      rating: 5,
      service: "Essay Writing",
      text: "Brilliant work on my constitutional law essay. The arguments were well-structured and supported by relevant case law. I couldn't be happier with the quality and timeliness of delivery.",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "David Kim",
      university: "MIT",
      course: "Engineering",
      rating: 5,
      service: "Research Paper",
      text: "The technical accuracy and depth of research exceeded my expectations. The paper was perfectly formatted according to IEEE standards and included all the latest research in my field.",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face"
    }
  ];

  const stats = [
    { number: 10000, suffix: "+", label: "Satisfied Students" },
    { number: 98, suffix: "%", label: "Success Rate" },
    { number: 4.9, suffix: "/5", label: "Average Rating" },
    { number: 24, suffix: "/7", label: "Support Available" }
  ];

  const faqs = [
    {
      question: "How does the referral program work?",
      answer: "Share your unique referral code with friends. When they place their first order, you both get a 10% discount on your next service. There's no limit to how many friends you can refer!"
    },
    {
      question: "What types of academic writing do you provide?",
      answer: "We offer research papers, essays, dissertations, case studies, lab reports, book reviews, and editing services across all academic levels and subjects."
    },
    {
      question: "How do you ensure originality?",
      answer: "All our papers are written from scratch by expert writers. We use advanced plagiarism detection software and provide originality reports with every order."
    },
    {
      question: "What is your revision policy?",
      answer: "We offer unlimited free revisions within 14 days of delivery. If the paper doesn't meet your requirements, we'll revise it until you're completely satisfied."
    },
    {
      question: "How do you select your writers?",
      answer: "Our writers undergo a rigorous selection process including academic verification, writing tests, and background checks. All hold advanced degrees in their fields."
    },
    {
      question: "Is my personal information secure?",
      answer: "Yes, we use advanced encryption and never share your personal information. Your privacy and confidentiality are our top priorities."
    }
  ];

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary-light py-20 text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-8 w-8 fill-accent text-accent" />
              ))}
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Student Success Stories
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
            Read what our satisfied students say about our academic writing services.
          </p>
          <Badge variant="secondary" className="bg-accent/20 text-accent-foreground border-accent/30 text-lg px-4 py-2">
            Trusted by Students Worldwide
          </Badge>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="bg-secondary/50 rounded-lg p-6">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  <CountingNumber end={stat.number} suffix={stat.suffix} />
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-20 bg-secondary/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              What Our Students Say
            </h2>
            <p className="text-xl text-muted-foreground">
              Real reviews from students who achieved academic success with our help.
            </p>
          </div>

          <Carousel 
            className="w-full max-w-5xl mx-auto"
            plugins={[
              Autoplay({
                delay: 4000,
              }),
            ]}
            opts={{
              align: "start",
              loop: true,
            }}
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                  <Card className="border-border hover:border-accent transition-all duration-500 hover:shadow-xl h-full">
                    <CardHeader>
                      <div className="flex items-center space-x-4 mb-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={testimonial.image} alt={testimonial.name} />
                          <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                          <CardDescription className="text-sm">{testimonial.university}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                          ))}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {testimonial.service}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="relative">
                        <Quote className="absolute -top-2 -left-2 h-8 w-8 text-accent/20" />
                        <p className="text-muted-foreground italic pl-6">"{testimonial.text}"</p>
                      </div>
                      <div className="mt-4 pt-4 border-t border-border">
                        <p className="text-sm text-muted-foreground">
                          <GraduationCap className="inline h-4 w-4 mr-1" />
                          {testimonial.course}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>

      {/* Success Highlights */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Our Track Record of Success
            </h2>
            <p className="text-lg text-muted-foreground">
              Helping students achieve their academic goals across top universities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary text-primary-foreground w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Top Grades Achieved</h3>
              <p className="text-muted-foreground">
                Our students consistently receive A and B grades on papers we've helped with, with many achieving top marks in their classes.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-accent text-accent-foreground w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <GraduationCap className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Graduation Success</h3>
              <p className="text-muted-foreground">
                Hundreds of students have successfully graduated with our dissertation and thesis support, achieving their academic dreams.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary text-primary-foreground w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Excellence Recognition</h3>
              <p className="text-muted-foreground">
                Many of our papers have been commended by professors and used as examples of excellent academic writing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Skyline Divider */}
      <div className="relative bg-secondary/50">
        <SkylinePattern />
      </div>

      {/* Referral Section */}
      <section className="py-20 bg-gradient-to-br from-accent to-accent-light text-accent-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-accent text-accent-foreground w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Gift className="h-10 w-10" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Refer Friends & Get Rewarded
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Share the success! Refer a friend and you both get 10% off your next order.
          </p>
          <div className="bg-white/10 rounded-lg p-6 mb-8 backdrop-blur-sm">
            <h3 className="text-xl font-semibold mb-4">How It Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div className="flex flex-col items-center">
                <Users className="h-8 w-8 mb-2" />
                <p>Share your referral code with friends</p>
              </div>
              <div className="flex flex-col items-center">
                <Award className="h-8 w-8 mb-2" />
                <p>They place their first order</p>
              </div>
              <div className="flex flex-col items-center">
                <Gift className="h-8 w-8 mb-2" />
                <p>You both get 10% discount</p>
              </div>
            </div>
          </div>
          <Button variant="secondary" size="lg" asChild>
            <Link to="/contact">Get Your Referral Code</Link>
          </Button>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-muted-foreground">
              Find answers to common questions about our services and referral program.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary-light text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Join Our Success Stories
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Be the next student to achieve academic excellence with our professional writing services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" asChild>
              <Link to="/contact">Start Your Success Story</Link>
            </Button>
            <Button variant="outline" size="lg" className="bg-white/10 border-white/30 text-white hover:bg-white/20" asChild>
              <Link to="/services">View Our Services</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Testimonials;