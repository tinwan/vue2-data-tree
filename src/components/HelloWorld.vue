<template>
  <div class="hello">
    <tree :options="options" :treeData="treeData">
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
        options: {},
        treeData: [
            {
                id: 1,
                name: "test1",
                checkedStatus: 0,
                children: [
                    {
                        id: 3,
                        name: "test3",
                        checkedStatus: 0,
                    },
                    {
                        id: 4,
                        name: "test4",
                        checkedStatus: 0,
                    },
                ]
            },
            {
                id: 2,
                name: "test2",
                checkedStatus: 0,
            }
        ]
    };
  },
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
