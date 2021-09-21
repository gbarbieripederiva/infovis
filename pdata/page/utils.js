export function applyMultipleStyles(selection, styles) {
    for (const name in styles) {
        selection.style(name,styles[name])
    }
    return selection;
}

export function mTohm(minutes) {
    return `${Math.floor(minutes/60)}hs ${minutes % 60}m`;
}

export default {
    applyMultipleStyles,
    mTohm
}