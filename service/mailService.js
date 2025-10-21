import nodemailer from 'nodemailer'

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({})
  }

  async sendActivationMail(to, link) {}
}

export default new MailService()
