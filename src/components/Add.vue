<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      >
      </el-alert>
      <el-steps
        :space="200"
        :active="activeindex - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form
        :model="addForm"
        :rules="addFormrules"
        ref="addFormref"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          :tab-position="'left'"
          v-model="activeindex"
          :before-leave="bfleave"
          @tab-click="tabclick"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                expand-trigger="hover"
                v-model="addForm.goods_cat"
                :options="catelist"
                :props="cateprops"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :label="item.attr_name"
              v-for="item in manydata"
              :key="item.attr_id"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="cb"
                  v-for="(cb, i) in item.attr_vals"
                  :key="i"
                  border
                >
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlydata"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              action="https://lianghj.top:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="picsuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4"
            >商品内容
            <quill-editor v-model="addForm.goods_introduce"> </quill-editor>
            <el-button type="primary" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览对话框 -->
    <el-dialog title="图片预览" :visible.sync="picdialogVisible" width="50%">
      <img :src="Previewpath" alt="" class="pic" />
    </el-dialog>
  </div>
</template>

<script>
import _ from "lodash"
export default {
  data() {
    return {
      activeindex: "0",
      addForm: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        pics: [],
        goods_introduce: "",
        attrs: [],
      },
      catelist: [],
      cateprops: {
        label: "cat_name",
        value: "cat_id",
        children: "children",
      },
      
      manydata: [],
      onlydata: [],
      Previewpath:"",
      picdialogVisible: false,
      headerObj: {
        Authorization: window.sessionStorage.getItem("token"),
      },
      addFormrules: {
        goods_name: [
          { required: true, message: "请输入商品名", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
        ],
        goods_cat: [
          { required: true, message: "请选择商品分类", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getcatelist();
  },
  methods: {
    async getcatelist() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) {
        return this.$message.error("获取失败");
      }
      this.catelist = res.data;
    },
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) this.addForm.goods_cat = [];
    },
    bfleave(activeName, oldactiveName) {
      if (oldactiveName === "0" && this.addForm.goods_cat.length !== 3) {
        this.$message.error("请先选择分类");
        return false;
      }
    },
    async tabclick() {
      if (this.activeindex === "1") {
        const { data: res } = await this.$http.get(
          `categories/${this.cateid}/attributes`,
          {
            params: { sel: "many" },
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("获取数据失败");
        }
        res.data.forEach((item) => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(" ");
        });
        this.manydata = res.data;
      } else if (this.activeindex === "2") {
        const { data: res } = await this.$http.get(
          `categories/${this.cateid}/attributes`,
          {
            params: { sel: "only" },
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("获取数据失败");
        }
        this.onlydata = res.data;
      }
    },
    handlePreview(file) {
      this.picdialogVisible = true;
      this.Previewpath = file.response.data.url;
    },
    handleRemove(file) {
      const filepath = file.response.data.tmp_path;
      const i = this.addForm.pics.findIndex((x) => x.pic === filepath);
      this.addForm.pics.splice(i, 1);
    },
    picsuccess(response) {
      const picinfo = { pic: response.data.tmp_path };
      this.addForm.pics.push(picinfo);
    },
    add() {
      this.$refs.addFormref.validate(async valid => {
        if (!valid) {
          return this.$message.error("请填写必填项");
        }
        const form = _.cloneDeep(this.addForm);
        form.goods_cat = form.goods_cat.join(',');
        
        this.manydata.forEach(item => {
          const newinfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' '),
          }
          this.addForm.attrs.push(newinfo);
        })
       
        this.onlydata.forEach(item => {
          const newinfo = { attr_id: item.attr_id, attr_value: item.attr_vals };
          this.addForm.attrs.push(newinfo)
        })
        form.attrs = this.addForm.attrs
        
        const { data: res } = await this.$http.post('goods', form)
        if (res.meta.status !== 201) {
          return this.$message.error("添加失败");
        }
        this.$message.success("添加成功");
        this.$router.push('/goods')
      });
    },
  },
  computed: {
    cateid() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2];
      }
      return null;
    },
  },
};
</script>

<style lang="less" scoped>
.el-steps {
  margin: 20px 0;
}
.el-step__title {
  font-size: 10px;
}
.pic {
  width: 100%;
}

.el-button {
  margin-top: 15px;
}
</style>