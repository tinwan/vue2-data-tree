<template>
    <ul v-if="showData && showData.length" class="vue-data-tree">
        <li v-for="(item, index) in showData"
            :class="{'data-tree-li': true, 'first-node': index === 0, 'only-node': showData.length === 1}">
            <tree-node :options="optionSettings"
                       :treeData="showData"
                       :nodeData="item"
                       @nodeDataChange="nodeDataChange"
                       :level="0"
            >
            </tree-node>
        </li>
    </ul>
</template>

<script>
    /**
     * checkable = {
     *      hafCheckable: true,
     *      cascade: {
     *          parent: true,
     *          child: true
     *      }
     * }
     */
    import Vue from "vue";
    import TreeNode from './tree-node.vue'

    const Tree = {
        name: "Tree",
        props: {
            options: Object,
            treeData: Array,
        },
        data () {
            return {
                showData: null
            }
        },
        components: {TreeNode},
        created () {
            let defaultOptions = {
                checkable: {
                    halfCheckable: true,
                    cascade: {
                        parent: true,
                        child: true,
                    },
                },
            };
            let newOptions = {};

            if (this.options.checkable) {
                newOptions.checkable = {
                    halfCheckable: this.options.checkable.halfCheckable === false ? false : true,
                    cascade: {...defaultOptions.checkable.cascade, ...this.options.checkable.cascade},
                };
            } else {
                newOptions.checkable = {...defaultOptions.checkable};
            }

            this.optionSettings = newOptions;
            this.showData = [...this.treeData];
        },
        updated () {
            console.log(this.showData);
        },
        methods: {
            nodeDataChange (item) {
                let index;
                let newChildren = this.showData.map((child, idx) => {
                    if (child.id === item.id) {
                        index = idx;
                        return item;
                    }
                    return child;
                });

//                this.showData = newChildren;console.log(222)
                Vue.set(this.showData, index, item);console.log(222)
            },
        },
    };

    export default Tree;
</script>

<style>
    .vue-data-tree {

    }
    .vue-data-tree ul,
    .vue-data-tree li {
        list-style-type: none;
        padding: 0;
        margin: 0;
    }

</style>