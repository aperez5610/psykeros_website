const express = require('express');
const router = express.Router();
const path = require('path');
const db = require('../lib/db');

// Home
router.get('/', (req,res)=>{
  db.all("SELECT * FROM testimonials WHERE visible=1 ORDER BY created_at DESC LIMIT 5", [], (err, rows)=>{
    if (err) rows = [];
    res.render('index', { testimonials: rows });
  });
});

router.get('/about', (req,res)=>{
  res.render('about');
});

router.get('/services', (req,res)=>{
  const services = [
    { title: 'Evaluación clínica a adultos', price: '1500 MXN', id: 'eval' },
    { title: 'Supervisión de casos clínicos', price: '500 MXN', id: 'supervision' },
    { title: 'Psicoterapia individual a adultos', price: '500 MXN', id: 'psicoterapia' }
  ];
  res.render('services', { services });
});

router.get('/doctor', (req,res)=>{
  res.render('doctor');
});

router.get('/gallery', (req,res)=>{
  res.render('gallery');
});

router.get('/testimonials', (req,res)=>{
  db.all("SELECT * FROM testimonials WHERE visible=1 ORDER BY created_at DESC", [], (err, rows)=>{
    if (err) rows = [];
    res.render('testimonials', { testimonials: rows });
  });
});

router.get('/blog', (req,res)=>{
  db.all("SELECT * FROM blog_posts ORDER BY created_at DESC", [], (err, rows)=>{
    if (err) rows = [];
    res.render('blog', { posts: rows });
  });
});

router.get('/blog/:slug', (req,res)=>{
  db.get("SELECT * FROM blog_posts WHERE slug = ?", [req.params.slug], (err,row)=>{
    if (err || !row) return res.redirect('/blog');
    res.render('post', { post: row });
  });
});

router.get('/contact', (req,res)=>{
  res.render('contact');
});

// client portal
router.get('/portal', (req,res)=>{
  if (!req.session.user) return res.redirect('/auth/login?next=/portal');
  // load appointments and notes for user
  const uid = req.session.user.id;
  db.all("SELECT * FROM appointments WHERE user_id = ?", [uid], (err, appts)=>{
    if (err) appts = [];
    db.all("SELECT * FROM notes WHERE user_id = ?", [uid], (err2, notes)=>{
      if (err2) notes = [];
      res.render('portal', { appointments: appts, notes });
    });
  });
});

module.exports = router;
