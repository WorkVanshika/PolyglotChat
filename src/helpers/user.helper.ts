export enum LANGUAGE_ENUM {
  ENGLISH = "en",
  SPANISH = "es",
  FRENCH = "fr",
  GERMAN = "de",
  ITALIAN = "it",
  PORTUGUESE = "pt",
  CHINESE_SIMPLIFIED = "zh-cn",
  CHINESE_TRADITIONAL = "zh-tw",
  JAPANESE = "ja",
  KOREAN = "ko",
  ARABIC = "ar",
  RUSSIAN = "ru",
  DUTCH = "nl",
  SWEDISH = "sv",
  DANISH = "da",
  NORWEGIAN = "no",
  FINNISH = "fi",
  GREEK = "el",
  HINDI = "hi",
  TURKISH = "tr",
  HEBREW = "he",
  THAI = "th",
  VIETNAMESE = "vi",
  POLISH = "pl",
  OTHER = "other",
}

export enum USER_ROLES_ENUM {
  ADMIN = "admin",
  NORMAL = "normal",
}

// User can either change their fullName or they can change their preferredLanguage
export interface IUpdateUserDetails {
  fullName?: string;
  preferredLanguage?: string;
}
