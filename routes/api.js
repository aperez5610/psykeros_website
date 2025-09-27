const express = require('express');
const router = express.Router();
const db = require('../lib/db');
const bcrypt = require('bcrypt');
const {google} = require('googleapis');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

// Basic contact form - sends email using SMTP if configured
router.post('/contact', (req,res)=>{
  const { name, email, message } = req.body;
  // store as testimonial draft? We will just send email
  if (!process.env.SMTP_HOST) {
    return res.json({ ok: true, message: 'Contact received. Configure SMTP to forward emails.' });
  }
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: process.env.SMTP_USER,
    subject: `Contacto web: ${name}`,
    text: `${name} <${email}>\n\n${message}`
  };
  transporter.sendMail(mailOptions, (err,info)=>{
    if (err) return res.status(500).json({ ok:false, error: err.message });
    res.json({ ok:true, info });
  });
});

// Book appointment (basic) - stores in DB and attempts Google Calendar insertion
router.post('/book', (req,res)=>{
  const { name, email, phone, date, time, notes } = req.body;
  db.run("INSERT INTO appointments (name,email,phone,date,time,notes) VALUES (?,?,?,?,?,?)",
    [name,email,phone,date,time,notes], function(err){
      if (err) return res.status(500).json({ ok:false, error: err.message });
      const appointmentId = this.lastID;
      // Try Google Calendar insertion if credentials provided
      try {
        const credPath = process.env.GOOGLE_CALENDAR_CREDENTIALS_PATH;
        const calendarId = process.env.GOOGLE_CALENDAR_ID;
        if (credPath && fs.existsSync(credPath) && calendarId) {
          const creds = JSON.parse(fs.readFileSync(credPath));
          // Service account flow
          const jwtClient = new google.auth.JWT(
            creds.client_email,
            null,
            creds.private_key,
            ['https://www.googleapis.com/auth/calendar']
          );
          jwtClient.authorize((err, tokens)=>{
            if (err) {
              console.error('Google auth error', err);
            } else {
              const calendar = google.calendar({version:'v3', auth: jwtClient});
              const start = new Date(date + 'T' + time + ':00');
              const end = new Date(start.getTime() + 60*60*1000); // 1 hour
              calendar.events.insert({
                calendarId: calendarId,
                requestBody: {
                  summary: `Cita - ${name}`,
                  description: notes || '',
                  start: { dateTime: start.toISOString() },
                  end: { dateTime: end.toISOString() }
                }
              }, (err, event)=>{
                if (err) console.error('Calendar insert err', err);
                else console.log('Event created', event.data.id);
              });
            }
          });
        }
      } catch(e){
        console.error(e);
      }
      res.json({ ok:true, id: appointmentId });
    });
});

// Simple testimonial creation (public)
router.post('/testimonial', (req,res)=>{
  const { name, content } = req.body;
  db.run("INSERT INTO testimonials (name,content,visible) VALUES (?,?,0)", [name,content], function(err){
    if (err) return res.status(500).json({ ok:false, error:err.message });
    res.json({ ok:true, id: this.lastID, message: 'Gracias. Su testimonio aparecerá una vez aprobado.' });
  });
});

module.exports = router;
