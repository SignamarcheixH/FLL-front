<template>
  <div class="container px-10 pt-10">
    <div class="bg-gray-300 h-40 w-full px-10 py-6">
      <span>Nombre de mots :</span>
      <input type="number" name="nbWords" :value="this.$store.state.options.nbWords" @change="updateNbWords"/>
    </div>
    <div class="bg-gray-300 h-40 w-full px-10 py-6">
      <span>Type du quiz</span>
      <select name="quizType" :value="this.$store.state.options.quizType" @change="updateQuizType">
        <option value="mix">Aléatoire</option>
        <option value="chooseWord">Choix parmis 4</option>
        <option value="fillWord">Ecriture du mot</option>
      </select>
    </div>
  </div>
</template>

<script>
import { Word } from '~/api/words'
import { mapMutations } from 'vuex'

export default {
  layout: 'default',
  data() {
    return {
      nbWords: this.$store.state.options.nbWords,
      quizType: this.$store.state.options.quizType
    }
  },
  methods: {
    updateNbWords(e) {
      let newValue = Math.abs(e.target.value || 0)
      this.$store.commit('options/updateNbWords', newValue)
    },
    updateQuizType(e) {
      this.$store.commit('options/updateQuizType', e.target.value)
    },
  },
  mounted() {}
}
</script>

<style scoped>
</style>
