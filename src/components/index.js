import MainLayout from './MainLayout';
import NotFound from './NotFound';
import Empty from './Empty';
import KeyValueItem from './KeyValueItem';

import VueScrollbar from 'vue2-scrollbar';
import 'vue2-scrollbar/dist/style/vue2-scrollbar.css';

const components = {
    MainLayout,
    NotFound,
    Empty,
    KeyValueItem,
    ScrollBar: VueScrollbar,
};

export default function injectComponents(Vue, options = {}) {
    Object.keys(components).forEach((key) => {
        Vue.component(key, components[key]);
    });
}