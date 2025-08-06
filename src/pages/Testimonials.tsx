import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Link } from "react-router-dom";
import { Star, Quote, GraduationCap, Award } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";

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
    { number: "10,000+", label: "Satisfied Students" },
    { number: "98%", label: "Success Rate" },
    { number: "4.9/5", label: "Average Rating" },
    { number: "24/7", label: "Support Available" }
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
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.number}</div>
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