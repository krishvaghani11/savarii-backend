const twilio = require("twilio");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ error: "Phone and OTP are required" });
    }

    const verificationCheck = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SID)
      .verificationChecks.create({
        to: phone,
        code: otp,
      });

    if (verificationCheck.status !== "approved") {
      return res.status(400).json({ success: false, error: "Invalid OTP" });
    }

    return res.status(200).json({
      success: true,
      uid: phone,
      message: "OTP verified successfully",
    });

  } catch (e) {
    console.error("VERIFY OTP ERROR:", e.message);
    return res.status(500).json({ success: false, error: e.message });
  }
};

