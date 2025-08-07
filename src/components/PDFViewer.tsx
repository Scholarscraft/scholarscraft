import { useState, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download, Maximize } from 'lucide-react';
import { toast } from 'sonner';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

interface PDFViewerProps {
  fileUrl: string;
  title?: string;
  onDownload?: () => void;
  maxHeight?: string;
}

const PDFViewer = ({ fileUrl, title, onDownload, maxHeight = "60vh" }: PDFViewerProps) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
    setError('');
  }, []);

  const onDocumentLoadError = useCallback((error: Error) => {
    console.error('PDF loading error:', error);
    setError('Failed to load PDF. Please try downloading the file.');
    setLoading(false);
    toast.error('Failed to load PDF preview');
  }, []);

  const goToPreviousPage = useCallback(() => {
    setPageNumber(prev => Math.max(prev - 1, 1));
  }, []);

  const goToNextPage = useCallback(() => {
    setPageNumber(prev => Math.min(prev + 1, numPages));
  }, [numPages]);

  const zoomIn = useCallback(() => {
    setScale(prev => Math.min(prev + 0.2, 3.0));
  }, []);

  const zoomOut = useCallback(() => {
    setScale(prev => Math.max(prev - 0.2, 0.5));
  }, []);

  const resetZoom = useCallback(() => {
    setScale(1.0);
  }, []);

  const handleDownload = useCallback(() => {
    if (onDownload) {
      onDownload();
    } else {
      window.open(fileUrl, '_blank');
    }
  }, [fileUrl, onDownload]);

  if (error) {
    return (
      <Card className="p-6 text-center">
        <div className="text-muted-foreground mb-4">{error}</div>
        <Button onClick={handleDownload} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
      </Card>
    );
  }

  return (
    <div className="w-full">
      {/* PDF Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-secondary/50 rounded-t-lg border border-b-0">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPreviousPage}
            disabled={pageNumber <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            Page {pageNumber} of {numPages || '...'}
          </span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={goToNextPage}
            disabled={pageNumber >= numPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" onClick={zoomOut} disabled={scale <= 0.5}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          
          <Button variant="outline" size="sm" onClick={resetZoom}>
            <span className="text-xs">{Math.round(scale * 100)}%</span>
          </Button>
          
          <Button variant="outline" size="sm" onClick={zoomIn} disabled={scale >= 3.0}>
            <ZoomIn className="h-4 w-4" />
          </Button>

          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* PDF Document */}
      <div 
        className="border border-border rounded-b-lg overflow-auto bg-gray-100 dark:bg-gray-800"
        style={{ maxHeight }}
      >
        <div className="flex justify-center min-h-[200px] py-4">
          {loading && (
            <div className="flex items-center justify-center h-64">
              <div className="text-muted-foreground">Loading PDF...</div>
            </div>
          )}
          
          <Document
            file={fileUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading=""
            error=""
            className="flex justify-center"
          >
            <Page
              pageNumber={pageNumber}
              scale={scale}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              className="shadow-lg"
            />
          </Document>
        </div>
      </div>

      {title && (
        <div className="text-xs text-muted-foreground mt-2 p-2 bg-muted/50 rounded">
          <strong>Document:</strong> {title}
        </div>
      )}
    </div>
  );
};

export default PDFViewer;