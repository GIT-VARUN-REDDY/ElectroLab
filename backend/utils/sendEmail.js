const sendEmail = async ({ to, subject, html }) => {
  console.log('📧 sendEmail called for:', to);
  console.log('📧 Subject:', subject);
  console.log('📧 BREVO_API_KEY exists:', !!process.env.BREVO_API_KEY);
  console.log('📧 BREVO_API_KEY starts with:', process.env.BREVO_API_KEY?.slice(0, 10));
  console.log('📧 FROM_EMAIL:', process.env.FROM_EMAIL);
  console.log('📧 FROM_NAME:', process.env.FROM_NAME);

  try {
    const SibApiV3Sdk = require('@getbrevo/brevo');
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    apiInstance.setApiKey(
      SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
      process.env.BREVO_API_KEY
    );

    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = html;
    sendSmtpEmail.sender = {
      name: process.env.FROM_NAME || 'ElectroLab',
      email: process.env.FROM_EMAIL || 'noreply@electrolab.com',
    };
    sendSmtpEmail.to = [{ email: to }];

    console.log('📧 Sending email via Brevo API...');
    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('✅ Email sent successfully to:', to);
    console.log('✅ Message ID:', result?.body?.messageId || result?.response?.body?.messageId);
    return result;
  } catch (error) {
    console.error('❌ sendEmail FULL ERROR:', error);
    console.error('❌ sendEmail error message:', error.message);
    console.error('❌ sendEmail error status:', error.status);
    console.error('❌ sendEmail error response:', JSON.stringify(error.response?.body || {}));
    throw error;
  }
};

module.exports = sendEmail;