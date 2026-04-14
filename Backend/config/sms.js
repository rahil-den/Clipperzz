import twilio from "twilio";

/**
 * Twilio SMS Client
 * Uses TWILIO_SID, TWILIO_TOKEN, and TWILIO_NO from .env
 */
const client = new twilio(
    process.env.TWILIO_SID,
    process.env.TWILIO_TOKEN
);

// ─── Welcome SMS (sent after email verification) ─────────────────────────────

/**
 * Sends a warm welcome SMS to the user after successful registration.
 *
 * @param {string} toPhone     - user's phone number (digits only, e.g. "9876543210")
 * @param {string} countryCode - country code with + prefix (e.g. "+91")
 * @param {string} userName    - user's full name
 */
export const sendWelcomeSMS = async (toPhone, countryCode, userName) => {
    const firstName = userName.split(" ")[0];
    const fullNumber = `${countryCode}${toPhone}`;

    const message = `🎉 Hey ${firstName}! Welcome to Clipperz!\n\nYour account is now live and ready to go. Start turning your long videos into viral short clips with the power of AI.\n\n🚀 Head to your dashboard to create your first clip!\n\n— Team Clipperz ⚡`;

    try {
        const response = await client.messages.create({
            body: message,
            from: process.env.TWILIO_NO,
            to: fullNumber,
        });

        console.log(`[sms] Welcome SMS sent to ${fullNumber} | SID: ${response.sid}`);
        return response;
    } catch (error) {
        console.error(`[sms] Failed to send SMS to ${fullNumber}:`, error.message);
        throw error;
    }
};
