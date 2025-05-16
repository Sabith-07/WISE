import twilio from 'twilio';

// Initialize Twilio client
const twilioClient = twilio(
  process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID,
  process.env.NEXT_PUBLIC_TWILIO_AUTH_TOKEN
);

interface SendSMSProps {
  to: string;
  message: string;
}

export async function sendSMSNotification({ to, message }: SendSMSProps) {
  try {
    // Validate Indian mobile number format
    const indianNumberRegex = /^(\+91|91)?[6-9]\d{9}$/;
    if (!indianNumberRegex.test(to)) {
      throw new Error('Invalid Indian mobile number format');
    }

    // Ensure number starts with +91
    const formattedNumber = to.startsWith('+91') ? to : `+91${to.replace(/^91/, '')}`;

    const response = await twilioClient.messages.create({
      body: message,
      to: formattedNumber,
      from: process.env.NEXT_PUBLIC_TWILIO_PHONE_NUMBER,
    });

    return {
      success: true,
      messageId: response.sid,
    };
  } catch (error) {
    console.error('SMS notification error:', error);
    throw error;
  }
} 