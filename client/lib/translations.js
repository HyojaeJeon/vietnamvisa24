export const translations = {
  ko: {
    hero: {
      title: "베트남 비자 신청",
      subtitle: "빠르고 안전한 베트남 비자 서비스"
    },
    nav: {
      home: "홈",
      services: "서비스",
      process: "절차",
      contact: "문의"
    }
  },
  en: {
    hero: {
      title: "Vietnam Visa Application",
      subtitle: "Fast and secure Vietnam visa service"
    },
    nav: {
      home: "Home",
      services: "Services", 
      process: "Process",
      contact: "Contact"
    }
  }
};

export function t(key, language = 'ko') {
  const keys = key.split('.');
  let value = translations[language];

  for (const k of keys) {
    value = value?.[k];
  }

  return value || key;
}