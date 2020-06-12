<template>
  <div class="input-group" ref="inputGroup">
    <div class="icon">
      <i :class="iconType"></i>
    </div>
    <div>
      <h5>{{inputTitle}}</h5>
      <input
        :type="inputType"
        :autocomplete="autocomplete"
        v-model="inputContent"
        class="input"
        @focus="focus"
        @blur="blur"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    inputType: {
      default: 'text'
    },
    iconType: {
      default: 'icon iconfont icon-Top'
    },
    inputTitle: {
      default: 'defaultTitle'
    },
    autocomplete: {
      default: true
    }
  },
  data () {
    return {
      inputContent: ''
    }
  },
  mounted () {
    if (this.inputContent !== '') {
      this.$refs.inputGroup.classList.add('exist')
    }
    this.$emit('inputContent', this.inputContent)
  },
  methods: {
    focus (event) {
      event.target.parentNode.parentNode.classList.add('focus')
    },
    blur (event) {
      event.target.parentNode.parentNode.classList.remove('focus')
      if (event.target.value !== '') { event.target.parentNode.parentNode.classList.add('exist') } else {
        event.target.parentNode.parentNode.classList.remove('exist')
      }
      this.$emit('inputContent', this.inputContent)
    }

  }
}
</script>

<style lang="stylus" scope>
/* ##########未选中时########## */
.input-group {
  position: relative;
  display: grid;
  grid-template-columns: 10% 90%;
  border-bottom: 0.1rem solid #d9d9d9;
  margin: 2rem 0;
  padding: 0.3rem 0;
}

.input {
  width: 100%;
  height: 100%;
  position: relative;
  border: none;
  outline: none;
  background: none;
  font-size: 1.2rem;
  color: #555;
}

.icon {
  display: flex;
  justify-content: center;
  align-items: center;
}

.icon i {
  color: #d9d9d9;
  transition: 0.5s;
  font-size: 2rem;
}

/* 图标和输入框整体定位 */
.input-group>div {
  position: relative;
  height: 3rem;
}

/* 标题 */
.input-group>div>h5 {
  position: absolute;
  top: -15%;
  transform: translateY(-50%);
  color: #d9d9d9;
  font-size: 18px;
  transition: 0.3s;
}

/* ##########选中时########## */
/* 选中时底部蓝条 */
.input-group:before, .input-group:after {
  content: '';
  position: absolute;
  bottom: -2px;
  background-color: #70CBFF;
  height: 2px;
  width: 0;
  transition: 0.5s;
}

/* 50%为了能够动画从中间开始 */
.input-group:after {
  right: 50%;
}

.input-group:before {
  left: 50%;
}

.input-group.focus .icon i {
  color: #70CBFF;
}

.input-group.focus div h5, .input-group.exist div h5 {
  top: -2rem;
  font-size: 0.8rem;
}

.input-group.focus:after, .input-group.focus:before {
  width: 50%;
}
</style>
