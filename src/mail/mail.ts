import { OAuth2Client } from "google-auth-library";
const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const CLIENT_ID =
  "362883414554-7hunsis61ulc4lt26l026sjetgttmc48.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN =
  "1//04u_NX2VCagghCgYIARAAGAQSNwF-L9IrdJUtsT2NCPcUNyLiUlid2FjKBsMRI3gS8_kx2lCkyPARDFzLTQEtustwOD6pQlYuqv0";

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

export const sendMail = async () => {
  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "cryp.trader01@gmail.com",
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    const mailOptions = {
      from: "cryp-trader <cryp.trader01@gmail.com>",
      to: "cryp.trader01@gmail.com",
      subject: "api test",
      text: "hello",
    };

    const result = await transport.sendMail(mailOptions);
    return result;
  } catch (err) {
    return err;
  }
};

// Listen for new email messages
async function watchForNewEmails() {
  const gmail = google.gmail({ version: "v1", auth: oAuth2Client });

  const res = await gmail.users.watch({
    userId: "me",
    resource: {
      topicName: "YOUR_PUBSUB_TOPIC_NAME_HERE", // Replace this with the name of your Pub/Sub topic
      labelIds: ["INBOX"],
    },
  });

  console.log(res.data);
}
