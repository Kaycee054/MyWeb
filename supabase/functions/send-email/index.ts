import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface EmailRequest {
  type: "contact" | "password-reset";
  to: string;
  name?: string;
  message?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { type, to, name, message }: EmailRequest = await req.json();

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    let emailContent: { subject: string; html: string };

    if (type === "contact") {
      emailContent = {
        subject: `New message from ${name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">New Contact Form Submission</h2>
            <p><strong>From:</strong> ${name}</p>
            <p><strong>Email:</strong> ${to}</p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
              <p><strong>Message:</strong></p>
              <p style="color: #555; line-height: 1.6;">${message?.replace(/\n/g, "<br />")}</p>
            </div>
          </div>
        `,
      };
    } else if (type === "password-reset") {
      emailContent = {
        subject: "Password Reset Link",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Password Reset Request</h2>
            <p>You requested a password reset. This link will expire in 1 hour.</p>
            <p>If you didn't request this, you can safely ignore this email.</p>
          </div>
        `,
      };
    } else {
      throw new Error("Invalid email type");
    }

    const { error } = await supabase.auth.admin.sendRawEmail({
      email: to,
      html: emailContent.html,
      subject: emailContent.subject,
    });

    if (error) {
      throw error;
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error: any) {
    console.error("Email error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Failed to send email",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
