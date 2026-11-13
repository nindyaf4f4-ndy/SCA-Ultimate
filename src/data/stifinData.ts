/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PersonalityTrait {
    name: string;
    val: number;
}

export interface DetailedTrait {
    label: string;
    subtitle: string;
    desc: string;
}

export interface PersonalityData {
    code: string;
    name: string;
    color: string;
    hex: string;
    mkGroup: 'Sensing' | 'Thinking' | 'Intuiting' | 'Feeling' | 'Insting';
    os: string;
    quotient: string;
    essence: string;
    drive: string;
    path: string;
    driveDetails: {
        drive: string;
        stimuli: string;
        falsafah: string;
        motivasi: string;
    };
    finansial: {
        tabiat: string;
        kemistri: string;
        brand: string;
    };
    peran: {
        utama: string;
        kelebihan: string;
        klu: string;
    };
    belajarDeep: {
        cara: string;
        pemicu: string;
    };
    topo: {
        scanner: string;
        os: string;
        lapisan: string;
        cuaca: string;
        cairan: string;
        angin: string;
    };
    belajar: {
        metode: string;
        peran: string;
        panggung: string;
        kebiasaan: string;
        media: string;
    };
    psiko: {
        traits: PersonalityTrait[];
        disc: string;
    };
    motivasi: {
        kemistri: string;
        luang: string;
        harapan: string;
        keywords: string[];
        profesiContoh: string;
    };
    karir: {
        utama: string;
        lainnya: string;
    };
    sosial: {
        support: string;
        didukung: string;
        conquer: string;
        ditaklukkan: string;
    };
    fisik: {
        konstitusi: string;
        otot: string;
        kalibrasi: string;
    };
    perilaku8: {
        os: string;
        kecerdasan: string;
        peranan: string;
        kelebihan: string;
        target: string;
        harapan: string;
        brand: string;
        tabiatUang: string;
    };
    gambaranDasar: {
        kalibrasi: string;
        tipologiFisik: string;
        organPenyakit: string;
    };
    traitsList: DetailedTrait[];
}

