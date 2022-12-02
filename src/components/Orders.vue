<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" clearable>
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="orderlist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column
          label="订单价格"
          prop="order_price"
          width="95px"
        ></el-table-column>
        <el-table-column label="付款状态" prop="pay_status" width="95px">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'"
              >已付款</el-tag
            >
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="是否发货"
          prop="is_send"
          width="95px"
        ></el-table-column>
        <el-table-column label="购买时间" prop="create_time">
          <template slot-scope="scope">
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <!-- <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              @click="showdil"
            ></el-button> -->
            <el-button
              type="success"
              icon="el-icon-location-outline"
              circle
              @click="showbox"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryinfo.pagenum"
        :page-sizes="[10, 20, 30]"
        :page-size="queryinfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background=""
      >
      </el-pagination>
    </el-card>
    <!-- 编辑对话框 -->
    <!-- <el-dialog title="修改地址" :visible.sync="setdialogVisible" width="50%" @close="closedialog">
      <el-form
        :model="addressForm"
        :rules="addressFormrules"
        ref="addressFormRef"
        label-width="100px"
        
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader :options="citydata" v-model="addressForm.address1"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setdialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog> -->
    <!-- 对话框 -->
    <el-dialog title="物流进度" :visible.sync="prodialogVisible" width="50%">
      <el-form
        :model="addressForm"
        :rules="addressFormrules"
        ref="addressFormRef"
        label-width="100px"
      >
        <el-timeline>
          <el-timeline-item v-for="(activity,index) in proinfo"
           :key="index"
           :timestamp="activity.time"
           >
            {{activity.context}}
          </el-timeline-item>
        </el-timeline>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import citydata from "../citydata";
export default {
  data() {
    return {
      queryinfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      proinfo:[],
      orderlist: [],
      total: 0,
      // setdialogVisible: false,
      // addressForm: {},
      // addressFormrules: {
      //   address1: [{ required: true, message: "请选择地址", trigger: "blur" }],
      //   address2: [
      //     { required: true, message: "请输入详细地址", trigger: "blur" },
      //   ],
      // },
      // address1: [],
      // address2: "",
      // citydata,
      prodialogVisible:false
    };
  },
  created() {
    this.getorderlist();
  },
  methods: {
    async getorderlist() {
      const { data: res } = await this.$http.get("orders", {
        params: this.queryinfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取数据失败");
      }
      this.orderlist = res.data.goods;
      this.total = res.data.total;
    },
    handleSizeChange(newSize) {
      this.queryinfo.pagesize = newSize;
      this.getorderlist();
    },
    handleCurrentChange(newPage) {
      this.queryinfo.pagenum = newPage;
      this.getorderlist();
    },
    // showdil() {
    //   this.setdialogVisible = true;
    // },
    // closedialog() {
    //   this.$refs.addressFormRef.resetFields();
    // },
    async showbox() {
      const { data : res } = await this.$http.get('/kuaidi/1106975712662')
      if (res.meta.status !== 200) {
        return this.$message.error("获取数据失败");
      }
      this.proinfo = res.data
      this.prodialogVisible = true
    },
  },
};
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>