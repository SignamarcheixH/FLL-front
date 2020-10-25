export const state = () => ({
  nbWords: 10,
  quizType: 'chooseWord'
})

export const mutations = {
  updateNbWords(state, nbWords) {
    state.nbWords = nbWords
  },
  updateQuizType(state, quizType) {
    state.quizType = quizType
  }
}