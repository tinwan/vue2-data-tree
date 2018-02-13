<template>
    <div :class="['data-tree-node', nodeData.hasChildren? '': 'leaf']" ref="outerBox">
        <div class="data-tree-el">
            <div class="data-tree-el-info" @mousedown="nodeMouseDown($event)" ref="nodeElInfo">
                <span v-if="nodeData.hasChildren"
                      :class="{'node-expand': true, 'close': !open}"
                      @click="clickExpand"></span>
                <span v-if="options.checkable"
                      :class="['node-check', ['', 'halfChecked', 'checked'][nodeData.checkStatus]]"
                      @click="clickCheckBox"></span>
                <span class="node-load"></span>
                <span :class="['node-title', selected ? 'selected' : '']"
                      @click="clickTitle"
                >{{nodeData.name}}</span>
            </div>
        </div>
        <ul v-if="nodeData.children && nodeData.children.length" v-show="open">
            <li v-for="(item, index) in nodeData.children" :key="'node_' + item.id">
                <tree-node :options="options"
                           :nodeData="item"
                           :bus="bus"
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
            bus: Object,
            level: {
                type: Number,
                default: 0
            }
        },
        data () {
            return {
                open: false,
                selected: false
            };
        },
        watch: {
            options: {
                handler (newOptions, oldOptions) {
                    if (newOptions.checkable && oldOptions.checkable) {
                        let newCheckList = newOptions.defaultChecked || [];
                        if ((newCheckList.indexOf(this.nodeData.id) > -1 && !this.nodeData.checkStatus) ||
                            (newCheckList.indexOf(this.nodeData.id) === -1 && this.nodeData.checkStatus === 2)) {
                            let checkStatus = newCheckList.indexOf(this.nodeData.id) > -1 ? 2 : 0;
                            Vue.set(this.nodeData, "checkStatus", checkStatus);
                            this.loopChildrenCheck(this.nodeData.children, checkStatus);
                            this.$emit("nodeDataChange", this.nodeData);
                        }
                    }
                },
                deep: true
            }
        },
        created () {
            this.self = this;
            if (this.options.defaultSelected && this.options.defaultSelected === this.nodeData.id) {
                this.selected = true;
                this.bus.$emit("nodeSelected", this.nodeData);
            }

            if (this.options.defaultChecked && this.options.defaultChecked.indexOf(this.nodeData.id) > -1) {
                this.nodeData.checkStatus = 2;
            }

            this.bus.$on("nodeSelected", node => {
                if (this.nodeData.id !== node.id) {
                    this.selected = false;
                }
            });
            this.bus.$on("deleteNode", node => {
                if (this.nodeData.children && this.nodeData.children.length) {
                    this.delChild(node);
                }
            });
            this.bus.$on("refreshNode", node => {
                if (this.nodeData.children && this.nodeData.children.length) {
                    let ids = this.nodeData.children.map(item => item.id);
                    if (ids.indexOf(node.id) > -1) {
                        this.refreshChild();
                    }
                }
            });

            if (this.level < this.options.defaultExpandedLevel && !this.bus.expandingInfo.expandEnd) {
                this.open = true;
                if (this.nodeData.hasChildren && !this.nodeData.children) {
                    let expanding = this.bus.expandingInfo;
                    expanding.start = true;
                    expanding.list.push(this.nodeData.id);
                    this.getNodeData().finally(() => {
                        expanding.list.splice(expanding.list.indexOf(this.nodeData.id), 1);
                        if (expanding.start && expanding.list.length === 0) {
                            this.bus.$emit("expandEnd");
                            expanding.expandEnd = true;
                        }
                    });
                }
            }
        },
        mounted () {
            this.$refs.outerBox.self = this;
            this.$refs.nodeElInfo.self = this;
            if (this.nodeData.checkStatus === 2) {
                this.$emit("nodeDataChange", this.nodeData);
            }
        },
        beforeDestroy () {
            this.$refs.outerBox.self = null;
            this.$refs.nodeElInfo.self = null;
        },
        methods: {
            clickCheckBox () {
                let newStatus = this.nodeData.checkStatus === 2 ? 0 : 2;

                if (this.options.checkable.cascade.child && this.nodeData.children) {
                    this.loopChildrenCheck(this.nodeData.children, newStatus);
                }
                Vue.set(this.nodeData, "checkStatus", newStatus);

                this.$emit("nodeDataChange", this.nodeData);

                this.bus.$emit("nodeChecked", this.nodeData);
            },
            loopChildrenCheck (list, status) {
                if (!list || list.length === 0) {
                    return;
                }
                list.forEach((item) => {
                    Vue.set(item, "checkStatus", status);
                    this.loopChildrenCheck(item.children, status);
                });
            },
            clickTitle () {
                if (!this.options.selectable) {
                    return;
                }

                this.selected = true;

                this.bus.$emit("nodeSelected", this.nodeData);
            },
            nodeDataChange (item) {
                let checkedNum = 0, checkStatus;
                let newChildren = this.nodeData.children.map((child) => {
                    if (item && child.id === item.id) {
                        checkedNum += item.checkStatus || 0;
                        return item;
                    }
                    checkedNum += child.checkStatus || 0;
                    return child;
                });

                if (this.options.checkable && this.options.checkable.cascade.parent) {
                    if (checkedNum === 0) {
                        checkStatus = 0;
                    } else if (checkedNum === 2 * this.nodeData.children.length) {
                        checkStatus = 2;
                    } else {
                        checkStatus = this.options.checkable.halfCheckable ? 1 : 0;
                    }
                    Vue.set(this.nodeData, "checkStatus", checkStatus);
                    this.$emit("nodeDataChange", {
                        ...this.nodeData,
                        checkStatus: checkStatus,
                        children: newChildren
                    });
                } else {
                    this.$emit("nodeDataChange", {
                        ...this.nodeData,
                        children: newChildren
                    });
                }
            },
            clickExpand () {
                this.open = !this.open;

                if (this.nodeData.hasChildren && !this.nodeData.children) {
                    this.getNodeData();
                }
            },
            getNodeData () {
                return this.options.getData(this.nodeData).then((result) => {
                    if (this.nodeData.checkStatus === 2) {
                        result.forEach((node) => {
                            node.checkStatus = 2;
                        });
                    }
                    Vue.set(this.nodeData, "children", result);
                });
            },
            nodeMouseDown (event) {
                if (!this.options.draggable) {
                    return;
                }
                this.bus.dragInfo.moveNode = this.nodeData;
                this.bus.dragInfo.cloneTarget = this.$refs.nodeElInfo;
                let targetRect = this.$refs.nodeElInfo.getBoundingClientRect();
                this.bus.dragInfo.moveStartPos = {x: event.clientX - targetRect.x, y: event.clientY - targetRect.y};
                this.bus.dragInfo.mouseStartPos = {x: event.clientX, y: event.clientY};
                this.$refs.outerBox.querySelectorAll(".data-tree-el-info").forEach(el => {
                    el.classList.add("dragg-moving");
                });
            },
            addChild (nodeData, index) {
                if (index + 1 > this.nodeData.children.length) {
                    this.nodeData.children.push(nodeData);
                } else {
                    this.nodeData.children.splice(index, 0, nodeData);
                }
                if (this.options.checkable && this.options.checkable.cascade.parent) {
                    this.nodeDataChange(nodeData);
                }
            },
            delChild (nodeData) {
                this.nodeData.children = this.nodeData.children.filter(node => {
                    return node.id !== nodeData.id;
                });
                if (this.options.checkable && this.options.checkable.cascade.parent) {
                    this.nodeDataChange();
                }
            },
            refreshChild () {
                if (this.nodeData.hasChildren) {
                    this.options.getData(this.nodeData).then(list => {
                        if (this.nodeData.children && this.nodeData.children.length) {
                            let checkStatusMap = {};
                            this.nodeData.children.forEach(item => {
                                checkStatusMap[item.id] = item.checkStatus;
                            });
                            let newList = list.map(node => {
                                return {
                                    ...node,
                                    checkStatus: checkStatusMap[node.id] || 0
                                };
                            });
                            Vue.set(this.nodeData, "children", newList);
                        } else {
                            Vue.set(this.nodeData, "children", list);
                        }
                    });
                }
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
        background-color: #888888;
    }
    .vue-data-tree .node-check.halfChecked:before {
        content: "\2713";
        display: block;
        position: absolute;
        width: 100%;
        height: 100%;
        color: #ffffff;
        line-height: 11px;
        text-align: center;
    }
    .vue-data-tree .node-title {
        display: inline-block;
        position: relative;
        top: -2px;
        cursor: pointer;
        border: 1px solid #FFFFFF;
        padding: 0 2px;
    }
    .vue-data-tree .node-title.selected {
        background-color: #F2F5FA;
        color: #000000;
        border: 1px solid #DAE3EC;
        opacity: 1;
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
    .vue-data-tree > ul:after {
        border-left: none;
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
    .vue-data-tree li:last-child:after {
      content: " ";
      position: absolute;
      width: 0;
      height: 100%;
      border-left: 3px solid #FFFFFF;
      left: 4px;
      top: 10px;
      z-index: 2;
    }
    .vue-data-tree > li:not(:last-child):after {
        content: " ";
        position: absolute;
        width: 0;
        height: 100%;
        border-left: 1px dashed #888888;
        left: 5px;
        top: 11px;
    }
    .vue-data-tree li.data-tree-li.only-node:before {
        border-top: none;
    }
    .vue-data-tree .data-tree-el .data-tree-el-info {
        display: inline-block;
    }
    .vue-data-tree > .data-tree-el-info {
        position: absolute;
        z-index: 20;

    }
    .vue-data-tree .data-hint-pos {
        background-color: #FFFFFF;
        width: 150px;
        height: 20px;
        border: 1px dashed #cccccc;
        position: relative;
        z-index: 2;
    }
</style>
