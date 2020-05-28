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
                <el-input v-model="query.docId" placeholder="文档Id" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-input v-model="query.appId" placeholder="应用Id" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch2">搜索</el-button>
                
                <el-button type="primary" style="float:right" icon="el-icon-plus" @click="handleAdd">新增</el-button>
            </div>

            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column prop="docId" label="文档ID" align="center"></el-table-column>
                <el-table-column prop="appId" label="应用ID" align="center"></el-table-column>
                <el-table-column prop="content" label="查看" align="center"></el-table-column>
                <el-table-column prop="createdTime" label="创建时间"></el-table-column>
                <el-table-column prop="updatedTime" label="更新时间"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>
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

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="文档内容">
                    <el-input v-model="updateContent"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 新增弹出框 -->
        <el-dialog title="新增评论" :visible.sync="addVisible" width="30%">
            <el-form ref="addform" :model="addform" label-width="70px">
                <el-form-item label="应用id">
                    <el-input v-model="addform.appId"></el-input>
                </el-form-item>
                <el-form-item label="文档内容">
                    <el-input v-model="addform.content"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveAdd()">确 定</el-button>
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
                appId: '',
                docId: '',
                pageIndex: 1,
                pageSize: 10
            },
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            pageTotal: 0,
            form: {},
            idx: -1,
            id: -1,
            updateContent:'',
            updateId:'',
            addVisible:false,
            addform:{
                appId:'',
                content:''
            }
        };
    },
    created() {
        this.getData();
    },
    methods: {
        // 获取 easy-mock 的模拟数据
        getData() {
            var _this = this
            this.$axios.get('doc/list')
                .then(response => {
                    console.log(response.data)
                    _this.tableData = response.data
                })
                .catch(function (error) {
                console.log(error)
            })
        },
        // 触发搜索按钮
        handleSearch() {
                var _this = this
                this.$axios.get('doc/selectBy_doc_id/'+this.query.docId)
                    .then(response => {
                        console.log(response.data)
                        _this.tableData = response.data
                        _this.query.docId = '';
                    })
                    .catch(function (error) {
                    console.log(error)
                })
        },
        handleSearch2() {
                var _this = this
                this.$axios.get('doc/selectBy_app_id/'+this.query.appId)
                    .then(response => {
                        console.log(response.data)
                        _this.tableData = response.data
                        _this.query.appId = '';
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
                this.$axios.delete('doc/deleteBy_doc_id/'+row.docId)
                    .then(response => {
                        console.log(response.data)
                        _this.tableData.splice(index, 1)
                        _this.$message.success('删除成功')
                        // 刷新当前页面
                        _this.getData()
                    })
                    .catch(function (error) {
                    console.log(error)
                })
                })
                .catch(() => {});
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        delAllSelection() {
            const length = this.multipleSelection.length;
            let str = '';
            this.delList = this.delList.concat(this.multipleSelection);
            for (let i = 0; i < length; i++) {
                str += this.multipleSelection[i].name + ' ';
            }
            this.$message.error(`删除了${str}`);
            this.multipleSelection = [];
        },
        // 编辑操作
        handleEdit(index, row) {
            this.idx = index;
            this.form = row;
            this.updateId = row.docId
            this.updateContent = row.content
            this.editVisible = true;
        },
        // 保存编辑
        saveEdit() {
            var _this = this
            this.$axios.put('doc/updateDoc',{
                docId: this.updateId,
                content: this.updateContent
            })
                .then(response => {
                    console.log(response.data)
                        _this.editVisible = false
                        _this.getData();
                    })
                .catch(function (error) {
                console.log(error)
            })
        },

        handleAdd(){
            this.addVisible = true
        },
                // 确认添加
        saveAdd(){
            var _this = this
            this.$axios.post('doc/addDoc',{
                appId: this.addform.appId,
                content: this.addform.content
            })
                .then(response => {
                    console.log(response.data)
                        _this.addVisible = false
                        _this.getData();
                    })
                .catch(function (error) {
                console.log(error)
            })
        },

        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageIndex', val);
            this.getData();
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
