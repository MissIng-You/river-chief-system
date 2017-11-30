<style lang="sass" scoped>
    $gray:#969ba0;
    $primary: #44b8b7;
    $danger: #f06900;
    
    .reply-item {
        background-color: #fff;

        .reply-content {
            margin-bottom: 10px;
            padding: 15px 0;
        }
    }
    .reply-user-wrap {
        &::after {
            display: block;
            position: absolute;
            content: "";
            left: 50%;
            width: 0;
            height: 30px;
            border-right: 1px dashed $gray;
        }
    }
    .reply-user {
        text-align: center;
        padding-top: 20px;
        .user-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            overflow: hidden;
            margin: 0 auto;
            background-color: $gray;
            line-height: 40px;

            .avatar {
                color: #fff;
                font-size: 24px;
            }
            img {
                width: 100%;
            }
        }
        .user-info {
            display: block;
        }
    }
    .reply-desc {
        position: relative;
        background-color: #2d8cf0;
        border-radius: 5px;
        padding: 15px;
        color: #fff;

        .desc-text {
            padding-bottom: 8px;
        }
        .desc-image {
            float: left;
            border: 2px solid #fff;
            width: 120px;
            height: 70px;
            margin: 0 8px 8px 0;
            overflow: hidden;

            img {
                width: 100%;
            }
        }
        .triangle {
            border-top: 10px solid transparent;
            border-right: 12px solid #2d8cf0;
            border-bottom: 10px solid transparent;
            position: absolute;
            left: -12px;
            top: 30px;
        }
    }
</style>
<template>
    <div class="reply-item">
        <div>
            <Row class="reply-content">
                <Col span="4" class="reply-user-wrap">
                    <div class="reply-user">
                        <div class="user-avatar">
                            <Icon type="person" class="avatar"></Icon>
                        </div>
                        <span class="user-info">Frank</span>
                        <span class="user-info">2017-11-12</span>
                        <span class="user-info">14:00:00</span>
                    </div>
                </Col>
                <Col span="19" class="reply-desc">
                    <p class="desc-text">河流水质改善。河流水质改善。河流水质改善。河流水质改善。</p>
                    <div class="desc-image">
                        <img src="http://171.221.202.126:30002/Image/201711/2017111012055488019.jpg" alt="">
                    </div>
                    <div class="triangle"></div>
                </Col>
            </Row>
        </div>
    </div>
</template>

<script type="text/babel">
import { mapGetters, mapState } from 'vuex';
import moment from 'moment';

export default {
    name: 'ReplyItem',
    props: {
        reply: {
            type: Array
        }
    },
    computed: {

    },
    methods: {
        formatSolveTime(time, format) {
            if(!time) return '';
            return moment(time).format(format);
        }
    }
};
</script>