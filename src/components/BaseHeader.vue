<template>
  <div class="hi-area">
    <el-header class="me-area" style="padding-right:0px;">
      <el-row class="me-header" type="flex" justify="center">
        <el-col :span="3" class="me-header-left">
          <router-link to="/" class="me-title">
            <img src="../assets/img/logo.png" />
          </router-link>
        </el-col>

        <el-col v-if="!simple" :span="17">
          <el-menu
            :router="true"
            menu-trigger="click"
            active-text-color="#00ccff"
            :default-active="activeIndex"
            mode="horizontal"
          >
					
            <template v-if="user.login">
							<el-menu-item index="/history">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-shouye" />
              </svg>&nbsp;调试记录
            </el-menu-item>
						<el-menu-item index="/">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-shouye" />
              </svg>&nbsp;今日调试
            </el-menu-item>
            <el-menu-item index="/tag/all">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-fenlei" />
              </svg>&nbsp;调试分类
            </el-menu-item>
              <el-menu-item index="/write">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-shuru" />
                </svg>&nbsp;日记编写
              </el-menu-item>
              <el-menu-item index="/myBlog">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-wode" />
                </svg>&nbsp;我的日记
              </el-menu-item>
            </template>
            <template v-else>
            </template>
            <el-menu-item>
              <div>
                <div class="search-input">
                  <input
                    placeholder=" 🔍 搜索感兴趣的调试"
                    type="text"
                    class="form-control"
                    v-model="keyword"
                    @keydown.enter="search()"
                  />
                </div>
              </div>
            </el-menu-item>
						<el-menu-item style="margin-left: 25%;">
               <a>欢迎来到心理调适系统，请先登录</a>
            </el-menu-item>
          </el-menu>
        </el-col>

        <template v-else>
          <slot></slot>
        </template>

        <el-col :span="3">
          <el-menu
            :router="true"
            menu-trigger="click"
            mode="horizontal"
            active-text-color="#00ccff"
          >
            <!-- Start If not logged in -->
            <template v-if="!user.login">
              <el-menu-item index="/login">
                <el-button type="text">登录</el-button>
              </el-menu-item>
              <el-menu-item index="/register">
                <el-button type="text">注册</el-button>
              </el-menu-item>
            </template>
            <!-- If logged in -->
            <template v-else>
              <el-submenu index>
                <template slot="title">
                  <img class="me-header-picture" :src="user.avatar" />
                  <span>{{user.nickname}}</span>
                </template>
                <el-menu-item index @click="logout">退出</el-menu-item>
                <br />
                <el-menu-item index @click="editUserInfo">编辑个人信息</el-menu-item>
              </el-submenu>
            </template>
            <!-- End If logged in -->
          </el-menu>
        </el-col>
      </el-row>
    </el-header>
  </div>
</template>


<script type="text/javascript">
import { searchByTitle } from "../utils/search";

export default {
  components: {},
  name: "BaseHeader",
  props: {
    activeIndex: String,
    simple: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      keyword: ""
    };
  },
  computed: {
    user() {
      let login = this.$store.state.account.length != 0;
      let avatar = this.$store.state.avatar;
      let account = this.$store.state.account;
      let nickname = this.$store.state.nickname;
      return {
        login,
        avatar,
        account,
        nickname
      };
    }
  },
  methods: {
    routeSearchResult: function(that, keyword) {
      let path = that.$route.path;
      if (!path.startsWith("/searchResultByTitle")) {
        that.$router.push({ path: `/searchResultByTitle/${keyword}` });
      } else {
        console.log("In result " + keyword);
        // that.$router.replace({ path: `/searchResultByTitle/${keyword}` });
        window.location.href =
          "http://buaapsy.com:8080" + `#/searchResultByTitle/${keyword}`;
        window.location.reload(false);
      }
    },
    search() {
      this.routeSearchResult(this, this.keyword);
    },
    logout: function() {
      let that = this;
      this.$store
        .dispatch("logout")
        .then(() => {
          this.$router.push({ path: "/" });
        })
        .catch(error => {
          if (error !== "error") {
            that.$message({ message: error, type: "error", showClose: true });
          }
        });
    },
    editUserInfo() {
      this.$router.push({ path: "/userInfo" });
    }
  }
};
</script>

<style type="text/css">
.el-button--text {
  color: #00aeda;
}

.el-button--text:hover {
  color: #5fc8e2;
}

.el-header {
  position: fixed;
  z-index: 1024;
  min-width: 100%;
  box-shadow: 0 2px 3px hsla(0, 0%, 7%, 0.1), 0 0 0 1px hsla(0, 0%, 7%, 0.1);
}

.me-title {
  margin-top: 10px;
  font-size: 24px;
}

.me-header-left {
  margin-top: 10px;
}

.me-title img {
  max-height: 2.4rem;
  max-width: 100%;
}

.me-header-picture {
  width: 36px;
  height: 36px;
  /* border: 1px solid #ddd; */
  border-radius: 50%;
  vertical-align: middle;
  /* background-color: #00ccff; */
}
.search-input {
  height: 30px;
  width: 210px;
  margin: 0 auto;
  margin-top: 15px;
  margin-left: 50px;
  position: relative;
}

.search-input input {
  border: 1px solid #e4e4e4;
  box-sizing: border-box;
  width: 200px;
  height: 30px;
  font-size: 14px;
  float: left;
  padding-left: 5px;
  padding-right: 15px;
  overflow: hidden;
}

input::-ms-clear {
  display: none;
}
</style>
