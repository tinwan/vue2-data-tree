<template>
    <ul v-if="showData && showData.length" class="vue-data-tree">
        <li v-for="(item, index) in showData"
            :class="{'data-tree-li': true, 'first-node': index === 0, 'only-node': showData.length === 1}">
            <tree-node :options="optionSettings"
                       :treeData="showData"
                       :nodeData="item"
                       :bus="bus"
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
                selectable: true
            };
            let newOptions = {};

            if (this.options.checkable) {
                newOptions.checkable = {
                    halfCheckable: this.options.checkable.halfCheckable === false ? false : true,
                    cascade: {...defaultOptions.checkable.cascade, ...this.options.checkable.cascade},
                };
            } else if (this.options.checkable === false) {
                newOptions.checkable = false;
            } else {
                newOptions.checkable = {...defaultOptions.checkable};
            }

            newOptions.selectable = this.options.selectable === false ? false : true;

            this.optionSettings = newOptions;
            this.showData = [...this.treeData];
            this.bus = new Vue();
            this.bus.$on("nodeSelected", node => {
                this.$emit("nodeSelected", node);
            });
            this.bus.$on("nodeChecked", node => {
                this.$emit("nodeChecked", node);
            });
        },
        methods: {
            nodeDataChange (item) {
                let index;

                this.showData.forEach((child, idx) => {
                    if (child.id === item.id) {
                        index = idx;
                    }
                });

                Vue.set(this.showData, index, item);
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