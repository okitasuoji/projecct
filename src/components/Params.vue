<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert
        title="只允许为第三级分类设置参数"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
            expand-trigger="hover"
            v-model="selectedcatekeys"
            :options="catelist"
            :props="cateProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            size="mini"
            type="primary"
            :disabled="isbtndis"
            @click="adialogVisible = true"
            >添加参数</el-button
          >
          <el-table :data="manydata" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="closetag(i,scope.row)"
                >
                  {{ item }}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>

            
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <!-- slot-scope="scope" -->
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showdialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="delbtn(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            size="mini"
            type="primary"
            :disabled="isbtndis"
            @click="adialogVisible = true"
            >添加属性</el-button
          >
          <el-table :data="onlydata" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="closetag(i,scope.row)"
                >
                  {{ item }}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="属性名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showdialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="delbtn(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 对话框 -->
    <el-dialog
      :title="'添加' + title"
      :visible.sync="adialogVisible"
      width="50%"
      @close="closeaddForm"
    >
      <el-form
        :model="addForm"
        :rules="addFormrules"
        ref="addFormref"
        label-width="100px"
      >
        <el-form-item :label="title" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="adialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addparmas">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改对话框 -->
    <el-dialog
      :title="'修改' + title"
      :visible.sync="editdialogVisible"
      width="50%"
      @close="closeeditForm"
    >
      <el-form
        :model="editForm"
        :rules="editFormrules"
        ref="editFormref"
        label-width="100px"
      >
        <el-form-item :label="title" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editparmas">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      manydata: [],
      onlydata: [],
      catelist: [],
      inputValue:'',
      editForm: {},
      addForm: {
        attr_name: "",
      },
      adialogVisible: false,
      inputVisible:false,
      cateProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      selectedcatekeys: [],
      activeName: "many",
      addFormrules: {
        attr_name: [{ required: true, message: "请输入内容", trigger: "blur" }],
      },
      editdialogVisible: false,
      editFormrules: {
        attr_name: [{ required: true, message: "请输入内容", trigger: "blur" }],
      },
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) {
        return this.$message.error("获取数据失败");
      }
      this.catelist = res.data;
    },
    handleChange() {
      this.getparamsdata();
    },
    handleClick() {
      this.getparamsdata();
    },
    // 获取数据方法
    async getparamsdata() {
      if (this.selectedcatekeys.length !== 3) {
        this.selectedcatekeys = [];
        this.manydata = []
        this.only = []
        return;
      }
      const { data: res } = await this.$http.get(
        `categories/${this.cateid}/attributes`,
        { params: { sel: this.activeName } }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("获取数据失败");
      }
      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
        item.inputVisible = false
        item.inputValue = ''
      });
      if (this.activeName === "many") {
        this.manydata = res.data;
      } else this.onlydata = res.data;
    },
    closeaddForm() {
      this.$refs.addFormref.resetFields();
    },
    closeeditForm() {
      this.$refs.editFormref.resetFields();
    },
    addparmas() {
      this.$refs.addFormref.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          `categories/${this.cateid}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName,
          }
        );
        if (res.meta.status !== 201) {
          return this.$message.error("添加失败");
        }
        this.$message.success("添加成功");
        this.adialogVisible = false;
        this.getparamsdata();
      });
    },
    async showdialog(attr_id) {
      const { data: res } = await this.$http.get(
        `categories/${this.cateid}/attributes/${attr_id}`,

        {
          params: { attr_sel: this.activeName },
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("获取数据失败");
      }
      this.editForm = res.data;
      this.editdialogVisible = true;
    },
    editparmas() {
      this.$refs.editFormref.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          `categories/${this.cateid}/attributes/${this.editForm.attr_id}`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName,
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("修改失败");
        }
        this.$message.success("修改成功");
        this.getparamsdata();
        this.editdialogVisible = false;
      });
    },
    async delbtn(attr_id) {
      const confirmresult = await this.$confirm(
        "此操作将删除该参数, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmresult !== "confirm") {
        return this.$message.info("已取消操作");
      }
      const { data: res } = await this.$http.delete(
        `categories/${this.cateid}/attributes/${attr_id}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error("删除失败");
      }
      this.$message.success("删除成功");
      this.getparamsdata();
    },
    async handleInputConfirm(row){
      if(row.inputValue.trim().length === 0){
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      this.savetag(row)
    },
    showInput(row){
      row.inputVisible = true
      this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
    },
    async savetag(row){
      const { data : res } = await this.$http.put(
        `categories/${this.cateid}/attributes/${row.attr_id}`,{
          attr_name:row.attr_name,
          attr_sel:row.attr_sel,
          attr_vals:row.attr_vals.join(' ')
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error("修改失败");
      }
      this.$message.success("修改成功");
    },
    closetag(i,row){
      row.attr_vals.splice(i,1)
      this.savetag(row)
    }
  },
  computed: {
    isbtndis() {
      if (this.selectedcatekeys.length !== 3) {
        return true;
      }
      return false;
    },
    cateid() {
      if (this.selectedcatekeys.length === 3) {
        return this.selectedcatekeys[2];
      }
      return null;
    },
    title() {
      if (this.activeName === "many") {
        return "动态参数";
      } else {
        return "静态属性";
      }
    },
  },
};
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}
.el-tag {
  margin: 15px;
}
.input-new-tag{
  width:120px
}
</style>