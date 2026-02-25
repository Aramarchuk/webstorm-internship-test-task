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
    timeFunc: (n: number, m: number) => number
    memoryFunc: (n: number, m: number) => number
    element: HTMLElement
    btn: HTMLButtonElement
}

function makeFunc(expr: string): (n: number, m: number) => number {
    return new Function('n', 'm', 'return ' + expr) as (n: number, m: number) => number
}

export function updateCard(card: AlgorithmCard): void {
    card.element.classList.toggle(styles.disabled, card.disabled)
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

const usesM = (expr: string): boolean => /\bm\b/.test(expr)

export function applyParams(cards: AlgorithmCard[], n: number, m: number, t: number, memory: number, fineTune: number): void {
    for (const card of cards) {
        const cardTime = card.timeFunc(n, m)
        const cardMem = card.memoryFunc(n, m)
        const lowerBound = t > 0 ? t * (fineTune / 100) : 0
        const timeFits = t === 0 || (cardTime >= lowerBound && cardTime <= t)
        const memFits = memory === 0 || cardMem <= memory
        const mMissing = m === 0 && (usesM(card.time_expr) || usesM(card.memory_expr))
        const fits = timeFits && memFits && !mMissing

        const fitRatio = t > 0 ? Math.min(cardTime / t, 1) : 1
        card.element.style.setProperty('--fit-ratio', fitRatio.toFixed(3))

        card.disabled = !fits
        updateCard(card)
    }
}

export function createCard(opts: AlghorithmOptions): AlgorithmCard {
    const root = document.createElement('div')
    root.className = styles.card

    const h2 = document.createElement('h2')
    h2.textContent = opts.name

    const time = document.createElement('p')
    time.textContent = opts.time

    const memory = document.createElement('p')
    memory.textContent = opts.memory

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

    return { ...opts, disabled: false, timeFunc: makeFunc(opts.time_expr), memoryFunc: makeFunc(opts.memory_expr), element: root, btn }
}