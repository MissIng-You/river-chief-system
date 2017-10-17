<style scope lang="sass">
$black: rgba(0, 0, 0, 0.6);
$white: #fff;
$gray: #ccc;
$empty-width: 200px;
$empty-height: 200px;

.empty-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    background-color: $white;
    width: 100%;
    margin: 10px 0;
    
    .empty-content {
        padding: 10px;
        width: $empty-width;
        height: $empty-height;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
    }
}
</style>
<template>
    <div class="empty-container" >
        <div class="empty-content">
            {{getContent(this.content)}}
        </div>
    </div>
</template>
<script type="text/babel">

export default {
    name: 'Empty',
    props: {
        content: {
            type: String,
            default: '没有数据!'
        }
    },
    computed: {
        
    },
    methods: {
        getContent(value) {
            return value ? value : this.content;
        }
    }
};
</script>