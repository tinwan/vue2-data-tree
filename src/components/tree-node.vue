<template>
    <div class="data-tree-node">
        <div class="data-tree-el">
            <span :class="{'node-expand': true, 'close': !open}" @click="clickExpand"></span>
            <span v-if="options.checkable"
                  :class="['node-check', ['unchecked', 'halfchecked', 'checked'][nodeData.checkStatus]]"
                  @click="clickCheckBox"></span>
            <span class="node-load"></span>
            <span class="node-title">{{nodeData.name}}</span>
        </div>
        <tree v-show="open"
              :options="options"
              :treeData="nodeData.children"
              :level="level + 1"
              @nodeCheckChange="nodeCheckChange"
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
        components: {Tree},
        data () {
            return {
                open: false
            }
        },
        methods: {
            clickCheckBox () {
                let newStatus = this.nodeData.checkStatus === 0 ? 2: 0;

                Vue.set(this.nodeData, "checkStatus", newStatus);

                if (this.options.checkable.cascade.parent) {
                    this.emit("nodeCheckChange", this.nodeData)
                }

                if (this.options.checkable.cascade.child) {
                    let newChildren = nodeData.children.map((item) => {
                        return {...item, checkStatus: newStatus};
                    });
                    Vue.set(this.nodeData, "children", newChildren);
                }
            },
            nodeCheckChange (checkStatus) {
                Vue.set(this.nodeData, "checkStatus", checkStatus);
            },
            clickExpand () {
                this.open = !this.open;
            }
        }
    }
</script>

<style>
    .vue-data-tree .data-tree-node {
        text-align: left;
        padding-left: 20px;
        font-size: 14px;
    }
    .vue-data-tree .data-tree-el {
        height: 20px;
        line-height: 20px;
        margin: 5px 0;
    }
    .vue-data-tree .node-expand {
        display: inline-block;
        width: 11px;
        height: 11px;
        border: 1px solid #888888;
        border-radius: 2px;
        position: relative;
    }
    .vue-data-tree .node-expand:before {
        content: "";
        position: absolute;
        border-top: 1px solid #888888;
        width: calc(100% - 4px);
        height: 0;
        display: inline-block;
        left: 2px;
        top: calc((100% - 1px)/2);
    }
    .vue-data-tree .node-expand.close:after {
        content: "";
        position: absolute;
        border-left: 1px solid #888888;
        width: 0;
        height: calc(100% - 4px);
        display: inline-block;
        left: calc((100% - 1px)/2);
        top: 2px;
    }
</style>