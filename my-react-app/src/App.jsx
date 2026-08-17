import React, { createContext, useState, useEffect, useContext } from "react";

// ==========================================
// 1. Translations Dictionary
// ==========================================
const translations = {
  en: {
    welcome: "Welcome",
    previewMsg: "This is your preference preview.",
    themeLabel: "Theme:",
    langLabel: "Language:",
    currentTheme: "Current Theme:",
    currentLang: "Current Language:",
    light: "Light",
    dark: "Dark",
    reset: "Reset to Defaults",
    settingsTitle: "Settings",
  },
  th: {
    welcome: "ยินดีต้อนรับ",
    previewMsg: "นี่คือหน้าตัวอย่างการตั้งค่า",
    themeLabel: "ธีม:",
    langLabel: "ภาษา:",
    currentTheme: "ธีมปัจจุบัน:",
    currentLang: "ภาษาปัจจุบัน:",
    light: "สว่าง",
    dark: "มืด",
    reset: "รีเซ็ตเป็นค่าเริ่มต้น",
    settingsTitle: "การตั้งค่า",
  },
};

// ==========================================
// 2. Settings Context & Provider
// ==========================================
const SettingsContext = createContext();

const defaultSettings = {
  theme: "light",
  language: "en",
};

export const SettingsProvider = ({ children }) => {
  // Load from localStorage on initialization
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem("app-settings");
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  // Save to localStorage whenever settings change
  useEffect(() => {
    localStorage.setItem("app-settings", JSON.stringify(settings));
  }, [settings]);

  // Actions
  const setTheme = (theme) => setSettings((prev) => ({ ...prev, theme }));
  const setLanguage = (language) => setSettings((prev) => ({ ...prev, language }));
  const resetSettings = () => setSettings(defaultSettings);

  return (
    <SettingsContext.Provider
      value={{ ...settings, setTheme, setLanguage, resetSettings }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

// Custom hook for easier consumption
export const useSettings = () => useContext(SettingsContext);

// ==========================================
// 3. UI Components
// ==========================================

const Header = () => {
  const { language } = useSettings();
  const t = translations[language];

  return (
    <header style={{ padding: "20px", borderBottom: "1px solid #777" }}>
      <h1 style={{ margin: 0 }}>{t.welcome}</h1>
    </header>
  );
};

const SettingsPanel = () => {
  const { theme, language, setTheme, setLanguage, resetSettings } = useSettings();
  const t = translations[language];

  const panelStyle = {
    padding: "20px",
    margin: "20px",
    borderRadius: "8px",
    border: "1px solid #777",
  };

  return (
    <div style={panelStyle}>
      <h2>{t.settingsTitle}</h2>
      
      {/* Theme Selector */}
      <div style={{ marginBottom: "15px" }}>
        <strong style={{ marginRight: "10px" }}>{t.themeLabel}</strong>
        <button 
          onClick={() => setTheme("light")} 
          disabled={theme === "light"}
          style={{ marginRight: "5px" }}
        >
          {t.light}
        </button>
        <button 
          onClick={() => setTheme("dark")} 
          disabled={theme === "dark"}
        >
          {t.dark}
        </button>
      </div>

      {/* Language Selector */}
      <div style={{ marginBottom: "15px" }}>
        <strong style={{ marginRight: "10px" }}>{t.langLabel}</strong>
        <button 
          onClick={() => setLanguage("en")} 
          disabled={language === "en"}
          style={{ marginRight: "5px" }}
        >
          EN
        </button>
        <button 
          onClick={() => setLanguage("th")} 
          disabled={language === "th"}
        >
          TH
        </button>
      </div>

      {/* Reset Button */}
      <button 
        onClick={resetSettings} 
        style={{ marginTop: "10px", color: "red", cursor: "pointer" }}
      >
        {t.reset}
      </button>
    </div>
  );
};

const PreviewCard = () => {
  const { theme, language } = useSettings();
  const t = translations[language];

  const cardStyle = {
    padding: "20px",
    margin: "20px",
    borderRadius: "8px",
    border: "2px dashed #777",
  };

  return (
    <div style={cardStyle}>
      <h3>{t.previewMsg}</h3>
      <p>
        <strong>{t.currentTheme}</strong> {theme === "light" ? t.light : t.dark}
      </p>
      <p>
        <strong>{t.currentLang}</strong> {language.toUpperCase()}
      </p>
    </div>
  );
};

// ==========================================
// 4. Main App Layout Wrapper
// ==========================================
const AppContent = () => {
  const { theme } = useSettings();

  // Dynamic styling based on the active theme
  const appStyle = {
    minHeight: "100vh",
    backgroundColor: theme === "light" ? "#f9f9f9" : "#1e1e1e",
    color: theme === "light" ? "#333333" : "#f1f1f1",
    transition: "background-color 0.3s, color 0.3s",
    fontFamily: "system-ui, -apple-system, sans-serif",
  };

  return (
    <div style={appStyle}>
      <Header />
      <SettingsPanel />
      <PreviewCard />
    </div>
  );
};

// ==========================================
// 5. Root Component
// ==========================================
export default function App() {
  return (
    <SettingsProvider>
      <AppContent />
    </SettingsProvider>
  );
}