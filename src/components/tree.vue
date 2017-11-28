<template>
    <ul v-if="treeData && treeData.length" class="vue-data-tree">
        <li v-for="(item, index) in treeData"
            :class="{'data-tree-li': true, 'first-node': level === 0 && index === 0, 'only-node': level === 0 && treeData.length === 1}">
            <tree-node :options="optionSettings"
                       :treeData="treeData"
                       :nodeData="item"
                       :level="level"
                       @nodeCheckChange="nodeCheckChange"
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

    export default {
        name: "tree",
        props: {
            options: Object,
            treeData: Array,
            level: {
                type: Number,
                default: 0
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
        },
        data () {
            return {
            }
        },
        methods: {
            nodeCheckChange (item) {
                let checkedNum = 0;

                this.treeData.forEach((data) => {
                    if (item.id !== data.id) {
                        Vue.set(data, "checkStatus", item.checkStatus);
                        checkedNum += item.checkStatus;
                    } else {
                        checkedNum += data.checkStatus;
                    }
                });

                if (checkedNum === 0) {
                    this.emit("nodeCheckChange", 0);
                } else if (checkedNum === 2 * this.treeData.length) {
                    this.emit("nodeCheckChange", 2);
                } else {
                    this.emit("nodeCheckChange", this.options.checkable.halfCheckable ? 1 : 0);
                }
            }
        },
    }
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