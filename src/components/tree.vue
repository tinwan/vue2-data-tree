<template>
    <ul v-if="treeData && treeData.length" class="vue-data-tree">
        <li v-for="(item, index) in treeData"
            :class="{'data-tree-li': true, 'first-node': index === 0, 'only-node': treeData.length === 1}">
            <tree-node :options="optionSettings"
                       :treeData="treeData"
                       :nodeData="item"
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
        },
        data () {
            return {
            }
        },
        methods: {
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