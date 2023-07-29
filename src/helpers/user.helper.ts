import axios from "axios";
require("dotenv").config();

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

const apiKey = process.env.API_SECRET;

/* Below function is a third party integration, using rapidapi.com api.
Purpose of integrating this third party was to translate our messages in specific language.
 */
export async function translateMessage(
  message: string,
  targetLanguage: string
): Promise<string> {
  console.log(
    "In tranlation function, parameters received : message : ",
    message,
    " targetLanguage : ",
    targetLanguage
  );
  const encodedParams = new URLSearchParams();
  encodedParams.set("q", message);
  encodedParams.set("target", targetLanguage);
  const options = {
    method: "POST",
    url: "https://google-translate1.p.rapidapi.com/language/translate/v2",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      "Accept-Encoding": "application/gzip",
      "X-RapidAPI-Key": apiKey,
      "X-RapidAPI-Host": "google-translate1.p.rapidapi.com",
    },
    data: encodedParams,
  };
  try {
    const response = await axios.request(options);
    console.log("Translation API response", response.data.data);
    return response.data?.data?.translations[0]?.translatedText;
  } catch (error) {
    console.error(error);
    // if any error occurs in translation API, we will atleast respond to the user with the same message
    return message;
  }
}
