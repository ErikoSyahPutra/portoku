import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from './contact.entity';
import * as nodemailer from 'nodemailer';

@Injectable()
export class ContactService {
  private transporter: nodemailer.Transporter | null = null;

  constructor(
    @InjectRepository(Contact)
    private readonly repo: Repository<Contact>,
  ) {
    this.initTransporter();
  }

  private initTransporter() {
    const host = process.env.SMTP_HOST;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (host && user && pass) {
      const port = parseInt(process.env.SMTP_PORT || '465', 10);
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
      });
    }
  }

  async findAll() {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async create(data: Partial<Contact>) {
    const entity = this.repo.create(data);
    const saved = await this.repo.save(entity);

    // Await email notification dispatch (essential for Serverless environments like Vercel)
    try {
      await this.sendNotificationEmail(saved);
    } catch (err: any) {
      console.error('Failed to send contact notification email:', err?.message || err);
    }

    return saved;
  }

  private async sendNotificationEmail(contact: Contact) {
    if (!this.transporter) {
      this.initTransporter();
    }

    if (!this.transporter) {
      console.log('ℹ️ Email transporter not configured (SMTP credentials missing in .env). Message saved to database & Admin Panel only.');
      return;
    }

    const targetEmail = process.env.EMAIL_TO || process.env.SMTP_USER;
    if (!targetEmail) return;

    const mailOptions = {
      from: `"Portfolio Contact Form" <${process.env.SMTP_USER}>`,
      to: targetEmail,
      replyTo: contact.email,
      subject: `📩 [Portfolio Contact] ${contact.subject || 'Pesan Baru dari ' + contact.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; background: #ffffff;">
          <div style="background: #6366f1; padding: 20px; color: #ffffff; text-align: center;">
            <h2 style="margin: 0; font-size: 20px;">Pesan Baru dari Portofolio</h2>
          </div>
          <div style="padding: 24px; color: #334155; line-height: 1.6;">
            <p style="margin-top: 0;"><strong>Nama Pengirim:</strong> ${contact.name}</p>
            <p><strong>Email Pengirim:</strong> <a href="mailto:${contact.email}" style="color: #6366f1;">${contact.email}</a></p>
            ${contact.subject ? `<p><strong>Subjek:</strong> ${contact.subject}</p>` : ''}
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
            <p><strong>Isi Pesan:</strong></p>
            <div style="background: #f8fafc; padding: 16px; border-radius: 6px; border-left: 4px solid #6366f1; white-space: pre-wrap;">${contact.message}</div>
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
            <p style="font-size: 12px; color: #94a3b8; text-align: center;">Email ini dikirim otomatis dari Formulir Kontak website portofolio Anda.</p>
          </div>
        </div>
      `,
    };

    await this.transporter.sendMail(mailOptions);
    console.log(`✅ Notification email successfully sent to ${targetEmail}`);
  }

  async markAsRead(id: number) {
    await this.repo.update(id, { isRead: true });
    return this.repo.findOneBy({ id });
  }

  async remove(id: number) {
    await this.repo.delete(id);
    return { deleted: true };
  }
}
