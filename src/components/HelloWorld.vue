<template>
  <div class="hello">
    <tree :options="options"
          :treeData="treeData"
          @nodeSelected="nodeSelected"
          @nodeChecked="nodeChecked"
    >
    </tree>
  </div>
</template>

<script>
    import Tree from './tree.vue'
export default {
  name: 'HelloWorld',
  components: {Tree},
  data() {
    return {
        options: {
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
                        checkStatus: 0,
                    },
                    {
                        id: 4,
                        name: "test4",
                        hasChildren: false,
                        checkStatus: 0,
                    },
                ]
            },
            {
                id: 2,
                name: "test2",
                checkStatus: 0,
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
