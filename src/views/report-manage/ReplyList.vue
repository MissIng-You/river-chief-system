<style lang="sass" scoped>
    $gray:#969ba0;
    $primary: #44b8b7;
    $danger: #f06900;
    
    .reply-list {
        background-color: #fff;

        .reply-content {
            margin-bottom: 10px;
            padding: 15px 0;
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
            top: 20px;
        }
    }
</style>
<template>
    <div class="reply-list">
        <div v-for="(item,index) in reply" :key="index">
            <Row class="reply-content">
                <Col span="5" class="reply-user">
                <div class="user-avatar">
                    <!--<img src="../../assets/images/b.jpg" alt="">-->
                    <Icon type="person" class="avatar"></Icon>
                </div>
                <span class="user-info">{{item.PeopleName}}</span>
                <span class="user-info">{{item.SolveTime}}</span>
                <!--<span class="user-info">16:00:00</span>-->
                </Col>
                <Col span="18" class="reply-desc">
                <p class="desc-text">{{item.SolveInfo}}</p>
                <div class="desc-image" v-for="(img,index) in item.SolveExceptionsFileList" :key="index">
                    <img :src="img.FileUrl" alt="">
                </div>
                <div class="triangle"></div>
                </Col>
            </Row>
        </div>
    </div>
</template>

<script type="text/babel">
import { mapGetters, mapState } from 'vuex';

export default {
    name: 'ReplyList',
    props: {
        reply: {
            type: Array
        }
    },
    computed: {

    },
    methods: {

    }
};
</script>