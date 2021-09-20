export function applyMultipleStyles(selection, styles) {
    for (const name in styles) {
        selection.style(name,styles[name])
    }
    return selection;
}