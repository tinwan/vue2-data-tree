<template>
  <div class="hello">
      <button @click="clickBtn">改变checkList</button>
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
</template>

<script>
    import Tree from "./tree.vue";

    let indexedId = 10;

    export default {
        name: "HelloWorld",
        components: {Tree},
        data () {
            return {
                options: {
                    defaultChecked: [3, 40, 13],
                    defaultSelected: 24,
                    defaultExpandedLevel: 2,
                    draggable: true,
                    getData (node) {
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
            },
            clickBtn () {
                this.options.defaultChecked = [];
            }
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
