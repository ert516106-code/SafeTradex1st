import { createContext, useContext, useState } from 'react';

const translations = {
  'English':          { dir: 'ltr', t: {} },
  'Chinese (简体)':   { dir: 'ltr', t: { 'Account balance': '账户余额', 'Market is live': '市场正在运行', 'Add Funds': '添加资金', 'Withdraw': '提现', 'Home': '首页', 'Markets': '市场', 'Trade': '交易', 'Financial': '金融', 'Assets': '资产', 'Welcome to login': '欢迎登录', 'Login': '登录', 'Log out': '退出登录' } },
  'Chinese (繁體)':   { dir: 'ltr', t: { 'Account balance': '帳戶餘額', 'Market is live': '市場正在運行', 'Add Funds': '新增資金', 'Withdraw': '提款', 'Home': '首頁', 'Markets': '市場', 'Trade': '交易', 'Financial': '金融', 'Assets': '資產', 'Welcome to login': '歡迎登錄', 'Login': '登錄', 'Log out': '登出' } },
  'Japanese':         { dir: 'ltr', t: { 'Account balance': '口座残高', 'Market is live': '市場は稼働中', 'Add Funds': '資金を追加', 'Withdraw': '出金', 'Home': 'ホーム', 'Markets': '市場', 'Trade': '取引', 'Financial': '金融', 'Assets': '資産', 'Welcome to login': 'ログインへようこそ', 'Login': 'ログイン', 'Log out': 'ログアウト' } },
  'Korean':           { dir: 'ltr', t: { 'Account balance': '계정 잔액', 'Market is live': '시장이 활성화됨', 'Add Funds': '자금 추가', 'Withdraw': '출금', 'Home': '홈', 'Markets': '시장', 'Trade': '거래', 'Financial': '금융', 'Assets': '자산', 'Welcome to login': '로그인을 환영합니다', 'Login': '로그인', 'Log out': '로그아웃' } },
  'Spanish':          { dir: 'ltr', t: { 'Account balance': 'Saldo de cuenta', 'Market is live': 'El mercado está activo', 'Add Funds': 'Agregar fondos', 'Withdraw': 'Retirar', 'Home': 'Inicio', 'Markets': 'Mercados', 'Trade': 'Comercio', 'Financial': 'Financiero', 'Assets': 'Activos', 'Welcome to login': 'Bienvenido a iniciar sesión', 'Login': 'Iniciar sesión', 'Log out': 'Cerrar sesión' } },
  'French':           { dir: 'ltr', t: { 'Account balance': 'Solde du compte', 'Market is live': 'Le marché est actif', 'Add Funds': 'Ajouter des fonds', 'Withdraw': 'Retirer', 'Home': 'Accueil', 'Markets': 'Marchés', 'Trade': 'Commerce', 'Financial': 'Financier', 'Assets': 'Actifs', 'Welcome to login': 'Bienvenue à la connexion', 'Login': 'Connexion', 'Log out': 'Déconnexion' } },
  'German':           { dir: 'ltr', t: { 'Account balance': 'Kontostand', 'Market is live': 'Markt ist aktiv', 'Add Funds': 'Geld hinzufügen', 'Withdraw': 'Abheben', 'Home': 'Startseite', 'Markets': 'Märkte', 'Trade': 'Handel', 'Financial': 'Finanzen', 'Assets': 'Vermögen', 'Welcome to login': 'Willkommen beim Login', 'Login': 'Anmelden', 'Log out': 'Abmelden' } },
  'Arabic':           { dir: 'rtl', t: { 'Account balance': 'رصيد الحساب', 'Market is live': 'السوق نشط', 'Add Funds': 'إضافة أموال', 'Withdraw': 'سحب', 'Home': 'الرئيسية', 'Markets': 'الأسواق', 'Trade': 'تداول', 'Financial': 'المالية', 'Assets': 'الأصول', 'Welcome to login': 'مرحبًا بتسجيل الدخول', 'Login': 'تسجيل الدخول', 'Log out': 'تسجيل الخروج' } },
  'Russian':          { dir: 'ltr', t: { 'Account balance': 'Баланс счёта', 'Market is live': 'Рынок активен', 'Add Funds': 'Добавить средства', 'Withdraw': 'Вывести', 'Home': 'Главная', 'Markets': 'Рынки', 'Trade': 'Торговля', 'Financial': 'Финансы', 'Assets': 'Активы', 'Welcome to login': 'Добро пожаловать', 'Login': 'Войти', 'Log out': 'Выйти' } },
  'Portuguese':       { dir: 'ltr', t: { 'Account balance': 'Saldo da conta', 'Market is live': 'Mercado ativo', 'Add Funds': 'Adicionar fundos', 'Withdraw': 'Sacar', 'Home': 'Início', 'Markets': 'Mercados', 'Trade': 'Comércio', 'Financial': 'Financeiro', 'Assets': 'Ativos', 'Welcome to login': 'Bem-vindo ao login', 'Login': 'Entrar', 'Log out': 'Sair' } },
  'Vietnamese':       { dir: 'ltr', t: { 'Account balance': 'Số dư tài khoản', 'Market is live': 'Thị trường đang hoạt động', 'Add Funds': 'Nạp tiền', 'Withdraw': 'Rút tiền', 'Home': 'Trang chủ', 'Markets': 'Thị trường', 'Trade': 'Giao dịch', 'Financial': 'Tài chính', 'Assets': 'Tài sản', 'Welcome to login': 'Chào mừng đăng nhập', 'Login': 'Đăng nhập', 'Log out': 'Đăng xuất' } },
  'Thai':             { dir: 'ltr', t: { 'Account balance': 'ยอดเงินในบัญชี', 'Market is live': 'ตลาดกำลังทำงาน', 'Add Funds': 'เพิ่มเงิน', 'Withdraw': 'ถอน', 'Home': 'หน้าหลัก', 'Markets': 'ตลาด', 'Trade': 'การซื้อขาย', 'Financial': 'การเงิน', 'Assets': 'สินทรัพย์', 'Welcome to login': 'ยินดีต้อนรับสู่การเข้าสู่ระบบ', 'Login': 'เข้าสู่ระบบ', 'Log out': 'ออกจากระบบ' } },
};

const LanguageContext = createContext({ language: 'English', t: k => k, dir: 'ltr', setLanguage: () => {} });

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => localStorage.getItem('app_language') || 'English');

  const setLanguage = (lang) => {
    localStorage.setItem('app_language', lang);
    document.documentElement.dir = translations[lang]?.dir || 'ltr';
    setLanguageState(lang);
    window.location.reload();
  };

  const t = (key) => translations[language]?.t[key] || key;
  const dir = translations[language]?.dir || 'ltr';

  return (
    <LanguageContext.Provider value={{ language, t, dir, setLanguage }}>
      <div dir={dir}>{children}</div>
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
