import nodemailer, { Transporter } from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

class MailSender {
  private transporter: Transporter;

  constructor() {
    if (!process.env.USER || !process.env.USER_PASS) {
      throw new Error(
        "As variáveis de ambiente USER e USER_PASS devem estar definidas"
      );
    }

    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.USER,
        pass: process.env.USER_PASS,
      },
    });
  }

  async sendMail(to: string | string[], subject: string, text: string, attachments?: { filename: string; content: Buffer }[]) {
    const mailOptions = {
      from: {
        name: "Repnet",
        address: process.env.USER!,
      },
      to,
      subject,
      text,
      attachments, // Adiciona os anexos aqui
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log("Email enviado com sucesso: %s", info.messageId);
      return info;
    } catch (error) {
      console.error("Erro ao enviar email: ", error);
      throw new Error("Erro ao enviar email");
    }
  }
}

export default new MailSender();
