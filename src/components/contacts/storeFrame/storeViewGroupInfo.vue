<template>
    <div>
        <el-form
            class="department-info-form"
            label-position="right"
            :rules="rules"
            :model="departInfo"
            ref="departForm"
            label-width="120px">
            <el-form-item label="部门名称" prop="name">
                <el-input v-model="departInfo.name"></el-input>
            </el-form-item>
            <el-form-item label="部门排序调整" prop="parentId">
                <el-input :disabled="disabled" v-model="departInfo.parentName" @focus="callGroupSelector" suffix-icon="el-icon-arrow-down"></el-input>
            </el-form-item>
        </el-form>
        <vue-select-employee ref="parentSelector" :treeSet="treeSet" @handleSelectedList="handleSelectedList" :treeData="treeData"></vue-select-employee>
    </div>
</template>
<script>
import vueSelectEmployee from "components/common/vueSelectEmployee";
export default {
    name: "store-view-group-info",
    components: {
        vueSelectEmployee
    },
    data() {
        return {
            rules: {
                name: [
                    { required: true, message: '请输入部门名称', trigger: 'blur' },
                    { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
                ],
                parentId: [
                    { required: true, message: '请选择父级部门', trigger: 'change' }
                ]
            },
            disabled: true,
            treeSet: {
                isSelectPerson: false,
                dialogVisible: false,
                isSingle: true // 是否单选
            },
            departInfo: {
                name: "",
                parentName: "",
                parentId: ""
            },
            treeData: {}
        } 
    },
    methods: {
        handleSelectedList() {
            console.log(group);
            this.departInfo.parentId = group ? group.id : "";
            this.departInfo.parentName = group ? group.label : "";
        },
        callGroupSelector() {
            this.treeSet.dialogVisible = true;
        }
    },
    watch: {
        treeData() {
            this.disabled = false;
        }
    }
}
</script>
