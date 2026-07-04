import { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  'English': { dir: 'ltr', t: {} },
  'Chinese (简体)': { dir: 'ltr', t: { 'Account balance': '账户余额' } },
  'Chinese (繁體)': { dir: 'ltr', t: { 'Account balance': '帳戶餘額' } },
  'Japanese': { dir: 'ltr', t: { 'Account balance': '口座残高' } },
  'Korean': { dir: 'ltr', t: { 'Account balance': '계정 잔액' } },
  'Spanish': { dir: 'ltr', t: { 'Account balance': 'Saldo de cuenta' } },
  'French': { dir: 'ltr', t: { 'Account balance': 'Solde du compte' } },
  'German': { dir: 'ltr', t: { 'Account balance': 'Kontostand' } },
  'Arabic': { dir: 'rtl', t: { 'Account balance': 'رصيد الحساب' } },
  'Russian': { dir: 'ltr', t: { 'Account balance': 'Баланс счёта' } },
  'Portuguese': { dir: 'ltr', t: { 'Account balance': 'Saldo da conta' } },
  'Vietnamese': { dir: 'ltr', t: { 'Account balance': 'Số dư tài khoản' } },
  'Thai': { dir: 'ltr', t: { 'Account balance': 'ยอดเงินในบัญชี' } },
};

const LanguageContext = createContext({
  language: 'English',
  t: (k) => k,
  dir: 'ltr',
  setLanguage: () => {}
});

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(
    localStorage.getItem('app_language') || 'English'
  );

  useEffect(() => {
    const dir = translations[language]?.dir || 'ltr';
    document.documentElement.dir = dir;
    localStorage.setItem('app_language', language);
  }, [language]);

  const setLanguage = (lang) => {
    setLanguageState(lang);
  };

  const t = (key) =>
    translations[language]?.t[key] || key;

  const dir =
    translations[language]?.dir || 'ltr';

  return (
    <LanguageContext.Provider
      value={{
        language,
        t,
        dir,
        setLanguage
      }}
    >
      <div dir={dir}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
