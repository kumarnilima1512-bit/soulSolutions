// server/api/query.post.ts
import nodemailer from 'nodemailer'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ name?: string; email?: string; query?: string; website?: string }>(event)

  // Honeypot: silently succeed for bots
  if (body.website) return { ok: true }

  const name = body.name?.trim() ?? ''
  const email = body.email?.trim() ?? ''
  const query = body.query?.trim() ?? ''

  if (name.length < 2 || !/^\S+@\S+\.\S+$/.test(email) || query.length < 6) {
    throw createError({ statusCode: 400, statusMessage: 'Please fill in all fields correctly.' })
  }
  if (query.length > 3000 || name.length > 100) {
    throw createError({ statusCode: 400, statusMessage: 'Message is too long.' })
  }

  const config = useRuntimeConfig()

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: config.mailUser, pass: config.mailPass },
  })

  const escape = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

  try {
    await transporter.sendMail({
      from: `"Soul Solutions Website" <${config.mailUser}>`,
      to: config.mailTo,
      replyTo: `"${name.replace(/"/g, '')}" <${email}>`,
      subject: `New query from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nQuery:\n${query}`,
      html: `
        <h3>New query from the website</h3>
        <p><strong>Name:</strong> ${escape(name)}</p>
        <p><strong>Email:</strong> ${escape(email)}</p>
        <p><strong>Query:</strong></p>
        <p>${escape(query).replace(/\n/g, '<br>')}</p>
      `,
    })
  } catch (e) {
    console.error('Mail error:', e)
    throw createError({ statusCode: 500, statusMessage: 'Could not send your query right now. Please try again later.' })
  }

  return { ok: true }
})