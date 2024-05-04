/**
 * Toggle the current theme.
 */
export function toggleTheme() {
    const isCurrentHueGreen = getComputedStyle(document.documentElement).getPropertyValue("--background-color") === getComputedStyle(document.documentElement).getPropertyValue("--green-background-color");

    const newHue = isCurrentHueGreen?  "amber" : "green";
    document.documentElement.style.setProperty("--background-color", `var(--${newHue}-background-color)`);
    document.documentElement.style.setProperty("--foreground-color", `var(--${newHue}-foreground-color)`);
}