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
    const { phone, otp } = req.body;

    // 🔴 Validation
    if (!phone || !otp) {
      return res.status(400).json({
        error: "Phone and OTP are required",
      });
    }

    // ✅ Verify OTP with Twilio
    const verificationCheck = await client.verify.v2
      .services(process.env.VERIFY_SID)
      .verificationChecks.create({
        to: phone,
        code: otp,
      });

    // 🔴 Check result
    if (verificationCheck.status !== "approved") {
      return res.status(400).json({
        success: false,
        error: "Invalid OTP",
      });
    }

    // ✅ Success → return UID
    return res.status(200).json({
      success: true,
      uid: phone, // stable UID
      message: "OTP verified successfully",
    });

  } catch (e) {
    console.error("VERIFY OTP ERROR:", e.message);

    return res.status(500).json({
      success: false,
      error: e.message,
    });
  }
};