const twilio = require("twilio");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,   // ✅ Use consistent variable names
  process.env.TWILIO_AUTH_TOKEN
);

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ error: "Phone number is required" });
    }

    if (!phone.startsWith("+91")) {
      return res.status(400).json({
        error: "Phone must include country code (e.g. +91...)",
      });
    }

    // ✅ Use Verify Service SID (VAxxxxxxxx)
    await client.verify.v2.services(process.env.TWILIO_VERIFY_SID)
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
    return res.status(500).json({ success: false, error: e.message });
  }
};
