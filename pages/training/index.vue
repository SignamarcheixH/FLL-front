<template>
  <div class="container px-10 pt-10">
    <div class="bg-gray-300 w-full px-10 py-6">
      <template v-if="gameData.gameStatus == 'ongoing'">                <!-- Quiz template -->
        <div class="min-h-40">
          <vue-typed-js 
            :show-cursor="false"
            :typeSpeed="30"
            :strings="currentWord.question"
            :key="gameData.currentIndex"
          >
            <p class="typing"></p>
          </vue-typed-js>
        </div>
        <div class="decorated w-full"></div>
        <div class="mt-20">
          <button @click="getHint()">Indice</button>
          <input type="answer" name="answer" class="border border-black" autocomplete="off" v-model="currentWord.answer"/>
          <button @click="validate()">Valider</button>
          <div>Mots : {{ gameData.currentIndex }} / {{ this.$store.state.options.nbWords }} </div>
        </div>
      </template>

      <template v-if="gameData.gameStatus == 'unstarted'">              <!-- Before quiz template -->
        <div class="decorated flex flex-col"><span class="fontbold text-4xl mb-4">Bienvenue dans le quiz !</span>
          Répondez successivement aux questions posées et vérifiez en fin de quiz votre taux de bonnes réponses !
        </div>
        <button class="bg-white rounded-full text-green-500 py-2 px-4" @click="newGame()">Commencer</button>
      </template>

      <template v-if="gameData.gameStatus == 'ended'">                  <!-- Results template -->
        <div class="flex justify-between items-center pb-4">
          <h2 class="text-2xl">Résultats</h2>
          <div class="flex">
            <button class="bg-white text-green-500 rounded-full py-2 px-4 mr-6" @click="newGame()">Recommencer</button>
            <div class="flex items-center text-2xl">{{ displayScore() }}</div>
          </div>  
        </div>
        <div v-for="result in gameData.words" class="rounded mb-4 flex" :class="result.correct ? 'bg-green-400' : 'bg-red-400'">
          <div :class="result.correct ? 'bg-green-500' : 'bg-red-500'" class="p-4 w-1/8 flex justify-center items-center">
            <img class="w-12" :src="result.correct ? '/icons/correct.png' : '/icons/incorrect.png'">
          </div>
          <div class="p-4 w-7/8">
            <div>{{ result.word.meaning }} : <span class="font-bold">{{ result.word.word_obj.name }}</span></div>
            <div class="italic">{{ result.word.exemple_obj[0].sentence }}</div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { Word } from '~/api/words'
import { Meaning } from '~/api/meanings'
export default {
  layout: 'default',
  data() {
    return {
      currentWord: {
        word: '', // the word fetched from the API, used for the quiz
        hint: '', // the word's hint under the form W__rd
        answer: '', // the expected answer
        question: [], // the word's currentWord.question
      },
      gameData: {
        correct: false,
        currentIndex: 0,
        gameStatus: 'unstarted', // unstarted, ongoing or ended
        words: [] // the quiz results containing each word aksed
      }

    }
  },
  computed: {
  },
  methods: {
    getQuestion() {
      let colorText = this.getCssColor('text')
      let meanings = this.writeMeanings()
      let exemple = this.formatExemple()

      let question = [`Nous cherchons un <span class='${ colorText }'>${ this.currentWord.word.grammatical_type_verbose }</span>^1000 <br/> Ce mot signifie <span class='italic'>${ meanings } </span> <br/> Par exemple, dans la phrase ${ exemple }`]
      this.currentWord.question = question
    },
    newGame() {
      this.reset()
      this.getWord().then(() => {
        this.gameData.gameStatus = 'ongoing'
      })
    },
    displayScore() {
      let correct = this.gameData.words.filter((el) => el.correct)
      return `${ correct.length } : ${ this.$store.state.options.nbWords }`
    },
    gameHandler() {
      if(parseInt(this.gameData.currentIndex) == parseInt(this.$store.state.options.nbWords)) { // if that was the last word of the quiz
        this.gameData.gameStatus = 'ended'
        this.reset()
      } else {
        this.reset()
        this.getWord().then(() => {
          this.gameData.currentIndex ++
        })
      }
    },
    reset() {
      this.gameData.correct = false
      this.currentWord.answer = '',
      this.currentWord.hint = '',
      this.currentWord.word = '',
      this.currentWord.question = []
    },
    validate() {
      /* Validate the user answer */
      this.gameData.correct = this.currentWord.word.word_obj.name.toLowerCase()
      this.gameData.correct = this.gameData.correct.localeCompare(this.currentWord.answer.toLowerCase()) == 0
      this.gameData.words.push({
        word: this.currentWord.word,
        correct: this.gameData.correct
      })
      this.gameHandler()
    },
    async getWord() {
      await Meaning.getRandom().then((response) => {
        this.currentWord.word = response.data
        this.getQuestion()
      })
    },
    getHint() {
      let word = this.currentWord.word.word_obj.name.toLowerCase()
      let nextLetter = word.substr(this.currentWord.hint.length)[0]
      if(nextLetter) {
        this.currentWord.hint = this.currentWord.hint + nextLetter
      }
    },
    formatExemple() {
      if(this.currentWord.word) {
        let words = this.currentWord.word.exemple_obj[0].sentence.split(" ")
        words.forEach((item, index)=> {
          if(item.toLowerCase().includes(this.currentWord.word.word_obj.name.toLowerCase())) {
            words[index] = '________'
          }
        })
        return words.join(" ")
      }
    },
    writeMeanings() {
      /* fonction which is responsible of writing the question text */
      if(this.currentWord.word) {
        let result = ''
        let meanings = this.currentWord.word.meaning.split(',')
        for(let meaning of meanings) {
          result += `${meaning} ^1500,`
        }
        return result.substr(0,result.length - 1)
      }
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
      return prefix[type] + '-' + colors[this.currentWord.word.grammatical_type_verbose]
    }
  },
  mounted() {
    //this.getWord()
  }
}
</script>

<style scoped>
  .decorated {
    &::after {
      content: '';
      width: 100%;
      height: 1px;
      @apply block bg-gray-600 my-4;
    }
  }
</style>
