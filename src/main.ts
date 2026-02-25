import './style.scss'
import { createCard, applyParams, type AlghorithmOptions, type AlgorithmCard } from './Card.ts'
import algorithmsData from './data/algorithms.json'


const list = document.querySelector('#card-list')!
const algorithmsDataList: AlghorithmOptions[] = algorithmsData
const cardsList: AlgorithmCard[] = algorithmsDataList.map(createCard)

list.append(...cardsList.map((card) => card.element))

const tuner = document.querySelector<HTMLInputElement>('#tune')!
const nInput = document.querySelector<HTMLInputElement>('#n')!
const mInput = document.querySelector<HTMLInputElement>('#m')!
const tInput = document.querySelector<HTMLInputElement>('#T')!
const memoryInput = document.querySelector<HTMLInputElement>('#M')!

function handleParamsChange() {
  const n = Number(nInput.value)
  const m = Number(mInput.value)
  const t = Number(tInput.value)
  const memory = Number(memoryInput.value)
  void tuner.value // fine-tune: reserved for future use
  applyParams(cardsList, n, m, t, memory)
}

nInput.addEventListener('input', handleParamsChange)
mInput.addEventListener('input', handleParamsChange)
tInput.addEventListener('input', handleParamsChange)
memoryInput.addEventListener('input', handleParamsChange)
tuner.addEventListener('input', handleParamsChange)