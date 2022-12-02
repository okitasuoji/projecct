<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addrolesdialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="rolelist" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row class="firstrow" :class="['bdbottom',i1===0 ? '' : 'bdtop']" v-for="(item1,i1) in scope.row.children" :key="item1.id">
              <el-col :span="5">
                <el-tag  closable @close="removetag(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
            </el-col>
              <el-col :span="19">
                <el-row class="firstrow" v-for="(item2) in item1.children" :key="item2.id" >
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removetag(scope.row,item2.id)">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag type="warning" v-for="(item3) in item2.children" :key="item3.id" closable @close="removetag(scope.row,item3.id)">{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <!-- slot-scope="scope" -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="changerolesdialog(scope.row.id)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="delroles(scope.row.id)">删除</el-button>
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="showsetdialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
      <!-- 分配权限对话框 -->
      <el-dialog
      title="分配权限"
      :visible.sync="setdialogVisible"
      width="50%"
      @close="closesetdialogVisible"
      >
      <el-tree
        :data="rightslist"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
        >
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加用户对话框 -->
    <el-dialog
        title="添加用户"
        :visible.sync="addrolesdialogVisible"
        width="50%"
        @close="rolesdialogclose"
        >
        <el-form :model="addroles" :rules="addRolesrules" ref="addRolesRef" label-width="70px">
          <el-form-item label="名称" prop="roleName">
            <el-input v-model="addroles.roleName"></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="roleDesc">
            <el-input v-model="addroles.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="addrolesdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addrole">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改对话框 -->
      <el-dialog
        title="编辑用户"
        :visible.sync="changerolesdialogVisible"
        width="50%"
        @close="changedialogclose"
        >
        <el-form :model="changeRoles" :rules="changeRolesrules" ref="changeRolesRef" label-width="70px">
          <el-form-item label="名称" prop="roleName">
            <el-input v-model="changeRoles.roleName"></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="roleDesc">
            <el-input v-model="changeRoles.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="changerolesdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="changerole">确 定</el-button>
        </span>
      </el-dialog>
  </div>
</template>

<script>
export default {
  data(){
    return{
      roleId:'',
      addroles:{
        roleName:'',
        roleDesc:'',
      },
      changeRoles:{
        
      },
      rolelist:[],
      setdialogVisible:false,
      addrolesdialogVisible:false,
      changerolesdialogVisible:false,
      rightslist:[],
      treeProps:{
        label:'authName',
        children:'children',      
      },
      defKeys:[],
      addRolesrules:{
        roleName:[
        { required: true, message: '请输入角色', trigger: 'blur' },
        { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        roleDesc:[
        { required: true, message: '请输入角色描述', trigger: 'blur' },
        { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
      },
      changeRolesrules:{
        roleName:[
        { required: true, message: '请输入角色', trigger: 'blur' },
        { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        roleDesc:[
        { required: true, message: '请输入角色描述', trigger: 'blur' },
        { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
      },
    }
  },
  created(){
    this.getrolrlist()
  },
  methods:{
    async getrolrlist(){
      const { data : res } = await this.$http.get('roles')
      if(res.meta.status !== 200){
          return this.$message.error('获取失败')
        }
        this.rolelist = res.data
    },
    async removetag(role,rightId){
      const confirmresult =  await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if(confirmresult !== 'confirm'){
          return this.$message.info('已取消删除')
        }
        const { data : res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
        if(res.meta.status !== 200){
          return this.$message.error('删除失败')
        }
       role.children = res.data
        this.$message({
          message: '删除成功',
          type: 'success'
        })
    }, 
    async showsetdialog(role){
      this.roleId = role.id
      const { data : res} = await this.$http.get('rights/tree') 
      if(res.meta.status !== 200){
          return this.$message.error('获取失败')
        }
        this.rightslist = res.data
        this.getKeys(role,this.defKeys)
        this.setdialogVisible = true
    },
    getKeys(node,arr){
      if(!node.children){
        return arr.push(node.id)
      }
      node.children.forEach(item => 
        this.getKeys(item,arr)
      );
    },  
    closesetdialogVisible(){
      this.defKeys = []
    },
     rolesdialogclose(){
        this.$refs.addRolesRef.resetFields()
    },
    changedialogclose(){
      this.$refs.changeRolesRef.resetFields()
    },
    addrole(){
      this.$refs.addRolesRef.validate(async valid =>{
        if(!valid) return
        const{ data : res } = await this.$http.post('roles',this.addroles)
        if(res.meta.status !== 201){
          return this.$message.error('添加用户失败')
        }
        this.$message.success('添加用户成功')
        this.addrolesdialogVisible = false
        this.getrolrlist()
      })
    },
    async changerolesdialog(id){
      const {data : res} = await this.$http.get('roles/' + id)
      if(res.meta.status !== 200){
        return this.$message.error('查询用户失败')
      }
      this.changeRoles = res.data
      this.changerolesdialogVisible = true
    },
    changerole(){
      this.$refs.changeRolesRef.validate(async valid =>{
        if(!valid) return
          const {data : res} = await this.$http.put('roles/' + this.changeRoles.roleId,{
          roleName:this.changeRoles.roleName , roleDesc:this.changeRoles.roleDesc 
        })
        if(res.meta.status !== 200){
          return this.$message.error('编辑用户失败')
        }
        this.changerolesdialogVisible = false
        this.getrolrlist()
        this.$message.success('编辑成功')
      })
    },
    async delroles(id){
      const confirmresult = await this.$confirm ('此操作将删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if(confirmresult !== 'confirm'){
          return this.$message.info('已取消操作')
        }
        const { data : res } = await this.$http.delete('roles/' + id)
        if(res.meta.status !== 200){
          return this.$message.error('删除失败')
        }
        this.$message.success('删除成功')
        this.getrolrlist()
    },
    async allotRights(){
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')
      const { data : res } = await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})
      if(res.meta.status !== 200){
          return this.$message.error('分配失败')
        }
        this.$message.success('分配成功')
        this.getrolrlist()
        this.setdialogVisible = false
    },
  },
}
</script>

<style lang="less" scoped>
  .el-tag{
    margin: 7px;
  }
  .bdtop{
    border-top: 1px solid rgb(206, 206, 206);
  }
  .bdbottom{
    border-bottom: 1px solid rgb(206, 206, 206);
  }
  .firstrow{
    display: flex;
    align-items: center;
  }
</style>