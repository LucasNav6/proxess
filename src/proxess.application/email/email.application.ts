import * as path from 'path';
import * as pug from 'pug';
import * as fs from 'fs';
import * as nodemailer from 'nodemailer';

export class EmailApplication {
  public async sendEmail({
    emailTo,
    subject,
    template,
  }: {
    emailTo: string;
    subject: string;
    template: string;
  }) {
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host: process.env.NODEMAILER_HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASSWORD,
      },
    });

    // send mail with defined transport object
    await transporter.sendMail({
      from: process.env.NODEMAILER_USER,
      to: emailTo,
      subject: subject,
      html: template,
    });
  }

  public async getPugTemplate(
    templateName: string,
    props = {},
  ): Promise<string> {
    const templatesPaths = path.resolve(__dirname, '../../proxess.templates');

    // Lee el contenido CSS
    const cssContent = fs.readFileSync(
      path.join(templatesPaths, 'proxess.styles.css'),
      'utf-8',
    );

    // Lee y compila la plantilla Pug
    const pugContent = fs.readFileSync(
      path.join(templatesPaths, `${templateName}.pug`),
      'utf-8',
    );
    const pugTemplate = pug.compile(pugContent);

    // Genera el HTML pasando las propiedades y el contenido CSS
    const htmlContent = pugTemplate({ ...props, cssContent });

    return htmlContent;
  }
}
