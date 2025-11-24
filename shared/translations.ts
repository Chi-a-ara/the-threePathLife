export type Language = "en" | "es" | "pt" | "it" | "ru";

export const LANGUAGES = {
  en: { code: "en", name: "English", flag: "🇬🇧" },
  es: { code: "es", name: "Español", flag: "🇪🇸" },
  pt: { code: "pt", name: "Português", flag: "🇧🇷" },
  it: { code: "it", name: "Italiano", flag: "🇮🇹" },
  ru: { code: "ru", name: "Русский", flag: "🇷🇺" },
} as const;

export const translations = {
  en: {
    nav: {
      forum: "Forum",
      training: "Training",
      calculation: "Calculation",
      services: "Services",
      member: "Member",
      contact: "Contact",
      signIn: "Sign In",
      signUp: "Sign Up",
    },
  },
  es: {
    nav: {
      forum: "Foro",
      training: "Formación",
      calculation: "Cálculo",
      services: "Servicios",
      member: "Miembro",
      contact: "Contacto",
      signIn: "Iniciar Sesión",
      signUp: "Registrarse",
    },
  },
  pt: {
    nav: {
      forum: "Fórum",
      training: "Treinamento",
      calculation: "Cálculo",
      services: "Serviços",
      member: "Membro",
      contact: "Contato",
      signIn: "Entrar",
      signUp: "Cadastrar",
    },
  },
  it: {
    nav: {
      forum: "Forum",
      training: "Formazione",
      calculation: "Calcolo",
      services: "Servizi",
      member: "Membro",
      contact: "Contatto",
      signIn: "Accedi",
      signUp: "Registrati",
    },
  },
  ru: {
    nav: {
      forum: "Форум",
      training: "Обучение",
      calculation: "Расчет",
      services: "Услуги",
      member: "Участник",
      contact: "Контакт",
      signIn: "Войти",
      signUp: "Регистрация",
    },
  },
};
