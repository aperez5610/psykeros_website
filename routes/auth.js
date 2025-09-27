const express = require('express');
const router = express.Router();
const db = require('../lib/db');
const bcrypt = require('bcrypt');

router.get('/login', (req,res)=>{
  res.render('auth/login', { next: req.query.next || '/' });
});

router.post('/login', (req,res)=>{
  const { email, password, next } = req.body;
  db.get("SELECT * FROM users WHERE email = ?", [email], (err,row)=>{
    if (err || !row) return res.render('auth/login', { error: 'Credenciales incorrectas', next });
    bcrypt.compare(password, row.password, (err, ok)=>{
      if (ok) {
        req.session.user = { id: row.id, name: row.name, email: row.email, role: row.role };
        return res.redirect(next || '/portal');
      } else {
        return res.render('auth/login', { error: 'Credenciales incorrectas', next });
      }
    });
  });
});

router.get('/logout', (req,res)=>{
  req.session.destroy(()=> res.redirect('/'));
});

// simple register for clients (creates user and appointment association possible)
router.get('/register', (req,res)=>{
  res.render('auth/register');
});

router.post('/register', (req,res)=>{
  const { name,email,password } = req.body;
  bcrypt.hash(password, 10, (err, hash)=>{
    if (err) return res.render('auth/register', { error: 'Error interno' });
    db.run("INSERT INTO users (name,email,password) VALUES (?,?,?)", [name,email,hash], function(err){
      if (err) return res.render('auth/register', { error: 'Email ya registrado' });
      res.redirect('/auth/login');
    });
  });
});

module.exports = router;
