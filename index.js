const Component = require('./src/tree.vue');

if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(Component);
}
module.exports = Component;

Component.install = Vue => Vue.component(Component.name, Component);
