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

    // Input validation
    if (!name || name.length > 100 || name.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Invalid name" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email) || email.length > 255) {
      return new Response(
        JSON.stringify({ error: "Invalid email" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (phone && phone.length > 20) {
      return new Response(
        JSON.stringify({ error: "Invalid phone" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!subject || subject.length > 200 || subject.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Invalid subject" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (message && message.length > 5000) {
      return new Response(
        JSON.stringify({ error: "Message too long" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const pagesNum = parseInt(pages);
    if (isNaN(pagesNum) || pagesNum < 1 || pagesNum > 1000) {
      return new Response(
        JSON.stringify({ error: "Invalid pages" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Rate limiting
    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    
    const { data: rateLimitData, error: rateLimitError } = await supabase
      .from('quote_submission_rate_limit')
      .select('*')
      .eq('ip_address', ipAddress)
      .eq('email', email)
      .single();

    if (rateLimitData) {
      const timeSinceFirst = new Date().getTime() - new Date(rateLimitData.first_submission_at).getTime();
      const minutesSinceFirst = timeSinceFirst / (1000 * 60);
      
      if (minutesSinceFirst < 60 && rateLimitData.submission_count >= 3) {
        console.warn(`Rate limit exceeded for ${email} from ${ipAddress}`);
        return new Response(
          JSON.stringify({ error: "Too many requests. Please try again later." }),
          { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      await supabase
        .from('quote_submission_rate_limit')
        .update({
          submission_count: rateLimitData.submission_count + 1,
          last_submission_at: new Date().toISOString()
        })
        .eq('id', rateLimitData.id);
    } else {
      await supabase
        .from('quote_submission_rate_limit')
        .insert({
          ip_address: ipAddress,
          email: email,
          submission_count: 1
        });
    }

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
      from: "ScholarsCraft <hello@scholarscraft.com>",
      to: [email],
      subject: "Quote Request Received - ScholarsCraft Academic Services",
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
          
          <p>If you have any urgent questions, feel free to contact us via WhatsApp at <a href="https://wa.me/+14802471779">+1 (480) 247-1779</a>.</p>
          
          <p>Best regards,<br>
          The ScholarsCraft Team</p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="font-size: 12px; color: #6b7280; text-align: center;">
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
      `,
    });

    // Send notification email to admin
    const adminEmailResponse = await resend.emails.send({
      from: "ScholarsCraft <hello@scholarscraft.com>",
      to: ["support@scholarscraft.com"],
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
      JSON.stringify({ error: "An error occurred processing your request" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);