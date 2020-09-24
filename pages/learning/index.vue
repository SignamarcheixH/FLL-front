<template>
  <div class="container px-10 pt-10 h-full">
    <div class="flex w-full flex-wrap justify-between">
      <div 
        v-for="letter in alphabet"
        :key="letter"
        class="uppercase bg-orange-200 px-3 pb-2 pt-1 rounded-t-md hover:opacity-100 opacity-25 cursor-pointer"
        :class="{ 'opacity-100' : filters.letter == letter }"
        @click="setFilter(letter)"
      >{{ letter }}</div>
    </div>
    <div class="flex px-20 py-16 bg-gray-200">
      <div class="page-left w-1/2 pr-20 overflow-y-scroll" @scroll="handleScroll">
        <div 
          v-for="word in words"
          :key="word.id"
          class="mb-2 px-4 py-2 text-white word cursor-pointer"
          :class="getCssColor(word.grammatical_type_verbose, 'background')"
          @click="setWord(word, $event)"
        >
          <div class="font-bold pointer-events-none">{{ word.word_obj.name }}</div>
          <div class="text-sm pointer-events-none">{{ word.meaning }}</div>
        </div>
        <div v-for="item in 10" class="skeleton h-16 w-full mb-2" v-if="loading"></div>
      </div>
      <div class="page-right w-1/2">
        <div class="bg-white w-full">
          <template v-if="wordDetails">
            <div class="w-full h-full border-r-4 py-6 px-8" :class="getCssColor(wordDetails.grammatical_type_verbose, 'border')">
              <div class='flex justify-between'>
                <h2 class="font-bold">{{ wordDetails.word_obj.name }}</h2>
                <div :class="getCssColor(wordDetails.grammatical_type_verbose, 'text')">{{ wordDetails.grammatical_type_verbose }}</div>
              </div>
              <div class="text-sm text-gray-600">{{ wordDetails.word_obj.pronunciation }}</div>
              <div class="flex text-sm">
                <div v-for="code in wordDetails.codes_obj">
                  {{ code.abbreviation }}
                </div>
              </div>
              <div>
                <div class="pt-4">{{ wordDetails.meaning }}</div>
                <div class="text-decorated flex justify-center text-sm text-gray-600 italic my-4"><span>Exemples</span></div>
                <ul class="italic">
                  <li v-for="exemple in wordDetails.exemple_obj" v-html="displayExemple(exemple.sentence, wordDetails.word_obj.name, wordDetails.grammatical_type_verbose)">
                  </li>
                </ul>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Meaning } from '~/api/meanings'
export default {
  layout: 'default',
  data() {
    return {
      alphabet: 'abcdefghijklmnopqrstuvwxyz',
      filters: {
        page: 1,
      },
      words: [],
      wordDetails: '',
      loading: false,
      next: true
    }
  },
  methods: {
    getCssColor(gramma_type, type) {
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
      return prefix[type]+'-'+colors[gramma_type]
    },
    displayExemple(exemple, word, gramma_type) {
      console.log(word)
      let words = exemple.split(" ")
      words.forEach((item, index)=> {
        console.log(index, item)
        if(item.toLowerCase().includes(word.toLowerCase())) {
          let color = this.getCssColor(gramma_type, 'text')
          words[index] = `<span class='font-bold ${color}'>${item}</span>`
        }
      })
      console.log(words)
      return words.join(" ")
    },
    resetWords() {
      this.words = []
    },
    setFilter(letter) {
      this.filters.letter = letter
      this.filters.page = 1
      this.wordDetails = ''
      this.next = true
      this.resetWords()
      this.fetchWords()
    },
    setWord(word, event) {
      this.wordDetails = word
      let items = [...document.getElementsByClassName("word")]
      items.forEach((el) => { el.classList.remove('active')})
      event.target.classList.add('active')
    },
    fetchWords() {
      if(this.next) {
        this.loading = true
        Meaning.list(this.filters).then((response) => {
          this.words = this.words.concat(response.data.results)
          this.filters.page = this.filters.page + 1
          this.next = response.data.next
          this.loading = false
        }).catch((error) => {
          this.loading = false
        })
      }
    },
    handleScroll(el) {
      if((el.srcElement.offsetHeight + el.srcElement.scrollTop) >= el.srcElement.scrollHeight) {
        this.fetchWords()
      }
    }
  },
  mounted() {
    this.fetchWords()
  }
}
</script>

<style scoped>
  .text-decorated {
    &:before, &:after {
      content: '';
      height: 1px;
      width: 40%;
      position: absolute;
      top: 50%;
      @apply bg-gray-400;
    }
    @apply relative;
    &:before {
      left: 0;
    }
    &:after {
      right: 0;
    }
  }
  .page-left {
    height: 60vh;
  }
  .word {
    transition: .15s;
    &:hover {
      transform: translateX(10%);
    }
    &.active {
      transform: translateX(10%);
    }
  }

</style>
