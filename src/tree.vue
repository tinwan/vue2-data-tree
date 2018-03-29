<template>
    <div class="vue-data-tree" @mousemove="dragMouseMove($event)" ref="dataTreeBox">
        <ul v-if="showData && showData.length" class="vue-data-tree" >
            <li v-for="(item, index) in showData"
                :class="{'data-tree-li': true, 'first-node': index === 0, 'only-node': showData.length === 1}"
                :key="'node_' + item.id">
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
    </div>
</template>

<script>
    /**
     * checkable = {
     *      halfCheckable: true,
     *      cascade: {
     *          parent: true,
     *          child: true
     *      }
     * }
     */
    import Vue from "vue";
    import TreeNode from "./tree-node.vue";

    const Tree = {
        name: "Tree",
        props: {
            options: Object,
            treeData: Array
        },
        data () {
            return {
                showData: null,
                optionSettings: {}
            };
        },
        watch: {
            options: {
                handler (newOptions) {
                    this.$set(this.optionSettings, "defaultChecked", newOptions.defaultChecked);
                },
                deep: true
            }
        },
        components: {TreeNode},
        created () {
            let defaultOptions = {
                checkable: {
                    halfCheckable: true,
                    cascade: {
                        parent: true,
                        child: true
                    }
                },
                selectable: true,
                defaultExpandedLevel: 0
            };

            let {checkable, selectable, ...newOptions} = this.options;

            if (checkable) {
                newOptions.checkable = {
                    halfCheckable: checkable.halfCheckable !== false,
                    cascade: {...defaultOptions.checkable.cascade, ...checkable.cascade}
                };
            } else if (checkable === false) {
                newOptions.checkable = false;
            } else {
                newOptions.checkable = {...defaultOptions.checkable};
            }

            newOptions.selectable = selectable !== false;

            this.optionSettings = newOptions;

            this.showData = [...this.treeData];

            // public bus for events
            this.bus = new Vue();
            this.bus.expandingInfo = {
                start: false,
                list: []
            };
            this.bus.dragInfo = {};
            this.bus.$on("nodeSelected", node => {
                this.selectedNode = node;
                this.$nextTick(() => {
                    this.$emit("nodeSelected", node);
                });
            });
            this.bus.$on("nodeChecked", node => {
                this.$nextTick(() => {
                    this.$emit("nodeChecked", node);
                });
            });
            this.bus.$on("expandEnd", () => {
                this.$emit("expandEnd", this.showData);
            });
            this.bus.$on("nodeNameChange", (nodeData) => {
                this.$emit("nodeNameChange", nodeData);
                this.$emit("nodeDataChange", this.showData);
            });
            this.bus.getParentTreeNodeEl = el => {
                let parentEl = el;
                while (parentEl !== document.body && (!parentEl.className ||
                    (parentEl.className.indexOf("vue-data-tree") === -1 &&
                    parentEl.className.indexOf("data-tree-node") === -1))) {
                    parentEl = parentEl.parentNode;
                }
                if (parentEl.className && parentEl.className.indexOf("data-tree-node") > -1) {
                    return parentEl;
                } else {
                    return null;
                }
            };
            this.bus.getElIndex = el => {
                if (el.parentNode) {
                    return [].indexOf.call(el.parentNode.children, el);
                } else {
                    return 0;
                }
            };

            // functions for dragging node
            this.bodyMouseUp = () => {
                if (this.bus.dragInfo.moveNode && this.bus.dragInfo.hintPosEl && this.bus.dragInfo.hintPosEl.parentNode) {
                    let hintPos = this.bus.dragInfo.hintPosEl;
                    let index = this.bus.getElIndex(hintPos);
                    let originEl = this.bus.getParentTreeNodeEl(this.bus.dragInfo.cloneTarget);
                    let targetParentEl = this.bus.getParentTreeNodeEl(hintPos);
                    let originParentEl = this.bus.getParentTreeNodeEl(originEl.parentNode);
                    let moveNodeToTarget = () => {
                        let nodeData = originEl.self.nodeData,
                            originNodeData = originEl.self.nodeData,
                            targetNodeData = targetParentEl ? targetParentEl.self.nodeData : null;
                        if (originParentEl) {
                            originParentEl.self.delChild(nodeData);
                        } else {
                            this.showData = this.showData.filter(node => {
                                return node.id !== nodeData.id;
                            });
                        }

                        if (targetParentEl) {
                            targetParentEl.self.addChild(nodeData, index);
                        } else {
                            this.showData.splice(index, 0, nodeData);
                        }
                        // if original parent node has no child after dragging, set some parameters of it.
                        if (originParentEl && originParentEl.self.nodeData.children.length === 0) {
                            this.$set(originParentEl.self.nodeData, "children", []);
                            this.$set(originParentEl.self.nodeData, "hasChildren", false);
                            originParentEl.self.open = false;
                        }

                        this.$nextTick(() => {
                            this.$emit("dragEnd", originNodeData, targetNodeData, index);
                        });
                    };
                    if (targetParentEl && targetParentEl === originParentEl) {
                        let idx = targetParentEl.self.nodeData.children.map(itm => itm.id).indexOf(originEl.self.nodeData.id);
                        if (index > idx) {
                            index = index - 1;
                        }
                    }
                    moveNodeToTarget();
                    hintPos.parentNode.removeChild(hintPos);
                }
                this.bus.dragInfo.moveNode = null;
                this.bus.dragInfo.cloneTarget = null;
                if (this.bus.dragInfo.cloneEl) {
                    this.$refs.dataTreeBox.removeChild(this.bus.dragInfo.cloneEl);
                    this.bus.dragInfo.cloneEl = null;
                }
                this.$refs.dataTreeBox.querySelectorAll(".data-tree-el-info").forEach(el => {
                    el.classList.remove("dragg-moving");
                });
            };
            document.body.addEventListener("mouseup", this.bodyMouseUp);
        },
        mounted () {
            if (!this.bus.expandingInfo.start) {
                this.bus.expandingInfo.expandEnd = true;
                this.bus.$emit("expandEnd");
            }
        },
        beforeDestroy () {
            this.bodyMouseUp();
            document.body.removeEventListener("mouseup", this.bodyMouseUp);
        },
        methods: {
            nodeDataChange (item) {
                let index;

                this.showData.forEach((child, idx) => {
                    if (child.id === item.id) {
                        index = idx;
                    }
                });

                this.$set(this.showData, index, item);
                this.$nextTick(() => {
                    this.$emit("nodeDataChange", this.showData);
                });
            },
            dragMouseMove (event) {
                if (!this.bus.dragInfo.moveNode) {
                    return;
                }
                let dragInfo = this.bus.dragInfo;
                if (Math.abs(event.clientX - dragInfo.mouseStartPos.x) < 2 && Math.abs(event.clientY - dragInfo.mouseStartPos.y) < 2) {
                    return;
                }
                if (!dragInfo.treeRect) {
                    dragInfo.treeRect = this.$refs.dataTreeBox.getBoundingClientRect();
                }
                if (!dragInfo.cloneEl) {
                    dragInfo.cloneEl = dragInfo.cloneTarget.cloneNode(true);
                    this.$refs.dataTreeBox.appendChild(dragInfo.cloneEl);
                }
                if (!dragInfo.hintPosEl) {
                    let frag = document.createElement("li");
                    frag.innerHTML = "<div class='data-tree-node'><div class='data-hint-pos'></div></div>";
                    dragInfo.hintPosEl = frag;
                }
                dragInfo.cloneEl.style.left = event.clientX - dragInfo.treeRect.x - dragInfo.moveStartPos.x + "px";
                dragInfo.cloneEl.style.top = event.clientY - dragInfo.treeRect.y - dragInfo.moveStartPos.y + "px";

                let nodeList = this.$refs.dataTreeBox.querySelectorAll(".data-tree-el-info");
                nodeList.forEach((nodeEl) => {
                    if (nodeEl === dragInfo.cloneEl || nodeEl === dragInfo.cloneTarget || nodeEl.classList.contains("dragg-moving")) {
                        return;
                    }
                    let rect = nodeEl.getBoundingClientRect();
                    if (event.clientX - rect.x > 0 && event.clientX - rect.x < rect.width &&
                        event.clientY - rect.y > 0 && event.clientY - rect.y < rect.height) {
                        let treeNodeEl = this.bus.getParentTreeNodeEl(nodeEl);
                        let hintPos = dragInfo.hintPosEl;
                        if (event.clientY - rect.y < rect.height / 2) {
                            treeNodeEl.parentNode.parentNode.insertBefore(hintPos, treeNodeEl.parentNode);
                        } else {
                            treeNodeEl.parentNode.parentNode.insertBefore(hintPos, treeNodeEl.parentNode.nextSibling);
                        }
                    }
                });
            },
            getCheckedNodes () {
                let checkedList = [],
                    loopGetChecked = list => {
                        if (!list || list.length === 0) {
                            return;
                        }
                        list.forEach(item => {
                            if (item.checkStatus === 2) {
                                checkedList.push(item);
                            }
                            if (item.children) {
                                loopGetChecked(item.children);
                            }
                        });
                    };
                loopGetChecked(this.showData);
                return checkedList;
            },
            getSelectedNode () {
                return this.selectedNode;
            },
            delCurrentNode () {
                if (!this.selectedNode) {
                    return;
                }
                this.bus.$emit("deleteNode", this.selectedNode);
            },
            refreshCurrentNode () {
                if (!this.selectedNode) {
                    return;
                }
                this.bus.$emit("refreshNode", this.selectedNode);
            }
        }
    };

    export default Tree;
</script>

<style>
    .vue-data-tree {
        position: relative;
    }
    .vue-data-tree * {
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        font-size: 14px;
        box-sizing: border-box;
    }
    .vue-data-tree ul,
    .vue-data-tree li {
        list-style-type: none;
        padding: 0;
        margin: 0;
    }

</style>
