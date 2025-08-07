import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Star, FileText, Calendar, User, Download } from "lucide-react";
import { Link } from "react-router-dom";

interface Sample {
  id?: string;
  title: string;
  type: string;
  level: string;
  pages: number;
  subject: string;
  grade: string;
  excerpt: string;
  features: string[];
  file_url?: string;
  preview_available?: boolean;
}

interface SampleModalProps {
  sample: Sample | null;
  isOpen: boolean;
  onClose: () => void;
}

const SampleModal = ({ sample, isOpen, onClose }: SampleModalProps) => {
  if (!sample) return null;

  const fullContent = `${sample.excerpt}

This comprehensive academic work demonstrates the highest standards of scholarly writing and research methodology. The paper follows proper academic formatting guidelines and includes extensive citation of relevant sources.

Key Research Findings:

1. Comprehensive Literature Review
The research begins with an extensive review of current literature in the field, synthesizing key findings from leading scholars and identifying gaps in existing knowledge. This foundation provides the necessary context for the original research presented.

2. Methodological Approach
The study employs rigorous research methodologies appropriate for the academic level and subject matter. Quantitative and qualitative data collection methods are used where applicable, with careful attention to validity and reliability.

3. Original Analysis
The paper presents original analysis and insights that contribute meaningfully to the academic discourse in the field. Arguments are well-structured, evidence-based, and demonstrate critical thinking skills.

4. Professional Formatting
All citations and references follow the specified academic style guide (${sample.features.find(f => f.includes('Format')) || 'Standard Academic Format'}). The paper maintains consistent formatting throughout and includes all required sections.

5. Quality Assurance
This work has undergone rigorous quality assurance processes, including:
- Thorough research and fact-checking
- Multiple rounds of editing and proofreading
- Plagiarism detection and originality verification
- Academic standard compliance review

The final result is a piece of academic writing that meets the highest standards of scholarly work and serves as an excellent example of quality academic writing at the ${sample.level} level.

This sample demonstrates our commitment to academic excellence and our ability to produce work that consistently achieves top grades while maintaining the highest standards of academic integrity.`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-xl leading-tight pr-4">
                {sample.title}
              </DialogTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline">{sample.type}</Badge>
                <div className="flex items-center space-x-1 bg-accent/10 px-2 py-1 rounded">
                  <Star className="h-4 w-4 text-accent" />
                  <span className="text-sm font-semibold text-accent">{sample.grade}</span>
                </div>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Metadata */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-secondary/50 rounded-lg p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Document Info
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Level:</span>
                  <span className="font-medium">{sample.level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subject:</span>
                  <span className="font-medium">{sample.subject}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pages:</span>
                  <span className="font-medium">{sample.pages}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Grade:</span>
                  <span className="font-medium text-accent">{sample.grade}</span>
                </div>
              </div>
            </div>

            <div className="bg-secondary/50 rounded-lg p-4">
              <h3 className="font-semibold mb-3">Features</h3>
              <div className="flex flex-wrap gap-2">
                {sample.features.map((feature, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Button className="w-full" asChild>
                <Link to="/contact" onClick={onClose}>
                  Order Similar Paper
                </Link>
              </Button>
              <Button className="w-full" variant="secondary" asChild>
                <Link to={`/samples/${sample.id || sample.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} onClick={onClose}>
                  View Full Text
                </Link>
              </Button>
              <Button 
                variant="outline" 
                className="w-full" 
                disabled={!sample.file_url}
                onClick={() => {
                  if (sample.file_url) {
                    window.open(sample.file_url, '_blank');
                  }
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Sample
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-2">
            <ScrollArea className="h-[60vh] pr-4">
              {sample.file_url && sample.file_url.endsWith('.pdf') ? (
                <div className="w-full h-full">
                  <div className="text-muted-foreground text-sm mb-4 p-3 bg-muted/50 rounded-lg border-l-4 border-primary">
                    <strong>Document Preview:</strong> This is a preview of the actual sample paper. Download the full document for the complete content.
                  </div>
                  <iframe
                    src={`${sample.file_url}#view=FitH`}
                    className="w-full h-[50vh] border border-border rounded-lg"
                    title="Sample Paper Preview"
                  />
                </div>
              ) : (
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <div className="text-muted-foreground text-sm mb-4 p-3 bg-muted/50 rounded-lg border-l-4 border-primary">
                    <strong>Note:</strong> This is a preview of the academic work. The full document contains additional research, analysis, and properly formatted citations.
                  </div>
                  
                  <div className="whitespace-pre-line text-sm leading-relaxed">
                    {fullContent}
                  </div>
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SampleModal;