<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 基础表格
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button
                    type="primary"
                    icon="el-icon-delete"
                    class="handle-del mr10"
                    @click="delAllSelection"
                >批量删除</el-button>
                <el-button
                    type="primary"
                    icon="el-icon-download"
                    class="handle-del mr10"
                    @click="expAllSelection"
                >批量导出</el-button>
                <el-input v-model="query.des" placeholder="应用名" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="appId" label="应用ID" width="80" align="center"></el-table-column>
                <el-table-column prop="appName" label="应用名"></el-table-column>
                <el-table-column label="应用图标(悬浮大图)" align="center">
                    <template slot-scope="scope">
                        <el-popover
                            placement="right"
                            title=""
                            trigger="hover">
                            <img :src="scope.row.imgSrc" style="max-height: 250px;max-width: 500px"/>
                            <img slot="reference" :src="scope.row.imgSrc" :alt="scope.row.imgSrc" style="max-height: 50px;max-width: 130px">
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column prop="createdTime" label="发布时间"></el-table-column>
                <el-table-column prop="updateTime" label="更新时间"></el-table-column>
                <el-table-column label="操作" width="350" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-plus"
                            @click="handleAdd(scope.$index, scope.row)"
                        >新增负责人</el-button>                        
                        <el-button
                            type="text"
                            icon="el-icon-view"
                            @click="handleCheck(scope.$index, scope.row)"
                        >查看负责人</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-download"
                            @click="handleExport(scope.$index, scope.row)"
                        >导出数据</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="handleDelete(scope.$index, scope.row)"
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="query.pageIndex"
                    :page-size="query.pageSize"
                    :total="pageTotal"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>

        <!-- 负责人数据表格弹出框 -->
        <el-dialog title="查看负责人" :visible.sync="editVisible" width="40%">
            <el-table
                :data="formManager"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
            <el-table-column prop="managerId" label="id" width="55" align="center"></el-table-column>
            <el-table-column prop="managerName" label="负责人"></el-table-column>
            <el-table-column label="删除">
                <template slot-scope="scope">
                    <el-button
                        type="text"
                        icon="el-icon-delete"
                        class="red"
                        @click="managerDelete(scope.$index, scope.row.managerId)"
                    >删除</el-button>                    
                </template>
            </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">隐 藏 </el-button>
            </span>
        </el-dialog>


        
        <!-- 新增弹出框 -->
        <el-dialog title="新增负责人" :visible.sync="addVisible" width="30%">
            <template>
            <el-select v-model="managerId" filterable placeholder="请选择负责人">
                <el-option
                    v-for="item in options"
                    :key="item.managerId"
                    :label="item.managerName"
                    :value="item.managerId">
                </el-option>
            </el-select>
            </template>

            <span slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="addConfirm">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { fetchData } from '../../api/index';
