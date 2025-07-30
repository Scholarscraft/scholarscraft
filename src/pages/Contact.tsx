import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  MessageCircle, 
  Mail, 
  Phone, 
  Clock, 
  Upload,
  Send
} from "lucide-react";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    service: "",
    deadline: "",
    pages: "",
    academicLevel: "",
    message: "",
    files: null as FileList | null
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would typically send the form data to your backend
    console.log("Form submitted:", formData);
    
    toast({
      title: "Quote Request Sent!",
      description: "We'll get back to you within 2 hours with a custom quote.",
    });
    
    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      service: "",
      deadline: "",
      pages: "",
      academicLevel: "",
      message: "",
      files: null
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, files: e.target.files }));
  };

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary-light py-20 text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Get Your Free Quote
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
            Ready to excel in your studies? Get a personalized quote for your academic writing project.
          </p>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Information */}
            <div className="lg:col-span-1">
              <h2 className="text-2xl font-bold text-foreground mb-6">Get In Touch</h2>
              <p className="text-muted-foreground mb-8">
                We're here to help you succeed. Contact us through any of these channels for immediate assistance.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-accent text-accent-foreground p-3 rounded-lg">
                    <MessageCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">WhatsApp</h3>
                    <p className="text-muted-foreground">+1 (234) 567-8900</p>
                    <Button variant="link" className="p-0 h-auto" asChild>
                      <a href="https://wa.me/+1234567890" target="_blank" rel="noopener noreferrer">
                        Chat Now
                      </a>
                    </Button>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-primary text-primary-foreground p-3 rounded-lg">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Email</h3>
                    <p className="text-muted-foreground">support@scholarcraft.com</p>
                    <Button variant="link" className="p-0 h-auto" asChild>
                      <a href="mailto:support@scholarcraft.com">Send Email</a>
                    </Button>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-accent text-accent-foreground p-3 rounded-lg">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Response Time</h3>
                    <p className="text-muted-foreground">Within 2 hours</p>
                    <p className="text-sm text-muted-foreground">24/7 customer support</p>
                  </div>
                </div>
              </div>

              <Card className="mt-8 border-accent">
                <CardHeader>
                  <CardTitle className="text-accent">Need Urgent Help?</CardTitle>
                  <CardDescription>
                    For urgent orders or immediate assistance, contact us directly via WhatsApp.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="premium" className="w-full" asChild>
                    <a href="https://wa.me/+1234567890" target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="h-4 w-4" />
                      WhatsApp Us Now
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Quote Form */}
            <div className="lg:col-span-2">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-2xl">Request Your Free Quote</CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll send you a personalized quote within 2 hours.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          required
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          required
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          placeholder="+1 (234) 567-8900"
                        />
                      </div>
                      <div>
                        <Label htmlFor="subject">Subject/Topic *</Label>
                        <Input
                          id="subject"
                          value={formData.subject}
                          onChange={(e) => handleInputChange("subject", e.target.value)}
                          required
                          placeholder="Enter your paper topic"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="service">Service Type *</Label>
                        <Select value={formData.service} onValueChange={(value) => handleInputChange("service", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select service type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="essay">Essay Writing</SelectItem>
                            <SelectItem value="research">Research Paper</SelectItem>
                            <SelectItem value="dissertation">Dissertation</SelectItem>
                            <SelectItem value="thesis">Thesis</SelectItem>
                            <SelectItem value="case-study">Case Study</SelectItem>
                            <SelectItem value="editing">Editing & Proofreading</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="academicLevel">Academic Level *</Label>
                        <Select value={formData.academicLevel} onValueChange={(value) => handleInputChange("academicLevel", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select academic level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="high-school">High School</SelectItem>
                            <SelectItem value="undergraduate">Undergraduate</SelectItem>
                            <SelectItem value="graduate">Graduate/Master's</SelectItem>
                            <SelectItem value="phd">PhD/Doctoral</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="pages">Number of Pages *</Label>
                        <Input
                          id="pages"
                          type="number"
                          min="1"
                          value={formData.pages}
                          onChange={(e) => handleInputChange("pages", e.target.value)}
                          required
                          placeholder="e.g., 5"
                        />
                      </div>
                      <div>
                        <Label htmlFor="deadline">Deadline *</Label>
                        <Input
                          id="deadline"
                          type="date"
                          value={formData.deadline}
                          onChange={(e) => handleInputChange("deadline", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="message">Additional Instructions</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => handleInputChange("message", e.target.value)}
                        placeholder="Provide any specific requirements, formatting guidelines, or additional details..."
                        rows={4}
                      />
                    </div>

                    <div>
                      <Label htmlFor="files">Upload Files (Optional)</Label>
                      <div className="mt-2">
                        <label htmlFor="files" className="flex items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-accent transition-colors">
                          <div className="text-center">
                            <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">
                              Click to upload or drag and drop
                            </p>
                            <p className="text-xs text-muted-foreground">
                              PDF, DOC, DOCX (Max 10MB)
                            </p>
                          </div>
                          <input
                            id="files"
                            type="file"
                            multiple
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>

                    <Button type="submit" variant="academic" size="lg" className="w-full">
                      <Send className="h-4 w-4" />
                      Send Quote Request
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;