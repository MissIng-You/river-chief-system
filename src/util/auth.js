import store from 'store';

export const USER_TOKEN = '__USER_TOKEN__';
export const USER_PERMISSION = '__USER_PERMISSION__';
export const USER_PEOPLE_INFO = '__USER_PEOPLE_INFO__';

export default {
    getToken() {
        return store.get(USER_TOKEN);
    },

    setToken(token) {
        store.set(USER_TOKEN, token);
    },

    getPermission() {
        return store.get(USER_PERMISSION);
    },

    setPermission(permission) {
        store.set(USER_PERMISSION, permission);
    },

    getPeopleInfo() {
        return store.get(USER_PEOPLE_INFO);
    },

    setPeopleInfo(people) {
        store.set(USER_PEOPLE_INFO, people);
    },

    logout(cb) {
        store.remove(USER_TOKEN);
        store.remove(USER_PERMISSION);
        cb && cb();
    },

    loggedIn() {
        return !!this.getToken();
    }
}
