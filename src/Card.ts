import styles from './Card.module.scss'

export interface AlghorithmOptions {
    name: string
    time: string
    time_expr: string
    memory: string
    memory_expr: string
}

export interface AlgorithmCard extends AlghorithmOptions {
    disabled: boolean
    usesM: boolean
    timeFunc: (n: number, m: number) => number
    memoryFunc: (n: number, m: number) => number
    element: HTMLElement
    cardEl: HTMLElement
    btn: HTMLButtonElement
    timeValueEl: HTMLElement
    memoryValueEl: HTMLElement
}

function makeFunc(expr: string): (n: number, m: number) => number {
    return new Function('n', 'm', 'return ' + expr) as (n: number, m: number) => number
}

export function updateCard(card: AlgorithmCard): void {
    card.cardEl.classList.toggle(styles.disabled, card.disabled)
    if (card.disabled) {
        card.btn.textContent = '✓ Include'
        card.btn.className = styles.btnInclude
    } else {
        card.btn.textContent = '✕ Exclude'
        card.btn.className = styles.btnExclude
    }
}

export function renderCards(container: Element, cards: AlgorithmCard[]): void {
    const sorted = [...cards].sort((a, b) => Number(a.disabled) - Number(b.disabled))
    container.append(...sorted.map(c => c.element))
}

const checkUsesM = (expr: string): boolean => /\bm\b/.test(expr)

export function applyParams(cards: AlgorithmCard[], n: number, m: number, t: number, memory: number, fineTune: number): void {
    for (const card of cards) {
        const cardTime = card.timeFunc(n, m)
        const cardMem = card.memoryFunc(n, m)
        const timeLower = t > 0 ? t / (10 ** (8 - fineTune)) : 0
        const memLower = memory > 0 ? memory / (10 ** (8 - fineTune)) : 0
        const timeFits = t === 0 || (cardTime >= timeLower && cardTime <= t)
        const memFits = memory === 0 || (cardMem >= memLower && cardMem <= memory)
        const mMissing = m === 0 && card.usesM
        const mUnused = m > 0 && !card.usesM
        const fits = timeFits && memFits && !mMissing && !mUnused

        const timeRatio = t > 0 ? Math.min(cardTime / t, 1) : 1
        const memRatio = memory > 0 ? Math.min(cardMem / memory, 1) : 1
        const fitRatio = Math.min(timeRatio, memRatio)

        console.log(card.name, memLower, memRatio, fitRatio)

        card.cardEl.style.setProperty('--fit-ratio', fitRatio.toFixed(3))

        const fmt = (v: number) => Number.isFinite(v) ? v.toLocaleString('en', { maximumFractionDigits: 1 }) : '∞'
        card.timeValueEl.textContent = n > 0 ? fmt(cardTime) : '—'
        card.memoryValueEl.textContent = n > 0 ? fmt(cardMem) : '—'

        card.disabled = !fits
        updateCard(card)
    }
}

export function createCard(opts: AlghorithmOptions): AlgorithmCard {
    const wrapper = document.createElement('div')
    wrapper.className = styles.cardContainer

    const root = document.createElement('div')
    root.className = styles.card

    const h2 = document.createElement('h2')
    h2.textContent = opts.name

    const time = document.createElement('p')
    time.className = styles.complexityRow
    time.innerHTML = `<span class="${styles.label}">Time</span><span class="${styles.formula}">${opts.time}</span><span class="${styles.value}">—</span>`

    const memory = document.createElement('p')
    memory.className = styles.complexityRow
    memory.innerHTML = `<span class="${styles.label}">Memory</span><span class="${styles.formula}">${opts.memory}</span><span class="${styles.value}">—</span>`

    const timeValueEl = time.querySelector<HTMLElement>(`.${styles.value}`)!
    const memoryValueEl = memory.querySelector<HTMLElement>(`.${styles.value}`)!

    const btn = document.createElement('button')
    btn.textContent = '✕ Exclude'
    btn.className = styles.btnExclude

    const title = document.createElement('div')
    title.className = styles.cardTitle
    title.append(h2)

    const body = document.createElement('div')
    body.className = styles.cardBody
    body.append(time, memory)

    root.append(title, body, btn)
    wrapper.append(root)

    const usesM = checkUsesM(opts.time_expr) || checkUsesM(opts.memory_expr)
    return { ...opts, disabled: false, usesM, timeFunc: makeFunc(opts.time_expr), memoryFunc: makeFunc(opts.memory_expr), element: wrapper, cardEl: root, btn, timeValueEl, memoryValueEl }
}