import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ConfirmationEmailRequest {
  email: string;
  confirmationLink: string;
  displayName?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, confirmationLink, displayName }: ConfirmationEmailRequest = await req.json();

    const emailResponse = await resend.emails.send({
      from: "ScholarsCraft <admin@gmail.com>",
      to: [email],
      subject: "Confirm Your Email - ScholarsCraft",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Confirm Your Email</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 40px 0; text-align: center;">
                <table role="presentation" style="width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                  <tr>
                    <td style="padding: 40px;">
                      <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #2563eb; margin: 0; font-size: 28px; font-weight: bold;">ScholarsCraft</h1>
                        <p style="color: #6b7280; margin: 5px 0 0 0; font-size: 14px;">Academic Writing Services</p>
                      </div>
                      
                      <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px; text-align: center;">Welcome${displayName ? `, ${displayName}` : ''}!</h2>
                      
                      <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
                        Thank you for signing up with ScholarsCraft! To complete your registration, please confirm your email address by clicking the button below.
                      </p>
                      
                      <div style="text-align: center; margin: 30px 0;">
                        <a href="${confirmationLink}" 
                           style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 14px 30px; border-radius: 6px; font-weight: bold; font-size: 16px;">
                          Confirm Email Address
                        </a>
                      </div>
                      
                      <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 25px 0;">
                        Once confirmed, you'll have access to:
                      </p>
                      
                      <ul style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0; padding-left: 20px;">
                        <li>Professional academic writing services</li>
                        <li>Expert writers in your field</li>
                        <li>24/7 customer support</li>
                        <li>Plagiarism-free guarantee</li>
                      </ul>
                      
                      <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 25px 0 0 0;">
                        If you did not create an account, please ignore this email.
                      </p>
                      
                      <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 15px 0 0 0;">
                        This link will expire in 24 hours for security reasons.
                      </p>
                      
                      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                      
                      <div style="text-align: center;">
                        <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                          ScholarsCraft<br>
                          Professional Academic Writing Services
                        </p>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    console.log("Confirmation email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, message: "Confirmation email sent successfully" }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending confirmation email:", error);
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