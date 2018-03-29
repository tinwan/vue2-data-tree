<template>
  <div id="app">
      <div class="hello">
          <tree :options="options"
                :treeData="treeData"
                @nodeSelected="nodeSelected"
                @nodeChecked="nodeChecked"
                @expandEnd="expandEnd"
                @dragEnd="dragEnd"
                @nodeDataChange="nodeDataChange"
                @nodeNameChange="nodeNameChange"
          >
          </tree>
      </div>
  </div>
</template>

<script>
    import Tree from "./tree.vue";

    let indexedId = 10;

    export default {
        name: 'app',
        components: {Tree},
        data () {
            return {
                options: {
                    defaultChecked: [3, 40, 13],
                    defaultSelected: 24,
                    defaultExpandedLevel: 2,
                    draggable: true,
                    nameEditable: true,
                    selectable: true,
                    getData (node) {
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
                    shouldUpdateNodeName (node, newName) {
                        // add some ajax or validate operations here, and must return a promise object
                        return new Promise(function (resolve, reject) {
                            setTimeout(() => {
                                resolve("success");
                                // reject(error);
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
    };
</script>

<style scoped>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
