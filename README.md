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

let indexedId = 10;

new Vue({
  el: '#app',
  // ...
  components: {Vue2DataTree},
  data () {
      return {
          options: {
              defaultChecked: [3, 40, 13],              // default list of checked node-id
              defaultSelected: 24,                      // default selected node-id
              defaultExpandedLevel: 2,                  // default expanded level
              draggable: true,                          // support drag node or not
              getData (node) {                          // getData function
                  return new Promise(function (resolve, reject) {
                      setTimeout(() => {
                          resolve([
                              {
                                  id: indexedId,
                                  name: "test" + indexedId,
                                  hasChildren: true,
                                  checkStatus: 0
                              },
                              {
                                  id: indexedId + 1,
                                  name: "test" + (indexedId + 1),
                                  hasChildren: true,
                                  checkStatus: 0
                              }
                          ]);
                          indexedId += 2;
                      });
                  });
              }
          },
          treeData: [
              {
                  id: 1,
                  name: "test1",
                  checkStatus: 0,
                  hasChildren: true,
                  children: [
                      {
                          id: 3,
                          name: "test3",
                          hasChildren: false,
                          checkStatus: 0
                      },
                      {
                          id: 4,
                          name: "test4",
                          hasChildren: false,
                          checkStatus: 0
                      }
                  ]
              },
              {
                  id: 2,
                  name: "test2",
                  hasChildren: true,
                  checkStatus: 0
              }
          ]
      };
  },
  methods: {
      nodeSelected (node) {
          console.log("select node: " + node.id);
          this.$nextTick(() => {
              console.log("HelloWord nodeSelected nextTick");
          });
      },
      nodeChecked (node) {
          console.log("check node: " + node.id);
          this.$nextTick(() => {
              console.log("HelloWord nodeChecked nextTick");
          });
      },
      expandEnd () {
          console.log("nodeExpand");
          this.$nextTick(() => {
              console.log("HelloWord expandEnd nextTick");
          });
      },
      dragEnd (currentNode, parentNode, index) {
          console.log("drag end " + currentNode.id + " " + parentNode + " " + index);
          this.$nextTick(() => {
              console.log("HelloWord dragEnd nextTick");
          });
      },
      nodeDataChange (treeData) {
          console.log("nodeDataChange", treeData);
          this.$nextTick(() => {
              console.log("HelloWord nodeDataChange nextTick");
          });
      }
  }
})
```

```html
<div id="app">
  <tree :options="options"
                  :treeData="treeData"
                  @nodeSelected="nodeSelected"
                  @nodeChecked="nodeChecked"
                  @expandEnd="expandEnd"
                  @dragEnd="dragEnd"
                  @nodeDataChange="nodeDataChange"
  >
  </tree>
</div>
```

## LICENSE

The MIT License
