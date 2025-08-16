import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

    // Get the user from the authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Authorization header missing" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Get user from token
    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace("Bearer ", "")
    );

    if (userError || !user) {
      console.log("User authentication failed:", userError);
      return new Response(
        JSON.stringify({ error: "Invalid authentication" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Check if user is admin using the security definer function
    const { data: roleData, error: roleError } = await supabase.rpc('has_role', {
      _user_id: user.id,
      _role: 'admin'
    });

    if (roleError || !roleData) {
      console.log("Admin check failed:", roleError);
      return new Response(
        JSON.stringify({ error: "Access denied. Admin privileges required." }),
        {
          status: 403,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Log the access attempt
    const { error: auditError } = await supabase
      .from('quote_request_audit')
      .insert({
        quote_request_id: '00000000-0000-0000-0000-000000000000',
        accessed_by: user.id,
        access_type: 'BULK_SELECT',
        user_agent: req.headers.get('user-agent') || null,
        ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || null
      });

    if (auditError) {
      console.warn("Failed to log audit entry:", auditError);
    }

    // Fetch quote requests
    const { data: quoteRequests, error: fetchError } = await supabase
      .from('quote_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error("Error fetching quote requests:", fetchError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch quote requests" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log(`Admin ${user.email} accessed ${quoteRequests?.length || 0} quote requests`);

    return new Response(
      JSON.stringify(quoteRequests || []),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in get-quote-requests-with-audit function:", error);
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