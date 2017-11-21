<style lang="sass" scoped>
    .custom-scrollbar {
        width: 100%;
        height: 400px;
    }
</style>

<template>
    <ScrollBar ref="scrollbar" classes="custom-scrollbar" :styles="scrollbarSetting">
        <slot></slot>
    </ScrollBar>
</template>
<script>

import { getDocumentHeight } from '../../util';
export default {
    name: 'CustomScrollbar',
    props: {
        height: {
            type: Number,
            default: 400
        },
        fixed: {
            type: Boolean,
            default: false
        }
    },
    mounted() {
        if(this.fixed) {
            this.scrollbarSetting.height = `${this.height}px`;
            return;
        }
        this._setScrollbarHeight();
    },
    updated() {
        if(this.fixed) {
            this.scrollbarSetting.height = `${this.height}px`;
            return;
        }
        this._setScrollbarHeight();
    },
    data() {
        return {
            scrollbarSetting: {
                width: '100%',
                height: '400px'
            },
        }
    },
    methods: {
        _setScrollbarHeight() {
            let scrollbar = this.$refs.scrollbar;
            scrollbar && scrollbar.scrollToY(0) && scrollbar.scrollToX(0);
            
            let $scrollbar = this.$refs.scrollbar.$el;
            let scrollbarRect = $scrollbar.getClientRects()
            let scrollbarTop = scrollbarRect && scrollbarRect[0] && scrollbarRect[0].top;
            let docHeight = getDocumentHeight();
            this.scrollbarSetting.height = `${docHeight - scrollbarTop - 20}px`;
        }
    }
}

</script>