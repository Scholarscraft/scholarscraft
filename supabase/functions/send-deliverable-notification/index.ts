import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface DeliverableNotificationRequest {
  userId: string;
  title: string;
  orderNumber?: string;
  deliveryNotes?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { userId, title, orderNumber, deliveryNotes }: DeliverableNotificationRequest = await req.json();

    // Get user email from auth
    const { data: authUser, error: authError } = await supabaseClient.auth.admin.getUserById(userId);
    
    if (authError || !authUser.user?.email) {
      throw new Error("Could not find user email");
    }

    // Get user profile for display name
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('display_name')
      .eq('user_id', userId)
      .single();

    const displayName = profile?.display_name || authUser.user.email;

    // Send email notification
    const emailResponse = await resend.emails.send({
      from: "ScholarsWrite <support@scholarscraft.com>",
      to: [authUser.user.email],
      subject: `Your Completed Work is Ready - ${title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
            Your Work is Ready!
          </h1>
          
          <p>Hello ${displayName},</p>
          
          <p>Great news! Your completed work is now available for download in your dashboard.</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #007bff;">Work Details:</h3>
            <p><strong>Title:</strong> ${title}</p>
            ${orderNumber ? `<p><strong>Order Number:</strong> ${orderNumber}</p>` : ''}
            ${deliveryNotes ? `<p><strong>Notes:</strong> ${deliveryNotes}</p>` : ''}
          </div>
          
          <p>To access your completed work:</p>
          <ol>
            <li>Log in to your account</li>
            <li>Go to your Dashboard</li>
            <li>Click on the "Completed Work" tab</li>
            <li>Download your files</li>
          </ol>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${Deno.env.get("SUPABASE_URL")?.replace('supabase.co', 'lovable.app') || 'https://scholarscraft.lovable.app'}/dashboard" 
               style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Access Dashboard
            </a>
          </div>
          
          <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #dee2e6;">
          
          <p style="color: #6c757d; font-size: 14px;">
            Best regards,<br>
            The ScholarsWrite Team<br>
            <a href="mailto:support@scholarscraft.com">support@scholarscraft.com</a>
          </p>
        </div>
      `,
    });

    // Create notification in database
    await supabaseClient
      .from('notifications')
      .insert({
        user_id: userId,
        title: 'Work Completed',
        message: `Your work "${title}" is ready for download`,
        type: 'info'
      });

    console.log("Deliverable notification sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-deliverable-notification function:", error);
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