import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.USER || !process.env.USER_PASS) {
    throw new Error('As variáveis de ambiente USER e USER_PASS devem estar definidas');
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.USER,
        pass: process.env.USER_PASS
    }
});

export { transporter }; 