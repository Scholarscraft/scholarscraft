import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Upload, FileText, Star, Eye, Download, Trash2, Plus } from "lucide-react";

interface SamplePaper {
  id: string;
  title: string;
  description: string;
  category: string;
  academic_level: string;
  subject: string;
  pages: number;
  file_url: string;
  file_name: string;
  file_size: number;
  preview_available: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

interface SamplePaperForm {
  title: string;
  description: string;
  category: string;
  academic_level: string;
  subject: string;
  pages: number;
  is_featured: boolean;
}

const categories = [
  "Essay",
  "Research Paper", 
  "Case Study",
  "Dissertation",
  "Thesis",
  "Report",
  "Assignment",
  "Term Paper"
];

const academicLevels = [
  "High School",
  "College",
  "University",
  "Master's",
  "PhD"
];

const subjects = [
  "English",
  "History", 
  "Psychology",
  "Business",
  "Science",
  "Mathematics",
  "Literature",
  "Philosophy",
  "Sociology",
  "Economics",
  "Other"
];

export function SamplePapersManager() {
  const { toast } = useToast();
  const [papers, setPapers] = useState<SamplePaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<SamplePaperForm>({
    title: "",
    description: "",
    category: "",
    academic_level: "",
    subject: "",
    pages: 1,
    is_featured: false
  });

  useEffect(() => {
    fetchSamplePapers();
  }, []);

  const fetchSamplePapers = async () => {
    try {
      const { data, error } = await supabase
        .from('sample_papers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPapers(data || []);
    } catch (error) {
      console.error('Error fetching sample papers:', error);
      toast({
        title: "Error",
        description: "Failed to fetch sample papers",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type (PDF, DOC, DOCX)
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid File Type",
          description: "Please upload a PDF, DOC, or DOCX file",
          variant: "destructive",
        });
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File Too Large", 
          description: "File size must be less than 10MB",
          variant: "destructive",
        });
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !formData.title || !formData.category || !formData.academic_level || !formData.subject) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and select a file",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      // Generate unique filename
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${formData.category.toLowerCase()}/${fileName}`;

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('sample-papers')
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('sample-papers')
        .getPublicUrl(filePath);

      // Save paper details to database
      const { error: dbError } = await supabase
        .from('sample_papers')
        .insert({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          academic_level: formData.academic_level,
          subject: formData.subject,
          pages: formData.pages,
          file_url: publicUrl,
          file_name: selectedFile.name,
          file_size: selectedFile.size,
          is_featured: formData.is_featured,
          preview_available: selectedFile.type === 'application/pdf'
        });

      if (dbError) throw dbError;

      toast({
        title: "Success",
        description: "Sample paper uploaded successfully",
      });

      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "",
        academic_level: "",
        subject: "",
        pages: 1,
        is_featured: false
      });
      setSelectedFile(null);
      setShowUploadDialog(false);
      fetchSamplePapers();

    } catch (error) {
      console.error('Error uploading sample paper:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload sample paper",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const toggleFeatured = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('sample_papers')
        .update({ is_featured: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      setPapers(papers.map(paper => 
        paper.id === id ? { ...paper, is_featured: !currentStatus } : paper
      ));

      toast({
        title: "Success",
        description: `Paper ${!currentStatus ? 'featured' : 'unfeatured'} successfully`,
      });
    } catch (error) {
      console.error('Error updating featured status:', error);
      toast({
        title: "Error",
        description: "Failed to update featured status",
        variant: "destructive",
      });
    }
  };

  const deletePaper = async (id: string, filePath: string) => {
    try {
      // Extract file path from URL
      const urlParts = filePath.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const category = urlParts[urlParts.length - 2];
      const fullPath = `${category}/${fileName}`;

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('sample-papers')
        .remove([fullPath]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('sample_papers')
        .delete()
        .eq('id', id);

      if (dbError) throw dbError;

      setPapers(papers.filter(paper => paper.id !== id));

      toast({
        title: "Success",
        description: "Sample paper deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting sample paper:', error);
      toast({
        title: "Error",
        description: "Failed to delete sample paper",
        variant: "destructive",
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">Loading sample papers...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Sample Papers Management</h2>
          <p className="text-muted-foreground">Upload and manage sample papers for the website</p>
        </div>
        <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Upload Sample Paper
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Upload New Sample Paper</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Title *</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Enter paper title"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Pages</label>
                  <Input
                    type="number"
                    min={1}
                    value={formData.pages}
                    onChange={(e) => setFormData({...formData, pages: parseInt(e.target.value) || 1})}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Brief description of the paper"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Category *</label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Academic Level *</label>
                  <Select value={formData.academic_level} onValueChange={(value) => setFormData({...formData, academic_level: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      {academicLevels.map((level) => (
                        <SelectItem key={level} value={level}>{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Subject *</label>
                  <Select value={formData.subject} onValueChange={(value) => setFormData({...formData, subject: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">File Upload *</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-border rounded-md">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                    <div className="flex text-sm text-muted-foreground">
                      <label className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80">
                        <span>Upload a file</span>
                        <input
                          type="file"
                          className="sr-only"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileSelect}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-muted-foreground">PDF, DOC, DOCX up to 10MB</p>
                    {selectedFile && (
                      <p className="text-sm text-primary font-medium">{selectedFile.name}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({...formData, is_featured: e.target.checked})}
                />
                <label htmlFor="featured" className="text-sm font-medium">Mark as featured</label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpload} disabled={uploading}>
                  {uploading ? "Uploading..." : "Upload Paper"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sample Papers ({papers.length})</CardTitle>
          <CardDescription>Manage uploaded sample papers</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Uploaded</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {papers.map((paper) => (
                <TableRow key={paper.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4" />
                      <div>
                        <div>{paper.title}</div>
                        <div className="text-sm text-muted-foreground">{paper.pages} pages</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{paper.category}</TableCell>
                  <TableCell>{paper.academic_level}</TableCell>
                  <TableCell>{paper.subject}</TableCell>
                  <TableCell>{formatFileSize(paper.file_size)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      {paper.is_featured && (
                        <Badge variant="default">
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                      {paper.preview_available && (
                        <Badge variant="secondary">
                          <Eye className="h-3 w-3 mr-1" />
                          Preview
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{format(new Date(paper.created_at), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleFeatured(paper.id, paper.is_featured)}
                      >
                        <Star className={`h-4 w-4 ${paper.is_featured ? 'fill-current' : ''}`} />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(paper.file_url, '_blank')}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deletePaper(paper.id, paper.file_url)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {papers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No sample papers uploaded yet
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}