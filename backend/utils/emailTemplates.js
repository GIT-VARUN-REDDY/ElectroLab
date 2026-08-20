const emailTemplates = {
  verifyEmail: (name, verificationUrl) => ({
    subject: '🔌 Verify Your Email — ElectroLab',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; background: #0f0f1a; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 40px auto; background: #1a1a2e; border-radius: 16px; overflow: hidden; border: 1px solid #16213e; }
          .header { background: #4f46e5; padding: 40px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 28px; }
          .body { padding: 40px; color: #e2e8f0; }
          .body h2 { color: #a78bfa; margin-top: 0; }
          .btn { display: inline-block; background: #4f46e5; color: white !important; padding: 16px 40px; border-radius: 50px; text-decoration: none; font-weight: bold; font-size: 16px; margin: 24px 0; }
          .footer { background: #0f0f1a; padding: 20px; text-align: center; color: #64748b; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header"><h1>⚡ ElectroLab</h1></div>
          <div class="body">
            <h2>Hello, ${name}! 👋</h2>
            <p>Welcome to <strong>ElectroLab</strong> — your hub for electronics project training.</p>
            <p>Please verify your email to activate your account.</p>
            <div style="text-align:center;">
              <a href="${verificationUrl}" class="btn">✅ Verify My Email</a>
            </div>
            <p style="color:#94a3b8;font-size:14px;">This link expires in <strong>24 hours</strong>.</p>
          </div>
          <div class="footer"><p>© ${new Date().getFullYear()} ElectroLab. All rights reserved.</p></div>
        </div>
      </body>
      </html>
    `,
  }),

  resetPassword: (name, resetUrl) => ({
    subject: '🔐 Reset Your Password — ElectroLab',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; background: #0f0f1a; margin: 0; }
          .container { max-width: 600px; margin: 40px auto; background: #1a1a2e; border-radius: 16px; overflow: hidden; border: 1px solid #16213e; }
          .header { background: #ef4444; padding: 40px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 28px; }
          .body { padding: 40px; color: #e2e8f0; }
          .btn { display: inline-block; background: #ef4444; color: white !important; padding: 16px 40px; border-radius: 50px; text-decoration: none; font-weight: bold; font-size: 16px; margin: 24px 0; }
          .footer { background: #0f0f1a; padding: 20px; text-align: center; color: #64748b; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header"><h1>🔐 Password Reset</h1></div>
          <div class="body">
            <h2 style="color:#fca5a5;">Hi ${name},</h2>
            <p>Click below to reset your password:</p>
            <div style="text-align:center;">
              <a href="${resetUrl}" class="btn">Reset My Password</a>
            </div>
            <p style="color:#94a3b8;font-size:14px;">This link expires in <strong>1 hour</strong>.</p>
          </div>
          <div class="footer"><p>© ${new Date().getFullYear()} ElectroLab</p></div>
        </div>
      </body>
      </html>
    `,
  }),

  contactAutoReply: (name, subject) => ({
    subject: `✅ We received your message — ${subject}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; background: #0f0f1a; margin: 0; }
          .container { max-width: 600px; margin: 40px auto; background: #1a1a2e; border-radius: 16px; overflow: hidden; border: 1px solid #16213e; }
          .header { background: #0891b2; padding: 40px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 24px; }
          .body { padding: 40px; color: #e2e8f0; }
          .footer { background: #0f0f1a; padding: 20px; text-align: center; color: #64748b; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header"><h1>⚡ ElectroLab</h1></div>
          <div class="body">
            <h2 style="color:#67e8f9;">Hi ${name}!</h2>
            <p>We received your message about <strong>"${subject}"</strong>.</p>
            <p>Our team typically responds within <strong>24-48 hours</strong>.</p>
            <p>Warm regards,<br><strong>The ElectroLab Team</strong></p>
          </div>
          <div class="footer"><p>© ${new Date().getFullYear()} ElectroLab</p></div>
        </div>
      </body>
      </html>
    `,
  }),

  contactAdminNotify: (contact) => ({
    subject: `📩 New Contact — ${contact.subject}`,
    html: `
      <div style="font-family:Arial;padding:20px;background:#f8fafc;">
        <h2 style="color:#4f46e5;">New Contact Form Submission</h2>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:8px;font-weight:bold;">Name:</td><td style="padding:8px;">${contact.name}</td></tr>
          <tr style="background:#f1f5f9;"><td style="padding:8px;font-weight:bold;">Email:</td><td style="padding:8px;">${contact.email}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;">Phone:</td><td style="padding:8px;">${contact.phone || 'N/A'}</td></tr>
          <tr style="background:#f1f5f9;"><td style="padding:8px;font-weight:bold;">Subject:</td><td style="padding:8px;">${contact.subject}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;">Message:</td><td style="padding:8px;">${contact.message}</td></tr>
        </table>
      </div>
    `,
  }),
};

module.exports = emailTemplates;