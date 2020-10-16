<template>
  <div class="container px-10 pt-10">
    <div class="bg-gray-300 h-40 w-full px-10 py-6">
      <span>Nombre de mots :</span>
      <input type="number" name="nbWords" :value="this.$store.state.options.nbWords" @change="updateNbWords"/>
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
      nbWords: this.$store.state.options.nbWords
    }
  },
  methods: {
     updateNbWords(e) {
        let newValue = Math.abs(e.target.value || 0)
        this.$store.commit('options/updateNbWords', newValue)
      },
  },
  mounted() {}
}
</script>

<style scoped>
</style>
