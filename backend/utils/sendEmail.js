const SibApiV3Sdk = require('@getbrevo/brevo');

const sendEmail = async ({ to, subject, html }) => {
  try {
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

    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('✅ Email sent via Brevo API:', result.body?.messageId);
    return result;
  } catch (error) {
    console.error('❌ sendEmail error:', error.message);
    throw error;
  }
};

module.exports = sendEmail;