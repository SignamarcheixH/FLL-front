export const state = () => ({
  nbWords: 10
})

export const mutations = {
  updateNbWords(state, nbWords) {
    state.nbWords = nbWords
  }
}