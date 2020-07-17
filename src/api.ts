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

type AlignmentMap = {
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


export async function translate(translationRequest: TranslationRequest): Promise<TranslationResponse> {
    const snakeRequest: ParsedUrlQueryInput = {}
    Object.keys(translationRequest).forEach(key => {
        // @ts-ignore
        snakeRequest[snakeCase(key)] = translationRequest[key]
    });
    return fetch(`${apiUrl}/translate?${queryString.stringify(snakeRequest)}`, {
        method: "GET"
    }).then(r => r.json()).then(respJson => {
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
}