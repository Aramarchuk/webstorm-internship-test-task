import styles from './Card.module.scss'

export interface AlgorithmCard {
    name: string
    time: string
    memory: string
    disabled?: boolean
    element: HTMLElement
}

export interface AlghorithmOptions {
    name: string
    time: string
    memory: string
}

export function parseTimeComplexity(str: string): (n: number, m?: number) => number {
    str = str.replace(/\s/g, '') // убираем пробелы
    if (str === "O(1)") return () => 1
    if (str === "O(n)") return n => n
    if (str === "O(n^2)") return n => n * n
    if (str === "O(nlogn)") return n => n * Math.log2(n)
    if (str === "O(n^3)") return n => n * n * n
    // Можно расширять
    return () => Infinity
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

    return { name: opts.name, time: opts.time, memory: opts.memory, disabled: false, element: root }
}