<template>
    <ul v-if="treeData && treeData.length" class="vue-data-tree">
        <li v-for="(item, index) in treeData"
            :class="{'data-tree-li': true, 'first-node': level === 0 && index === 0, 'only-node': level === 0 && treeData.length === 1}">
            <tree-node :options="optionSettings"
                       :treeData="treeData"
                       :nodeData="item"
                       :level="level"
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
    }
</script>

<style>

</style>