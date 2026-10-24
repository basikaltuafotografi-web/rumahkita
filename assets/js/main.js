/**
 * RUMAH KITA HOMESTAY - MAIN JAVASCRIPT
 * Mengendalikan fungsi navigasi mudah alih, PWA Install, dan penjanaan pertanyaan WhatsApp.
 */

let deferredInstallPrompt = null;

// Register Service Worker for PWA (Progressive Web App)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then((reg) => {
        console.log('Rumah Kita PWA Service Worker didaftarkan berjaya:', reg.scope);
      })
      .catch((err) => {
        console.log('Service Worker gagal didaftarkan:', err);
      });
  });
}

// Tangkap event install PWA untuk Android / Chrome
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredInstallPrompt = e;
  
  // Tunjukkan butang install jika ada di UI
  const installButtons = document.querySelectorAll('.pwa-install-btn');
  installButtons.forEach(btn => {
    btn.classList.remove('hidden');
    btn.style.display = 'inline-flex';
  });
});

window.addEventListener('appinstalled', () => {
  deferredInstallPrompt = null;
  const installButtons = document.querySelectorAll('.pwa-install-btn');
  installButtons.forEach(btn => btn.style.display = 'none');
  alert('Tahniah! Aplikasi Rumah Kita Homestay berjaya dipasang pada telefon anda.');
});

// Fungsi untuk pasang app (PWA Install trigger)
function triggerPWAInstall() {
  if (deferredInstallPrompt) {
    deferredInstallPrompt.prompt();
    deferredInstallPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('Pengguna menerima pemasangan aplikasi Rumah Kita');
      } else {
        console.log('Pengguna membatalkan pemasangan aplikasi');
      }
      deferredInstallPrompt = null;
    });
  } else {
    // Panduan untuk iOS Safari atau jika pelayar tidak menyokong prompt langsung
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    if (isIOS) {
      alert("📱 Cara Pasang di iPhone:\n1. Tekan butang 'Kongsi' (Share / ikon kotak bertanda anak panah ke atas di bahagian bawah Safari).\n2. Skrol ke bawah dan pilih 'Add to Home Screen' (Tambah ke Skrin Utama).\n3. Tekan 'Add'. Ikon Apps Rumah Kita akan tersedia di telefon anda!");
    } else {
      alert("📱 Cara Pasang Aplikasi:\nTekan menu tiga titik (⋮) di bahagian atas kanan pelayar telefon anda, kemudian pilih 'Install app' atau 'Add to Home Screen' (Tambah ke Skrin Utama).");
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // 1. Kawalan Menu Telefon Bimbit (Mobile Menu Toggle)
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
      mobileMenu.classList.toggle('hidden');
    });

    // Tutup menu apabila pautan ditekan
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 2. Tetapkan Had Minimum Tarikh Masuk (Hari Ini & Masa Depan Sahaja)
  const checkInInput = document.getElementById('check-in-date');
  const checkOutInput = document.getElementById('check-out-date');

  if (checkInInput && checkOutInput) {
    const today = new Date().toISOString().split('T')[0];
    checkInInput.setAttribute('min', today);
    checkOutInput.setAttribute('min', today);

    // Apabila tarikh masuk dipilih, tarikh keluar mesti sekurang-kurangnya tarikh yang sama/berikutnya
    checkInInput.addEventListener('change', () => {
      if (checkInInput.value) {
        checkOutInput.setAttribute('min', checkInInput.value);
        if (checkOutInput.value && checkOutInput.value < checkInInput.value) {
          checkOutInput.value = checkInInput.value;
        }
      }
    });
  }

  // 3. Borang Pertanyaan Tempahan WhatsApp
  const bookingForm = document.getElementById('whatsapp-booking-form');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const guestName = document.getElementById('guest-name')?.value.trim() || 'Tetamu';
      const checkInDate = document.getElementById('check-in-date')?.value || 'Belum pasti';
      const checkOutDate = document.getElementById('check-out-date')?.value || 'Belum pasti';
      const guestCount = document.getElementById('guest-count')?.value || '1';
      const guestNotes = document.getElementById('guest-notes')?.value.trim() || 'Tiada nota tambahan';

      // Format tarikh ke bentuk yang lebih selesa dibaca
      const formatDisplayDate = (dateStr) => {
        if (!dateStr || dateStr === 'Belum pasti') return 'Belum pasti';
        try {
          const parts = dateStr.split('-');
          if (parts.length === 3) {
            return `${parts[2]}/${parts[1]}/${parts[0]}`;
          }
          return dateStr;
        } catch {
          return dateStr;
        }
      };

      // Mesej WhatsApp yang sopan, teratur, dan profesional
      const message = 
`Salam Puan Shahirah, saya berminat membuat pertanyaan tempahan di *Rumah Kita Homestay (Gua Musang)* bagi *Promosi Terhad RM180*.

*Butiran Pertanyaan Tetamu:*
• Nama: ${guestName}
• Cadangan Tarikh Masuk: ${formatDisplayDate(checkInDate)}
• Cadangan Tarikh Keluar: ${formatDisplayDate(checkOutDate)}
• Bilangan Tetamu: ${guestCount} orang
• Nota/Pertanyaan: ${guestNotes}

Boleh saya semak ketersediaan tarikh dan slot promosi RM180 ini? Terima kasih!`;

      const whatsappNumber = (typeof homestayConfig !== 'undefined' && homestayConfig.brand.whatsappNumber) 
        ? homestayConfig.brand.whatsappNumber 
        : '60145113466';

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

      // Buka aplikasi WhatsApp dalam tab baharu
      window.open(whatsappUrl, '_blank');
    });
  }
});

/**
 * Fungsi Pintas WhatsApp Terus
 * Digunakan untuk butang umum "Tanya Sekarang"
 */
function openQuickWhatsApp(customContext = '') {
  const whatsappNumber = (typeof homestayConfig !== 'undefined' && homestayConfig.brand.whatsappNumber) 
    ? homestayConfig.brand.whatsappNumber 
    : '60145113466';

  let text = 'Salam Puan Shahirah, saya ingin bertanya maklumat lanjut mengenai Rumah Kita Homestay di Taman Saujana, Gua Musang.';
  if (customContext) {
    text += ` (${customContext})`;
  }

  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
}

/**
 * Fungsi Pintas WhatsApp untuk Promosi RM180 (10 Terawal)
 */
function openPromoWhatsApp() {
  const whatsappNumber = (typeof homestayConfig !== 'undefined' && homestayConfig.brand.whatsappNumber) 
    ? homestayConfig.brand.whatsappNumber 
    : '60145113466';

  const text = 'Salam Puan Shahirah, saya berminat nak buat tempahan *Promosi Terhad RM180* (Harga asal ~RM250~) terhad untuk 10 orang terawal di Rumah Kita Homestay, Gua Musang. Adakah slot promosi ini masih ada?';
  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
}
