import emailjs from "@emailjs/react-native";
// EMAILJSL: EMail Provider
const SERVICE_ID = "service_xafrl9z";
const TEMPLATE_ID = "template_9q0yw5i";
const EMAILJS_PUBLIC_KEY = "ZQcFpx8GBt-59-Q_0";

// TWILIO : SMS PROVIDER
const accountSid = "ACed6e83a2d9a5cc0d79eec23705ae1142";
const authToken = "3a4bdf7cc16ecdeeee7e79a16426a6b6";
const twilioNumber = "+19542803027";

export const sendSmsOtp = async (phone, otp) => {
  try {
    const headers = new Headers({
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + btoa(`${accountSid}:${authToken}`),
    });

    const body = new URLSearchParams({
      To: "+" + phone,
      From: twilioNumber,
      Body: `The OTP code for verifying your 1Fi account is ${otp}. This code is valid for the next 5 minutes. Please use it to complete your verification process.`,
    });

    const response = await fetch(
      "https://api.twilio.com/2010-04-01/Accounts/" +
        accountSid +
        "/Messages.json",
      {
        method: "POST",
        headers: headers,
        body: body.toString(),
      }
    );

    const data = await response.json();
    if (data.error_message) {
      console.error("Error sending SMS:", data.error_message);
    } else {
      console.log("SMS sent successfully:", data);
    }
  } catch (error) {
    console.error("Error sending SMS:", error);
  }
};

export const sendEmailOtp = async (email, otp) => {
  // Send OTP via EmailJS
  try {
    const templateParams = {
      from_name: "1Fi",
      to_email: email,
      email_otp: otp,
    };

    await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, {
      publicKey: EMAILJS_PUBLIC_KEY,
    });
  } catch (error) {
    console.error("Failed to send Email OTP:", error);
  }
};

export const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP
};
