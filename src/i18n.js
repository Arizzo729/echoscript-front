const i18n = {
  language: "en",
  t: (k) => k,
  changeLanguage: async (lng) => (i18n.language = lng || "en"),
};
export default i18n;