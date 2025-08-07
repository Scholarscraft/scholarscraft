import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import SampleModal from "@/components/SampleModal";
import { supabase } from "@/integrations/supabase/client";
import { Download, Eye, FileText, Star, GraduationCap, Clock } from "lucide-react";

const Samples = () => {
  const [selectedSample, setSelectedSample] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [samples, setSamples] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const openSampleModal = (sample: any) => {
    setSelectedSample(sample);
    setIsModalOpen(true);
  };

  const closeSampleModal = () => {
    setIsModalOpen(false);
    setSelectedSample(null);
  };

  useEffect(() => {
    fetchSamples();
  }, []);

  const fetchSamples = async () => {
    try {
      const { data, error } = await supabase
        .from('sample_papers')
        .select('*')
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform data to match existing format
      const transformedSamples = data?.map(paper => ({
        title: paper.title,
        type: paper.category,
        level: paper.academic_level,
        pages: paper.pages,
        subject: paper.subject,
        grade: paper.is_featured ? "A+" : "A",
        excerpt: paper.description || "High-quality academic paper demonstrating excellence in research and writing.",
        features: ["Academic Format", "Cited Sources", "Original Content", "Professional Writing"],
        file_url: paper.file_url,
        preview_available: paper.preview_available
      })) || [];

      setSamples(transformedSamples);
    } catch (error) {
      console.error('Error fetching samples:', error);
      // Fallback to mock data on error
      setSamples([]);
    } finally {
      setLoading(false);
    }
  };

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

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading sample papers...</p>
            </div>
          ) : samples.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-xl text-muted-foreground">No sample papers available yet.</p>
              <p className="text-muted-foreground">Check back soon for new samples!</p>
            </div>
          ) : (
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
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => openSampleModal(sample)}
                    >
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
          )}
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

      <SampleModal 
        sample={selectedSample}
        isOpen={isModalOpen}
        onClose={closeSampleModal}
      />
    </div>
  );
};

export default Samples;