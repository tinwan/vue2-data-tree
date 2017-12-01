<template>
    <div :class="['data-tree-node', nodeData.hasChildren? '': 'leaf']">
        <div class="data-tree-el">
            <span v-if="nodeData.hasChildren"
                  :class="{'node-expand': true, 'close': !open}"
                  @click="clickExpand"
            >
            </span>
            <span v-if="options.checkable"
                  :class="['node-check', ['', 'halfChecked', 'checked'][nodeData.checkStatus]]"
                  @click="clickCheckBox"></span>
            <span class="node-load"></span>
            <span class="node-title">{{nodeData.name}}</span>
        </div>
        <ul v-if="nodeData.children && nodeData.children.length" v-show="open">
            <li v-for="(item, index) in nodeData.children">
                <tree-node :options="options"
                           :nodeData="item"
                           @nodeDataChange="nodeDataChange"
                           :level="level + 1"
                >
                </tree-node>
            </li>
        </ul>
    </div>
</template>

<script>
    import Vue from "vue";

    const TreeNode = {
        name: "TreeNode",
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
                open: false
            }
        },
        methods: {
            clickCheckBox () {
                let newStatus = this.nodeData.checkStatus === 2 ? 0: 2;

                if (this.options.checkable.cascade.child && this.nodeData.children) {
                    let newChildren = this.nodeData.children.map((item) => {
                        return {...item, checkStatus: newStatus};
                    });
                    this.$emit("nodeDataChange", {...this.nodeData, checkStatus: newStatus, children: newChildren});
                } else {
                    this.$emit("nodeDataChange", {...this.nodeData, checkStatus: newStatus});
                }
            },
            nodeDataChange (item) {
                let checkedNum = 0, checkStatus;
                let newChildren = this.nodeData.children.map((child) => {
                    if (child.id === item.id) {
                        checkedNum += item.checkStatus || 0;
                        return item;
                    }
                    checkedNum += child.checkStatus || 0;
                    return child;
                });

                if (this.options.checkable.cascade.parent) {
                    if (checkedNum === 0) {
                        checkStatus = 0;
                    } else if (checkedNum === 2 * this.nodeData.children.length) {
                        checkStatus = 2;
                    } else {
                        checkStatus = this.options.checkable.halfCheckable ? 1 : 0;
                    }
                    this.$emit("nodeDataChange", {...this.nodeData, checkStatus: checkStatus, children: newChildren});
                } else {
                    this.$emit("nodeDataChange", {...this.nodeData, children: newChildren});
                }
            },
            clickExpand () {
                this.open = !this.open;
            }
        }
    };

    export default TreeNode;
</script>

<style>
    .vue-data-tree .data-tree-node {
        text-align: left;
        padding-left: 20px;
        font-size: 14px;
    }
    .vue-data-tree .data-tree-node.leaf {
        padding-left: 25px;
    }
    .vue-data-tree .data-tree-el {
        height: 20px;
        line-height: 20px;
        margin: 5px 0;
        background-color: #FFFFFF;
        position: relative;
        z-index: 2;
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
    .vue-data-tree .node-check {
        display: inline-block;
        width: 11px;
        height: 11px;
        border: 1px solid #888888;
        border-radius: 2px;
        line-height: 11px;
        position: relative;
    }
    .vue-data-tree .node-check.checked:before {
        content: "\2713";
        display: block;
        position: absolute;
        width: 100%;
        height: 100%;
        text-align: center;
    }
    .vue-data-tree .node-check.halfChecked {
        background-color:#888888;
    }
    .vue-data-tree .node-check.halfChecked:before {
        content:"\2713";
        display:block;
        position:absolute;
        width:100%;
        height:100%;
        color:#ffffff;
        line-height: 11px;
        text-align: center;
    }
    .vue-data-tree ul {
        position: relative;
    }
    .vue-data-tree ul:after {
        content: " ";
        position: absolute;
        width: 0;
        height: 100%;
        border-left: 1px dashed #888888;
        left: 5px;
        top: -11px;
    }
    .vue-data-tree li {
        position: relative;
    }
    .vue-data-tree li:before {
        content: " ";
        position: absolute;
        width: 100px;
        height: 0;
        left: 5px;
        top: 8px;
        border-top: 1px dashed #888888;
    }
    .vue-data-tree > li:not(:last-child):after {
        content: " ";
        position: absolute;
        width: 0;
        height: 100%;
        border-left: 1px dashed #888888;
        left: 4px;
        top: 11px;
    }
    .vue-data-tree li.data-tree-li.only-node:before {
        border-top: none;
    }
</style>