<template>
    <div class="data-tree-node">
        <div class="data-tree-el">
            <span class="node-expand"></span>
            <span v-if="options.checkable" class="node-check" @click="clickCheckBox"></span>
            <span class="node-load"></span>
            <span class="node-title"></span>
        </div>
        <tree :options="options"
              :treeData="nodeData.children"
              :level="level + 1"
        >
        </tree>
    </div>
</template>

<script>
    import Vue from "vue";
    import Tree from './tree.vue'

    export default {
        name: "treeNode",
        props: {
            options: Object,
            nodeData: Object,
            level: {
                type: Number,
                default: 0
            }
        },
        data () {
            return {
            }
        },
        methods: {
            clickCheckBox () {

            }
        }
    }
</script>

<style>

</style>