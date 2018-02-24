const Component = require('./src/tree.vue');
module.exports = Component;

Component.install = Vue => Vue.component(Component.name, Component);

if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(Component);
}