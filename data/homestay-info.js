/**
 * DATA PENGURUSAN RUMAH KITA HOMESTAY
 * ----------------------------------------
 * Maklumat rasmi Rumah Kita Homestay, Gua Musang.
 */

const homestayConfig = {
  brand: {
    name: "Rumah Kita Homestay",
    tagline: "A place made for us",
    ownerName: "Puan Shahirah",
    phoneDisplay: "014-511 3466",
    whatsappNumber: "60145113466", // Format antarabangsa tanpa '+' atau '0' di hadapan
    location: {
      area: "Taman Saujana",
      town: "Gua Musang",
      state: "Kelantan",
      fullAddress: "Taman Saujana, 18300 Gua Musang, Kelantan"
    }
  },

  // Promosi Terhad 10 Orang Terawal
  promo: {
    title: "Promosi Terhad — 10 Orang Terawal",
    originalPrice: 250,
    promoPrice: 180,
    currency: "RM",
    period: "per malam",
    limit: 10,
    badge: "🔥 Tawaran Terhad — 10 Orang Terawal Sahaja!"
  },

  // Kemudahan homestay
  amenities: [
    { name: "Penghawa Dingin (Aircond)", note: "Ruang sejuk & selesa", icon: "aircond" },
    { name: "Ruang Parkir Bertutup / Luas", note: "Mudah & selamat untuk kenderaan", icon: "parking" },
    { name: "Peti Sejuk & Dapur Memasak", note: "Kelengkapan asas disediakan", icon: "kitchen" },
    { name: "Seterika & Papan Seterika", note: "Kemudahan pakaian kemas", icon: "iron" },
    { name: "Televisyen & Ruang Tamu Santai", note: "Tempat berkumpul keluarga", icon: "tv" },
    { name: "Pemanas Air Mandi (Water Heater)", note: "Kesegaran mandian bila-bila masa", icon: "shower" }
  ],

  // Waktu operasi asas
  rules: {
    checkIn: "3:00 Petang",
    checkOut: "12:00 Tengah Hari",
    capacity: "Sesuai untuk keluarga / tetamu bertatasusila"
  }
};