export const STIFIN_DATA: {
    bloodTypes: Record<string, { desc: string; type: string }>;
    kecerdasan5W: Record<string, { w: string; otak: string; karakterUtama: string; ciriKhas: string }>;
    personalities: Record<string, PersonalityData>;
} = {
    bloodTypes: {
        'O': { desc: 'Cenderung terdorong/merespon awal secara spontan layaknya orang berkarakter Feeling (Suka menolong, empati).', type: 'Feeling' },
        'A': { desc: 'Cenderung terdorong/merespon awal secara spontan layaknya orang berkarakter Thinking (Logis, teratur).', type: 'Thinking' },
        'B': { desc: 'Cenderung terdorong/merespon awal secara spontan layaknya orang berkarakter Intuiting (Kreatif, konseptual).', type: 'Intuiting' },
        'AB': { desc: 'Cenderung terdorong/merespon awal secara spontan layaknya orang berkarakter Sensing (Praktis, realistis).', type: 'Sensing' }
    },
    kecerdasan5W: {
        'Sensing': {
            w: 'What',
            otak: 'Limbik Kiri',
            karakterUtama: 'Berbasis pada fakta, data, dan realita nyata (indrawi).',
            ciriKhas: 'Menyukai hal-hal praktis, memiliki memori yang kuat, fokus pada masa kini, dan cenderung atletis atau memiliki stamina fisik yang baik.'
        },
        'Thinking': {
            w: 'Who / Why',
            otak: 'Neokorteks Kiri',
            karakterUtama: 'Berbasis pada logika, analisis, dan struktur.',
            ciriKhas: 'Objektif, mandiri, pandai mengorganisasi, fokus pada sebab-akibat, dan cenderung kritis dalam mengambil keputusan.'
        },
        'Intuiting': {
            w: 'Where / When',
            otak: 'Neokorteks Kanan',
            karakterUtama: 'Berbasis pada imajinasi, kreativitas, dan visi jangka panjang.',
            ciriKhas: 'Menyukai konsep abstrak, inovatif, berfokus pada masa depan, dan senang membuat strategi besar daripada detail teknis.'
        },
        'Feeling': {
            w: 'Whom',
            otak: 'Limbik Kanan',
            karakterUtama: 'Berbasis pada emosi, hubungan antarmanusia (hubungan sosial), dan empati.',
            ciriKhas: 'Komunikatif, pandai memimpin orang lain, sangat mengandalkan perasaan, dan sensitif terhadap keharmonisan lingkungan.'
        },
        'Insting': {
            w: 'How',
            otak: 'Otak Tengah (Midbrain)',
            karakterUtama: 'Berbasis pada naluri, kecepatan respons, dan spiritualitas.',
            ciriKhas: 'Berjiwa generalis (serba bisa), cinta damai, respons refleks yang cepat, tulus membantu, dan adaptif dalam berbagai situasi.'
        }
    },
    personalities: {
        'Si': {
            code: 'Si', name: 'Sensing Introvert', color: 'stifin-sensing', hex: '#ef4444',
            mkGroup: 'Sensing',
            os: 'sistem operasi otak Anda dominan pada Limbik Kiri lapisan Putih (Dalam)',
            quotient: 'MQ (Memory Quotient)',
            essence: 'Anda dilahirkan dengan kecerdasan Sensing Introvert (Si) yang bersumber dari belahan sistem limbik kiri pada lapisan putih (dalam). Secara genetis, Anda adalah seorang \'Player\' atau eksekutor tangguh yang memproses informasi secara konkrit melalui panca indera.',
            drive: 'Chemistry alamiah Anda adalah mengejar Harta dan kepastian materi. Kapan pun ada peluang nyata di depan mata, dorongan dari dalam diri Anda akan langsung merespons dengan determinasi.',
            path: 'Kunci sukses Anda adalah dengan terus mengasah \'muscle memory\' melalui pengalaman dan repetisi. Belajarlah dengan cara merekam dan mempraktekkan langsung.',
            driveDetails: { drive: 'Introvert (i)', stimuli: 'Saraf Dari Dalam', falsafah: 'Diancam (Anti-Neraka)', motivasi: 'Ditantang' },
            finansial: { tabiat: 'Hemat (Memeras Keringat)', kemistri: 'Mengejar Harta (No Pain No Gain)', brand: 'Volume / Skala (Contoh: Tung Desem Waringin)' },
            peran: { utama: 'Player / Pemain', kelebihan: 'Efisien (Terlatih Rincian)', klu: 'Mencari Panggung (Menambah Jam Terbang)' },
            belajarDeep: { cara: 'Merekam vocabulary, peraga, mengulang sambil bergerak/menulis', pemicu: 'Perlu teman / penantang belajar' },
            topo: { scanner: 'Active', os: 'Limbik Kiri', lapisan: 'Putih (Dalam)', cuaca: 'Kering', cairan: 'Empedu Kuning (Koleris)', angin: 'Utara' },
            belajar: { 
                metode: 'Merekam vocabulary, peraga, mengulang-ulang (repetisi) materi sambil bergerak/menulis', 
                peran: 'Player (Eksekutor Praktis)', 
                panggung: 'Area teknis, operasional, & praktik lapangan',
                kebiasaan: 'Belajar dengan menyalin tulisan / merangkum fisik',
                media: 'Peraga nyata, flashcard, soal-soal latihan'
            },
            psiko: { traits: [{name: 'Persistent', val: 95}, {name: 'Detailed', val: 86}, {name: 'Discipline', val: 72}], disc: 'Dominant (D)' },
            motivasi: { kemistri: 'Harta', luang: 'Hemat', harapan: 'Yielding (Imbal Hasil)', keywords: ['Mengingat', 'Otot', 'Rajin', 'Tergerak'], profesiContoh: 'Pedagang' },
            karir: { utama: 'Keuangan, Perdagangan, Transportasi, Bahasa, Olahraga', lainnya: 'Ekonom, Atlit, Tentara, Bisnis Perhotelan, Sejarawan, Bankir, Pertanahan, Dokter, Jurnalis, Keartisan, Manufacturing, Pilot, Pramugari, Model, Aktor/Aktris, Salesman, Perkebunan, Pertanian, Peternakan, Administrasi, Sekretaris, Pustakawan, Operator, Pegawai/Staf, Penyanyi, Pekerja Pabrik, Security, Pelukis naturalis, Fotografer, Cameramen, Presenter, Penari, Pekerja lapangan dll.' },
            sosial: { support: 'Thinking (T)', didukung: 'Feeling (F)', conquer: 'Insting (In)', ditaklukkan: 'Intuiting (I)' },
            fisik: { konstitusi: 'Atletis Bongsor', otot: 'Merah kasar, tenaga kuat', kalibrasi: 'Berkeringat (Aktivitas fisik)' },
            perilaku8: {
                os: 'Berada di Limbik Kiri di Lapisan Putih',
                kecerdasan: 'Memory Quotient',
                peranan: 'Peran utama sebagai Player',
                kelebihan: 'Kelebihannya Efisiensi ( O/i )',
                target: 'Connection ( Hubungan )',
                harapan: 'Yielding ( Panen hasil kerja )',
                brand: 'Merek pada Scala Volume',
                tabiatUang: 'Terhadap uang Hemat'
            },
            gambaranDasar: { kalibrasi: 'Bergerak, Main', tipologiFisik: 'Atletis', organPenyakit: 'Lambung & Limfa' },
            traitsList: [
                { label: 'Persistent', subtitle: 'gigih menjalani', desc: 'Stabil bekerja, Tahan banting, pantang menyerah' },
                { label: 'Detailed', subtitle: 'terperinci', desc: 'Berurutan, memperinci, cermat' },
                { label: 'Discipline', subtitle: 'disiplin', desc: 'Tepat waktu, taat peraturan, tertib' },
                { label: 'Encyclopedic', subtitle: 'seperti kamus', desc: 'Merekam semua, mengingat kuat, menyimpan yang lengkap' },
                { label: 'Workaholic', subtitle: 'kerja keras', desc: 'Mendapatkan hasil maksimal, menambah jam kerja (lembur), menambah kesibukan' }
            ]
        },
        'Se': {
            code: 'Se', name: 'Sensing Extrovert', color: 'stifin-sensing', hex: '#ef4444',
            mkGroup: 'Sensing',
            os: 'sistem operasi otak Anda dominan pada Limbik Kiri lapisan Abu-abu (Luar)',
            quotient: 'PQ (Physical Quotient)',
            essence: 'Anda dilahirkan dengan kecerdasan Sensing Extrovert (Se). Anda adalah seorang \'Garda Depan\' yang energik, mengandalkan panca indera dan kelincahan fisik. Anda tampil mempesona dan pragmatis dalam mengambil peluang.',
            drive: 'Chemistry alamiah Anda adalah mengejar Harta melalui koneksi dan interaksi. Anda termotivasi oleh insentif yang nyata dan lingkungan yang dinamis.',
            path: 'Kunci sukses Anda adalah dengan memanfaatkan kelincahan fisik dan kemampuan diplomasi. Temukan ladang proyek yang terus berputar.',
            driveDetails: { drive: 'Extrovert (e)', stimuli: 'Rangsangan Dari Luar', falsafah: 'Iming-iming (Cari Surga)', motivasi: 'Difasilitasi' },
            finansial: { tabiat: 'Pemboros (Mencari Kenikmatan & Mentraktir)', kemistri: 'Dikejar Harta (Suka Mentraktir & Cari Proyek)', brand: 'Personal Guarantee (Contoh: Chairul Tanjung)' },
            peran: { utama: 'Garda Depan / Frontliner', kelebihan: 'Menemukan Momentum (Menyenangkan Orang)', klu: 'Temukan Ladang (Proyek Bermargin)' },
            belajarDeep: { cara: 'Menandai bacaan, visual rangsangan, belajar sambil bermain', pemicu: 'Diberi iming-iming daya tarik konkrit' },
            topo: { scanner: 'Active', os: 'Limbik Kiri', lapisan: 'Abu-abu (Luar)', cuaca: 'Hangat', cairan: 'Empedu Kuning (Koleris)', angin: 'Timur Laut' },
            belajar: { 
                metode: 'Menandai bacaan (highlight), rangsangan visual, belajar di luar ruangan sambil bermain/bergerak', 
                peran: 'Frontliner / Garda Depan (Praktisi Lapangan)', 
                panggung: 'Area interaksi publik & simulasi langsung',
                kebiasaan: 'Belajar interaktif dengan banyak alat bantu visual',
                media: 'Stabilo warna-warni, gambar konkrit, papan permainan'
            },
            psiko: { traits: [{name: 'Energetic', val: 90}, {name: 'Pragmatic', val: 85}, {name: 'Sociable', val: 80}], disc: 'Influence (I)' },
            motivasi: { kemistri: 'Harta', luang: 'Pemboros', harapan: 'Generating (Menghasilkan)', keywords: ['Mengingat', 'Otot', 'Rajin', 'Tercetak'], profesiContoh: 'Aktor / Salesman' },
            karir: { utama: 'Hiburan, Sales, Pariwisata, Jasa, Hospitality, Perdagangan', lainnya: 'Ahli Keuangan, Ahli Bahasa, Bisnis Transportasi, Pedagang, Entertainer, Bankir, Pertanahan, Dokter, Jurnalis, Keartisan, Manufacturing, Pilot, Pramugari, Model, Aktor/Aktris, Salesman, Perkebunan, Pertanian, Peternakan, Administrasi, Sekretaris, Pustakawan, Operator, Pegawai/Staf, Penyanyi, Pekerja Pabrik, Security, Pelukis naturalis, Fotografer, Cameramen, Presenter, Penari, Pekerja lapangan dll.' },
            sosial: { support: 'Thinking (T)', didukung: 'Feeling (F)', conquer: 'Insting (In)', ditaklukkan: 'Intuiting (I)' },
            fisik: { konstitusi: 'Atletis Mungil', otot: 'Merah halus, kelincahan tinggi', kalibrasi: 'Bersenang-senang / Liburan' },
            perilaku8: {
                os: 'Berada di Limbik Kiri di Lapisan Kelabu',
                kecerdasan: 'Physical Quotient',
                peranan: 'Peran utama Frontliner',
                kelebihan: 'Momentum / Kesempatan seketika',
                target: 'Opportunity ( Peluang )',
                harapan: 'Generating ( Menghasilkan Laba )',
                brand: 'Merek pada Jaminan Dirinya',
                tabiatUang: 'Terhadap uang Boros'
            },
            gambaranDasar: { kalibrasi: 'Bergerak, Main', tipologiFisik: 'Atletis', organPenyakit: 'Lambung & Limfa' },
            traitsList: [
                { label: 'Momentum', subtitle: 'tanggap peluang', desc: 'Sangat sigap menangkap momen & peluang seketika di depan mata' },
                { label: 'Pragmatic', subtitle: 'pragmatis', desc: 'Berorientasi pada hasil nyata yang efisien dan langsung berdampak' },
                { label: 'Sociable', subtitle: 'mudah bergaul', desc: 'Luwes berinteraksi, menyenangkan orang lain, dan berjiwa sosial tinggi' },
                { label: 'Action-Oriented', subtitle: 'eksekusi cepat', desc: 'Lebih mengutamakan tindakan fisik daripada berteori lama' },
                { label: 'Adaptable', subtitle: 'fleksibel lapangan', desc: 'Mudah menyesuaikan diri dengan situasi lapangan yang dinamis' }
            ]
        },
        'Ti': {
            code: 'Ti', name: 'Thinking Introvert', color: 'stifin-thinking', hex: '#64748b',
            mkGroup: 'Thinking',
            os: 'sistem operasi otak Anda dominan pada Neokorteks Kiri lapisan Putih (Dalam)',
            quotient: 'TQ (Technical Quotient)',
            essence: 'Anda dilahirkan dengan kecerdasan Thinking Introvert (Ti) di belahan otak rasional. Anda adalah seorang \'Expert\' yang memiliki ketajaman analitis mendalam, mandiri, dan berorientasi pada data.',
            drive: 'Chemistry alamiah Anda adalah mengejar Tahta atau pengakuan atas kepakaran Anda. Anda didorong oleh keinginan untuk mengetahui cara kerja segala sesuatu hingga ke akarnya.',
            path: 'Kunci sukses Anda adalah dengan menancapkan tiang spesialisasi. Jadilah yang terbaik di satu bidang spesifik. Belajarlah dengan memahami kausalitas.',
            driveDetails: { drive: 'Introvert (i)', stimuli: 'Saraf Dari Dalam', falsafah: 'Diancam (Anti-Neraka)', motivasi: 'Ditantang' },
            finansial: { tabiat: 'Mikir Manfaat Pengeluaran', kemistri: 'Mencari Tahta (Membuktikan Kepakaran)', brand: 'Expertise / Keahlian (Contoh: Ciputra)' },
            peran: { utama: 'Expert / Pakar', kelebihan: 'Efektif (Terbiasa Menghitung)', klu: 'Mencari Tapak (Spesialisasi Tajam)' },
            belajarDeep: { cara: 'Mencari sebab-akibat (kausalitas), skema pelajaran, logika mendalam', pemicu: 'Perlu rekognisi / pengakuan derajat' },
            topo: { scanner: 'Active', os: 'Neokorteks Kiri', lapisan: 'Putih (Dalam)', cuaca: 'Dingin', cairan: 'Empedu Hitam (Melankolis)', angin: 'Barat' },
            belajar: { 
                metode: 'Menganalisis skema, mencari hubungan sebab-akibat (kausalitas), serta kedalaman logika teoritis', 
                peran: 'Expert / Pakar (Peneliti Spesialis)', 
                panggung: 'Area riset, analisis data, & pengolahan sistem',
                kebiasaan: 'Membaca mandiri dalam keheningan total',
                media: 'Diagram alur, rumus, buku teks ilmiah, skema logika'
            },
            psiko: { traits: [{name: 'Analytical', val: 92}, {name: 'Independent', val: 88}, {name: 'Objective', val: 85}], disc: 'Compliance (C)' },
            motivasi: { kemistri: 'Tahta', luang: 'Bermanfaat / Investasi', harapan: 'Accuration (Akurat)', keywords: ['Menalar', 'Tulang', 'Mandiri', 'Mendalam'], profesiContoh: 'Perminyakan / Peneliti' },
            karir: { utama: 'Riset, Teknologi, Perminyakan, Manufaktur, Konstruksi', lainnya: 'Manager/Eksekutif/Yudikatif, Manufactur, Bisnis Properti, Peternakan, Peneliti, Fabrikan, Perminyakan, Pengeboran, Programer, Dokter, Apoteker, Perawat, Ekonom, Dosen/Guru, Property, Insinyur, Fisikawan, Kimiawan, Konsultan Managemen, Teknokrat, Birokrat, Perpajakan, Produsen, QC, Auditor, Ahli Strategi, Pelatih bola, Pembuat Kebijakan, System Analist, Ahli Rekayasa, Developer, Atlit (Pertandingan)' },
            sosial: { support: 'Insting (In)', didukung: 'Sensing (S)', conquer: 'Intuiting (I)', ditaklukkan: 'Feeling (F)' },
            fisik: { konstitusi: 'Piknis Tebal', otot: 'Tulang besar & kokoh', kalibrasi: 'Menyendiri / Membaca / Catur' },
            perilaku8: {
                os: 'Berada di Neo Cortex Kiri di Lapisan Putih',
                kecerdasan: 'Technical Quotient',
                peranan: 'Expert ( Pakar )',
                kelebihan: 'Effective ( Output / Standard )',
                target: 'Certainty ( Kepastian )',
                harapan: 'Managing ( Pengelolaan )',
                brand: 'Merek pada Expertise-nya',
                tabiatUang: 'Terhadap uang Berhitung'
            },
            gambaranDasar: { kalibrasi: 'Kembali ke alam, Wisata', tipologiFisik: 'Piknis', organPenyakit: 'Ginjal' },
            traitsList: [
                { label: 'Specialist', subtitle: 'ahli dalam bidangnya', desc: 'Mendalami satu bidang, Menekuni kompetensi khusus, Kejelian mikroskopis (melihat hal2 yang sangat detail sekali)' },
                { label: 'Independent', subtitle: 'mandiri, tidak tergantung', desc: 'Kerja Mandiri, Swadaya (self support/energi datang dari diri sendiri), Bertumpu pada kemampuan sendiri' },
                { label: 'Focus', subtitle: 'konsentrasi pada 1 perkara', desc: 'Penuh konsentrasi, Berpikir mendalam, tidak terganggu/terdistraksi/Tenang' },
                { label: 'Prudent', subtitle: 'penuh kehati-hatian', desc: 'Mempertimbangkan dengan hati-hati, Mengantisipasi penyimpangan, Meminimalkan resiko' },
                { label: 'Mechanistic', subtitle: 'seperti mesin (tanpa hati)', desc: 'Terstruktur dan sistematis, Sesuai SOP (aturan baku), Bekerja stabil seperti mesin' }
            ]
        },
        'Te': {
            code: 'Te', name: 'Thinking Extrovert', color: 'stifin-thinking', hex: '#64748b',
            mkGroup: 'Thinking',
            os: 'sistem operasi otak Anda dominan pada Neokorteks Kiri lapisan Abu-abu (Luar)',
            quotient: 'LQ (Logical Quotient)',
            essence: 'Anda dilahirkan dengan kecerdasan Thinking Extrovert (Te). Anda adalah seorang \'Chief\' atau pengatur sejati yang mahir dalam mengorganisasi sumber daya dan membangun struktur.',
            drive: 'Chemistry alamiah Anda adalah mengejar Tahta melalui penguasaan manajerial dan perluasan rentang kendali.',
            path: 'Kunci sukses Anda adalah mendelegasikan dan mengontrol. Praktikkan manajerialship Anda secara terstruktur.',
            driveDetails: { drive: 'Extrovert (e)', stimuli: 'Rangsangan Dari Luar', falsafah: 'Iming-iming (Cari Surga)', motivasi: 'Difasilitasi' },
            finansial: { tabiat: 'Mengakumulasikan Uang (Barang Berharga Rasional)', kemistri: 'Dikejar Tahta (Kharisma Manajerial & Rentang Kendali)', brand: 'Managerialship (Contoh: Tanri Abeng)' },
            peran: { utama: 'Chief / Manajer Utama', kelebihan: 'Multiplying (Melipatgandakan / Optimalisasi)', klu: 'Berorganisasi (Praktik Manajerial)' },
            belajarDeep: { cara: 'Membuat struktur, memahami garis besar logika sistematis', pemicu: 'Kemenangan beruntun & target terukur' },
            topo: { scanner: 'Active', os: 'Neokorteks Kiri', lapisan: 'Abu-abu (Luar)', cuaca: 'Sejuk', cairan: 'Empedu Hitam (Melankolis)', angin: 'Barat Laut' },
            belajar: { 
                metode: 'Membuat struktur kerangka materi, memahami garis besar logika sistematis, & diskusi/debat rasional', 
                peran: 'Chief / Manajer (Pengatur Strategi & Struktur)', 
                panggung: 'Area manajerial, struktur organisasi, & birokrasi',
                kebiasaan: 'Mengisi daftar target (checklist) & studi kasus terukur',
                media: 'Mind-map terstruktur, outline bab, forum diskusi rasional'
            },
            psiko: { traits: [{name: 'Organized', val: 94}, {name: 'Systematic', val: 89}, {name: 'Assertive', val: 82}], disc: 'Dominant-Compliance' },
            motivasi: { kemistri: 'Tahta', luang: 'Akumulasi', harapan: 'Controlling (Pengendalian)', keywords: ['Menalar', 'Tulang', 'Mandiri', 'Meluas'], profesiContoh: 'Tentara / Manajer' },
            karir: { utama: 'Birokrasi, Manajemen, Militer, Hukum, Bisnis Skala Besar', lainnya: 'Ristek, IT, Bisnis Pertambangan, Ahli konstruksi, Bisnis Kesehatan, Garmen, Peneliti, Fabrikan, Perminyakan, Pengeboran, Programer, Dokter, Apoteker, Perawat, Ekonom, Manager, Dosen/Guru, Property, Insinyur, Fisikawan, Kimiawan, Konsultan Managemen, Teknokrat, Birokrat, Perpajakan, Produsen, QC, Auditor, Ahli Strategi, Pelatih bola, Pembuat Kebijakan, System Analist, Ahli Rekayasa, Developer, Atlit (Pertandingan)' },
            sosial: { support: 'Insting (In)', didukung: 'Sensing (S)', conquer: 'Intuiting (I)', ditaklukkan: 'Feeling (F)' },
            fisik: { konstitusi: 'Piknis Tipis', otot: 'Tulang proporsional', kalibrasi: 'Kompetisi logis / Game strategi' },
            perilaku8: {
                os: 'Berada di Neo Cortex Kiri di Lapisan Kelabu',
                kecerdasan: 'Logical Quotient',
                peranan: 'Chief ( Komandan )',
                kelebihan: 'Multiplying (Pelipatgandaan)',
                target: 'Authority ( Wewenang )',
                harapan: 'Controlling ( Pengendalian )',
                brand: 'Merek pada Proses Manajerialnya',
                tabiatUang: 'Terhadap uang Mengumpulkan'
            },
            gambaranDasar: { kalibrasi: 'Kembali ke alam, Wisata', tipologiFisik: 'Piknis', organPenyakit: 'Ginjal' },
            traitsList: [
                { label: 'Thoughtful', subtitle: 'kuat mikir', desc: 'Berpikir sistematis (masuk prioritas), Analisis tajam berdasar data, Berpikir terencana' },
                { label: 'Competitive', subtitle: 'senang kompetisi', desc: 'Selalu ingin menang, Berusaha memperbaiki diri, Mencari ajang/event kompetisi' },
                { label: 'Forceful', subtitle: 'komando kuat', desc: 'Tactical (berpikir taktis), Rentang kendali kuat (mampu memanaje banyak orang/kegiatan/span of control kuat), Tegas memerintah' },
                { label: 'Responsible', subtitle: 'tanggung jawab', desc: 'Dapat diandalkan, Siap menanggung resiko, Kerja tuntas' },
                { label: 'Justice', subtitle: 'ingin adil', desc: 'Adil memutuskan, Objektif, Mempertimbangkan dengan tepat' }
            ]
        },
        'Ii': {
            code: 'Ii', name: 'Intuiting Introvert', color: 'stifin-intuiting', hex: '#3b82f6',
            mkGroup: 'Intuiting',
            os: 'sistem operasi otak Anda dominan pada Neokorteks Kanan lapisan Putih (Dalam)',
            quotient: 'CQ (Creativity Quotient)',
            essence: 'Anda dilahirkan dengan kecerdasan Intuiting Introvert (Ii). Anda adalah \'Kreator\' murni yang mengandalkan intuisi dan imajinasi spasial. Anda memandang jauh ke depan.',
            drive: 'Chemistry alamiah Anda adalah mencipta "Kata" atau konsep/ide. Anda termotivasi oleh hasrat untuk merealisasikan visi batin Anda menjadi mahakarya.',
            path: 'Kunci sukses Anda adalah mencari inkubator untuk memelihara ide Anda hingga matang. Belajarlah dengan menangkap konsep makro.',
            driveDetails: { drive: 'Introvert (i)', stimuli: 'Saraf Dari Dalam', falsafah: 'Diancam (Anti-Neraka)', motivasi: 'Ditantang' },
            finansial: { tabiat: 'Mencari Kepuasan Ide (Seni untuk Seni)', kemistri: 'Menerbangkan Kata (Kepuasan Ide Murni)', brand: 'Quality / Kualitas Kerja (Contoh: Sri Mulyani)' },
            peran: { utama: 'Inisiator / Kreator Murni', kelebihan: 'Invention (Ciptaan Murni / Ide Unik)', klu: 'Mencari Program / Inkubasi (Inkubasi Ciptaan)' },
            belajarDeep: { cara: 'Menangkap konsep makro, visualisasi spasial, metafora', pemicu: 'Ditantang (merasa bisa berbuat lebih)' },
            topo: { scanner: 'Active', os: 'Neokorteks Kanan', lapisan: 'Putih (Dalam)', cuaca: 'Sejuk', cairan: 'Lendir (Flegmatis)', angin: 'Barat Daya' },
            belajar: { 
                metode: 'Menggunakan visualisasi spasial, menghubungkan pola abstrak, metafora, & analogi ide murni', 
                peran: 'Inisiator / Kreator (Penggagas Karya Unik)', 
                panggung: 'Area kreatif murni, laboratorium inovasi, & konseptual',
                kebiasaan: 'Melamun/membayangkan konsep sebelum menuangkannya',
                media: 'Coretan ide, simbol abstrak, gambar 3D, ilustrasi metafora'
            },
            psiko: { traits: [{name: 'Imaginative', val: 95}, {name: 'Perfectionist', val: 88}, {name: 'Visionary', val: 85}], disc: 'Compliance (C)' },
            motivasi: { kemistri: 'Kata (Ide)', luang: 'Berkreasi', harapan: 'Creating (Kreasi)', keywords: ['Mengarang', 'Perut Panjang', 'Perubahan', 'Murni'], profesiContoh: 'Sutradara / Penemu' },
            karir: { utama: 'Periklanan, Desain, Arsitektur, Sastra, R&D Kreatif', lainnya: 'Pengusaha/Investor, Bisnis Pendidikan/Pelatihan, Penulis Sastra, Cinematografis, Detektif, Seniman, Pengusaha, Peneliti Sain Murni, Fisikawan Quantum, Pencipta Lagu, Reengineering, Proyeksi, Peramal Bisnis, Pemain Saham, Investor, Filosof, Pakar Pembelajaran/Pemodul, Even Organizer (EO) Produsen, Desainer, Ahli Kreatif Berbagai Bidang, Arsitek, Sutradara, Pelukis Abstrak, Pesulap, Peramal, Pialang Saham, Atlit (Sprinter/Pertandingan), Pelatih Olahraga Pertandingan, Penyembuh, Cenayang dll.' },
            sosial: { support: 'Feeling (F)', didukung: 'Insting (In)', conquer: 'Sensing (S)', ditaklukkan: 'Thinking (T)' },
            fisik: { konstitusi: 'Astenis Tebal', otot: 'Ramping padat', kalibrasi: 'Menonton film / Berimajinasi / Hening' },
            perilaku8: {
                os: 'Berada di Neo Cortex Kanan di Lapisan Putih',
                kecerdasan: 'Creativity Quotient',
                peranan: 'Initiator ( Penggagas )',
                kelebihan: 'Invention (Penemuan)',
                target: 'Significance ( Perubahan nyata )',
                harapan: 'Creating ( Penciptaan )',
                brand: 'Merek pada kualitas kerjanya',
                tabiatUang: 'Terhadap uang Kepuasan'
            },
            gambaranDasar: { kalibrasi: 'Tidur, Nonton', tipologiFisik: 'Astenis', organPenyakit: 'Liver' },
            traitsList: [
                { label: 'Learner', subtitle: 'pembelajar', desc: 'Suka belajar, Mengejar ilmu, Curious (ingin serba tahu)' },
                { label: 'Assertive', subtitle: 'berani menagih hak', desc: 'Menyampaikan haknya, Berani tidak populer, Berani berpendapat' },
                { label: 'Perfectionist', subtitle: 'ingin sempurna', desc: 'Menuntut sempurna (berharap orang lain sempurna), selalu menjadi terbaik, Mengutamakan kualitas' },
                { label: 'Invention', subtitle: 'menciptakan ide murni', desc: 'Kreatifitas murni, Eksploratif, Berani bereksperimen' },
                { label: 'Optimistic', subtitle: 'yakin berhasil', desc: 'Prasangka baik terhadap diri, Yakin selalu berhasil, Percaya diri tinggi' }
            ]
        },
        'Ie': {
            code: 'Ie', name: 'Intuiting Extrovert', color: 'stifin-intuiting', hex: '#3b82f6',
            mkGroup: 'Intuiting',
            os: 'sistem operasi otak Anda dominan pada Neokorteks Kanan lapisan Abu-abu (Luar)',
            quotient: 'SQ (Spatial Quotient)',
            essence: 'Anda dilahirkan dengan kecerdasan Intuiting Extrovert (Ie). Anda adalah \'Pembaharu\' atau pengusaha visioner yang mahir merakit berbagai ide.',
            drive: 'Chemistry alamiah Anda adalah "Kata" (Ide) yang dibumikan atau dikomersialkan. Anda termotivasi oleh kebebasan dan perubahan.',
            path: 'Kunci sukses Anda adalah berbisnis dan beraliansi. Tangkap tren makro dari ketinggian dan temukan partner eksekusi.',
            driveDetails: { drive: 'Extrovert (e)', stimuli: 'Rangsangan Dari Luar', falsafah: 'Iming-iming (Cari Surga)', motivasi: 'Difasilitasi' },
            finansial: { tabiat: 'Progresif (Modal Masa Depan)', kemistri: 'Mendaratkan Kata (Dikawinkan dengan Pasar)', brand: 'Margin / Keuntungan (Contoh: Sukanto Tanoto)' },
            peran: { utama: 'Pembaharu / Entrepreneur', kelebihan: 'Innovation (Pembaharu / Tren Bisnis)', klu: 'Berbisnis (Memutar Aset & Marjin)' },
            belajarDeep: { cara: 'Studi kasus kontekstual, kebebasan eksplorasi ruang & ide', pemicu: 'Jangan dibatasi / Beri ruang gerak' },
            topo: { scanner: 'Active', os: 'Neokorteks Kanan', lapisan: 'Abu-abu (Luar)', cuaca: 'Hangat', cairan: 'Lendir (Flegmatis)', angin: 'Selatan' },
            belajar: { 
                metode: 'Mempelajari studi kasus kontekstual, perakitan gagasan (assembling), & eksplorasi tren masa depan', 
                peran: 'Pembaharu / Entrepreneur (Perakit Inovasi Bisnis)', 
                panggung: 'Area bisnis disrupsi, riset pasar, & perancangan strategi',
                kebiasaan: 'Brainstorming terbuka tanpa batasan kaku',
                media: 'Mind-mapping dinamis, tren industri, studi kasus nyata'
            },
            psiko: { traits: [{name: 'Innovative', val: 93}, {name: 'Adaptable', val: 89}, {name: 'Optimistic', val: 86}], disc: 'Influence-Dominant' },
            motivasi: { kemistri: 'Kata (Ide)', luang: 'Eksplorasi', harapan: 'Assembling (Merakit)', keywords: ['Mengarang', 'Perut Panjang', 'Perubahan', 'Rakitan'], profesiContoh: 'Pengusaha' },
            karir: { utama: 'Wirausaha, Pemasaran Strategis, Investasi, Developer', lainnya: 'Marketer/Iklan Agency, Lifestyle/Mode, Bisnis Penerbangan, Bisnis Agro-Forestry, Seniman, Pengusaha, Peneliti Sain Murni, Fisikawan Quantum, Pencipta Lagu, Reengineering, Proyeksi, Peramal Bisnis, Pemain Saham, Investor, Filosof, Pakar Pembelajaran/Pemodul, Even Organizer (EO) Produsen, Desainer, Ahli Kreatif Berbagai Bidang, Arsitek, Sutradara, Pelukis Abstrak, Pesulap, Peramal, Pialang Saham, Atlit (Sprinter/Pertandingan), Pelatih Olahraga Pertandingan, Penyembuh, Cenayang dll.' },
            sosial: { support: 'Feeling (F)', didukung: 'Insting (In)', conquer: 'Sensing (S)', ditaklukkan: 'Thinking (T)' },
            fisik: { konstitusi: 'Astenis Tipis', otot: 'Ramping lentur', kalibrasi: 'Traveling / Mencari inspirasi baru' },
            perilaku8: {
                os: 'Berada di Neo Cortex Kanan di Lapisan Kelabu',
                kecerdasan: 'Spatial Quotient',
                peranan: 'Reformer ( Pembaharu )',
                kelebihan: 'Inovation (Karya cipta)',
                target: 'Quality ( Kualitas )',
                harapan: 'Assembling ( Kreativitas Perakitan )',
                brand: 'Merek pada Margin Keuntungan',
                tabiatUang: 'Terhadap uang Maju'
            },
            gambaranDasar: { kalibrasi: 'Tidur, Nonton', tipologiFisik: 'Astenis', organPenyakit: 'Liver' },
            traitsList: [
                { label: 'Inspiring', subtitle: 'menginspirasi', desc: 'Banyak ide, Pandai melihat sisi lain, Hadirkan kebaruan' },
                { label: 'Benchmarker', subtitle: 'standar rujukan', desc: 'Menghidupkan standar, Ingin menjadi trendsetter, Quality driven (Terus memperbaiki diri)' },
                { label: 'Expressive', subtitle: 'penuh ekspresi', desc: 'Tampil ekspresif, Menghidupkan Bahasa tubuh, Teatrikal' },
                { label: 'Innovative', subtitle: 'menciptakan ide yang lebih baik', desc: 'Selalu memberi nilai tambah, Mensintesa, Assembling/kreatifitas rakitan' },
                { label: 'Spatial', subtitle: 'kemampuan meruang', desc: 'Kemampuan meruang, Menginvestigasi, Intuition (kemampuan melihat masa depan)' }
            ]
        },
        'Fi': {
            code: 'Fi', name: 'Feeling Introvert', color: 'stifin-feeling', hex: '#22c55e',
            mkGroup: 'Feeling',
            os: 'sistem operasi otak Anda dominan pada Limbik Kanan lapisan Putih (Dalam)',
            quotient: 'EQ (Emotional Quotient)',
            essence: 'Anda dilahirkan dengan kecerdasan Feeling Introvert (Fi). Anda adalah \'Leader\' kharismatik yang memimpin dari hati dengan empati mendalam.',
            drive: 'Chemistry alamiah Anda adalah Cinta dan pengaruh. Anda termotivasi oleh harmoni dan pengakuan emosional.',
            path: 'Kunci sukses Anda adalah mencari platform untuk memperkuat pengaruh kepemimpinan Anda.',
            driveDetails: { drive: 'Introvert (i)', stimuli: 'Saraf Dari Dalam', falsafah: 'Diancam (Anti-Neraka)', motivasi: 'Ditantang' },
            finansial: { tabiat: 'Nge-bossi (Menyenangkan Pengikut)', kemistri: 'Menjaring Cinta (Cinta Perempuan Tunggal)', brand: 'Leadership / Kepemimpinan (Contoh: Ir. Soekarno)' },
            peran: { utama: 'Leader / Pemimpin Kharismatik', kelebihan: 'Popularitas (Pesona & Kharisma)', klu: 'Mencari Platform (Memperkuat Pengaruh)' },
            belajarDeep: { cara: 'Mendengarkan (Auditori / Ilmu lewat telinga), ceramah', pemicu: 'Sentuh emosi & jaga mood' },
            topo: { scanner: 'Active', os: 'Limbik Kanan', lapisan: 'Putih (Dalam)', cuaca: 'Hangat', cairan: 'Darah (Sanguinis)', angin: 'Tenggara' },
            belajar: { 
                metode: 'Menyimak rekaman suara (auditori), mendengarkan ceramah/podcast, & perenungan emosional secara hening', 
                peran: 'Leader / Pemimpin Kharismatik (Penyentuh Emosi/Batin)', 
                panggung: 'Area kepemimpinan, advokasi, & pergerakan sosial',
                kebiasaan: 'Mendengarkan penjelasan lisan secara khusyuk',
                media: 'Audiobook, podcast, ceramah lisan, cerita inspiratif'
            },
            psiko: { traits: [{name: 'Empathetic', val: 96}, {name: 'Persuasive', val: 87}, {name: 'Idealistic', val: 84}], disc: 'Steadiness (S)' },
            motivasi: { kemistri: 'Cinta', luang: 'Nge-bossi', harapan: 'Leading (Terdepan)', keywords: ['Merasakan', 'Pernafasan', 'Memimpin', 'Memerlukan'], profesiContoh: 'Politisi / Leader' },
            karir: { utama: 'Politik, Diplomasi, Hubungan Masyarakat, Advokasi, Agama', lainnya: 'Psikolog, Komunikasi, Diplomat, Humas, Promotor, Investor, Negarawan, Trainer /Public Speaker, Administrasi Negara, Seniman, Budayawan, Hubungan International, Salesman, Inspirator, Motivator, Psikiater, Counselor, Idiolog, Personalia, Lawyer, Birokrat, Aktivis, Atlit Maraton, Dll' },
            sosial: { support: 'Sensing (S)', didukung: 'Intuiting (I)', conquer: 'Thinking (T)', ditaklukkan: 'Insting (In)' },
            fisik: { konstitusi: 'Displastis Besar', otot: 'Besar / Lebar', kalibrasi: 'Curhat / Hening / Diskusi hati' },
            perilaku8: {
                os: 'Berada di Limbik Kanan di Lapisan Putih',
                kecerdasan: 'Emotional Quotient',
                peranan: 'Leader ( Pemimpin )',
                kelebihan: 'Popularity (Ketenaran)',
                target: 'VISI ( Pandangan Jauh )',
                harapan: 'Leading ( Kepemimpinan )',
                brand: 'Merek pada Kepemimpinannya',
                tabiatUang: 'Terhadap uang sbg. Juragan'
            },
            gambaranDasar: { kalibrasi: 'Curhat, Bercengkrama', tipologiFisik: 'Displastis', organPenyakit: 'Paru-paru' },
            traitsList: [
                { label: 'Idealistic', subtitle: 'idealis', desc: 'Hidup dengan filosofi, Visioner, Berpikir besar' },
                { label: 'Leader', subtitle: 'memimpin', desc: 'Memimpin dengan hati, Mempunyai charisma, Keteladanan' },
                { label: 'Populer', subtitle: 'terkenal', desc: 'Ingin disayangi, Meningkatkan exposure, Mengemas citra' },
                { label: 'Reflective', subtitle: 'bercermin diri', desc: 'Mampu bercermin diri, Mendapatkan kenyamanan suasana hati (butuh/kemampuan utk curhat), Menumbuhkan jiwa baru' },
                { label: 'Convincing', subtitle: 'meyakinkan', desc: 'Memiliki keyakinan besar, Mempersuasi, Menginduksi/kata-kata yg menyihir' }
            ]
        },
        'Fe': {
            code: 'Fe', name: 'Feeling Extrovert', color: 'stifin-feeling', hex: '#22c55e',
            mkGroup: 'Feeling',
            os: 'sistem operasi otak Anda dominan pada Limbik Kanan lapisan Abu-abu (Luar)',
            quotient: 'Sq (Social Quotient)',
            essence: 'Anda dilahirkan dengan kecerdasan Feeling Extrovert (Fe). Anda adalah \'Mentor\' atau fasilitator ulung yang sangat peka terhadap dinamika sosial.',
            drive: 'Chemistry alamiah Anda adalah Cinta yang diekspresikan keluar untuk membangun tim yang harmonis.',
            path: 'Kunci sukses Anda adalah membangun kader atau tim yang loyal. Jadilah "King Maker".',
            driveDetails: { drive: 'Extrovert (e)', stimuli: 'Rangsangan Dari Luar', falsafah: 'Iming-iming (Cari Surga)', motivasi: 'Difasilitasi' },
            finansial: { tabiat: 'Instan (Cari Jalan Mudah)', kemistri: 'Menebar Cinta (Ke Mana-mana)', brand: 'Team & Organization (Contoh: Jakob Oetama)' },
            peran: { utama: 'Owner / King Maker / Mentor', kelebihan: 'Magnifying (Membesarkan Orang / Kader)', klu: 'Mencari Kader (Mencetak Pemimpin Baru)' },
            belajarDeep: { cara: 'Berdiskusi (Interaksi telinga & mulut), role-play', pemicu: 'Beri pujian & apresiasi' },
            topo: { scanner: 'Active', os: 'Limbik Kanan', lapisan: 'Abu-abu (Luar)', cuaca: 'Hangat', cairan: 'Darah (Sanguinis)', angin: 'Timur' },
            belajar: { 
                metode: 'Diskusi kelompok interaktif (telinga & mulut), role-play, serta membutuhkan dorongan apresiasi/pujian', 
                peran: 'Mentor / King Maker (Penggembleng & Pemimpin Tim)', 
                panggung: 'Area HR, pengembangan komunitas, & pelatihan SDM',
                kebiasaan: 'Tanya-jawab interaktif & mengajar balik materi',
                media: 'Forum diskusi, simulasi peran (role-play), kerja kelompok'
            },
            psiko: { traits: [{name: 'Sociable', val: 94}, {name: 'Nurturing', val: 90}, {name: 'Communicative', val: 88}], disc: 'Influence-Steadiness' },
            motivasi: { kemistri: 'Cinta', luang: 'Instan', harapan: 'Coaching (Kingmaker)', keywords: ['Merasakan', 'Pernafasan', 'Memimpin', 'Diperlukan'], profesiContoh: 'Public Speaker' },
            karir: { utama: 'HRD, Psikologi, Public Relations, Pendidikan, Konseling', lainnya: 'Politisi, Eksekutif, Lawyer, Kesenian , Investor, Negarawan, Trainer /Public Speaker, Administrasi Negara, Seniman, Budayawan, Hubungan International, Salesman, Inspirator, Motivator, Psikiater, Counselor, Idiolog, Personalia, Lawyer, Birokrat, Aktivis, Atlit Maraton, Dll' },
            sosial: { support: 'Sensing (S)', didukung: 'Intuiting (I)', conquer: 'Thinking (T)', ditaklukkan: 'Insting (In)' },
            fisik: { konstitusi: 'Displastis Kecil', otot: 'Fleksibel', kalibrasi: 'Nongkrong / Silaturahmi' },
            perilaku8: {
                os: 'Berada di Limbik Kanan di Lapisan Kelabu',
                kecerdasan: 'Social Quotient',
                peranan: 'Owner ( Pemilik )',
                kelebihan: 'Magnifying (Pembesaran)',
                target: 'People ( Orang lain )',
                harapan: 'Coaching (Penggemblengan)',
                brand: 'Merek pada TIM & Organisasinya',
                tabiatUang: 'Terhadap uang Ambil Risiko'
            },
            gambaranDasar: { kalibrasi: 'Curhat, Bercengkrama', tipologiFisik: 'Displastis', organPenyakit: 'Paru-paru' },
            traitsList: [
                { label: 'Empathy', subtitle: 'berempati', desc: 'Memahami orang lebih dalam, memiliki kepekaan peka, memiliki kepedulian' },
                { label: 'Communicative', subtitle: 'komunikatif', desc: 'Komunikatif, Menyentuh hati, Pendengar yang baik' },
                { label: 'Social minded', subtitle: 'orientasi sosial', desc: 'Berorientasi social (orang), Toleransi, Bekerjasama' },
                { label: 'Affectionate', subtitle: 'penuh sayang', desc: 'Memberi kasih sayang, Penuh perhatian, Berlimpah cinta' },
                { label: 'Guiding', subtitle: 'membimbing', desc: 'Membimbing orang, Menaikkan level orang (enable), Memotivasi orang' }
            ]
        },
        'In': {
            code: 'In', name: 'Insting', color: 'stifin-insting', hex: '#eab308',
            mkGroup: 'Insting',
            os: 'sistem operasi otak Anda dominan pada Otak Tengah (Cerebellum)',
            quotient: 'AQ (Altruist Quotient)',
            essence: 'Anda dilahirkan dengan kecerdasan Insting (In). Anda adalah \'Partner\' yang serba bisa, spontan, pragmatis, dan memiliki altruisme tinggi.',
            drive: 'Chemistry alamiah Anda adalah Bahagia dan kedamaian. Anda termotivasi oleh peran untuk menolong orang lain.',
            path: 'Kunci sukses Anda adalah mengambil peran untuk berkontribusi. Anda adalah generalis yang menjembatani semua pihak.',
            driveDetails: { drive: 'Tanpa Kemudi (Otomatis / Refleks)', stimuli: 'Spontanitas Lingkungan', falsafah: 'Kedamaian & Netralitas', motivasi: 'Bimbingan Telaten Tanpa Kemarahan' },
            finansial: { tabiat: 'Martir (Mendahulukan Orang Lain)', kemistri: 'Selalu Bahagia (Menghindari Ekstrem)', brand: 'Role / Peranan (Contoh: Jusuf Kalla)' },
            peran: { utama: 'Partner / Orang Kedua / Peaceseeker', kelebihan: 'Radar Panjang (Sinyal Langit / Serba Bisa)', klu: 'Berperan / Multitasking (Pengabdian)' },
            belajarDeep: { cara: 'Merangkum / Resume (Deduktif: kesimpulan ke detail)', pemicu: 'Bimbingan bertahap tanpa kemarahan' },
            topo: { scanner: 'Active', os: 'Otak Tengah', lapisan: 'Tidak Ada (Otomatis)', cuaca: 'Netral', cairan: 'Air Tubuh (-)', angin: 'Pusat' },
            belajar: { 
                metode: 'Penalaran deduktif (dari kesimpulan umum merangkum ke detail), merangkum poin inti, & praktik spontan', 
                peran: 'Partner / Peaceseeker (Mitra Multitasking Generalis)', 
                panggung: 'Area mediasi, nirlaba, pelayanan, & koordinasi lintas divisi',
                kebiasaan: 'Membuat ringkasan poin-poin singkat yang netral',
                media: 'Rangkuman/resume singkat, modul kilat, instruksi langsung'
            },
            psiko: { traits: [{name: 'Spontaneous', val: 92}, {name: 'Altruistic', val: 95}, {name: 'Adaptable', val: 90}], disc: 'Steadiness-Compliance' },
            motivasi: { kemistri: 'Bahagia', luang: 'Berkorban', harapan: 'Contributing (Berkontribusi)', keywords: ['Merangkai', 'Reflek', 'Berkorban', 'Otomatis'], profesiContoh: 'Penggiat Nirlaba' },
            karir: { utama: 'NGO, Musik/Seni, Pelayanan Masyarakat, Mediation, Spiritual', lainnya: 'Pembalap, Entertainer, Agamawan, Aktivis, Musik, Chef, Jurnalis, Pengetahuan Umum, Performance, Spiritualist, Birokrat, Pelayan Masyarakat, Mediator, Tangan Kanan untuk semua posisi dan semua Industri, Kolumnis, Generalis, Presenter Serba Bisa, Atlit Serba Bisa, dll' },
            sosial: { support: 'Intuiting (I)', didukung: 'Thinking (T)', conquer: 'Feeling (F)', ditaklukkan: 'Sensing (S)' },
            fisik: { konstitusi: 'Stenis Datar', otot: 'Refleks cepat (Sumsum tulang)', kalibrasi: 'Musik / Suasana damai' },
            perilaku8: {
                os: 'Berada di Otak Tengah Lapisan tidak ada',
                kecerdasan: 'Altruist Quotient',
                peranan: 'Partner ( Mitra )',
                kelebihan: '3rd Eye (Mata Ketiga)',
                target: 'Growth ( Pertumbuhan )',
                harapan: 'Contributing (Kontribusi)',
                brand: 'Merek pada Tingkat berperannya',
                tabiatUang: 'Terhadap uang sbg. Penolong'
            },
            gambaranDasar: { kalibrasi: 'Silaturahmi', tipologiFisik: 'Stenis', organPenyakit: 'Jantung' },
            traitsList: [
                { label: 'Generalis', subtitle: 'orientasi menyeluruh', desc: 'Serba bisa, Deduktif: berpikir dari umum ke khusus, Holistic / komperhensive' },
                { label: 'Flowing', subtitle: 'mengalir', desc: 'Berjiwa mengalir, Menjalin Hubungan, Mempermudah urusan' },
                { label: 'Resourceful', subtitle: 'menjadi sumber daya', desc: 'Menjadi sumber daya pelengkap, (ingin) terlibat, Occupied (kepake) yang dibutuhkan orang' },
                { label: 'Instinctive', subtitle: 'naluri tajam', desc: 'Naluri tajam, Responsive, Menangkap insight (hikmah)' },
                { label: 'Altruis', subtitle: 'rela berkorban', desc: 'Rela berkorban, Pembuktian kebaikan, Helpful' }
            ]
        }
    }
};
