const db = require('../lib/db');

const statements = [
`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT UNIQUE,
  password TEXT,
  role TEXT DEFAULT 'client',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);`,
`CREATE TABLE IF NOT EXISTS appointments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  name TEXT,
  email TEXT,
  phone TEXT,
  date TEXT,
  time TEXT,
  notes TEXT,
  status TEXT DEFAULT 'scheduled',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);`,
`CREATE TABLE IF NOT EXISTS notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  appointment_id INTEGER,
  user_id INTEGER,
  content TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);`,
`CREATE TABLE IF NOT EXISTS blog_posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  slug TEXT,
  content TEXT,
  lang TEXT DEFAULT 'es',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);`,
`CREATE TABLE IF NOT EXISTS testimonials (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  content TEXT,
  visible INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);`
];

db.serialize(()=>{
  statements.forEach(s=> db.run(s));
  console.log('Tables created or verified.');
  // create admin user placeholder (password must be changed via env)
  const bcrypt = require('bcrypt');
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const adminPass = process.env.ADMIN_PASSWORD || 'change_me';
  bcrypt.hash(adminPass, 10, (err, hash)=>{
    if (err) return console.error(err);
    db.get("SELECT * FROM users WHERE email = ?", [adminEmail], (e,row)=>{
      if (row) {
        console.log('Admin already exists:', adminEmail);
      } else {
        db.run("INSERT INTO users (name,email,password,role) VALUES (?,?,?, 'admin')",
          ['Admin', adminEmail, hash], function(err){
            if (err) console.error(err);
            else console.log('Admin user created:', adminEmail);
          });
      }
    });
  });
});
