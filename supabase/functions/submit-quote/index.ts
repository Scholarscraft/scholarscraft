import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface QuoteRequest {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  service: string;
  deadline: string;
  pages: string;
  academicLevel: string;
  message?: string;
  fileNames?: string[];
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

    const {
      name,
      email,
      phone,
      subject,
      service,
      deadline,
      pages,
      academicLevel,
      message,
      fileNames
    }: QuoteRequest = await req.json();

    console.log("Received quote request:", { name, email, subject, service });

    // Insert quote request into database
    const { data: quoteData, error: dbError } = await supabase
      .from("quote_requests")
      .insert({
        name,
        email,
        phone,
        subject,
        service,
        deadline,
        pages: parseInt(pages),
        academic_level: academicLevel,
        message,
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      throw new Error(`Database error: ${dbError.message}`);
    }

    console.log("Quote request saved to database:", quoteData.id);

    // Send confirmation email to client
    const clientEmailResponse = await resend.emails.send({
      from: "ScholarCraft <noreply@scholarcraft.com>",
      to: [email],
      subject: "Quote Request Received - ScholarCraft Academic Services",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1e40af; text-align: center;">Thank you for your quote request!</h1>
          
          <p>Dear ${name},</p>
          
          <p>We have received your request for academic writing assistance. Our team will review your requirements and we'll get back to you shortly with a personalized quote.</p>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e40af; margin-top: 0;">Request Details:</h3>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Service:</strong> ${service}</p>
            <p><strong>Academic Level:</strong> ${academicLevel}</p>
            <p><strong>Pages:</strong> ${pages}</p>
            <p><strong>Deadline:</strong> ${deadline}</p>
            ${message ? `<p><strong>Additional Instructions:</strong> ${message}</p>` : ''}
            ${fileNames && fileNames.length > 0 ? `<p><strong>Uploaded Files:</strong> ${fileNames.join(', ')}</p>` : ''}
          </div>
          
          <p>If you have any urgent questions, feel free to contact us via WhatsApp at <a href="https://wa.me/+1234567890">+1 (234) 567-8900</a>.</p>
          
          <p>Best regards,<br>
          The ScholarCraft Team</p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="font-size: 12px; color: #6b7280; text-align: center;">
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
      `,
    });

    // Send notification email to admin
    const adminEmailResponse = await resend.emails.send({
      from: "ScholarCraft <noreply@scholarcraft.com>",
      to: ["bennangel4@gmail.com"],
      subject: `New Quote Request from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #dc2626;">New Quote Request</h1>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e40af; margin-top: 0;">Client Information:</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
          </div>
          
          <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #d97706; margin-top: 0;">Project Details:</h3>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Service:</strong> ${service}</p>
            <p><strong>Academic Level:</strong> ${academicLevel}</p>
            <p><strong>Pages:</strong> ${pages}</p>
            <p><strong>Deadline:</strong> ${deadline}</p>
            ${message ? `<p><strong>Additional Instructions:</strong> ${message}</p>` : ''}
            ${fileNames && fileNames.length > 0 ? `<p><strong>Uploaded Files:</strong> ${fileNames.join(', ')}</p>` : ''}
          </div>
          
          <p><strong>Request ID:</strong> ${quoteData.id}</p>
          <p><strong>Submitted:</strong> ${new Date(quoteData.created_at).toLocaleString()}</p>
          
          <p style="color: #dc2626; font-weight: bold;">Please respond to the client shortly.</p>
        </div>
      `,
    });

    console.log("Emails sent successfully");

    return new Response(
      JSON.stringify({
        success: true,
        message: "Quote request submitted successfully",
        requestId: quoteData.id,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in submit-quote function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);