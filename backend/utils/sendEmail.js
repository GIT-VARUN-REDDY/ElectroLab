const https = require('https');

const sendEmail = ({ to, subject, html }) => {
  return new Promise((resolve, reject) => {
    const apiKey = process.env.BREVO_API_KEY;
    const fromEmail = process.env.FROM_EMAIL;
    const fromName = process.env.FROM_NAME || 'ElectroLab';

    if (!apiKey) {
      return reject(new Error('BREVO_API_KEY is not configured'));
    }

    if (!fromEmail) {
      return reject(new Error('FROM_EMAIL is not configured'));
    }

    const payload = JSON.stringify({
      sender: {
        name: fromName,
        email: fromEmail,
      },
      to: [
        {
          email: to,
        },
      ],
      subject,
      htmlContent: html,
    });

    const options = {
      hostname: 'api.brevo.com',
      path: '/v3/smtp/email',
      method: 'POST',
      headers: {
        accept: 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json',
        'content-length': Buffer.byteLength(payload),
      },
    };

    const request = https.request(options, (response) => {
      let body = '';

      response.on('data', (chunk) => {
        body += chunk;
      });

      response.on('end', () => {
        if (response.statusCode >= 200 && response.statusCode < 300) {
          let result;

          try {
            result = JSON.parse(body);
          } catch {
            result = body;
          }

          console.log('✅ Brevo email sent:', result);

          resolve(result);
        } else {
          console.error(
            '❌ Brevo email failed:',
            response.statusCode,
            body
          );

          reject(
            new Error(
              `Brevo email failed with status ${response.statusCode}: ${body}`
            )
          );
        }
      });
    });

    request.on('error', (error) => {
      console.error('❌ Brevo request error:', error.message);
      reject(error);
    });

    request.setTimeout(30000, () => {
      request.destroy();
      reject(new Error('Brevo API request timed out'));
    });

    request.write(payload);
    request.end();
  });
};

module.exports = sendEmail;