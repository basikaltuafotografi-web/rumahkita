// Bookings are stored by the private-data backend; no guest records are cached here.
(() => {
  const API = 'https://rumah-kita-bookings.tangydog8.chatgpt.site';
  const form = document.getElementById('booking-request-form');
  if (!form) return;
  const field = id => document.getElementById(id);
  const button = field('booking-submit'), error = field('booking-error');
  const money = cents => new Intl.NumberFormat('ms-MY', {style: 'currency', currency: 'MYR'}).format(cents / 100);
  let config, requestKey;
  try { requestKey = sessionStorage.getItem('rk-booking-request') || crypto.randomUUID(); sessionStorage.setItem('rk-booking-request', requestKey); }
  catch { requestKey = crypto.randomUUID(); }
  async function api(path, options) {
    const response = await fetch(API + path, options);
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Tidak dapat menghantar permohonan. Sila cuba lagi.');
    return result;
  }
  function quote() {
    if (!config) return;
    const checkIn = field('check-in-date').value, checkOut = field('check-out-date').value;
    const nights = (Date.parse(checkOut) - Date.parse(checkIn)) / 86400000;
    field('check-out-date').min = checkIn ? new Date(Date.parse(checkIn) + 86400000).toISOString().slice(0, 10) : config.today;
    field('booking-quote').textContent = nights > 0 && nights <= 30 ? `${nights} malam · ${money(nights * config.nightlyRate)}` : `${money(config.nightlyRate)} / malam · Pilih tarikh anda`;
  }
  form.addEventListener('input', quote);
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!config) return;
    error.hidden = true;
    button.disabled = true;
    const label = button.querySelector('span');
    label.textContent = 'Menghantar permohonan…';
    try {
      const data = {
        name: field('guest-name').value, phone: field('guest-phone').value,
        email: field('guest-email').value, guests: Number(field('guest-count').value),
        checkIn: field('check-in-date').value, checkOut: field('check-out-date').value,
        notes: field('guest-notes').value, website: field('guest-website').value
      };
      const result = await api('/api/bookings', {method: 'POST', headers: {'Content-Type': 'application/json', 'Idempotency-Key': requestKey}, body: JSON.stringify(data)});
      try { sessionStorage.removeItem('rk-booking-request'); } catch {}
      window.location.assign(API + '/request/' + result.id + '#token=' + encodeURIComponent(result.token));
    } catch (err) {
      error.textContent = err.message;
      error.hidden = false;
      button.disabled = false;
      label.textContent = 'Hantar Permohonan Tempahan';
    }
  });
  api('/api/config').then(result => {
    config = result;
    field('check-in-date').min = config.today;
    field('check-out-date').min = config.today;
    quote();
    button.disabled = false;
  }).catch(() => {
    field('booking-quote').textContent = 'Borang tempahan belum dapat dimuatkan.';
    error.textContent = 'Sila muat semula halaman atau hubungi Shahirah melalui WhatsApp.';
    error.hidden = false;
  });
})();
