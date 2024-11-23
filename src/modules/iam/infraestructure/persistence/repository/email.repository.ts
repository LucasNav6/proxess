import * as nodemailer from 'nodemailer';

export class EmailRepository {
  public async sendEmail(emailTo: string, subject: string, template: string) {
    const transporter = nodemailer.createTransport({
      host: process.env.NODEMAILER_HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASSWORD,
      },
    });

    const message = await transporter.sendMail({
      from: process.env.NODEMAILER_USER,
      to: emailTo,
      subject: subject,
      text: template,
    });

    console.log(message);
  }
}
