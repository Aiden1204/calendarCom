<!--日历组件演示-->
<template>
  <div class="all">
    <div class="displayBlock">
      <calendar
              ref="calCom"
              :weekSortMark="weekSortMark"
              :mode="mode"
              :highLightArr="highLightArr"
              :disableClick="disableClick"
              @firstSelected="firstSelectedFun"
              @secondSelected="secondSelectedFun"
      ></calendar>
    </div>
    <div class="testBlock">
      <div>
        <div>language</div>
        <div>
          <input type="radio" v-model="language" id="chinese" value="zh-CN">中文<br>
          <input type="radio" v-model="language" id="english" value="en-US">English<br>
        </div>
      </div>
      <div>
        <div>weekSortMark</div>
        <div>
          <input type="radio" v-model="weekSortMark" id="日" value="日">日<br>
          <input type="radio" v-model="weekSortMark" id="六" value="六">六<br>
          <input type="radio" v-model="weekSortMark" id="一" value="一">一<br>
          <input type="radio" v-model="weekSortMark" id="二" value="二">二<br>
          <input type="radio" v-model="weekSortMark" id="三" value="三">三<br>
          <input type="radio" v-model="weekSortMark" id="四" value="四">四<br>
          <input type="radio" v-model="weekSortMark" id="Sun" value="Sun">Sun<br>
          <input type="radio" v-model="weekSortMark" id="Sat" value="Sat">Sat<br>
        </div>
      </div>
      <div>
        <div>mode</div>
        <div>
          <input type="radio" v-model="mode" id="single" value="single">single<br>
          <input type="radio" v-model="mode" id="section" value="section">section<br>
        </div>
      </div>
      <div>
        <div>firstSelected</div>
        <div> {{firstSelected}}</div>
      </div>
      <div>
        <div>secondSelected</div>
        <div> {{secondSelected}}</div>
      </div>
      <div>
        <button @click="toSpecialMonth">跳转2020年12月</button>
      </div>
      <div>
        <button @click="selectedOne">选择8月1日</button>
      </div>
      <div>
        <button @click="selectedSection">选择8月3日~8月9日（限section模式）</button>
      </div>
      <div>
        <button @click="setHighLight">设置8月1日~8月3日高亮</button>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <button @click="clearHighLight">清除</button>
      </div>
      <div>
        <button @click="setDisabled">禁止选择8月25日~8月29日</button>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <button @click="clearDisabled">清除</button>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

import calendar from '@/components/calendar.vue'
import './calReset.less';

export default {
  name: 'home',
  components: {
    calendar
  },
  data(){
    return {
      language:localStorage.getItem('locale'),
      weekSortMark:"日",
      mode:"section",
      firstSelected:null,
      secondSelected:null,
      highLightArr:[],
      disableClick:[],
    }
  },
  methods:{
    firstSelectedFun(val){
      this.firstSelected = val
    },
    secondSelectedFun(val){
      this.secondSelected = val
    },
    toSpecialMonth(){
      this.$refs.calCom.changeMonthView({
        mark:"2020-12-01"
      })
    },
    selectedOne(){
      this.$refs.calCom.chooseDay("2019-08-01","firstSelected");
    },
    selectedSection(){
      this.$refs.calCom.chooseDay("2019-08-03","firstSelected");
      this.$refs.calCom.chooseDay("2019-08-09","secondSelected");
    },
    setHighLight(){
      this.highLightArr=[
        "2019-08-01",
        "2019-08-02",
        "2019-08-03",
      ]
    },
    clearHighLight(){
      this.highLightArr=[]
    },
    setDisabled(){
      this.disableClick=[
        "2019-08-25",
        "2019-08-26",
        "2019-08-27",
        "2019-08-28",
        "2019-08-29",
      ]
    },
    clearDisabled(){
      this.disableClick=[]
    }
  },
  watch:{
    language(val){
      localStorage.setItem("locale",val);
      location.reload()
    }
  }
}
</script>
<style scoped lang="less">
  .all {
    .displayBlock {
      position: sticky;
      top: 0;
    }
    .testBlock {
      margin-top: 20px;
      input {
        margin: 5px 0;
      }
      button {
        margin: 5px 0;
      }
      >div {
        display: flex;
        align-items: center;
        justify-content: left;
        border-bottom: 1px solid black;
        padding: 5px 0;
        >div {
          width: 200px;
        }
      }
    }
  }
</style>
