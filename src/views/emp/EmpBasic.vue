<template>
    <div>
        <div style="display: flex;justify-content: space-between">
            <div>
            <el-input style="width: 300px;margin-right: 10px;margin-top: 10px"
                      size="small"
                      prefix-icon="el-icon-search"
                      v-model="keyword"
                      clearable
                      @clear="showEmpsInfo"
                      @keydown.enter.native="showEmpsInfo"
                      placeholder="请输入员工名进行查询..."></el-input>
            <el-button size="small" icon="el-icon-search" type="primary"  @click="showEmpsInfo">搜索</el-button>
            <el-button size="small" type="primary">
                <i class="fa fa-angle-double-down" aria-hidden="true"></i>
                高级搜索</el-button>
            </div>
            <div>
                <el-button type="success" size="small">
                    <i class="fa fa-level-up" aria-hidden="true"></i>
                    导入数据</el-button>
                <el-button type="success" size="small">
                    <i class="fa fa-level-down" aria-hidden="true"></i>
                    导出数据</el-button>
                <el-button type="primary" icon="el-icon-plus" size="small" @click="showAddEmpView">添加员工</el-button>
            </div>
        </div>
        <div style="margin-top: 10px">
            <el-table
                    :data="empsInfo"
                    stripe
                    border
                    v-loading="loading"
                    element-loading-text="加载中..."
                    element-loading-spinner="el-icon-loading"
                    size="small"
                    style="width: 100%">
                <el-table-column
                        type="selection"
                        width="55">
                </el-table-column>
                <el-table-column
                        prop="name"
                        fixed
                        align="left"
                        label="姓名"
                        width="90">
                </el-table-column>
                <el-table-column
                        prop="workID"
                        align="left"
                        label="工号"
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="gender"
                        align="left"
                        label="性别"
                        width="55">
                </el-table-column>
                <el-table-column
                        prop="birthday"
                        align="left"
                        label="出生日期"
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="idCard"
                        align="left"
                        label="身份证号码"
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="wedlock"
                        label="婚姻状况"
                        width="90">
                </el-table-column>
                <el-table-column
                        prop="nations.name"
                        label="民族"
                        width="50">
                </el-table-column>
                <el-table-column
                        prop="nativePlace"
                        label="籍贯"
                        width="80">
                </el-table-column>
                <el-table-column
                        prop="politics.name"
                        width="100"
                        align="left"
                        label="政治面貌">
                </el-table-column>
                <el-table-column
                        prop="email"
                        align="left"
                        width="150"
                        label="电子邮件">
                </el-table-column>
                <el-table-column
                        prop="phone"
                        width="100"
                        label="电话号码">
                </el-table-column>
                <el-table-column
                        prop="address"
                        align="left"
                        width="220"
                        label="地址">
                </el-table-column>
                <el-table-column
                        prop="department.name"
                        align="left"
                        width="80"
                        label="所属部门">
                </el-table-column>
                <el-table-column
                        prop="positions.name"
                        width="120"
                        align="left"
                        label="职位">
                </el-table-column>
                <el-table-column
                    prop="jobLevels.name"
                    align="left"
                    width="100"
                    label="职称">
                </el-table-column>
                <el-table-column
                        prop="engageForm"
                        align="left"
                        width="100"
                        label="聘用形式">
                </el-table-column>
                <el-table-column
                        prop="beginDate"
                        width="100"
                        align="left"
                        label="入职日期">
                </el-table-column>
                <el-table-column
                        prop="conversionTime"
                        align="left"
                        width="100"
                        label="转正日期">
                </el-table-column>
                <el-table-column
                        prop="beginContract"
                        align="left"
                        width="100"
                        label="合同起始日期">
                </el-table-column>
                <el-table-column
                        prop="endContract"
                        align="left"
                        width="100"
                        label="合同截止日期">
                </el-table-column>
                <el-table-column
                        align="left"
                        width="100"
                        label="合同期限">
                    <template slot-scope="scope">
                        <el-tag>{{scope.row.contractTerm}}</el-tag>
                        年
                    </template>
                </el-table-column>
                <el-table-column
                        prop="tiptopDegree"
                        align="left"
                        width="70"
                        label="最高学历">
                </el-table-column>
                <el-table-column
                        fixed="right"
                        width="200"
                        align="center"
                        label="操作">
                    <template slot-scope="scope">
                        <el-button style="padding: 3px" size="mini" @click="showEditEmpViews(scope.row)">编辑</el-button>
                        <el-button style="padding: 3px" size="mini" type="primary">查看高级资料</el-button>
                        <el-button style="padding: 3px" size="mini" type="danger" @click="deleteEmployee(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>

            </el-table>
            <div style="display: flex;justify-content: flex-end">
                <el-pagination
                        background
                        @current-change="currentChange"
                        :page-sizes="[10, 15, 20,30, 40, 50]"
                        @size-change="sizeChange"
                        layout="sizes, prev, pager, next, jumper, ->, total, slot"
                        :total="total">
                </el-pagination>
            </div>
        </div>
        <el-dialog
                :title="title"
                :visible.sync="dialogVisible"
                width="70%">
            <div>
                <el-form :rules="rules" :model="employee" ref="empForm">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="姓名:" prop="name">
                            <el-input style="width: 150px;" size="mini" placeholder="请输入员工姓名..." prefix-icon="el-icon-edit" v-model="employee.name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item label="性别：" prop="gender">
                            <el-radio-group v-model="employee.gender">
                                <el-radio label="男">男</el-radio>
                                <el-radio label="女" style="margin-left: 0px">女</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="出生日期:" prop="birthday">
                            <el-date-picker
                                    style="width: 150px;"
                                    v-model="employee.birthday"
                                    type="date"
                                    size="mini"
                                    value-format="yyyy-MM-dd"
                                    placeholder="请选择出生日期...">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7">
                        <el-form-item label="政治面貌:" prop="politicId">
                            <el-select v-model="employee.politicId" placeholder="政治面貌" size="mini" style="width: 200px">
                                <el-option
                                        v-for="item in politics"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                    <el-row>
                        <el-col :span="6">
                        <el-form-item label="民族:" prop="nationId">
                            <el-select v-model="employee.nationId" placeholder="民族" size="mini" style="width: 150px">
                                <el-option
                                        v-for="item in nations"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="籍贯:" prop="nativePlace">
                                <el-input style="width: 150px;" size="mini" placeholder="请输入员工籍贯..." prefix-icon="el-icon-edit" v-model="employee.nativePlace"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="电子邮箱:" prop="email">
                                <el-input style="width: 150px;" size="mini" placeholder="请输入电子邮箱..." prefix-icon="el-icon-message" v-model="employee.email"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label="联系地址:" prop="address">
                                <el-input style="width: 200px;" size="mini" placeholder="请输入联系地址..." prefix-icon="el-icon-edit" v-model="employee.address"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="职位:" prop="posId">
                                <el-select v-model="employee.posId" placeholder="职位" size="mini" style="width: 150px">
                                    <el-option
                                            v-for="item in positions"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="职称:" prop="jobLevelId">
                                <el-select v-model="employee.jobLevelId" placeholder="职称" size="mini" style="width: 150px">
                                    <el-option
                                            v-for="item in jobLevels"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>

                        <el-col :span="6">
                            <el-form-item label="所属部门:" prop="departmentId">

                                    <el-popover
                                            placement="right"
                                            title="请选择部门"
                                            width="200"
                                            trigger="manual"
                                            v-model="PopVisible">
                                            <el-tree default-expand-all :data="departments" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
                                        <div slot="reference" style="width: 150px;height:26px;display: inline-flex;font-size: 12px;border: 1px solid #dedede;
                                border-radius: 5px;cursor: pointer;align-items: center;padding-left: 8px;box-sizing: border-box"@click="showDepsView" placeholder="所属部门">{{inputDepName}}</div>
                                    </el-popover>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label="电话号码:" prop="phone">
                                <el-input style="width: 200px;" size="mini" placeholder="请输入电话号码..." prefix-icon="el-icon-phone" v-model="employee.phone"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="工号:" prop="workID">
                            <el-input style="width: 150px;" size="mini" placeholder="工号" v-model="employee.workID" disabled></el-input>
                        </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="最高学历:" prop="tiptopDegree">
                                <el-select v-model="employee.tiptopDegree" placeholder="最高学历" size="mini" style="width: 150px">
                                    <el-option
                                            v-for="item in degrees"
                                            :key="item"
                                            :label="item"
                                            :value="item">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>

                        <el-col :span="6">
                            <el-form-item label="毕业院校:" prop="school">
                                <el-input style="width: 150px;" size="mini" placeholder="毕业院校" prefix-icon="el-icon-edit" v-model="employee.school"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label="专业名称:" prop="specialty">
                                <el-input style="width: 200px;" size="mini" placeholder="请输入电话号码..." prefix-icon="el-icon-edit" v-model="employee.specialty"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="入职日期:" prop="beginDate">
                                <el-date-picker
                                        style="width: 150px;"
                                        v-model="employee.beginDate"
                                        type="date"
                                        size="mini"
                                        value-format="yyyy-MM-dd"
                                        placeholder="请选择入职日期...">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="转正日期:" prop="conversionTime">
                            <el-date-picker
                                    style="width: 150px;"
                                    v-model="employee.conversionTime"
                                    type="date"
                                    size="mini"
                                    value-format="yyyy-MM-dd"
                                    placeholder="请选择转正日期...">
                            </el-date-picker>
                        </el-form-item>
                        </el-col>

                        <el-col :span="6">
                            <el-form-item label="合同起始日期:" prop="beginContract">
                                <el-date-picker
                                        style="width: 130px;"
                                        v-model="employee.beginContract"
                                        type="date"
                                        size="mini"
                                        value-format="yyyy-MM-dd"
                                        placeholder="请选择合同起始日期...">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="合同终止日期:" prop="endContract">
                                <el-date-picker
                                        style="width: 130px;"
                                        v-model="employee.endContract"
                                        type="date"
                                        size="mini"
                                        value-format="yyyy-MM-dd"
                                        placeholder="请选择合同终止日期...">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="身份证号码:" prop="idCard">
                                <el-input style="width: 200px;" size="mini" placeholder="请输入身份证号码..." prefix-icon="el-icon-edit" v-model="employee.idCard"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="聘用形式：" prop="engageForm">
                                <el-radio-group v-model="employee.engageForm">
                                    <el-radio label="劳动合同">劳动合同</el-radio>
                                    <el-radio label="劳务合同">劳务合同</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="婚姻状况：" prop="wedlock">
                                <el-radio-group v-model="employee.wedlock">
                                    <el-radio label="已婚">已婚</el-radio>
                                    <el-radio label="未婚">未婚</el-radio>
                                    <el-radio label="离异">离异</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addEmployee">确 定</el-button>
  </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "EmpBasic",
        data(){
            return {
                keyword: '',
                empsInfo: [],
                loading: false,
                total: 0,
                page: 1,
                size: 10,
                dialogVisible: false,
                PopVisible: false,
                title: '',
                nations: [],
                politics: [],
                jobLevels: [],
                positions: [],
                degrees: [
                    "本科",
                    "大专",
                    "硕士",
                    "博士",
                    "高中",
                    "初中",
                    "小学",
                    "其他"
                ],
                departments: [],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                inputDepName: '',
                employee: {

                    name: "",
                    gender: "",
                    birthday: "",
                    idCard: "",
                    wedlock: "",
                    nationId: 1,
                    nativePlace: "",
                    politicId: 13,
                    email: "",
                    phone: "",
                    address: "",
                    departmentId: null,
                    jobLevelId: null,
                    posId: null,
                    engageForm: "",
                    tiptopDegree: "",
                    specialty: "",
                    school: "",
                    beginDate: "",
                    workState: "",
                    workID: "",
                    contractTerm: null,
                    conversionTime: "",
                    notWorkDate: null,
                    beginContract: "",
                    endContract: "",
                    workAge: null
                },
                rules: {
                    name:[{required:true,message:"请输入员工名",trigger:"blur"}],
                    gender:[{required:true,message:"请选择性别",trigger:"blur"}],
                    birthday:[{required:true,message:"请选择出生日期",trigger:"blur"}],
                    idCard:[{required:true,message:"请输入身份证号码",trigger:"blur"},
                        {pattern:/^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/,
                            message:"身份证号格式错误，请重新输入",trigger:"blur"}],
                    wedlock:[{required:true,message:"请选择婚姻状况",trigger:"blur"}],
                    nationId:[{required:true,message:"请选择民族",trigger:"blur"}],
                    nativePlace:[{required:true,message:"请输入籍贯地址",trigger:"blur"}],
                    politicId:[{required:true,message:"请选择政治面貌",trigger:"blur"}],
                    email:[{required:true,message:"请输入邮箱",trigger:"blur"},
                            {type:'email',message:"邮箱格式错误，请重新输入",trigger:"blur"}],
                    phone:[{required:true,message:"请输入手机号码",trigger:"blur"},
                        {pattern:"^1[3|4|5|7|8][0-9]{9}$",message:"请输入正确的手机号",trigger:"blur"}],
                    address:[{required:true,message:"请输入联系地址",trigger:"blur"}],
                    departmentId:[{required:true,message:"请选择部门",trigger:"blur"}],
                    jobLevelId:[{required:true,message:"请选择职称",trigger:"blur"}],
                    posId:[{required:true,message:"请选择职位",trigger:"blur"}],
                    engageForm:[{required:true,message:"请选择聘用形式",trigger:"blur"}],
                    tiptopDegree:[{required:true,message:"请选择最高学历",trigger:"blur"}],
                    specialty:[{required:true,message:"请输入专业名称",trigger:"blur"}],
                    school:[{required:true,message:"请输入学校名称",trigger:"blur"}],
                    beginDate:[{required:true,message:"请选择入职日期",trigger:"blur"}],
                    workState:[{required:true,message:"请输入员工名",trigger:"blur"}],
                    conversionTime:[{required:true,message:"请选择转正日期",trigger:"blur"}],
                    beginContract:[{required:true,message:"请选择合同起始日期",trigger:"blur"}],
                    endContract:[{required:true,message:"请选择合同截止日期",trigger:"blur"}],
                }
            };
        },
        mounted() {
            this.showEmpsInfo();
        },
        methods:{
            emptyEmp() {
                this.employee = {
                    name: "",
                    gender: "",
                    birthday: "",
                    idCard: "",
                    wedlock: "",
                    nationId: 1,
                    nativePlace: "",
                    politicId: 13,
                    email: "",
                    phone: "",
                    address: "",
                    departmentId: null,
                    jobLevelId: null,
                    posId: null,
                    engageForm: "",
                    tiptopDegree: "",
                    specialty: "",
                    school: "",
                    beginDate: "",
                    workID: "",
                    contractTerm: null,
                    conversionTime: "",
                    notworkDate: null,
                    beginContract: "",
                    endContract: "",
                    workAge: null
                }
                this.inputDepName = '';
            },
            showEditEmpViews(row) {
                this.title = '修改员工信息';
                this.initPositions();
                this.initData();
                this.dialogVisible = true;
                this.employee = row;
                this.inputDepName = row.department.name;
            },
            deleteEmployee(index,row) {
                console.log(index,row);
                this.$confirm('此操作将永久删除员工【'+row.name+'】, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/employee/basic/?id="+row.id).then(resp=>{
                        if (resp) {
                            this.showEmpsInfo();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            getMaxID() {
                this.getRequest("/employee/basic/maxWorkID").then(resp=>{
                    if (resp) {
                        this.employee.workID = resp.obj;
                    }
                })
            },
            addEmployee() {
                if (this.employee.id) {
                    this.$refs['empForm'].validate(valid=>{
                        if (valid) {
                            this.putRequest("/employee/basic/",this.employee).then(resp=>{
                                if (resp) {
                                    this.dialogVisible = false;
                                    this.showEmpsInfo();
                                }
                            })
                        }
                    });
                } else {
                    this.$refs['empForm'].validate(valid=>{
                        if (valid) {
                            this.postRequest("/employee/basic/",this.employee).then(resp=>{
                                if (resp) {
                                    this.dialogVisible = false;
                                    this.showEmpsInfo();
                                }
                            })
                        }
                    });
                }
            },
            handleNodeClick(data) {
                this.inputDepName = data.name;
                this.employee.departmentId = data.id;
                this.PopVisible = !this.PopVisible;

            },
            showDepsView() {
                this.PopVisible = !this.PopVisible;
            },
            initPositions() {
                this.getRequest("/employee/basic/positions").then(resp=>{
                    if (resp) {
                        this.positions = resp;
                    }
                })
            },
            initData() {
                if (!window.sessionStorage.getItem("nations")) {
                    this.getRequest("/employee/basic/nations").then(resp=>{
                        if (resp) {
                            this.nations = resp;
                            window.sessionStorage.setItem("nations", JSON.stringify(resp));
                        }
                    })
                }else {
                    this.nations = JSON.parse(window.sessionStorage.getItem("nations"));
                }
                if (!window.sessionStorage.getItem("politics")) {
                    this.getRequest("/employee/basic/politics").then(resp=>{
                        if (resp) {
                            this.politics = resp;
                            window.sessionStorage.setItem("politics", JSON.stringify(resp));
                        }
                    })
                } else {
                    this.politics = JSON.parse(window.sessionStorage.getItem("politics"));
                }
                if (!window.sessionStorage.getItem("jobLevels")) {
                    this.getRequest("/employee/basic/jobs").then(resp=>{
                        if (resp) {
                            this.jobLevels = resp;
                            window.sessionStorage.setItem("jobLevels", JSON.stringify(resp));
                        }
                    })
                }else {
                    this.jobLevels = JSON.parse(window.sessionStorage.getItem("jobLevels"));
                }
                if (!window.sessionStorage.getItem("departments")) {
                    this.getRequest("/employee/basic/departments").then(resp=>{
                        if (resp) {
                            this.departments = resp;
                            window.sessionStorage.setItem("departments", JSON.stringify(resp));
                        }
                    })
                }else {
                    this.departments = JSON.parse(window.sessionStorage.getItem("departments"));
                }
            },
            showAddEmpView() {
                this.title = '添加员工';
                this.emptyEmp();
                this.getMaxID();
                this.initPositions();
                this.initData();
                this.dialogVisible = true;
            },
            sizeChange(pageSize ) {
                this.size = pageSize;
                this.showEmpsInfo();
            },
            currentChange(currentChange) {
                this.page = currentChange;
                this.showEmpsInfo();
            },
            showEmpsInfo() {
                this.loading = true;
                this.getRequest("/employee/basic/?page="+this.page+"&size="+this.size+"&keyword="+this.keyword).then(resp=>{
                    this.loading = false;
                    if (resp) {
                        this.empsInfo = resp.data;
                        this.total = resp.total;
                    }
                })

            }
        }
    }
</script>

<style scoped>

</style>