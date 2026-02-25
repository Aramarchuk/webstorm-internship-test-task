import './style.scss'
import { createCard, applyParams, updateCard, renderCards, type AlghorithmOptions, type AlgorithmCard } from './Card.ts'
import algorithmsData from './data/algorithms.json'


const list = document.querySelector('#card-list')!
const algorithmsDataList: AlghorithmOptions[] = algorithmsData
const cardsList: AlgorithmCard[] = algorithmsDataList.map(createCard)

renderCards(list, cardsList)

cardsList.forEach(card => {
  card.btn.addEventListener('click', () => {
    card.disabled = !card.disabled
    updateCard(card)
    renderCards(list, cardsList)
  })
})

const tuner = document.querySelector<HTMLInputElement>('#tune')!
const nInput = document.querySelector<HTMLInputElement>('#n')!
const mInput = document.querySelector<HTMLInputElement>('#m')!
const tInput = document.querySelector<HTMLInputElement>('#time')!
const memoryInput = document.querySelector<HTMLInputElement>('#memory')!

function handleParamsChange() {
  const n = Number(nInput.value)
  const m = Number(mInput.value)
  const t = Number(tInput.value)
  const memory = Number(memoryInput.value)
  applyParams(cardsList, n, m, t, memory, Number(tuner.value))
  renderCards(list, cardsList)
}

const swapBtn = document.querySelector<HTMLButtonElement>('#swap-nm')!
swapBtn.addEventListener('click', () => {
  const tmp = nInput.value
  nInput.value = mInput.value
  mInput.value = tmp
  handleParamsChange()
})

nInput.addEventListener('input', handleParamsChange)
mInput.addEventListener('input', handleParamsChange)
tInput.addEventListener('input', handleParamsChange)
memoryInput.addEventListener('input', handleParamsChange)
tuner.addEventListener('input', handleParamsChange)