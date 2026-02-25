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
}

function makeFunc(expr: string): (n: number, m: number) => number {
    return new Function('n', 'm', 'return ' + expr) as (n: number, m: number) => number
}

export function applyParams(cards: AlgorithmCard[], n: number, m: number, t: number, memory: number): void {
    for (const card of cards) {
        const fits = (t === 0 || card.timeFunc(n, m) <= t) &&
            (memory === 0 || card.memoryFunc(n, m) <= memory)
        card.disabled = !fits
        card.element.classList.toggle(styles.disabled, card.disabled)
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

    root.append(h2, time, memory)

    return { ...opts, disabled: false, timeFunc: makeFunc(opts.time_expr), memoryFunc: makeFunc(opts.memory_expr), element: root }
}