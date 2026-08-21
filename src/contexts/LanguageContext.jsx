import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabase";

const STORAGE_KEY = "safetradex_language";

export const LANGUAGES = [
  { code: "en-US", label: "English (US)" },
  { code: "en-GB", label: "English (UK)" },
  { code: "es", label: "Español" },
  { code: "pt", label: "Português" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
  { code: "it", label: "Italiano" },
  { code: "nl", label: "Nederlands" },
  { code: "pl", label: "Polski" },
  { code: "ru", label: "Русский" },
  { code: "zh", label: "中文" },
  { code: "ja", label: "日本語" },
  { code: "ko", label: "한국어" },
  { code: "vi", label: "Tiếng Việt" },
  { code: "th", label: "ไทย" },
  { code: "id", label: "Bahasa Indonesia" },
  { code: "ms", label: "Bahasa Melayu" },
  { code: "hi", label: "हिन्दी" },
  { code: "ar", label: "العربية" },
];

// Translation dictionary. Add a `key: { code: "text" }` entry here for every
// piece of UI text as pages get converted. Falls back to English if a key
// is missing for the selected language.
const translations = {
  "profile.language.title": {
    "en-US": "Language",
    "en-GB": "Language",
    es: "Idioma",
    pt: "Idioma",
    fr: "Langue",
    de: "Sprache",
    it: "Lingua",
    nl: "Taal",
    pl: "Język",
    ru: "Язык",
    zh: "语言",
    ja: "言語",
    ko: "언어",
    vi: "Ngôn ngữ",
    th: "ภาษา",
    id: "Bahasa",
    ms: "Bahasa",
    hi: "भाषा",
    ar: "اللغة",
  },
  "profile.language.subtitle": {
    "en-US": "Choose your display language",
    "en-GB": "Choose your display language",
    es: "Elige tu idioma de visualización",
    pt: "Escolha seu idioma de exibição",
    fr: "Choisissez votre langue d'affichage",
    de: "Wähle deine Anzeigesprache",
    it: "Scegli la tua lingua di visualizzazione",
    nl: "Kies je weergavetaal",
    pl: "Wybierz język wyświetlania",
    ru: "Выберите язык отображения",
    zh: "选择显示语言",
    ja: "表示言語を選択してください",
    ko: "표시 언어를 선택하세요",
    vi: "Chọn ngôn ngữ hiển thị",
    th: "เลือกภาษาที่แสดง",
    id: "Pilih bahasa tampilan",
    ms: "Pilih bahasa paparan",
    hi: "अपनी प्रदर्शन भाषा चुनें",
    ar: "اختر لغة العرض",
  },

  // ── Bottom navigation ──
  "nav.home": {
    "en-US": "Home", "en-GB": "Home", es: "Inicio", pt: "Início", fr: "Accueil", de: "Start",
    it: "Home", nl: "Start", pl: "Start", ru: "Главная", zh: "首页", ja: "ホーム", ko: "홈",
    vi: "Trang chủ", th: "หน้าแรก", id: "Beranda", ms: "Laman Utama", hi: "होम", ar: "الرئيسية",
  },
  "nav.markets": {
    "en-US": "Markets", "en-GB": "Markets", es: "Mercados", pt: "Mercados", fr: "Marchés", de: "Märkte",
    it: "Mercati", nl: "Markten", pl: "Rynki", ru: "Рынки", zh: "市场", ja: "マーケット", ko: "마켓",
    vi: "Thị trường", th: "ตลาด", id: "Pasar", ms: "Pasaran", hi: "बाज़ार", ar: "الأسواق",
  },
  "nav.trade": {
    "en-US": "Trade", "en-GB": "Trade", es: "Operar", pt: "Negociar", fr: "Trader", de: "Handel",
    it: "Trading", nl: "Handel", pl: "Handel", ru: "Торговля", zh: "交易", ja: "取引", ko: "거래",
    vi: "Giao dịch", th: "เทรด", id: "Perdagangan", ms: "Dagangan", hi: "ट्रेड", ar: "تداول",
  },
  "nav.financial": {
    "en-US": "Financial", "en-GB": "Financial", es: "Finanzas", pt: "Financeiro", fr: "Finance", de: "Finanzen",
    it: "Finanza", nl: "Financieel", pl: "Finanse", ru: "Финансы", zh: "理财", ja: "金融", ko: "금융",
    vi: "Tài chính", th: "การเงิน", id: "Keuangan", ms: "Kewangan", hi: "वित्त", ar: "مالية",
  },
  "nav.assets": {
    "en-US": "Assets", "en-GB": "Assets", es: "Activos", pt: "Ativos", fr: "Actifs", de: "Vermögen",
    it: "Attività", nl: "Bezittingen", pl: "Aktywa", ru: "Активы", zh: "资产", ja: "資産", ko: "자산",
    vi: "Tài sản", th: "สินทรัพย์", id: "Aset", ms: "Aset", hi: "संपत्ति", ar: "الأصول",
  },

  // ── Common / shared ──
  "common.notifications": {
    "en-US": "Notifications", "en-GB": "Notifications", es: "Notificaciones", pt: "Notificações",
    fr: "Notifications", de: "Benachrichtigungen", it: "Notifiche", nl: "Meldingen", pl: "Powiadomienia",
    ru: "Уведомления", zh: "通知", ja: "通知", ko: "알림", vi: "Thông báo", th: "การแจ้งเตือน",
    id: "Notifikasi", ms: "Pemberitahuan", hi: "सूचनाएं", ar: "الإشعارات",
  },
  "common.profile": {
    "en-US": "Profile", "en-GB": "Profile", es: "Perfil", pt: "Perfil", fr: "Profil", de: "Profil",
    it: "Profilo", nl: "Profiel", pl: "Profil", ru: "Профиль", zh: "个人资料", ja: "プロフィール",
    ko: "프로필", vi: "Hồ sơ", th: "โปรไฟล์", id: "Profil", ms: "Profil", hi: "प्रोफ़ाइल", ar: "الملف الشخصي",
  },

  // ── Home / Portfolio card ──
  "home.portfolio.title": {
    "en-US": "Total Portfolio Value", "en-GB": "Total Portfolio Value", es: "Valor Total de la Cartera",
    pt: "Valor Total da Carteira", fr: "Valeur Totale du Portefeuille", de: "Gesamtwert des Portfolios",
    it: "Valore Totale del Portafoglio", nl: "Totale Portefeuillewaarde", pl: "Całkowita Wartość Portfela",
    ru: "Общая стоимость портфеля", zh: "投资组合总价值", ja: "ポートフォリオ総額", ko: "총 포트폴리오 가치",
    vi: "Tổng Giá Trị Danh Mục", th: "มูลค่าพอร์ตทั้งหมด", id: "Total Nilai Portofolio",
    ms: "Jumlah Nilai Portfolio", hi: "कुल पोर्टफोलियो मूल्य", ar: "القيمة الإجمالية للمحفظة",
  },
  "home.portfolio.today": {
    "en-US": "Today", "en-GB": "Today", es: "Hoy", pt: "Hoje", fr: "Aujourd'hui", de: "Heute",
    it: "Oggi", nl: "Vandaag", pl: "Dziś", ru: "Сегодня", zh: "今日", ja: "今日", ko: "오늘",
    vi: "Hôm nay", th: "วันนี้", id: "Hari ini", ms: "Hari ini", hi: "आज", ar: "اليوم",
  },

  // ── Home / Market overview ──
  "home.markets.viewAll": {
    "en-US": "View All", "en-GB": "View All", es: "Ver Todo", pt: "Ver Tudo", fr: "Voir Tout",
    de: "Alle Anzeigen", it: "Vedi Tutto", nl: "Alles Bekijken", pl: "Zobacz Wszystko",
    ru: "Смотреть все", zh: "查看全部", ja: "すべて表示", ko: "전체 보기", vi: "Xem Tất Cả",
    th: "ดูทั้งหมด", id: "Lihat Semua", ms: "Lihat Semua", hi: "सभी देखें", ar: "عرض الكل",
  },
  "home.markets.loading": {
    "en-US": "Loading markets...", "en-GB": "Loading markets...", es: "Cargando mercados...",
    pt: "Carregando mercados...", fr: "Chargement des marchés...", de: "Märkte werden geladen...",
    it: "Caricamento mercati...", nl: "Markten laden...", pl: "Ładowanie rynków...",
    ru: "Загрузка рынков...", zh: "加载市场中...", ja: "マーケットを読み込み中...", ko: "마켓 불러오는 중...",
    vi: "Đang tải thị trường...", th: "กำลังโหลดตลาด...", id: "Memuat pasar...",
    ms: "Memuatkan pasaran...", hi: "बाज़ार लोड हो रहा है...", ar: "جارٍ تحميل الأسواق...",
  },

  // ── Home / Rewards carousel — slide 1 ──
  "home.rewards.s1.c1.title": {
    "en-US": "REFER & EARN", "en-GB": "REFER & EARN", es: "REFIERE Y GANA", pt: "INDIQUE E GANHE",
    fr: "PARRAINER & GAGNER", de: "EMPFEHLEN & VERDIENEN", it: "INVITA E GUADAGNA",
    nl: "DOORVERWIJZEN & VERDIENEN", pl: "POLEĆ I ZARABIAJ", ru: "ПРИГЛАШАЙ И ЗАРАБАТЫВАЙ",
    zh: "邀请赚佣金", ja: "紹介して稼ぐ", ko: "추천하고 받기", vi: "GIỚI THIỆU & KIẾM TIỀN",
    th: "แนะนำและรับรางวัล", id: "AJAK & DAPATKAN", ms: "RUJUK & DAPAT", hi: "रेफ़र करें और कमाएं", ar: "أحِل واربح",
  },
  "home.rewards.s1.c1.btn": {
    "en-US": "Invite Friends", "en-GB": "Invite Friends", es: "Invitar Amigos", pt: "Convidar Amigos",
    fr: "Inviter des Amis", de: "Freunde Einladen", it: "Invita Amici", nl: "Vrienden Uitnodigen",
    pl: "Zaproś Znajomych", ru: "Пригласить друзей", zh: "邀请好友", ja: "友達を招待", ko: "친구 초대",
    vi: "Mời Bạn Bè", th: "เชิญเพื่อน", id: "Undang Teman", ms: "Jemput Rakan",
    hi: "मित्रों को आमंत्रित करें", ar: "دعوة الأصدقاء",
  },
  "home.rewards.s1.c2.title": {
    "en-US": "LEARN & EARN", "en-GB": "LEARN & EARN", es: "APRENDE Y GANA", pt: "APRENDA E GANHE",
    fr: "APPRENDRE & GAGNER", de: "LERNEN & VERDIENEN", it: "IMPARA E GUADAGNA",
    nl: "LEREN & VERDIENEN", pl: "UCZ SIĘ I ZARABIAJ", ru: "УЧИСЬ И ЗАРАБАТЫВАЙ",
    zh: "学习赚奖励", ja: "学んで稼ぐ", ko: "배우고 받기", vi: "HỌC & KIẾM TIỀN",
    th: "เรียนรู้และรับรางวัล", id: "BELAJAR & DAPATKAN", ms: "BELAJAR & DAPAT", hi: "सीखें और कमाएं", ar: "تعلّم واربح",
  },
  "home.rewards.s1.c2.btn": {
    "en-US": "Start Learning", "en-GB": "Start Learning", es: "Empezar a Aprender", pt: "Começar a Aprender",
    fr: "Commencer à Apprendre", de: "Lernen Beginnen", it: "Inizia a Imparare", nl: "Begin met Leren",
    pl: "Rozpocznij Naukę", ru: "Начать обучение", zh: "开始学习", ja: "学習を始める", ko: "학습 시작",
    vi: "Bắt Đầu Học", th: "เริ่มเรียนรู้", id: "Mulai Belajar", ms: "Mula Belajar",
    hi: "सीखना शुरू करें", ar: "ابدأ التعلم",
  },
  "home.rewards.s1.c3.title": {
    "en-US": "DAILY CHECK-IN", "en-GB": "DAILY CHECK-IN", es: "REGISTRO DIARIO", pt: "CHECK-IN DIÁRIO",
    fr: "CONNEXION QUOTIDIENNE", de: "TÄGLICHER CHECK-IN", it: "CHECK-IN GIORNALIERO",
    nl: "DAGELIJKSE CHECK-IN", pl: "CODZIENNE LOGOWANIE", ru: "ЕЖЕДНЕВНЫЙ ВХОД",
    zh: "每日签到", ja: "デイリーチェックイン", ko: "데일리 체크인", vi: "ĐIỂM DANH HÀNG NGÀY",
    th: "เช็คอินรายวัน", id: "CHECK-IN HARIAN", ms: "DAFTAR MASUK HARIAN", hi: "डेली चेक-इन", ar: "تسجيل الحضور اليومي",
  },
  "home.rewards.s1.c3.btn": {
    "en-US": "Claim Now", "en-GB": "Claim Now", es: "Reclamar Ahora", pt: "Resgatar Agora",
    fr: "Réclamer Maintenant", de: "Jetzt Einlösen", it: "Riscatta Ora", nl: "Nu Claimen",
    pl: "Odbierz Teraz", ru: "Забрать сейчас", zh: "立即领取", ja: "今すぐ受け取る", ko: "지금 받기",
    vi: "Nhận Ngay", th: "รับตอนนี้", id: "Klaim Sekarang", ms: "Tuntut Sekarang",
    hi: "अभी प्राप्त करें", ar: "المطالبة الآن",
  },

  // ── Rewards carousel — slide 2 ──
  "home.rewards.s2.c1.title": {
    "en-US": "TRADING CHALLENGE", "en-GB": "TRADING CHALLENGE", es: "DESAFÍO DE TRADING",
    pt: "DESAFIO DE NEGOCIAÇÃO", fr: "DÉFI DE TRADING", de: "TRADING-HERAUSFORDERUNG",
    it: "SFIDA DI TRADING", nl: "TRADING-UITDAGING", pl: "WYZWANIE TRADINGOWE",
    ru: "ТОРГОВЫЙ ВЫЗОВ", zh: "交易挑战赛", ja: "トレーディングチャレンジ", ko: "트레이딩 챌린지",
    vi: "THỬ THÁCH GIAO DỊCH", th: "ชาเลนจ์การเทรด", id: "TANTANGAN TRADING",
    ms: "CABARAN DAGANGAN", hi: "ट्रेडिंग चैलेंज", ar: "تحدي التداول",
  },
  "home.rewards.s2.c1.btn": {
    "en-US": "Join Challenge", "en-GB": "Join Challenge", es: "Unirse al Desafío", pt: "Participar do Desafio",
    fr: "Rejoindre le Défi", de: "Herausforderung Beitreten", it: "Unisciti alla Sfida", nl: "Doe Mee",
    pl: "Dołącz do Wyzwania", ru: "Присоединиться", zh: "参加挑战", ja: "チャレンジに参加", ko: "챌린지 참여",
    vi: "Tham Gia", th: "เข้าร่วมชาเลนจ์", id: "Ikuti Tantangan", ms: "Sertai Cabaran",
    hi: "चैलेंज में शामिल हों", ar: "انضم للتحدي",
  },
  "home.rewards.s2.c2.title": {
    "en-US": "VIP REWARDS", "en-GB": "VIP REWARDS", es: "RECOMPENSAS VIP", pt: "RECOMPENSAS VIP",
    fr: "RÉCOMPENSES VIP", de: "VIP-BELOHNUNGEN", it: "PREMI VIP", nl: "VIP-BELONINGEN",
    pl: "NAGRODY VIP", ru: "VIP-НАГРАДЫ", zh: "VIP奖励", ja: "VIP特典", ko: "VIP 리워드",
    vi: "ƯU ĐÃI VIP", th: "รางวัล VIP", id: "HADIAH VIP", ms: "GANJARAN VIP", hi: "वीआईपी रिवॉर्ड्स", ar: "مكافآت VIP",
  },
  "home.rewards.s2.c2.btn": {
    "en-US": "View Now", "en-GB": "View Now", es: "Ver Ahora", pt: "Ver Agora", fr: "Voir Maintenant",
    de: "Jetzt Ansehen", it: "Guarda Ora", nl: "Nu Bekijken", pl: "Zobacz Teraz", ru: "Смотреть сейчас",
    zh: "立即查看", ja: "今すぐ見る", ko: "지금 보기", vi: "Xem Ngay", th: "ดูตอนนี้",
    id: "Lihat Sekarang", ms: "Lihat Sekarang", hi: "अभी देखें", ar: "عرض الآن",
  },
  "home.rewards.s2.c3.title": {
    "en-US": "MYSTERY BOX", "en-GB": "MYSTERY BOX", es: "CAJA MISTERIOSA", pt: "CAIXA MISTERIOSA",
    fr: "BOÎTE MYSTÈRE", de: "MYSTERY-BOX", it: "SCATOLA MISTERIOSA", nl: "MYSTERIEBOX",
    pl: "SKRZYNKA NIESPODZIANKA", ru: "КОРОБКА С СЮРПРИЗОМ", zh: "神秘盲盒", ja: "ミステリーボックス",
    ko: "미스터리 박스", vi: "HỘP BÍ ẨN", th: "กล่องสุ่ม", id: "KOTAK MISTERI",
    ms: "KOTAK MISTERI", hi: "मिस्ट्री बॉक्स", ar: "صندوق الغموض",
  },
  "home.rewards.s2.c3.btn": {
    "en-US": "Open Box", "en-GB": "Open Box", es: "Abrir Caja", pt: "Abrir Caixa", fr: "Ouvrir la Boîte",
    de: "Box Öffnen", it: "Apri Scatola", nl: "Open Box", pl: "Otwórz Skrzynkę", ru: "Открыть коробку",
    zh: "打开盲盒", ja: "ボックスを開く", ko: "박스 열기", vi: "Mở Hộp", th: "เปิดกล่อง",
    id: "Buka Kotak", ms: "Buka Kotak", hi: "बॉक्स खोलें", ar: "افتح الصندوق",
  },

  // ── Rewards carousel — slide 3 ──
  "home.rewards.s3.c1.title": {
    "en-US": "CASHBACK", "en-GB": "CASHBACK", es: "REEMBOLSO", pt: "CASHBACK", fr: "REMISE EN ARGENT",
    de: "CASHBACK", it: "CASHBACK", nl: "CASHBACK", pl: "ZWROT GOTÓWKI", ru: "КЭШБЭК",
    zh: "现金返还", ja: "キャッシュバック", ko: "캐시백", vi: "HOÀN TIỀN", th: "เงินคืน",
    id: "CASHBACK", ms: "WANG TUNAI BALIK", hi: "कैशबैक", ar: "استرداد نقدي",
  },
  "home.rewards.s3.c1.btn": {
    "en-US": "See Cashback", "en-GB": "See Cashback", es: "Ver Reembolso", pt: "Ver Cashback",
    fr: "Voir la Remise", de: "Cashback Ansehen", it: "Vedi Cashback", nl: "Bekijk Cashback",
    pl: "Zobacz Zwrot", ru: "Смотреть кэшбэк", zh: "查看返现", ja: "キャッシュバックを見る",
    ko: "캐시백 보기", vi: "Xem Hoàn Tiền", th: "ดูเงินคืน", id: "Lihat Cashback",
    ms: "Lihat Cashback", hi: "कैशबैक देखें", ar: "عرض الاسترداد",
  },
  "home.rewards.s3.c2.title": {
    "en-US": "NEW USER MISSION", "en-GB": "NEW USER MISSION", es: "MISIÓN NUEVO USUARIO",
    pt: "MISSÃO NOVO USUÁRIO", fr: "MISSION NOUVEL UTILISATEUR", de: "MISSION FÜR NEUE NUTZER",
    it: "MISSIONE NUOVO UTENTE", nl: "MISSIE NIEUWE GEBRUIKER", pl: "MISJA NOWEGO UŻYTKOWNIKA",
    ru: "МИССИЯ НОВИЧКА", zh: "新人任务", ja: "新規ユーザーミッション", ko: "신규 유저 미션",
    vi: "NHIỆM VỤ NGƯỜI DÙNG MỚI", th: "ภารกิจผู้ใช้ใหม่", id: "MISI PENGGUNA BARU",
    ms: "MISI PENGGUNA BAHARU", hi: "नए यूज़र मिशन", ar: "مهمة المستخدم الجديد",
  },
  "home.rewards.s3.c2.btn": {
    "en-US": "Claim Rewards", "en-GB": "Claim Rewards", es: "Reclamar Recompensas", pt: "Resgatar Recompensas",
    fr: "Réclamer les Récompenses", de: "Belohnungen Einlösen", it: "Riscatta Premi",
    nl: "Beloningen Claimen", pl: "Odbierz Nagrody", ru: "Получить награды", zh: "领取奖励",
    ja: "報酬を受け取る", ko: "리워드 받기", vi: "Nhận Thưởng", th: "รับรางวัล",
    id: "Klaim Hadiah", ms: "Tuntut Ganjaran", hi: "रिवॉर्ड प्राप्त करें", ar: "احصل على المكافآت",
  },
  "home.rewards.s3.c3.title": {
    "en-US": "AI MARKET INSIGHT", "en-GB": "AI MARKET INSIGHT", es: "ANÁLISIS DE MERCADO IA",
    pt: "INSIGHT DE MERCADO IA", fr: "ANALYSE DE MARCHÉ IA", de: "KI-MARKTANALYSE",
    it: "ANALISI DI MERCATO IA", nl: "AI-MARKTINZICHT", pl: "ANALIZA RYNKU AI",
    ru: "AI-АНАЛИЗ РЫНКА", zh: "AI市场洞察", ja: "AIマーケット分析", ko: "AI 마켓 인사이트",
    vi: "PHÂN TÍCH THỊ TRƯỜNG AI", th: "ข้อมูลเชิงลึกตลาด AI", id: "WAWASAN PASAR AI",
    ms: "PANDANGAN PASARAN AI", hi: "एआई मार्केट इनसाइट", ar: "تحليل السوق بالذكاء الاصطناعي",
  },
  "home.rewards.s3.c3.btn": {
    "en-US": "Read More", "en-GB": "Read More", es: "Leer Más", pt: "Ler Mais", fr: "Lire Plus",
    de: "Mehr Lesen", it: "Leggi di Più", nl: "Lees Meer", pl: "Czytaj Więcej", ru: "Читать далее",
    zh: "阅读更多", ja: "もっと読む", ko: "더 보기", vi: "Đọc Thêm", th: "อ่านเพิ่มเติม",
    id: "Baca Selengkapnya", ms: "Baca Lagi", hi: "और पढ़ें", ar: "اقرأ المزيد",
  },

  // ── Rewards carousel — slide 4 ──
  "home.rewards.s4.c1.title": {
    "en-US": "ACHIEVEMENT", "en-GB": "ACHIEVEMENT", es: "LOGRO", pt: "CONQUISTA", fr: "RÉUSSITE",
    de: "ERFOLG", it: "OBIETTIVO", nl: "PRESTATIE", pl: "OSIĄGNIĘCIE", ru: "ДОСТИЖЕНИЕ",
    zh: "成就", ja: "実績", ko: "업적", vi: "THÀNH TÍCH", th: "ความสำเร็จ",
    id: "PENCAPAIAN", ms: "PENCAPAIAN", hi: "उपलब्धि", ar: "الإنجاز",
  },
  "home.rewards.s4.c2.title": {
    "en-US": "STAKING REWARDS", "en-GB": "STAKING REWARDS", es: "RECOMPENSAS DE STAKING",
    pt: "RECOMPENSAS DE STAKING", fr: "RÉCOMPENSES DE STAKING", de: "STAKING-BELOHNUNGEN",
    it: "PREMI DI STAKING", nl: "STAKING-BELONINGEN", pl: "NAGRODY ZE STAKINGU",
    ru: "НАГРАДЫ ЗА СТЕЙКИНГ", zh: "质押奖励", ja: "ステーキング報酬", ko: "스테이킹 리워드",
    vi: "PHẦN THƯỞNG STAKING", th: "รางวัลการสเตค", id: "HADIAH STAKING",
    ms: "GANJARAN STAKING", hi: "स्टेकिंग रिवॉर्ड्स", ar: "مكافآت التخزين",
  },
  "home.rewards.s4.c2.btn": {
    "en-US": "Stake Now", "en-GB": "Stake Now", es: "Hacer Staking", pt: "Fazer Staking",
    fr: "Staker Maintenant", de: "Jetzt Staken", it: "Fai Staking", nl: "Nu Staken",
    pl: "Zablokuj Teraz", ru: "Стейкать сейчас", zh: "立即质押", ja: "今すぐステーク",
    ko: "지금 스테이킹", vi: "Staking Ngay", th: "สเตคตอนนี้", id: "Staking Sekarang",
    ms: "Staking Sekarang", hi: "अभी स्टेक करें", ar: "قم بالتخزين الآن",
  },
  "home.rewards.s4.c3.title": {
    "en-US": "TRENDING COINS", "en-GB": "TRENDING COINS", es: "MONEDAS EN TENDENCIA",
    pt: "MOEDAS EM ALTA", fr: "CRYPTOS TENDANCE", de: "TRENDENDE COINS", it: "CRIPTO DI TENDENZA",
    nl: "TRENDING COINS", pl: "POPULARNE KRYPTOWALUTY", ru: "ПОПУЛЯРНЫЕ МОНЕТЫ",
    zh: "热门币种", ja: "トレンドコイン", ko: "인기 코인", vi: "ĐỒNG COIN NỔI BẬT",
    th: "เหรียญยอดนิยม", id: "KOIN TRENDING", ms: "SYILING TRENDING", hi: "ट्रेंडिंग कॉइन", ar: "العملات الرائجة",
  },
  "home.rewards.s4.c3.btn": {
    "en-US": "Explore", "en-GB": "Explore", es: "Explorar", pt: "Explorar", fr: "Explorer",
    de: "Entdecken", it: "Esplora", nl: "Verkennen", pl: "Odkryj", ru: "Исследовать",
    zh: "探索", ja: "探索する", ko: "탐색하기", vi: "Khám Phá", th: "สำรวจ",
    id: "Jelajahi", ms: "Terokai", hi: "अन्वेषण करें", ar: "استكشف",
  },
};

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) || "en-US";
  });

  // On mount, if the user is logged in, prefer whatever language is saved
  // on their Supabase profile over the local one (keeps devices in sync).
  useEffect(() => {
    async function loadFromProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.id) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("language")
        .eq("id", user.id)
        .maybeSingle();

      if (!error && data?.language) {
        setLanguageState(data.language);
        localStorage.setItem(STORAGE_KEY, data.language);
      }
    }
    loadFromProfile();
  }, []);

  const setLanguage = useCallback(async (code) => {
    setLanguageState(code);
    localStorage.setItem(STORAGE_KEY, code);

    const { data: { user } } = await supabase.auth.getUser();
    if (user?.id) {
      await supabase.from("profiles").update({ language: code }).eq("id", user.id);
    }
  }, []);

  const t = useCallback(
    (key) => {
      const entry = translations[key];
      if (!entry) return key;
      return entry[language] || entry["en-US"] || key;
    },
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, languages: LANGUAGES, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
}
