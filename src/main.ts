import './style.scss'
import { createCard, type AlghorithmOptions, type AlgorithmCard } from './Card.ts'
import algorithmsData from './data/algorithms.json'


const list = document.querySelector('#card-list')!
const algorithmsDataList: AlghorithmOptions[] = algorithmsData
const cardsList: AlgorithmCard[] = algorithmsDataList.map(createCard)

list.append(...cardsList.map((card) => card.element))
