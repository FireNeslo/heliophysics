import Vue from 'vue'
import Game from './components/game/game.vue'

const app = document.createElement('main')


document.body.appendChild(app)

new Vue({ // eslint-disable-line no-new
  el: app,
  render: (h) => h(Game)
})
