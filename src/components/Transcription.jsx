import React, { useState, useEffect, useMemo } from "react";

// Full expanded language list with native names
const LANGUAGES = [
  { code: "auto", name: "Auto Detect" },
  { code: "af", name: "Afrikaans" },
  { code: "sq", name: "Albanian (Shqip)" },
  { code: "ar", name: "Arabic (العربية)" },
  { code: "hy", name: "Armenian (Հայերեն)" },
  { code: "az", name: "Azerbaijani (Azərbaycanca)" },
  { code: "eu", name: "Basque (Euskara)" },
  { code: "be", name: "Belarusian (Беларуская)" },
  { code: "bn", name: "Bengali (বাংলা)" },
  { code: "bs", name: "Bosnian (Bosanski)" },
  { code: "bg", name: "Bulgarian (Български)" },
  { code: "ca", name: "Catalan (Català)" },
  { code: "ceb", name: "Cebuano" },
  { code: "zh", name: "Chinese (中文)" },
  { code: "co", name: "Corsican" },
  { code: "hr", name: "Croatian (Hrvatski)" },
  { code: "cs", name: "Czech (Čeština)" },
  { code: "da", name: "Danish (Dansk)" },
  { code: "nl", name: "Dutch (Nederlands)" },
  { code: "en", name: "English" },
  { code: "eo", name: "Esperanto" },
  { code: "et", name: "Estonian (Eesti)" },
  { code: "fi", name: "Finnish (Suomi)" },
  { code: "fr", name: "French (Français)" },
  { code: "fy", name: "Frisian (Frysk)" },
  { code: "gl", name: "Galician (Galego)" },
  { code: "ka", name: "Georgian (ქართული)" },
  { code: "de", name: "German (Deutsch)" },
  { code: "el", name: "Greek (Ελληνικά)" },
  { code: "gu", name: "Gujarati (ગુજરાતી)" },
  { code: "ht", name: "Haitian Creole (Kreyòl ayisyen)" },
  { code: "ha", name: "Hausa" },
  { code: "haw", name: "Hawaiian (ʻŌlelo Hawaiʻi)" },
  { code: "he", name: "Hebrew (עברית)" },
  { code: "hi", name: "Hindi (हिन्दी)" },
  { code: "hmn", name: "Hmong" },
  { code: "hu", name: "Hungarian (Magyar)" },
  { code: "is", name: "Icelandic (Íslenska)" },
  { code: "ig", name: "Igbo" },
  { code: "id", name: "Indonesian (Bahasa Indonesia)" },
  { code: "ga", name: "Irish (Gaeilge)" },
  { code: "it", name: "Italian (Italiano)" },
  { code: "ja", name: "Japanese (日本語)" },
  { code: "jw", name: "Javanese (Basa Jawa)" },
  { code: "kn", name: "Kannada (ಕನ್ನಡ)" },
  { code: "kk", name: "Kazakh (Қазақша)" },
  { code: "km", name: "Khmer (ខ្មែរ)" },
  { code: "rw", name: "Kinyarwanda" },
  { code: "ko", name: "Korean (한국어)" },
  { code: "ku", name: "Kurdish (Kurmancî)" },
  { code: "ky", name: "Kyrgyz (Кыргызча)" },
  { code: "lo", name: "Lao (ລາວ)" },
  { code: "la", name: "Latin" },
  { code: "lv", name: "Latvian (Latviešu)" },
  { code: "lt", name: "Lithuanian (Lietuvių)" },
  { code: "lb", name: "Luxembourgish (Lëtzebuergesch)" },
  { code: "mk", name: "Macedonian (Македонски)" },
  { code: "mg", name: "Malagasy" },
  { code: "ms", name: "Malay (Bahasa Melayu)" },
  { code: "ml", name: "Malayalam (മലയാളം)" },
  { code: "mt", name: "Maltese (Malti)" },
  { code: "mi", name: "Maori (Māori)" },
  { code: "mr", name: "Marathi (मराठी)" },
  { code: "mn", name: "Mongolian (Монгол)" },
  { code: "my", name: "Myanmar (Burmese)" },
  { code: "ne", name: "Nepali (नेपाली)" },
  { code: "no", name: "Norwegian (Norsk)" },
  { code: "ny", name: "Nyanja (Chichewa)" },
  { code: "or", name: "Odia (ଓଡ଼ିଆ)" },
  { code: "ps", name: "Pashto (پښتو)" },
  { code: "fa", name: "Persian (فارسی)" },
  { code: "pl", name: "Polish (Polski)" },
  { code: "pt", name: "Portuguese (Português)" },
  { code: "pa", name: "Punjabi (ਪੰਜਾਬੀ)" },
  { code: "ro", name: "Romanian (Română)" },
  { code: "ru", name: "Russian (Русский)" },
  { code: "sm", name: "Samoan" },
  { code: "gd", name: "Scots Gaelic (Gàidhlig)" },
  { code: "sr", name: "Serbian (Српски)" },
  { code: "st", name: "Sesotho" },
  { code: "sn", name: "Shona" },
  { code: "sd", name: "Sindhi (سنڌي)" },
  { code: "si", name: "Sinhala (සිංහල)" },
  { code: "sk", name: "Slovak (Slovenčina)" },
  { code: "sl", name: "Slovenian (Slovenščina)" },
  { code: "so", name: "Somali (Soomaali)" },
  { code: "es", name: "Spanish (Español)" },
  { code: "su", name: "Sundanese" },
  { code: "sw", name: "Swahili (Kiswahili)" },
  { code: "sv", name: "Swedish (Svenska)" },
  { code: "tg", name: "Tajik (Тоҷикӣ)" },
  { code: "ta", name: "Tamil (தமிழ்)" },
  { code: "tt", name: "Tatar (Татарча)" },
  { code: "te", name: "Telugu (తెలుగు)" },
  { code: "th", name: "Thai (ไทย)" },
  { code: "tr", name: "Turkish (Türkçe)" },
  { code: "tk", name: "Turkmen" },
  { code: "uk", name: "Ukrainian (Українська)" },
  { code: "ur", name: "Urdu (اردو)" },
  { code: "ug", name: "Uyghur" },
  { code: "uz", name: "Uzbek (Oʻzbek)" },
  { code: "vi", name: "Vietnamese (Tiếng Việt)" },
  { code: "cy", name: "Welsh (Cymraeg)" },
  { code: "xh", name: "Xhosa" },
  { code: "yi", name: "Yiddish" },
  { code: "yo", name: "Yoruba" },
  { code: "zu", name: "Zulu" },
];

