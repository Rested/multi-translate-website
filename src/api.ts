import {snakeCase} from "snake-case";
import * as queryString from "querystring";
import {ParsedUrlQueryInput} from "querystring";


const apiUrl = "https://multi-translate-public-api.rekon.uk"

export type SupportedLanguages = {
    [key: string]: string[]
}

export type TranslationRequest = {
    sourceText: string,
    toLanguage: string,
    fromLanguage?: string,
    preferredEngine?: string,
    withAlignment?: boolean,
    fallback?: boolean
}

type AlignmentSection = {
    end: string,
    start: string,
    text: string,
}

export type AlignmentMap = {
    dest: AlignmentSection,
    src: AlignmentSection,
}

export type TranslationResponse = {
    engine: string,
    engineVersion: string,
    detectedLanguageConfidence?: number,
    toLanguage: string,
    fromLanguage: string,
    sourceText: string,
    translatedText: string,
    alignment?: AlignmentMap[]
}


export async function getSupportedLanguages(): Promise<SupportedLanguages> {
    return fetch(`${apiUrl}/supported-languages`, {
        method: "GET",
        cache: "force-cache"
    }).then(r => r.json());
}

export async function getAvailableEngines() {
    return fetch(`${apiUrl}/available-engines`, {
        method: "GET",
        cache: "force-cache"
    }).then(r => r.json());
}


export async function translate(translationRequest: TranslationRequest): Promise<TranslationResponse | string> {
    const snakeRequest: ParsedUrlQueryInput = {}
    Object.keys(translationRequest).forEach(key => {
        // @ts-ignore
        snakeRequest[snakeCase(key)] = translationRequest[key]
    });
    return fetch(`${apiUrl}/translate?${queryString.stringify(snakeRequest)}`, {
        method: "GET"
    }).then(r => {
        if (r.status >= 500){
            return `Internal server error (${r.status})`
        }
        if (r.status >= 400){
            return r.json().then(respJson => {
                if (respJson.detail){
                    if (typeof respJson.detail === "string") return respJson.detail
                    return `Bad ${respJson.detail[0].loc[1]} ${respJson.detail[0].msg}`
                }
                if (respJson.error) {
                    return respJson.error
                }
            })
        }

        return r.json().then(respJson => {
            return {
                engine: respJson.engine,
                engineVersion: respJson.engine_version,
                detectedLanguageConfidence: respJson.detected_language_confidence,
                fromLanguage: respJson.from_language,
                sourceText: respJson.source_text,
                toLanguage: respJson.to_language,
                translatedText: respJson.translated_text,
                alignment: respJson.alignment
            }
        })
    }).catch(r => {
        return "Unknown Network Error"
    })
}