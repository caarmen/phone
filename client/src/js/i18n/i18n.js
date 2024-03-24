import { STRINGS} from "./strings_en.js";
export const strings = STRINGS;

// We could maybe support more languages later. Aint gonna happen.

export function translateText(key) {
    return strings[key] ?? key;

}
export function translateElement(containerElement) {
    Array.from(containerElement.querySelectorAll('[data-i18n]')).forEach(element =>{
        const key = element.dataset.i18n;
        element.innerText = translateText(key);
    });
    Array.from(containerElement.querySelectorAll('[data-i18n-placeholder]')).forEach(element =>{
        const key = element.dataset.i18nPlaceholder;
        element.placeholder = translateText(key);
    });
    Array.from(containerElement.querySelectorAll('[data-i18n-value]')).forEach(element =>{
        const key = element.dataset.i18nValue;
        element.value = translateText(key);
    });
}