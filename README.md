[![npm](https://img.shields.io/npm/v/vue2-data-tree.svg )](https://www.npmjs.com/package/vue2-data-tree)
[![npm](https://img.shields.io/npm/dm/vue2-data-tree.svg)](https://www.npmjs.com/package/vue2-data-tree)
[![GitHub stars](https://img.shields.io/github/stars/tinwan/vue2-data-tree.svg?style=social&label=Stars&style=for-the-badge)](https://github.com/tinwan/vue2-data-tree/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/tinwan/vue2-data-tree.svg?style=social&label=Fork&style=for-the-badge)](https://github.com/tinwan/vue2-data-tree/network)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg)]()

# vue2-data-tree

```QQ Group: 596446187``` <br/>

> A Vue.js project

## Install
npm install vue2-data-tree --save

## Usage

```js
import Vue from 'vue'
import Vue2DataTree from 'vue2-data-tree'

new Vue({
  el: '#app',
  // ...
  data(){
    return {
      target: {msg: 'Hello Vuejs!'}
    }
  },
  components: { Vue2DataTree }
})
```

```html
<div id="app">
  <vue2-data-tree :value="target"></vue2-data-tree>
</div>
```

## LICENSE

The MIT License
