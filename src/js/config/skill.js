
export const skillArjuna = [
  {
    namaSkill: "Sasmita Duta",
    deskripsi: "Meningkatkan serangan fisik untuk beberapa giliran.",
    efek: {
      atk: 25, // Buff ATK +25%
    },
    efekText: "ATK +25%", // Teks untuk notifikasi
    tipe: "Buff Type",
    cooldown: 8,
    durasi: 4,
    tenagaSukma: 2,
  },
  {
    namaSkill: "Semedi Kawelasan",
    deskripsi: "Menyembuhkan tubuhnya melalui energi spiritual.",
    efek: {
      heal: 30, // Heal 30% HP
    },
    efekText: "Heal 30% Max HP", // Teks untuk notifikasi
    tipe: "Support Type",
    cooldown: 12,
    durasi: null,
    tenagaSukma: 4,
  },
  {
    namaSkill: "Panuntun Jiwa",
    deskripsi: "Memacu kecepatan serangan dan ketepatan.",
    efek: {
      atk: 15,
      atkSpd: 15, // Buff ATK & ATK SPD +15%
    },
    efekText: "ATK +15% & Kecepatan Serang +15%", // Teks untuk notifikasi
    tipe: "Buff Type",
    cooldown: 10,
    durasi: 6,
    tenagaSukma: 4,
  },
];

export const skillDuryudana = [
  {
    namaSkill: "Gada Wisa Astina",
    deskripsi: "Menghasilkan serangan brutal kepada musuh.",
    efek: {
      baseDamage: 30,
      bonusDamagePercent: 20, // 20% dari ATK
    },
    efekText: "Damage 30 + 20% dari ATK", // Jelas efeknya
    tipe: "Attack",
    cooldown: 9,
    durasi: null, // Langsung/instant
    tenagaSukma: 4,
  },
  {
    namaSkill: "Daya Wisesa",
    deskripsi: "Tubuh menjadi sangat tahan pukul selama beberapa waktu.",
    efek: {
      immuneDamage: true,
    },
    efekText: "Immune semua damage selama 3 detik", // Jelas dan informatif
    tipe: "Defence",
    cooldown: 12,
    durasi: 3,
    tenagaSukma: 5,
  },
  {
    namaSkill: "Raja Tanpa Tunduk",
    deskripsi: "Memperkuat semangat tempurnya, meningkatkan serangan.",
    efek: {
      atk: 20,
    },
    efekText: "ATK +20% selama 3 detik", // Format seperti Arjuna
    tipe: "Buff",
    cooldown: 8,
    durasi: 3,
    tenagaSukma: 3,
  },
];
