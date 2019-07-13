<template>
  <el-dialog :title="dynamicValidateForm.title" :visible.sync="dynamicValidateForm.visible" :close-on-click-modal="false" >
    <el-form
      :model="dynamicValidateForm"
      ref="dynamicValidateForm"
      label-width="120px"
      class="demo-dynamic"
    >
      <template v-for="(dynamicInput,indexs) in dynamicValidateForm.dynamicInputs">
        <el-divider :key="'_'+indexs">{{indexs+1}}</el-divider>
        <el-form-item
          v-for="(dynamicInputItem, index) in dynamicInput"
          :label="dynamicInputItem.label"
          :key="indexs+'_'+index"
          :prop="'dynamicInputs.' + indexs + '.' + index + '.value'"
          :rules="{
        required: true, message: '不能为空', trigger: 'blur'
      }"
        >
          <el-input v-model="dynamicInputItem.value"></el-input>
        </el-form-item>
        <el-button
          type="danger"
          round
          class="deleteBTN"
          @click.prevent="removeDynamicInputs(dynamicInput)"
          :key="'__'+indexs"
          v-show="indexs!==0"
        >删除</el-button>
      </template>

      <el-divider></el-divider>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="hideForm">取 消</el-button>
      <el-button @click="addDynamicInputs">新增一项</el-button>
      <el-button @click="resetForm('dynamicValidateForm')">重置</el-button>
      <el-button type="primary" @click="submitForm('dynamicValidateForm')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "MulForm",

  props: {
    prop_dynamicValidateForm: Object,
    // 对象或数组默认值必须从一个工厂函数获取
    default: function() {
      return {
        visible: false,
        title: "你好",
        addTemp:[{
              label: "QQ号",
              value: ""
            },],
        dynamicInputs: [
          [
            {
              label: "QQ号",
              value: ""
            },
            {
              label: "网络图片路径",
              value: ".jpg"
            },
            {
              label: "打开QQ的链接",
              value: "http://test"
            }
          ]
        ]
      };
    }
  },
  data() {
    return {
      dynamicValidateForm: this.prop_dynamicValidateForm
    };
  },
  created() {
    console.log(this.dynamicValidateForm);
  },
  methods: {
    hideForm() {
      this.$emit("child-event-fn-dynamicValidateForm-hide");
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$emit(
            "child-event-fn-dynamicValidateForm-dynamicInputs",
            this.dynamicValidateForm.dynamicInputs
          );
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    removeDynamicInputs(item) {
      var index = this.dynamicValidateForm.dynamicInputs.indexOf(item);
      if (index !== -1) {
        this.dynamicValidateForm.dynamicInputs.splice(index, 1);
      }
    },
    addDynamicInputs() {
      this.dynamicValidateForm.dynamicInputs.push(this.dynamicValidateForm.addTemp);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.demo-dynamic {
  margin-right: 10px;

  vertical-align: top;
}
.deleteBTN {
  width: 50%;
}
</style>
