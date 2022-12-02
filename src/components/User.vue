<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 搜索栏 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" class="input-with-select" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表 -->
      <el-table :data="userlist" stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChanged(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="170px">
          <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" circle size="mini" @click="showdialog(scope.row.id)"></el-button>
              
              <el-button type="danger" icon="el-icon-delete" circle size="mini" @click="delteuserById(scope.row.id)"></el-button>

            <el-tooltip  effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" circle size="mini" @click="setRole(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="block">

        <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2 ,5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
        </el-pagination>
      </div>
      <!-- 对话框 -->
    </el-card>
      <el-dialog
        title="添加用户"
        :visible.sync="dialogVisible"
        width="50%"
        @close="dialogclose"
        >
        <el-form :model="addForm" :rules="addFormrules" ref="addFormRef" label-width="70px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="phone">
            <el-input v-model="addForm.phone"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="adduser">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改对话框 -->
        <el-dialog
          title="修改用户"
          :visible.sync="editdialogVisible"
          width="50%"
          @close="editdialogclose"
         >
         <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
          <el-form-item label="用户名">
            <el-input v-model="editForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="editdialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="changeuser">确 定</el-button>
          </span>
        </el-dialog>
        <!-- 分配角色对话框 -->
        <el-dialog
            title="分配角色"
            :visible.sync="setroledialogVisible"
            width="50%"
            @close="setdialogclosed"
            >
            <div>
              <p>当前用户：{{userinfo.username}}</p>
              <p>当前角色：{{userinfo.role_name}}</p>
              <p>分配新角色：
                <el-select v-model="selectroleid" placeholder="请选择">
                  <el-option
                    v-for="item in roleslist"
                    :key="item.id"
                    :label="item.roleName"
                    :value="item.id">
                  </el-option>
                </el-select>
              </p>
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button @click="setroledialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="saveroleinfo">确 定</el-button>
            </span>
         </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    var checkemail = (rule,value,cb)=>{
      const regEmail = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      if(regEmail.test(value)){
        return cb()
      }
      cb(new Error('请输入合法的邮箱'))
    }
    var checkphone = (rule,value,cb)=>{
      const regphone = /^1(3\d|4[5-8]|5[0-35-9]|6[567]|7[01345-8]|8\d|9[025-9])\d{8}$/
      if(regphone.test(value)){
        return cb()
      }
      cb(new Error('请输入正确的手机号'))
    }
    return {
      roleslist:[],
      selectroleid:'',
      userinfo:{},
      setroledialogVisible:false,
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2,
      },
      userlist: [],
      total: 0,
      dialogVisible:false,
      editdialogVisible:false,
      addForm:{
        username:'',
        password:'',
        email:'',
        phone:''
      },
      editForm:{
      },
      editFormRules:{
        email:[
        { required: true, message: '请输入新邮箱', trigger: 'blur' },
        {validator:checkemail ,  trigger: 'blur'}
        ], 
        mobile:[
        { required: true, message: '请输入新手机号', trigger: 'blur' },
        {validator:checkphone ,  trigger: 'blur'}
        
        ]
      },
      addFormrules:{
        username:[
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password:[
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
         email:[
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        {validator:checkemail ,  trigger: 'blur'}
        ], 
        phone:[
        { required: true, message: '请输入手机号', trigger: 'blur' },
        {validator:checkphone ,  trigger: 'blur'}
        
        ]
      },
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo,
      });

      if (res.meta.status !== 200) {
        return this.$message.error("获取失败");
      }
      this.userlist = res.data.users;
      this.total = res.data.total;
    },
    handleSizeChange(newSize){
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    handleCurrentChange(newPage){
      this,this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    async userStateChanged(userinfo){
      const {data :res } =  await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
      if(res.meta.status !== 200){
        userinfo.mg_state = !userinfo.mg_state
        return this.$message.error('更新状态失败！')
      }
      this.$message.success('更新状态成功！')
    },
    dialogclose(){
        this.$refs.addFormRef.resetFields()
    },
    adduser(){
      this.$refs.addFormRef.validate(async valid =>{
        if(!valid) return
        const{ data : res } = await this.$http.post('users',this.addForm)
        if(res.meta.status !== 201){
          return this.$message.error('添加用户失败')
        }
        this.$message.success('添加用户成功')
        this.dialogVisible = false
        this.getUserList()
      })
    },
    async showdialog(id){
      const {data : res} = await this.$http.get('users/' + id)
      if(res.meta.status !== 200){
        return this.$message.error('查询用户失败')
      }
      this.editForm = res.data
      this.editdialogVisible = true
    },
    editdialogclose(){
      this.$refs.editFormRef.resetFields()
    },
    changeuser(){
      this.$refs.editFormRef.validate(async valid =>{
        if(!valid) return
        const {data : res} = await this.$http.put('users/' + this.editForm.id,{
          email:this.editForm.email , mobile:this.editForm.mobile
        })
        if(res.meta.status !== 200){
          return this.$message.error('修改用户失败')
        }
        this.editdialogVisible = false
        this.getUserList()
        this.$message.success('更新成功')
      })
    },
    async delteuserById(id){
      const confirmresult = await this.$confirm ('此操作将删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if(confirmresult !== 'confirm'){
          return this.$message.info('已取消操作')
        }
        const { data : res } = await this.$http.delete('users/' + id)
        if(res.meta.status !== 200){
          return this.$message.error('删除失败')
        }
        this.$message.success('删除成功')
        this.getUserList()
    },
    async setRole(userinfo){
      this.userinfo = userinfo
      const {data : res} = await this.$http.get('roles')
      if(res.meta.status !== 200){
          return this.$message.error('获取数据失败')
        }
        this.roleslist = res.data
      this.setroledialogVisible = true
    },
    async saveroleinfo(){
      if(!this.selectroleid  ){
        return this.$message.error('请选择分配的角色')
      }
      const { data : res } = await this.$http.put(`users/${this.userinfo.id}/role`,{
        rid:this.selectroleid
      })
      if(res.meta.status !== 200){
          return this.$message.error('修改失败')
        }
        this.$message.success('修改成功')
        this.getUserList()
        this.setroledialogVisible = false
    },
    setdialogclosed(){
      this.selectroleid = ''
      this.userinfo = {}
    }
  },

};
</script>

<style lang="less" scoped>
</style>