// Models info with tooltips
const MODELS = [
  { code: "tiny", label: "Tiny", info: "Very fast, less accurate. Best for rough drafts." },
  { code: "base", label: "Base", info: "Fast and reasonable accuracy." },
  { code: "small", label: "Small", info: "Better accuracy, moderate speed." },
  { code: "medium", label: "Medium", info: "High accuracy, slower." },
  { code: "large", label: "Large", info: "Highest accuracy, slowest." },
];

// Searchable dropdown option component
function SearchableDropdown({ label, options, value, onChange, tooltip }) {
  const [search, setSearch] = useState("");
  const filteredOptions = useMemo(() => {
    const lower = search.toLowerCase();
    return options.filter(
      (o) =>
        o.name.toLowerCase().includes(lower) || o.code.toLowerCase().includes(lower)
    );
  }, [search, options]);

  return (
    <div className="w-full max-w-md mb-6">
      <label className="block text-gray-700 mb-1 font-semibold flex items-center gap-2">
        {label}
        {tooltip && (
          <span
            className="cursor-help text-blue-500"
            title={tooltip}
            aria-label={tooltip}
          >
            ℹ️
          </span>
        )}
      </label>
      <input
        type="text"
        placeholder={`Search ${label}...`}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <select
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border rounded-md bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
        size={6} // show 6 options visible for easy navigation
        aria-label={`${label} selector`}
      >
        {filteredOptions.map(({ code, name }) => (
          <option key={code} value={code}>
            {name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function LanguageModelSelector({ onChangeLanguage, onChangeModel }) {
  const [language, setLanguage] = useState("auto");
  const [model, setModel] = useState("medium");
  const [autoDetect, setAutoDetect] = useState(true);

  // Load preferences from localStorage on mount
  useEffect(() => {
    const savedLang = localStorage.getItem("preferredLanguage");
    const savedModel = localStorage.getItem("preferredModel");
    const savedAutoDetect = localStorage.getItem("autoDetectEnabled");

    if (savedLang) setLanguage(savedLang);
    if (savedModel) setModel(savedModel);
    if (savedAutoDetect !== null) setAutoDetect(savedAutoDetect === "true");
  }, []);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem("preferredLanguage", language);
    onChangeLanguage && onChangeLanguage(language);
  }, [language, onChangeLanguage]);

  useEffect(() => {
    localStorage.setItem("preferredModel", model);
    onChangeModel && onChangeModel(model);
  }, [model, onChangeModel]);

  useEffect(() => {
    localStorage.setItem("autoDetectEnabled", autoDetect);
    if (autoDetect) setLanguage("auto");
  }, [autoDetect]);

  // Handle language change - disable autoDetect if user picks manual language
  function handleLanguageChange(e) {
    const val = e.target.value;
    setLanguage(val);
    if (val !== "auto") setAutoDetect(false);
    else setAutoDetect(true);
  }

  return (
    <section className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
        Language & Model Selection
      </h2>

      <div className="mb-4 flex items-center gap-3">
        <input
          type="checkbox"
          id="autoDetectToggle"
          checked={autoDetect}
          onChange={() => setAutoDetect(!autoDetect)}
          className="w-5 h-5 cursor-pointer"
        />
        <label htmlFor="autoDetectToggle" className="cursor-pointer select-none text-gray-700">
          Enable Auto Language Detection
        </label>
        <span
          className="ml-auto text-sm text-gray-500 cursor-help"
          title="Auto detection uses AI to detect the spoken language automatically. Disable to manually select the language."
          aria-label="Auto language detection info"
        >
          ℹ️
        </span>
      </div>

      <SearchableDropdown
        label="Language"
        options={LANGUAGES.filter((l) => l.code !== "auto")}
        value={language}
        onChange={handleLanguageChange}
        tooltip="Select the language of your audio. Use Auto Detect for automatic detection."
      />

      <SearchableDropdown
        label="Model"
        options={MODELS.map(({ code, label }) => ({ code, name: label }))}
        value={model}
        onChange={(e) => setModel(e.target.value)}
        tooltip="Choose the transcription model based on accuracy vs speed tradeoff."
      />

      <div className="mt-6 p-4 bg-blue-50 rounded-md text-blue-700 text-sm leading-relaxed">
        <p>
          <strong>Pro tip:</strong> Use <em>Auto Detect</em> for best convenience. Choose larger models for higher accuracy but slower processing.
        </p>
      </div>
    </section>
  );
}
