const twilio = require("twilio");

const client = twilio(
  process.env.ACCOUNT_SID,
  process.env.AUTH_TOKEN
);

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { phone } = req.body;

    // 🔴 Validation
    if (!phone) {
      return res.status(400).json({ error: "Phone number is required" });
    }

    // 🔴 Must be international format
    if (!phone.startsWith("+91")) {
      return res.status(400).json({
        error: "Phone must include country code (e.g. +91...)",
      });
    }

    // ✅ Send OTP
    await client.verify.v2.services(process.env.VERIFY_SID)
      .verifications.create({
        to: phone,
        channel: "sms",
      });

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });

  } catch (e) {
    console.error("SEND OTP ERROR:", e.message);

    return res.status(500).json({
      success: false,
      error: e.message,
    });
  }
};