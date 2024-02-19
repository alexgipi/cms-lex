import nodemailer from "nodemailer";
import { newOrderClientEmailTemplate } from "./email-templates.js";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: "alexgp895@gmail.com",
    pass: "TByKFc7RGQNnOskA",
  },
});

export async function sendEmail(mailOptions) {
  const {fromName, fromEmail, to, subject, html} = mailOptions;

  const info = await transporter.sendMail({
    from: `"${fromName}" <${fromEmail}>`, // sender address
    to,
    subject,
    html,
  });

  console.log("Message sent: %s", info.messageId);
}

// interface OrderEmailOptions {
//   fromName:String,
//   fromEmail:String,
//   to: String,
//   subject?: String,
//   html?: String
// }

export async function sendOrderEmail(order, options){
  const {fromName, fromEmail, to, subject, html} = options;
    const mailOptions = {
        fromName,
        fromEmail, // sender address
        to, // list of receivers
        subject: subject || "✅ Compra realizada correctamente", // Subject line // plain text body
        html: html || newOrderClientEmailTemplate(order)
    }

    sendEmail(mailOptions)    

}