export default {
    name: 'basetable',
    data() {
        return {
            query: {
                des: '',
                pageIndex: 1,
                pageSize: 10
            },
            tableData: [],
            multipleSelection: [],
            delIds: '',
            editVisible: false,
            addVisible: false,
            pageTotal: 0,
            form: [],
            formManager:[],
            idx: -1,
            id: -1,
            searchFlag: 'false',
            options:[],
            managerId: '',
            appId:'',
        };
    },
    created() {
        this.getData(this.query.pageIndex);
    },
    methods: {
        
        // 获取数据
        getData(page) {
            var _this = this
            this.$axios.get('manager/list/' + page)
                .then(response => {
                    console.log(response.data)
                    _this.tableData = response.data.records
                    _this.pageTotal = response.data.total
                    _this.query.pageIndex = response.data.current
                })
                .catch(function (error) {
                console.log(error)
            })
        },

        // 获取负责人数据
        getManagers(){
            var _this = this
            this.$axios.get('manager/list')
                .then(response => {
                    _this.options = response.data
                })
                .catch(function (error) {
                console.log(error)
            })
        },

        // 触发搜索按钮
        handleSearch() {

            // 默认搜索都是第一页开始
            this.$set(this.query, 'pageIndex', 1);
            var _this = this
            this.$axios.get('manager/search/'+ this.query.pageIndex,{ params:{
                des: this.query.des
            }
            })
                .then(response => {
                    console.log(response.data)
                    // 设置搜索标志
                    _this.searchFlag = true
                    _this.tableData = response.data.records
                    _this.pageTotal = response.data.total
                    _this.query.pageIndex = response.data.current
                })
                .catch(function (error) {
                console.log(error)
            })
        },
        // 删除操作
        handleDelete(index, row) {
            var _this = this
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    // 删除
                this.$axios.delete('manager/delete',{
                    data: {
                        "id":row.dynamicId
                        }
                    })
                    .then(response => {
                        console.log(response.data)
                        _this.tableData.splice(index, 1)
                        _this.$message.success('删除成功')
                        // 刷新当前页面
                        _this.getData(_this.query.pageIndex)
                    })
                    .catch(function (error) {
                    console.log(error)
                })
                })
                .catch(() => {});
        },

        // 负责人添加弹窗显示
        handleAdd(index,row){
            this.getManagers();
            this.appId = row.appId
            this.idx = index;
            this.form = row.managers;
            this.addVisible = true;
        },

        // 确认负责人添加
        addConfirm(index,row){
            var _this = this
            this.$axios.post('manager/add', {
                appId: this.appId,
                managerId: this.managerId
            })
                .then(response => {
                console.log(response.data)
                if (response.data.code === '200') {
                    this.$notify({
                    title: '新增成功',
                    message: response.data.msg,
                    type: 'success'
                    })
                    this.addVisible = false;
                    this.getData(this.query.pageIndex);
                }

                // 提交失败
                if (response.data.code === '500') {
                    this.$notify.error({
                    title: '错误',
                    message: response.data.msg
                    })
                }
                })
                .catch(function (error) {
                console.log(error)
            })
        },
        // 负责人单个删除
        managerDelete(index,row){
            var _this = this
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    // 删除
                this.$axios.delete('manager/deleteManager',{
                    data: {
                        "appId":this.appId,
                        "managerId":row
                        }
                    })
                    .then(response => {
                        _this.formManager.splice(index, 1)
                        _this.$message.success('删除成功')
                        // 刷新当前页面
                        _this.getData(_this.query.pageIndex)
                    })
                    .catch(function (error) {
                        // 提交失败
                        if (response.data.code === '500') {
                            this.$notify.error({
                            title: '错误',
                            message: response.data.msg
                            })
                        }
                    })
                })
                .catch(() => {});
        },
        // 数据导出
        handleExport(index,row){
            
            // const link = document.createElement("a");


            // var url = 'manager/exportSingle?appId='+ row.appId;
            // link.setAttribute('href', url)
            // document.body.appendChild(link);
            // link.click();
            // document.body.removeChild(link);
            var _this = this
            this.$axios.get('manager/exportSingle',{ params:{
                appId: row.appId
            }
            })
                .then(response => {
                   
                })
                .catch(function (error) {
                
            })
        },
        // 批量导出
        expAllSelection(){

            let url = 'manager/exportBatch?ids='+this.multipleSelection.join();
            this.$axios({
                method:"get",
                url:url,
                responseType: "blob"
            })
                .then(response => {
                    const link = document.createElement("a");
                    let blob = new Blob([res.data], { type: "multipary/form-data" });
                    link.style.display = "none";
                    link.href = URL.createObjectURL(blob);
                    link.setAttribute("download", decodeURI(res.headers['filename']));
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                })
                .catch(function (error) {
                    
                })
        },
        // 多选操作 传递ids数组对象给多选删除方法
        handleSelectionChange(val) {
            // 每次变化就重置
            this.multipleSelection = [];
            for (let i = 0; i < val.length; i++) {
                if (this.multipleSelection.indexOf(val[i].appId) === -1) {
                    this.multipleSelection.push(val[i].appId)
                }
            }

        },

        // 多选删除
        delAllSelection() {
            var _this = this
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    // 删除
                this.$axios.post('manager/deleteBatch?ids='+this.multipleSelection.join())
                    .then(response => {
                        _this.$message.success('删除成功')
                        // 刷新当前页面
                        _this.getData(_this.query.pageIndex)
                    })
                    .catch(function (error) {
                        // 提交失败
                        if (response.data.code === '500') {
                            this.$notify.error({
                            title: '错误',
                            message: response.data.msg
                            })
                        }
                    })
                })
                .catch(() => {});

        },

        // 查看应用负责人信息操作
        handleCheck(index, row) {
            this.appId = row.appId
            this.idx = index;
            this.formManager = row.managers;
            this.editVisible = true;
        },
        // 保存编辑
        saveEdit() {
            this.editVisible = false;
            this.$message.success(`修改第 ${this.idx + 1} 行成功`);
            this.$set(this.tableData, this.idx, this.form);
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageIndex', val);
            // 判断是搜索后的分页 还是正常分页
            if(this.query.searchDate === '' && this.query.des === '') {
                this.searchFlag = false
            }
            if (this.query.state !== '' || this.searchFlag !== false) {
                this.handleSearch()
            } else {
                this.getData(this.query.pageIndex)
            }
        }
    }
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style>
