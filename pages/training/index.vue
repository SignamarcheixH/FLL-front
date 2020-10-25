<template>
  <div class="container px-10 pt-10">
    <div class="bg-gray-300 w-full px-10 py-6">

      <template v-if="gameData.gameStatus == 'ongoing'">                <!-- Quiz template -->
        <h2 class="font-bold">Mot n° {{ gameData.currentIndex }} sur {{ this.$store.state.options.nbWords }} </h2><br/>
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
        <!-- <button @click="getHint()">Indice</button> -->
        <template v-if="this.$store.state.options.quizType == 'fillWord'">
          <div class="mt-6">
            <input 
              type="answer"
              name="answer"
              class="rounded p-2"
              autocomplete="off"
              v-model="currentWord.answer"
              placeholder="Réponse.."
              @keyup.enter="validateFill()"
              autofocus/>
            <button class="rounded-full bg-white text-green-500 py-2 px-4 ml-4" @click="validateFill()">Valider</button>
            <button class="rounded-full bg-white text-red-500 py-2 px-4 ml-4" @click="validateFill()">Passer</button>
          </div>
        </template>

        <template v-if="this.$store.state.options.quizType == 'chooseWord'">
          <div class="flex mt-10" v-show="gameData.choicesLoaded">
            <div 
              v-for="choice in currentWord.wordChoices"
              class="bg-white rounded-lg mr-6 mb-6 p-8 w-1/4 text-2xl font-bold cursor-pointer word-choice"
              :class="getCssColor('text')"
              @click="validateChoose(choice)"
            >
              <span>{{ choice }}</span>
            </div>
          </div>
        </template>
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
        question: [], // the quiz's question
        wordChoices: []
      },
      gameData: {
        correct: false,
        choicesLoaded: false,
        currentIndex: 1,
        gameStatus: 'unstarted', // unstarted, ongoing or ended
        words: [] // the quiz results containing each word aksed
      }
    }
  },
  computed: {
  },
  methods: {
    newGame() {
      this.reset()
      this.getWord().then(() => {
        this.gameData.gameStatus = 'ongoing'
      })
    },
    getQuestion() {
      let colorText = this.getCssColor('text')
      let meanings = this.writeMeanings()
      let exemple = this.formatExemple()

      let question = [`Nous cherchons un <span class='${ colorText }'>${ this.currentWord.word.grammatical_type_verbose }</span>^1000 <br/> Ce mot signifie <span class='italic'>${ meanings } </span> <br/> Par exemple, dans la phrase suivante :<br/> ${ exemple }`]
      this.currentWord.question = question
    },
    displayScore() {
      let correct = this.gameData.words.filter((el) => el.correct)
      return `${ correct.length } / ${ this.$store.state.options.nbWords }`
    },
    gameHandler() {
      /* Fonction which checks if the question was the last one, and if not, prepare the next one */
      this.resetQuestion()
      if(parseInt(this.gameData.currentIndex) == parseInt(this.$store.state.options.nbWords)) { // last word of the quiz case
        this.gameData.gameStatus = 'ended'
      } else {
        this.getWord().then(() => {
          this.gameData.currentIndex ++
        })
      }
    },
    resetQuestion() {
      /* Reinitialize data for the next quiz question */
      this.gameData.correct = false
      this.currentWord.answer = '',
      this.currentWord.hint = '',
      this.currentWord.word = '',
      this.currentWord.question = []
      this.currentWord.wordChoices = []
    },
    reset() {
      /* reinitialize data for a whole new quiz */
      this.resetQuestion()
      this.gameData.words = []
      this.gameData.currentIndex = 1
    },
    validateFill() {
      /* Validate the user answer in the case of a fillWord question */
      this.gameData.correct = this.currentWord.word.word_obj.name.toLowerCase()
      this.gameData.correct = this.gameData.correct.localeCompare(this.currentWord.answer.toLowerCase()) == 0
      this.gameData.words.push({
        word: this.currentWord.word,
        correct: this.gameData.correct
      })
      this.gameHandler()
    },
    validateChoose(answer) {
      /* Validate the user answer in the case of a chooseWord question */
      this.gameData.correct = this.currentWord.word.word_obj.name.toLowerCase()
      this.gameData.correct = this.gameData.correct.localeCompare(answer.toLowerCase()) == 0
      this.gameData.words.push({
        word: this.currentWord.word,
        correct: this.gameData.correct
      })
      this.gameHandler()
    },
    async getWord() {
      this.gameData.choicesLoaded = false
      await Meaning.getRandom({ 'limit': 1 }).then((response) => {
        this.currentWord.word = response.data
        this.currentWord.wordChoices.push(response.data.word_obj.name)
        this.getQuestion()
      })
      for(let i of 'abc') {
        await Meaning.getRandom({ 'limit': 1 }).then((response) => {
          this.currentWord.wordChoices.push(response.data.word_obj.name)
        })
      }
      this.shuffleChoices(this.currentWord.wordChoices)
      this.gameData.choicesLoaded = true
    },
    shuffleChoices() {
      for (let i = this.currentWord.wordChoices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.currentWord.wordChoices[i], this.currentWord.wordChoices[j]] = [this.currentWord.wordChoices[j], this.currentWord.wordChoices[i]];
      }
    },
    getHint() {
      let word = this.currentWord.word.word_obj.name.toLowerCase()
      let nextLetter = word.substr(this.currentWord.hint.length)[0]
      if(nextLetter) {
        this.currentWord.hint = this.currentWord.hint + nextLetter
      }
    },
    formatExemple() {
      /* Fonction which format the exemple to remove the quizzed word from the exemple sentence  */
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
  .word-choice {
    transition: .2s;
  }
  .word-choice:hover {
    transform: translateY(-10px);
  }
</style>
