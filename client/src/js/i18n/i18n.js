import { STRINGS} from "./strings_en.js";
export const strings = STRINGS;

// We could maybe support more languages later. Aint gonna happen.

/**
 * Translate the given translation key.
 * @param {string} key a key in the strings_<XX>.js language file.
 * @returns {string} the translated text if the key was found, the key otherwise.
 */
export function translateText(key) {
    return strings[key] ?? key;

}

/**
 * Translate all elements in the containerElement and its descendants.
 *
 * Find all the elements in the containerElement and its descendants, 
 * which have a data-i18n* attribute. Set the attributes of the elements
 * with the translations of the data-i18n* keys as follows:
 *
 * - data-i18n: set the innerText of the element to the translated text.
 * - data-i18n-placeholder: set the placeholder of the element to the translated text.
 * - data-i18n-value: set the value of the element to the translated text.
 *
 * If the value of the data-i18n* key is not found in the translation dictionary,
 * then the relevant attribute will be set with the key itself.
 * @param {Element} containerElement the anscestor element for which the descendants should be translated.
 */
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