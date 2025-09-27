// Basic front-end handlers for forms (fetch)
document.addEventListener('DOMContentLoaded', ()=>{
  const booking = document.getElementById('bookingForm');
  if (booking) booking.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const data = new FormData(booking);
    const plain = Object.fromEntries(data.entries());
    const res = await fetch('/api/book', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(plain)});
    const json = await res.json();
    alert(json.ok ? 'Cita reservada.' : ('Error: '+ (json.error || '')));
    if (json.ok) booking.reset();
  });

  const contact = document.getElementById('contactForm');
  if (contact) contact.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const data = new FormData(contact);
    const plain = Object.fromEntries(data.entries());
    const res = await fetch('/api/contact', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(plain)});
    const json = await res.json();
    alert(json.ok ? 'Mensaje enviado.' : ('Error: '+ (json.error || '')));
    if (json.ok) contact.reset();
  });

  const tform = document.getElementById('testimonialForm');
  if (tform) tform.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const data = new FormData(tform);
    const plain = Object.fromEntries(data.entries());
    const res = await fetch('/api/testimonial', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(plain)});
    const json = await res.json();
    alert(json.message || 'Gracias por tu testimonio.');
    if (json.ok) tform.reset();
  });
});
