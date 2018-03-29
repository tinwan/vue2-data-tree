[![npm](https://img.shields.io/npm/v/vue2-data-tree.svg )](https://www.npmjs.com/package/vue2-data-tree)
[![npm](https://img.shields.io/npm/dm/vue2-data-tree.svg)](https://www.npmjs.com/package/vue2-data-tree)
[![GitHub stars](https://img.shields.io/github/stars/tinwan/vue2-data-tree.svg?style=social&label=Stars&style=for-the-badge)](https://github.com/tinwan/vue2-data-tree/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/tinwan/vue2-data-tree.svg?style=social&label=Fork&style=for-the-badge)](https://github.com/tinwan/vue2-data-tree/network)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg)]()

# vue2-data-tree （[中文文档](https://github.com/tinwan/vue2-data-tree/blob/master/README_CN.md)）

```QQ Group: 596446187``` <br/>

## Demo
<img src="https://raw.githubusercontent.com/tinwan/vue2-data-tree/master/demoImage.gif" width=337 height=385 />
<br/>
<img src="https://raw.githubusercontent.com/tinwan/vue2-data-tree/master/demoImage_2.gif" width=343 height=254 />

## Install
npm install vue2-data-tree --save

## Usage

```html
<div id="app">
  <vue2-data-tree :options="options" :treeData="treeData"
      @nodeSelected="nodeSelected"      // listener for node-selecting
      @nodeChecked="nodeChecked"       // listener for node-checking
      @expandEnd="expandEnd"        // listener for initial node-expanding
      @dragEnd="dragEnd"        // listener for node-drag-end
      @nodeDataChange="nodeDataChange" // listener for node's data change
      @nodeNameChange="nodeNameChange" // listener for node's name edited
  >
  </vue2-data-tree>
</div>
```

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
              defaultChecked: [3, 40, 13],   // default list of checked node-id, type of
                                             // every item must be same to the node-id's type
              defaultSelected: 24,  // default selected node-id, type of this
                                    // config must be same to the node-id's type
              defaultExpandedLevel: 2, // default expanded level, must be a number
              draggable: true, // support dragging node or not,
                               // must be a boolean, default value is false
              nameEditable: false, // support editing name or not, default value is false
                     // if we want to save change to backend, we could use "shouldUpdateNodeName" function.
              selectable: true,  // support selecting node or not, default value is true
              checkable: { // support check node or not, set the value to
                           // false will disable check; default value is like this value
                  halfCheckable: true, // support half-check or not, must
                                       // be a boolean, default value is false
                  cascade: {
                      parent: true, // cascade parent or not
                      child: true // cascade child or not
                  }
               }
              getData (node) { // getData function
                  return new Promise(function (resolve, reject) {
                      setTimeout(() => {
                          resolve([
                              {
                                  id: indexedId,
                                  name: "treeNode" + indexedId,
                                  hasChildren: true,
                                  checkStatus: 0
                              },
                              {
                                  id: indexedId + 1,
                                  name: "treeNode" + (indexedId + 1),
                                  hasChildren: true,
                                  checkStatus: 0
                              }
                          ]);
                          indexedId += 2;
                          // reject(error);
                      });
                  });
              },
              /**
               * Function for submitting edit-name str, and this will executed before update the node’s name,
               *  if failed, reject function will execute, the node's name will not be changed;
               *
              /
              shouldUpdateNodeName (node, newName) {
                  // add some ajax or validate operations here, and must return a promise object
                  return new Promise(function (resolve, reject) {
                      setTimeout(() => {
                          resolve("success");
                          // reject("error");
                      }, 1000);
                  });
              }
          },
          treeData: [
              {
                  id: 1,
                  name: "treeNode1",
                  checkStatus: 0,
                  hasChildren: true,
                  children: [
                      {
                          id: 3,
                          name: "treeNode3",
                          hasChildren: false,
                          checkStatus: 0
                      },
                      {
                          id: 4,
                          name: "treeNode4",
                          hasChildren: false,
                          checkStatus: 0
                      }
                  ]
              },
              {
                  id: 2,
                  name: "treeNode2",
                  hasChildren: true,
                  checkStatus: 0
              }
          ]
      };
  },
  methods: {
      nodeSelected (node) {
          console.log("select node: " + node.id);
      },
      nodeChecked (node) {
          console.log("check node: " + node.id);
      },
      expandEnd () {
          console.log("nodeExpand");
      },
      dragEnd (currentNode, parentNode, index) {
          console.log("drag end " + currentNode.id + " " + parentNode + " " + index);
      },
      nodeDataChange (treeData) {
          console.log("nodeDataChange", treeData);
      },
      nodeNameChange (node) {
          console.log("nodeNameChange", node);
      }
  }
})
```
### Method
| Method name | Description | Parameters |
|---------- |-------- |---------- |
| getSelectedNode | returns the currently selected node | - |
| getCheckedNodes | returns the array of nodes selected by the current check box | - |
| delCurrentNode | delete currently selected node | - |
| refreshCurrentNode | refresh currently selected node | - |

## LICENSE

The MIT License

### 如果你觉得这个项目帮助到了你，你可以帮作者买一杯果汁表示鼓励
<img src="https://raw.githubusercontent.com/tinwan/vue2-data-tree/master/myWechat.png" width=256 height=256 />
