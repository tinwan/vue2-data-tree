[![npm](https://img.shields.io/npm/v/vue2-data-tree.svg )](https://www.npmjs.com/package/vue2-data-tree)
[![npm](https://img.shields.io/npm/dm/vue2-data-tree.svg)](https://www.npmjs.com/package/vue2-data-tree)
[![GitHub stars](https://img.shields.io/github/stars/tinwan/vue2-data-tree.svg?style=social&label=Stars&style=for-the-badge)](https://github.com/tinwan/vue2-data-tree/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/tinwan/vue2-data-tree.svg?style=social&label=Fork&style=for-the-badge)](https://github.com/tinwan/vue2-data-tree/network)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg)]()

# vue2-data-tree （[English Document](https://github.com/tinwan/vue2-data-tree/blob/master/README.md)）

```QQ群: 596446187``` <br/>

## Demo
<img src="https://raw.githubusercontent.com/tinwan/vue2-data-tree/master/demoImage.gif" width=337 height=385 />

## 安装
npm install vue2-data-tree --save

## 使用

```html
<div id="app">
  <vue2-data-tree :options="options" :treeData="treeData"
      @nodeSelected="nodeSelected"          // 选中节点的事件
      @nodeChecked="nodeChecked"            // 勾选节点的事件
      @expandEnd="expandEnd"            // 初始化后展开到默认层级之后的事件
      @dragEnd="dragEnd"                // 拖拽结束后的事件
      @nodeDataChange="nodeDataChange"  // 节点数据改变后触发的事件
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
              defaultChecked: [3, 40, 13],  // 组件初始化时默认勾选的节点id列表，id类型必须与节点id一致
                                            // 这一项如果不设置，初始化时默认不勾选任何节点
              defaultSelected: 24,  // 组件初始化时默认选中的节点id，类型必须与节点id一致
                                    // 这一项如果不设置，初始化时默认选中任何节点
              defaultExpandedLevel: 2, // 组件初始化时展开的层级，默认值为0
              draggable: true, // 是否可拖拽节点，默认值是false
              checkable: { // 是否可勾选，默认值如左侧对象这样；如果这一项设为false，将不展示勾选框
                  halfCheckable: true, // 是否支持半勾选，默认值是false
                  cascade: {
                      parent: true, // 勾选时是否级联上一级节点
                      child: true // 勾选时是否级联下一级节点
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
                                  id: indexedId + 1,  // id是必填属性
                                  name: "treeNode" + (indexedId + 1),  // name是必填属性
                                  hasChildren: true,    //可选属性，是否有子节点，默认值是false
                                  checkStatus: 0     //可选属性，是否勾选，默认值是0
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
      }
  }
})
```


## LICENSE

The MIT License

### 如果你觉得这个项目帮助到了你，你可以帮作者买一杯果汁表示鼓励
<img src="https://raw.githubusercontent.com/tinwan/vue2-data-tree/master/myWechat.png" width=256 height=256 />
