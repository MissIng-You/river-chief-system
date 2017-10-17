import MainLayout from './MainLayout';
import NotFound from './NotFound';
import Empty from './Empty';
import KeyValueItem from './KeyValueItem';

const components = {
    MainLayout,
    NotFound,
    Empty,
    KeyValueItem
};

export default function injectComponents(Vue, options = {}) {
    Object.keys(components).forEach((key) => {
        Vue.component(key, components[key]);
    });
}