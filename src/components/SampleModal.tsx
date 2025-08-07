import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Star, FileText, Calendar, User, Download } from "lucide-react";
import { Link } from "react-router-dom";
import PDFViewer from "@/components/PDFViewer";

interface Sample {
  id?: string;
  title: string;
  category?: string;
  academic_level?: string;
  type: string;
  level: string;
  pages: number;
  subject: string;
  grade: string;
  description?: string;
  excerpt?: string;
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

  // Use actual description from database, with minimal fallback
  const fullContent = sample.description || sample.excerpt || `This ${sample.level} level ${sample.subject} paper provides comprehensive academic analysis and research.

The work demonstrates excellence in scholarly writing through:
- Rigorous research methodology
- Professional academic formatting
- Original analysis and insights  
- Proper citation and referencing
- Quality assurance standards

This sample represents the high-quality academic work that consistently achieves excellent grades while maintaining academic integrity standards appropriate for ${sample.level} level studies.`;

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
                <div className="w-full">
                  <div className="text-muted-foreground text-sm mb-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Download className="h-4 w-4 text-primary" />
                      <strong className="text-primary">Download Required</strong>
                    </div>
                    <p>This is a limited preview. Download the complete sample to view the full document with all formatting, citations, and content.</p>
                  </div>
                  <PDFViewer 
                    fileUrl={sample.file_url} 
                    title={sample.title}
                    maxHeight="45vh"
                    onDownload={() => window.open(sample.file_url!, '_blank')}
                  />
                </div>
              ) : (
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <div className="text-muted-foreground text-sm mb-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Download className="h-4 w-4 text-primary" />
                      <strong className="text-primary">Download Required</strong>
                    </div>
                    <p>This is a limited preview. Download the complete sample to view the full document with all formatting, citations, and content.</p>
                  </div>
                  <h3 className="text-lg font-semibold text-primary mb-3">Abstract</h3>
                  
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