<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showadddialogVisible"
            >添加分类</el-button
          >
        </el-col>
      </el-row>
      <tree-table
        :data="catalist"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text=""
        border
        :show-row-hover="false"
      >
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag
            type="success"
            size="mini"
            v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <template slot="opt" slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="showsetdialog(scope.row.cat_id)"
            >编辑</el-button
          >
          <el-button type="danger" icon="el-icon-delete" size="mini"
          @click="deletecate(scope.row.cat_id)"
            >删除</el-button
          >
        </template>
      </tree-table>
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[3, 5, 10]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </el-card>
    <!-- 添加对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="adddialogVisible"
      width="50%"
      @close="closeadddialogVisible"
    >
      <el-form
        :model="addcateform"
        :rules="addcateformRules"
        ref="addcateformRef"
        label-width="100px"
      >
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="addcateform.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类:">
          <el-cascader
            expand-trigger="hover"
            v-model="selectkeys"
            :options="parentcatelist"
            :props="cateprops"
            @change="catechange"
            clearable
            change-on-select
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="adddialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addcate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑对话框 -->
    <el-dialog
      title="编辑"
      :visible.sync="setdialogVisible"
      width="50%"
      @close="closesetdialogVisible"
    >
      <el-form
        :model="setcateform"
        :rules="setcateformRules"
        ref="setcateformRef"
        label-width="100px"
      >
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="setcateform.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setcate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      setdialogVisible:false,
      adddialogVisible:false,
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      catalist: [],
      total: 0,
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        { label: "是否有效", type: "template",template:'isok'},
        {label:'排序', type:'template',template:'order'},
        {label:'操作', type:'template',template:'opt'},
      ],
      addcateform:{
        cat_name:'',
        cat_pid:0,
        cat_level:0
      },
      addcateformRules:{
        cat_name:[
        { required: true, message: '请输入分类名称', trigger: 'blur' },
        { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ]
      },
      setcateformRules:{
        cat_name:[
        { required: true, message: '请输入分类名称', trigger: 'blur' },
        { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ]
      },
      parentcatelist:[],
      cateprops:{
        value:'cat_id',
        label:'cat_name',
        children:'children'
      },
      setcateform:{},
      selectkeys:[],
    };
  },
  created() {
    this.getcatelist();
  },
  methods: {
    async getcatelist() {
      const { data: res } = await this.$http.get("categories", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取失败");
      }
      this.catalist = res.data.result;
      this.total = res.data.total;
    },
    handleSizeChange(newSize){
      this.queryInfo.pagesize = newSize
      this.getcatelist()
    },
    handleCurrentChange(newPage){
      this.queryInfo.pagenum = newPage
      this.getcatelist()
    },
    showadddialogVisible(){
      this.getparentcatelist()
      this.adddialogVisible = true
    },
    async getparentcatelist(){
      const { data : res} = await this.$http.get('categories',{params:{type:2}})
      if (res.meta.status !== 200) {
        return this.$message.error("获取失败");
      }
      this.parentcatelist = res.data
    },
    catechange(){
      if(this.selectkeys.length > 0){
        this.addcateform.cat_pid = this.selectkeys[this.selectkeys.length - 1]
        this.addcateform.cat_level = this.selectkeys.length
        return
      }else{
        this.addcateform.cat_pid = 0
        this.addcateform.cat_level = 0
      }
    },
    closeadddialogVisible(){
      this.$refs.addcateformRef.resetFields()
      this.selectkeys = []
      this.addcateform.cat_pid = 0
      this.addcateform.cat_level = 0
    },
    closesetdialogVisible(){
      this.$refs.setcateformRef.resetFields()
    },
    addcate(){
      this.$refs.addcateformRef.validate(async valid =>{
        if(!valid) return
        const { data : res } = await this.$http.post('categories',this.addcateform)
        if (res.meta.status !== 201) {
        return this.$message.error("添加失败");
      }
        this.$message.success('添加成功')
        this.getcatelist()
        this.adddialogVisible = false
      })
    },
    async showsetdialog(id){
      const {data : res} = await this.$http.get('categories/' + id)
      if(res.meta.status !== 200){
        return this.$message.error('查询用户失败')
      }
      this.setcateform = res.data
      this.setdialogVisible = true
    },
    setcate(){
      this.$refs.setcateformRef.validate(async valid =>{
        if(!valid) return
          const {data : res} = await this.$http.put('categories/' + this.setcateform.cat_id,{
            cat_name:this.setcateform.cat_name  
        })
        if(res.meta.status !== 200){
          return this.$message.error('编辑用户失败')
        }
        this.setdialogVisible = false
        this.getcatelist()
        this.$message.success('编辑成功')
      })
    },
    async deletecate(id){
      const confirmresult = await this.$confirm ('此操作将删除该分类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if(confirmresult !== 'confirm'){
          return this.$message.info('已取消操作')
        }
        const { data : res } = await this.$http.delete('categories/' + id)
        if(res.meta.status !== 200){
          return this.$message.error('删除失败')
        }
        this.$message.success('删除成功')
        this.getcatelist()
    },
  },
};
</script>

<style lang="less" scoped>
.el-row {
  margin-bottom: 15px;
}
.el-cascader {
  width: 100%;
}
</style>