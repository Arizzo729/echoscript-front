// src/i18n/es.js
export default {
  purchase: {
    perMonth: "/mes",
    free: "Gratis",
    getStarted: "Comenzar",
    processing: "Procesando...",
    assistant: {
      title: "¿Necesitas ayuda para elegir?",
      body: "Aquí tienes en cuenta algunos consejos al elegir un plan.",
      tips: [
        "El plan Starter es excelente para probar cosas.",
        "Pro incluye transcripción premium y mayor velocidad.",
      ],
      note: "Estas son sugerencias generales basadas en patrones de uso.",
      show: "Mostrar Asistente",
      hide: "Ocultar Asistente",
    },
    footer: {
      secure: "Pago seguro",
      privacy: "No se almacenan datos sensibles",
    },
    plans: {
      starter: {
        name: "Starter",
        features: ["Transcripción básica", "Cargas limitadas"],
        suggested: "Ideal para uso ligero",
      },
      pro: {
        name: "Pro",
        features: [
          "Transcripción ilimitada",
          "Cola rápida",
          "Resumen con IA",
        ],
        suggested: "Perfecto para creadores",
      },
      enterprise: {
        name: "Enterprise",
        price: "Personalizado",
        features: [
          "Soporte dedicado",
          "Alojamiento local",
          "Acceso para equipos",
        ],
        suggested: "Para equipos o empresas",
      },
    },
  },
};
