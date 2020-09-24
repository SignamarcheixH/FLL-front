<template>
  <div class="container px-10 pt-10">
    <div class="bg-gray-300 h-40 w-full px-10 py-6">
      <template v-if="word">
        <vue-typed-js 
          :show-cursor="false"
          :strings="[`Nous cherchons un <span class='${getCssColor('text')}'>${ word.grammatical_type_verbose }</span>^1000 <br/> Ce mot signifie <span class='italic'>${ getMeanings() } </span> <br/> Par exemple, dans la phrase ${ formatExemple() }`]"
        >
          <p class="typing"></p>
        </vue-typed-js>
        <template v-if="checkFlag">
          <vue-typed-js
            v-if="correct"
            :show-cursor="false"
            :strings="[`Bravo !`]"
          >
            <p class="typing"></p>
          </vue-typed-js>
          <vue-typed-js
          v-else
          :show-cursor="false"
          :strings="[`Faux ! Le mot était ${word.word_obj.name}`]"
        >
          <p class="typing"></p>
        </vue-typed-js>
        </template>
        <div>{{ hint}}</div>
      </template>
    </div>
    <button @click="getHint()">Indice</button>
    <input type="answer" name="answer" class="border border-black" v-model="answer"/>
    <button @click="validate()">Valider</button>
    <button @click="reset()">Nouveau</button>
  </div>
</template>

<script>
import { Word } from '~/api/words'
import { Meaning } from '~/api/meanings'
export default {
  layout: 'default',
  data() {
    return {
      word: '',
      hint: '',
      answer: '',
      checkFlag: false,
      correct: false
    }
  },
  methods: {
    reset() {
      this.checkFlag = false
      this.correct = false
      this.answer = '',
      this.hint = '',
      this.word = '',
      this.getWord()
    },
    validate() {
      if(this.word.word_obj.name.toLowerCase().includes(this.answer.toLowerCase()) || this.answer.toLowerCase().includes(this.word.word_obj.name.toLowerCase())) {
        this.correct = true
      }
      this.checkFlag = true
    },
    getWord() {
      Meaning.getRandom().then((response) => {
        this.word = response.data
      })
    },
    getHint() {
      let word = this.word.word_obj.name.toLowerCase()
      let nextLetter = word.substr(this.hint.length)[0]
      this.hint = (nextLetter) ? this.hint + nextLetter : this.hint
    },
    formatExemple() {
      // let regex = `/${this.word.word_obj.name.toLowerCase()}/gi`
      let words = this.word.exemple_obj[0].sentence.split(" ")
      words.forEach((item, index)=> {
        if(item.toLowerCase().includes(this.word.word_obj.name.toLowerCase())) {
          words[index] = '________'
        }
      })
      return words.join(" ")
    },
    getMeanings() {
      let result = ''
      let meanings = this.word.meaning.split(',')
      for(let meaning of meanings) {
        result += `${meaning} ^1500,`
      }
      return result.substr(0,result.length-1)
    },
    getCssColor(type) {
      let prefix = {
        'background': 'bg',
        'text': 'text',
        'border': 'border'
      }
      let colors = {
        'Nom': 'green-400',
        'Adjectif': 'blue-400',
        'Verbe': 'orange-500'
      }
      return prefix[type]+'-'+colors[this.word.grammatical_type_verbose]
    }
  },
  mounted() {
    this.getWord()
  }
}
</script>

<style scoped>
</style>
