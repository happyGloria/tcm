<template>
  <div class="page-line clearfix">
    <div class="left fl">
      <div class="title">本级节点</div>
      <div class="content">
        <div class="ico ico-info-logo" />
        <template v-if="!curModel">
          <div class="blank">
            <span>节点信息</span>
            <span>尚未设置本级节点</span>
            <a class="btn-add"
               @click="addCurNode">点击添加 >> </a>
          </div>
        </template>
        <template v-else>
          <div class="cur-info">
            <p v-for="item in curNode"
               :key="item.prop"
               class="clearfix">
              <span class="label">{{ item.name }}</span>
              <span> : </span>
              <span :title="item.text" class="text" v-html="item.text" />
            </p>
            <p class="btns">
              <el-button size="mini"
                         @click="editCurNode">修改</el-button>
            </p>
          </div>
        </template>
      </div>
    </div>
    <div class="right fr">
      <div class="title">节点关系</div>
      <relation ref="relation" />
      <edit-form ref="dialog"
                 :title="title" />

    </div>
  </div>
</template>

<script>
import EditForm from './dialog.vue'
import Relation from './relation.vue'
export default {
  components: {
    EditForm,
    Relation
  },
  filters: {
    siteType (value) {
      return Util.v2str('siteType', value)
    }
  },
  data () {
    return {
      title: '新建节点',
      curModel: null,
      curNode: [
        { prop: 'id', name: '节点ID' },
        { prop: 'no', name: '节点编号' },
        { prop: 'name', name: '节点名称' },
        { prop: 'siteType', name: '节点类型' },
        { prop: 'ip', name: 'IP地址' },
        { prop: 'gbId', name: '国标编号' }
      ]
    }
  },
  computed: {
    jtable () {
      return this.$refs.relation.$refs.jtable
    }
  },
  mounted () {
    this.init()
    this.jtable.init()
  },
  methods: {
    addCurNode () {
      this.$refs.dialog.open({}, true)
    },
    editCurNode () {
      this.title = '修改节点'
      this.$refs.dialog.open({ id: this.curModel.id }, true)
    },
    init () {
      return Service.checkSession().then(({ data: { currentSite }}) => {
        // this.curModel = !Util.isEmptyFn(currentSite) ? currentSite : {}
        /* if (!Util.isEmptyFn(currentSite)) {
          this.curModel = {}
          for (var key in currentSite) {
            this.curModel[key] = Util.isEmptyFn(currentSite[key]) ? '--' : currentSite[key]
          }
        } */
        if (!Util.isEmptyFn(currentSite)) {
          this.curModel = currentSite
          this.curNode.map(item => {
            var val = currentSite[item.prop]
            if (Util.isEmptyFn(val)) {
              item.text = '--'
            } else {
              item.text = item.prop == 'siteType' ? Util.v2str('siteType', val) : val
            }
          })
        }
      })
    }
  }
}
</script>
<style lang="less">
@import "~@/less/mixin.less";
.page-line {
  border: none;
  & > div {
    position: relative;
    height: 100%;
    border: 1px solid #eee;
    .title {
      width: 100%;
      height: 40px;
      line-height: 40px;
      background-color: #eee;
      text-indent: 15px;
      color: #555;
    }
  }
  .left {
    width: 310px;
    margin-right: 10px;
    border: 1px solid #eee;
    .ico-info-logo {
      display: block;
      margin: 30px auto;
    }
    .blank {
      span,
      a {
        display: block;
        text-align: center;
        color: #999;
        font-size: 12px;
        height: 26px;
        line-height: 26px;
      }
      span:nth-of-type(1) {
        font-size: 20px;
        height: 44px;
        line-height: 44px;
        color: #666;
      }
      .btn-add {
        font-size: 12px;
        color: #4cb1ff;
        cursor: pointer;
      }
    }
    .cur-info {
      padding: 0 35px;
      p {
        height: 28px;
        line-height: 28px;
        font-size: 12px;
        color: #333;
        padding-left: 20px;
        span {
          display: block;
          float: left;
        }
        .label {
          color: #666;
          .text_distribute(60px);
        }
        .label+span {
          padding: 0 5px;
        }
        .text {
          .ellipsis_r(80px);
        }
      }
      .btns {
        text-align: right;
        button {
          padding: 6px 12px;
        }
      }
    }
  }
  .right {
    width: calc(~"100% - 320px");
  }
}
</style>

