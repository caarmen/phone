export function toggleTheme() {
    const isGreen = getComputedStyle(document.documentElement).getPropertyValue('--background-color') === getComputedStyle(document.documentElement).getPropertyValue('--green-background-color');

    const hue = isGreen?  "amber" : "green";
    document.documentElement.style.setProperty('--background-color', `var(--${hue}-background-color)`);
    document.documentElement.style.setProperty('--foreground-color', `var(--${hue}-foreground-color)`);
}