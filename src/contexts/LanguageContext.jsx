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
