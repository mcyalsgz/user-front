<template>
  <div v-title data-title="Search Result">
    <el-container>
      <el-main class="me-articles">
        <card-article cardHeader="搜索结果" :articles="searchResult"></card-article>
      </el-main>

      <el-aside>
        <card-tag :tags="hotTags"></card-tag>

        <card-article cardHeader="最热文章" :articles="hotArticles"></card-article>

        <card-archive cardHeader="文章归档" :archives="archives"></card-archive>

        <card-article cardHeader="最新文章" :articles="newArticles"></card-article>
      </el-aside>
    </el-container>
  </div>
</template>

<script>
import CardMe from "@/components/card/CardMe";
import CardArticle from "@/components/card/CardArticle";
import CardArchive from "@/components/card/CardArchive";
import CardTag from "@/components/card/CardTag";
import ArticleScrollPage from "@/components/common/ArticleScrollPage";

import {
  getArticles,
  getHotArtices,
  getNewArtices,
  getArticlesByUser,
  getArticlesByTitlecontains,
  listArchives
} from "@/api/article";
import { getHotTags } from "@/api/tag";
import { searchByTitle } from "../utils/search";

export default {
  name: "searchResult",
  created() {
    searchByTitle(this, this.$route.params.keyword);
    this.getHotArtices();
    this.getNewArtices();
    this.getHotTags();
    this.listArchives();
  },
  data() {
    return {
      searchResult: [],
      hotTags: [],
      hotArticles: [],
      newArticles: [],
      archives: []
    };
  },
  methods: {
    getHotArtices() {
      let that = this;
      getHotArtices()
        .then(data => {
          that.hotArticles = data.data;
        })
        .catch(error => {
          if (error !== "error") {
            that.$message({
              type: "error",
              message: "最热文章加载失败!",
              showClose: true
            });
          }
        });
    },
    getNewArtices() {
      let that = this;
      getNewArtices()
        .then(data => {
          that.newArticles = data.data;
        })
        .catch(error => {
          if (error !== "error") {
            that.$message({
              type: "error",
              message: "最新文章加载失败!",
              showClose: true
            });
          }
        });
    },
    getHotTags() {
      let that = this;
      getHotTags()
        .then(data => {
          that.hotTags = data.data;
        })
        .catch(error => {
          if (error !== "error") {
            that.$message({
              type: "error",
              message: "最热分类加载失败!",
              showClose: true
            });
          }
        });
    },
    listArchives() {
      listArchives()
        .then(data => {
          this.archives = data.data;
        })
        .catch(error => {
          if (error !== "error") {
            that.$message({
              type: "error",
              message: "文章归档加载失败!",
              showClose: true
            });
          }
        });
    }
  },
  components: {
    "card-me": CardMe,
    "card-article": CardArticle,
    "card-tag": CardTag,
    ArticleScrollPage,
    CardArchive
  }
};
</script>

<style scoped>
.el-container {
  width: 960px;
}

.el-aside {
  margin-left: 20px;
  width: 260px;
}

.el-main {
  padding: 0px;
  line-height: 16px;
}

.el-card {
  border-radius: 0;
}

.el-card:not(:first-child) {
  margin-top: 20px;
}
</style>
