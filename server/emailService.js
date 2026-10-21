
async function sendEmail({ to, subject, text }) {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;

  if (!apiKey || !senderEmail || !to) {
    console.warn("Email skipped: missing Brevo configuration.");
    return false;
  }

  try {
    const response = await fetch(
      "https://api.brevo.com/v3/smtp/email",
      {
        method: "POST",
        headers: {
          accept: "application/json",
          "api-key": apiKey,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          sender: {
            name: "Eventora",
            email: senderEmail,
          },
          to: [{ email: to }],
          subject,
          textContent: text,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Brevo email failed:", response.status, errorText);
      return false;
    }

    console.log("Brevo accepted email:", subject);
    return true;
  } catch (error) {
    console.error("Email service error:", error.message);
    return false;
  }
}

module.exports = { sendEmail };
