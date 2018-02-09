<template>
    <div class="vue-data-tree" @mousemove="dragMouseMove($event)" ref="dataTreeBox">
        <ul v-if="showData && showData.length" class="vue-data-tree" >
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
    </div>
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
    import TreeNode from "./tree-node.vue";

    const Tree = {
        name: "Tree",
        props: {
            options: Object,
            treeData: Array
        },
        data () {
            return {
                showData: null
            };
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
                    halfCheckable: checkable.halfCheckable === false ? false : true,
                    cascade: {...defaultOptions.checkable.cascade, ...checkable.cascade}
                };
            } else if (checkable === false) {
                newOptions.checkable = false;
            } else {
                newOptions.checkable = {...defaultOptions.checkable};
            }

            newOptions.selectable = selectable === false ? false : true;

            this.optionSettings = newOptions;

            this.showData = [...this.treeData];

            // public bus for events
            this.bus = new Vue();
            this.bus.expandingInfo = {
                start: false,
                list: []
            };
            this.bus.$on("nodeSelected", node => {
                this.$emit("nodeSelected", node);
            });
            this.bus.$on("nodeChecked", node => {
                this.$emit("nodeChecked", node);
            });
            this.bus.$on("expandEnd", () => {
                this.$emit("expandEnd", this.showData);
            });

            // functions for dragging node
            this.bodyMouseUp = () => {
                this.bus.moveNode = null;
                this.bus.cloneTarget = null;
                if (this.bus.cloneEl) {
                    this.$refs.dataTreeBox.removeChild(this.bus.cloneEl);
                    this.bus.cloneEl = null;
                }
            };
            document.body.addEventListener("mouseup", this.bodyMouseUp);
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

                Vue.set(this.showData, index, item);
            },
            dragMouseMove (event) {
                if (!this.bus.moveNode) {
                    return;
                }
                if (!this.bus.treeRect) {
                    this.bus.treeRect = this.$refs.dataTreeBox.getBoundingClientRect();
                }
                if (!this.bus.cloneEl) {
                    this.bus.cloneEl = this.bus.cloneTarget.cloneNode(true);
                    this.$refs.dataTreeBox.appendChild(this.bus.cloneEl);
                }
                this.bus.cloneEl.style.left = event.clientX - this.bus.treeRect.x - this.bus.moveStartPos.x + "px";
                this.bus.cloneEl.style.top = event.clientY - this.bus.treeRect.y - this.bus.moveStartPos.y + "px";

                let nodeList = this.$refs.dataTreeBox.querySelectorAll(".data-tree-el-info");
                nodeList.forEach((nodeEl) => {
                    let rect = nodeEl.getBoundingClientRect();
                    if (event.clientX - rect.x > 0 && event.clientX - rect.x < rect.width &&
                        event.clientY - rect.y > 0 && event.clientY - rect.y < rect.height) {

                    }
                });
                console.log(event);
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
        font-size: 14px
    }
    .vue-data-tree ul,
    .vue-data-tree li {
        list-style-type: none;
        padding: 0;
        margin: 0;
    }

</style>
