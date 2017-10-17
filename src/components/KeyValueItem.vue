<style scope lang="sass">
$black: rgba(0, 0, 0, 0.6);
$white: #fff;
$gray: #ccc;
$key-value-item-width: 200px;

.key-value-item {
    line-height: 2.0;
    width: $key-value-item-width;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-start;
    .item-key {
        display: inline-block;
        padding-right: 10px;
        position: relative;
        &::after {
            position: absolute;
            top: 0;
            right: 0;
            display: block;
            content: "：";
            vertical-align: super;
        }
    }
    .item-value {
        display: inline-block;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        max-width: $key-value-item-width - 60px;
        vertical-align: middle;
    }
}

</style>
<template>
    <div class="key-value-item">
        <span :id="data.key" class="item-key">{{data.label}}</span>
        <span class="item-value">{{data.value}}</span>
    </div>
</template>
<script type="text/babel">

export default {
    name: 'KeyValueItem',
    props: {
        data: {
            type: Object,
            require: true,
            default: () => {}
        }
    },
    computed: {
        
    },
    methods: {

    }
};
</script>