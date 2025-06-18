import React, { useState } from "react";
import { Listbox } from "@headlessui/react";
import { ChevronUpDown } from "lucide-react";

const groupedLanguages = {
  Popular: [
    { code: "en", label: "English 🇺🇸" },
    { code: "es", label: "Spanish 🇪🇸" },
    { code: "fr", label: "French 🇫🇷" },
    { code: "de", label: "German 🇩🇪" },
    { code: "zh", label: "Chinese 🇨🇳" },
  ],
  More: [
    { code: "ja", label: "Japanese 🇯🇵" },
    { code: "pt", label: "Portuguese 🇧🇷" },
    { code: "hi", label: "Hindi 🇮🇳" },
    { code: "ar", label: "Arabic 🇸🇦" },
    { code: "ko", label: "Korean 🇰🇷" },
    { code: "ru", label: "Russian 🇷🇺" },
    { code: "it", label: "Italian 🇮🇹" },
    { code: "tr", label: "Turkish 🇹🇷" },
  ],
};

const flattenLanguages = Object.values(groupedLanguages).flat();

export default function LanguageDropdown({
  placeholder = "Select Language",
  value,
  onChange,
  type = "transcription",
}) {
  const [query, setQuery] = useState("");

  const filtered =
    query === ""
      ? flattenLanguages
      : flattenLanguages.filter((lang) =>
          lang.label.toLowerCase().includes(query.toLowerCase())
        );

  const selected = flattenLanguages.find((l) => l.code === value);

  return (
    <div className="w-64">
      <Listbox value={value} onChange={onChange}>
        {({ open }) => (
          <div className="relative">
            <Listbox.Button className="w-full bg-zinc-900 text-white border border-zinc-700 rounded-lg p-2 flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-teal-500">
              {selected ? selected.label : placeholder}
              <ChevronUpDown className="w-4 h-4 opacity-70" />
            </Listbox.Button>

            {open && (
              <div className="absolute z-50 w-full mt-1 rounded-lg bg-zinc-800 shadow-lg border border-zinc-700">
                <input
                  type="text"
                  className="w-full px-3 py-2 text-sm bg-zinc-800 text-white border-b border-zinc-700 focus:outline-none"
                  placeholder="Search language..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <ul className="max-h-48 overflow-y-auto text-sm custom-scrollbar">
                  {filtered.map((lang) => (
                    <Listbox.Option
                      key={lang.code}
                      value={lang.code}
                      className={({ active }) =>
                        `cursor-pointer px-4 py-2 ${
                          active ? "bg-teal-700 text-white" : "text-zinc-300"
                        }`
                      }
                    >
                      {lang.label}
                    </Listbox.Option>
                  ))}
                  {filtered.length === 0 && (
                    <li className="px-4 py-2 text-zinc-500 italic">No match found</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        )}
      </Listbox>
      <p className="mt-1 text-xs text-zinc-400">
        {type === "transcription"
          ? "Language to transcribe from"
          : "Language to translate to (optional)"}
      </p>
    </div>
  );
}
