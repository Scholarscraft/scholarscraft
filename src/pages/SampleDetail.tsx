import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, FileText, Users, Shield, Clock, CheckCircle, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import PDFViewer from "@/components/PDFViewer";

interface SamplePaper {
  id: string;
  title: string;
  category: string;
  academic_level: string;
  subject: string;
  pages?: number;
  file_size?: number;
  description?: string;
  file_url: string;
  preview_available?: boolean;
  is_featured?: boolean;
  created_at: string;
}

const SampleDetail = () => {
  const { id } = useParams();
  const [sample, setSample] = useState<SamplePaper | null>(null);
  const [loading, setLoading] = useState(true);
  const [views] = useState(Math.floor(Math.random() * 2000) + 500); // Mock views for demonstration

  useEffect(() => {
    const fetchSample = async () => {
      if (!id) return;

      try {
        const { data, error } = await supabase
          .from('sample_papers')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching sample:', error);
          return;
        }

        setSample(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSample();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary/30 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Skeleton className="h-12 w-3/4 mb-4" />
              <Skeleton className="h-6 w-1/2 mb-8" />
              <Skeleton className="h-8 w-2/3 mb-4" />
              <Skeleton className="h-64 w-full" />
            </div>
            <div>
              <Skeleton className="h-80 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!sample) {
    return (
      <div className="min-h-screen bg-secondary/30 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Sample not found</h1>
          <Link to="/samples">
            <Button>Back to Samples</Button>
          </Link>
        </div>
      </div>
    );
  }

  const wordCount = sample.pages ? sample.pages * 250 : 795; // Estimate 250 words per page

  const fullContent = `${sample.description || 'This comprehensive academic work demonstrates the highest standards of scholarly writing and research methodology.'}

This academic paper showcases excellence in research, analysis, and presentation. The work follows rigorous academic standards and demonstrates deep understanding of the subject matter.

Key Research Findings:

1. Comprehensive Literature Review
The research begins with an extensive review of current literature in the field, synthesizing key findings from leading scholars and identifying gaps in existing knowledge. This foundation provides the necessary context for the original research presented.

2. Methodological Approach
The study employs rigorous research methodologies appropriate for the academic level and subject matter. Quantitative and qualitative data collection methods are used where applicable, with careful attention to validity and reliability.

3. Original Analysis
The paper presents original analysis and insights that contribute meaningfully to the academic discourse in the field. Arguments are well-structured, evidence-based, and demonstrate critical thinking skills.

4. Professional Formatting
All citations and references follow the specified academic style guide. The paper maintains consistent formatting throughout and includes all required sections such as abstract, introduction, literature review, methodology, findings, discussion, and conclusion.

5. Quality Assurance
This work has undergone rigorous quality assurance processes, including:
- Thorough research and fact-checking
- Multiple rounds of editing and proofreading  
- Plagiarism detection and originality verification
- Academic standard compliance review

The research methodology employed in this study ensures reliability and validity of findings. Primary and secondary sources have been carefully selected and analyzed to provide comprehensive insights into the topic.

The analysis reveals significant patterns and trends that contribute to our understanding of the subject matter. These findings have important implications for both theoretical understanding and practical applications in the field.

The paper concludes with recommendations for future research and practical applications of the findings. The work demonstrates mastery of academic writing conventions and provides valuable contributions to the scholarly discourse.

This sample represents the high-quality academic work that consistently achieves top grades while maintaining the highest standards of academic integrity and scholarly excellence.`;

  return (
    <div className="min-h-screen bg-secondary/30 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-lg shadow-card p-8">
              {/* Header */}
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-primary mb-4 leading-tight">
                  {sample.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    <span>Pages {sample.pages || 3} ({wordCount} words)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>Views {views}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  <Badge variant="outline">{sample.category}</Badge>
                  <Badge variant="outline">{sample.academic_level}</Badge>
                  <Badge variant="outline">{sample.subject}</Badge>
                </div>
              </div>

              {/* Content Section */}
              <div className="mb-6">
                {sample.file_url && sample.file_url.endsWith('.pdf') ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-primary">
                        Full Document Preview
                      </h2>
                      <Button 
                        variant="outline" 
                        onClick={() => window.open(sample.file_url, '_blank')}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </Button>
                    </div>
                    <PDFViewer 
                      fileUrl={sample.file_url} 
                      title={sample.title}
                      maxHeight="70vh"
                      onDownload={() => window.open(sample.file_url, '_blank')}
                    />
                  </div>
                ) : (
                  <div className="prose prose-gray max-w-none">
                    <h2 className="text-xl font-semibold text-primary mb-4">
                      {sample.subject}: Academic Excellence Demonstrated
                    </h2>
                    
                    <div className="whitespace-pre-line text-foreground leading-relaxed">
                      {fullContent}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* CTA Card */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-primary">
                  Get quality help now
                </h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center">
                      <Shield className="h-4 w-4 text-accent" />
                    </div>
                    <div>
                      <p className="font-medium">100% Plagiarism Free</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-accent" />
                    </div>
                    <div>
                      <p className="font-medium">Strictly Following instruction</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center">
                      <Clock className="h-4 w-4 text-accent" />
                    </div>
                    <div>
                      <p className="font-medium">Never miss deadlines</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 bg-accent/20 rounded-full border-2 border-background flex items-center justify-center">
                      <Users className="h-3 w-3 text-accent" />
                    </div>
                    <div className="w-8 h-8 bg-primary/20 rounded-full border-2 border-background flex items-center justify-center">
                      <Users className="h-3 w-3 text-primary" />
                    </div>
                    <div className="w-8 h-8 bg-accent/20 rounded-full border-2 border-background flex items-center justify-center">
                      <Users className="h-3 w-3 text-accent" />
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {Math.floor(Math.random() * 50) + 100} writers online
                  </span>
                </div>

                <Link to="/contact" className="w-full">
                  <Button className="w-full bg-gradient-hero hover:opacity-90 transition-opacity">
                    Hire Writer
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Sample Info */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Document Information</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Category:</span>
                    <span className="font-medium">{sample.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Level:</span>
                    <span className="font-medium">{sample.academic_level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subject:</span>
                    <span className="font-medium">{sample.subject}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pages:</span>
                    <span className="font-medium">{sample.pages || 3}</span>
                  </div>
                  {sample.file_size && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">File Size:</span>
                      <span className="font-medium">{(sample.file_size / 1024).toFixed(1)} KB</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Back to Samples */}
            <Link to="/samples">
              <Button variant="outline" className="w-full">
                ← Back to Samples
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SampleDetail;