import React, { useState, useEffect, useMemo } from "react";
import Button from "./ui/Button"; // Optional: if you want to wrap CTA

const LANGUAGES = [/* ...same as before... */];
const MODELS = [/* ...same as before... */];

function SearchableDropdown({ label, options, value, onChange, tooltip }) {
  const [search, setSearch] = useState("");
  const filteredOptions = useMemo(() => {
    const lower = search.toLowerCase();
    return options.filter(
      (o) =>
        o.name.toLowerCase().includes(lower) ||
        o.code.toLowerCase().includes(lower)
    );
  }, [search, options]);

  return (
    <div className="w-full mb-6">
      <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-200 mb-1 flex items-center gap-2">
        {label}
        {tooltip && (
          <span
            className="cursor-help text-teal-500"
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
        className="w-full mb-2 px-3 py-2 rounded-md bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
      />
      <select
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 rounded-md bg-white dark:bg-zinc-900 text-sm border border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
        size={6}
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

  useEffect(() => {
    const savedLang = localStorage.getItem("preferredLanguage");
    const savedModel = localStorage.getItem("preferredModel");
    const savedAutoDetect = localStorage.getItem("autoDetectEnabled");

    if (savedLang) setLanguage(savedLang);
    if (savedModel) setModel(savedModel);
    if (savedAutoDetect !== null) setAutoDetect(savedAutoDetect === "true");
  }, []);

  useEffect(() => {
    localStorage.setItem("preferredLanguage", language);
    onChangeLanguage && onChangeLanguage(language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem("preferredModel", model);
    onChangeModel && onChangeModel(model);
  }, [model]);

  useEffect(() => {
    localStorage.setItem("autoDetectEnabled", autoDetect);
    if (autoDetect) setLanguage("auto");
  }, [autoDetect]);

  const handleLanguageChange = (e) => {
    const val = e.target.value;
    setLanguage(val);
    setAutoDetect(val === "auto");
  };

  return (
    <section className="p-6 max-w-xl mx-auto bg-white dark:bg-zinc-900 rounded-xl shadow-md border border-zinc-200 dark:border-zinc-800">
      <h2 className="text-2xl font-bold mb-5 text-center text-zinc-800 dark:text-white">
        Language & Model Selection
      </h2>

      <div className="mb-4 flex items-center gap-3">
        <input
          type="checkbox"
          id="autoDetectToggle"
          checked={autoDetect}
          onChange={() => setAutoDetect(!autoDetect)}
          className="w-5 h-5 accent-teal-500"
        />
        <label
          htmlFor="autoDetectToggle"
          className="text-sm text-zinc-700 dark:text-zinc-300 cursor-pointer"
        >
          Enable Auto Language Detection
        </label>
        <span
          className="ml-auto text-xs text-zinc-500 dark:text-zinc-400 cursor-help"
          title="AI will try to detect the language. Disable to choose manually."
        >
          ℹ️
        </span>
      </div>

      <SearchableDropdown
        label="Language"
        options={LANGUAGES.filter((l) => l.code !== "auto")}
        value={language}
        onChange={handleLanguageChange}
        tooltip="Select the spoken language. Auto will detect it automatically."
      />

      <SearchableDropdown
        label="Model"
        options={MODELS.map(({ code, label }) => ({ code, name: label }))}
        value={model}
        onChange={(e) => setModel(e.target.value)}
        tooltip="Choose between faster or more accurate transcription models."
      />

      <div className="mt-6 p-4 bg-teal-50 dark:bg-zinc-800 border border-teal-100 dark:border-zinc-700 rounded-md text-teal-800 dark:text-zinc-300 text-sm leading-relaxed">
        <p>
          <strong>Pro tip:</strong> Use <em>Auto Detect</em> for convenience.
          Choose a larger model if you want higher accuracy (but slower).
        </p>
      </div>
    </section>
  );
}

