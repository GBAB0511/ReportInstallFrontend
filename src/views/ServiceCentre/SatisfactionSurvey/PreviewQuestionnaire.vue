<template>
  <div class="PreviewQuestionnaire">
    <ul >
      <li v-for="(item,index) in Question" :key="index">
        <div v-if="item.theme==1">
          <h3>
            {{index+1}}、{{item.title}}<sup>*</sup><span>[单选题]</span><span v-if="item.scCusTemplate==1">[必答题]</span>

          </h3>
          <div>
            <el-radio-group v-model="item.optionAnswer">
              <el-radio :label="litem.questionCon" v-for="(litem,lindex) in item.list" :key="lindex">
                {{litem.questionCon}}({{Number(litem.lvalue)}}分)
              </el-radio>
            </el-radio-group>
          </div>
        </div>

        <div v-else-if="item.theme==2">
          <h3>
            {{index+1}}、{{item.title}}<sup>*</sup><span>[单选题]</span><span v-if="item.scCusTemplate==1">[必答题]</span>

          </h3>
          <div>
             <el-radio-group v-model="item.optionAnswer">
              <el-radio :label="litem.questionCon" v-for="(litem,lindex) in item.list" :key="lindex">
                {{litem.questionCon}}({{Number(litem.lvalue)}}分)
              </el-radio>
            </el-radio-group>
          </div>
        </div>

        <div v-else-if="item.theme==3">
          <h3>
            {{index+1}}、{{item.title}}<sup>*</sup><span>[多选题]</span><span v-if="item.scCusTemplate==1">[必答题]</span><span>[至少选择1项]</span>
          </h3>
          <div>
            <el-checkbox-group v-model="item.optionAnswer">
              <el-checkbox v-for="litem in item.list" :key="litem" :label="litem.questionCon">{{litem.questionCon}}{{litem.content}}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>

        <div v-else-if="item.theme==4">
          <h3>
            {{index+1}}、{{item.title}}<sup>*</sup><span>[问答题]</span><span v-if="item.scCusTemplate==1">[必答题]</span>
          </h3>
          <div>
            <el-input v-model="item.optionAnswer" :rows="3" type="textarea"></el-input>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: "PreviewQuestionnaire",
  props:["Question"],
  data() {
    return {
      SingleElection: "",
      checkList:[],
      multiple:'1',
      otherType: "",
      list:{},
    };
  },
  mounted(){

  },
  methods:{
    init(){
      
    }
  },
};
</script>
<style lang="scss">
$theme-color: #297acc;
.PreviewQuestionnaire {
  padding: 10px 15px;
  li {
    padding: 25px 10px;
    border-bottom: 1px solid #f5f5f5;
    &:last-of-type {
      border-bottom: 0px;
    }
    h3 {
      color: $theme-color;
      font-size: 16px;
      height: 30px;
      line-height: 30px;
      margin-bottom: 15px;
      span {
        color: #606266;
        font-size: 14px;
        margin-left: 15px;
      }
      sup {
        color: red;
      }
    }
    .el-checkbox__label,
    .el-radio__label {
      font-size: 14px;
    }
  }
}
</style>
