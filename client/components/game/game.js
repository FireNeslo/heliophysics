async function level(name) {
  const [background, script] = await Promise.all([
    fetch(`./client/levels/${name}/background.svg`)
      .then(data => data.text()),
    fetch(`./client/levels/${name}/script.json`)
      .then(data => data.json()),
  ])

  return { background, script }
}

export default {
  name: 'game',
  methods: {
    async run(script) {
      for(const [action, ...args] of script) {
        if(!this[action]) {
          throw new Error(`action: ${action} not implemented!`)
        }
        await this[action](...args)
      }
    },
    click(action) {
      this.$el.addEventListener('click', event => {
        if(event.target.matches(action.target)) {
          this.run(action.script)
        }
      })
    },
    effect(effect) {
      const element = this.$el.querySelector(effect.target)

      if(element) {
        element.classList.toggle(effect.type)
      }
    },
    dialogue(message) {
      this.message = message

      return new Promise(resolve => {
        this.message.close = e => {
          resolve(this.message = {})
        }
      })
    },
    prompt(message) {
      this.message = message

      return new Promise(resolve => {
        this.message.close = async answer => {
          if(!answer) return
          await this.run(answer.script)
          this.message = {}
          resolve(answer)
        }
      })
    },
    async navigate(target) {
      this.level = await level(target)
    }
  },
  data() {
    return {
      level: {
        background: '',
        script: []
      },
      message: {
        label: '',
        message: ''
      }
    }
  },
  async created() {
    this.level = await level('world')
    this.run(this.level.script)
  }


}
