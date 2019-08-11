<template>
    <div
        class="all"
        v-swipeleft="{fn:changeMonthView,flag:'last'}"
        v-swiperight="{fn:changeMonthView,flag:'next'}"
    >
        <div class="yearMonthDisplay">
            <div class="leftIcon" v-tap="{fn:changeMonthView,flag:'last'}">
                <i></i>
            </div>
            <span>
                {{currentMonth | yearMonthText}}
            </span>
            <div class="rightIcon" v-tap="{fn:changeMonthView,flag:'next'}">
                <i></i>
            </div>
        </div>
        <div class="weekDisplay">
            <div class="weekItem" v-for="item in weekData" :key="item">{{item}}</div>
        </div>
        <div class="daysDisplay">
            <div
                class="dayItem"
                v-for="(item,index) in currentDays"
                :key="item.date.toString()"
                v-tap="{fn:chooseDate,date:item.date}"
                :class="{
                selectedMiddle:item.date>firstSelected && item.date<secondSelected,
                selectedStart:item.date.getTime()===(firstSelected?firstSelected.getTime():null) && ![null,undefined,''].includes(secondSelected),
                selectedEnd:item.date.getTime()===(secondSelected?secondSelected.getTime():null),
                }"
            >
                <span
                    :class="{selected:item.date.getTime()===(firstSelected?firstSelected.getTime():null) || item.date.getTime()===(secondSelected?secondSelected.getTime():null)}"
                >
                  {{item.text}}
                </span>
            </div>
        </div>
    </div>
</template>

<script>
  export default {
    name: "calendar",
    data(){
      return {
        currentMonth:null, //当前视图展示的月份的时间戳
        currentDays:[], //当前视图展示的天数
        firstSelected:null, //单次选中 或 区间的第一次选择
        secondSelected:null, //区间的第二次选择
      }
    },
    props:{
      // 单选single或多选section模式
      mode: {
        type: String,
        default() {
          // return "single"
          return "section"
        }
      },
      // 星期的排序标识
      weekSortMark: {
        type: String,
        default() {
          return this.$t('weekText[0]')
        }
      },
    },
    computed:{
      // 当前语言的星期文字
      weekText: {
        get: function () {
          return this.$t('weekText')
        },
      },

      // 实际展示的星期顺序
      weekData: {
        // getter
        get: function () {
          let _self = this;
          let index = _self.weekText.indexOf(_self.weekSortMark);
          // weekSortMark入参异常时给出警告，把星期天排第一个进行默认渲染
          try {
            if(index < 0){
              index = 0;
              throw new Error("weekSortMark异常，可能未与当前语种匹配")
            }
          }
          catch (e) {
            console.warn(e)
          }
          let arrTemp = [...this.weekText];
          arrTemp = [...arrTemp.slice(index),...arrTemp.slice(0,index)];
          return arrTemp
        },
      }
    },
    filters:{
      // 将时间戳转为对应当前语言的年月格式
      yearMonthText(val){
        let y = val.getFullYear();
        let m = val.getMonth() + 1;
        let res = "";
        switch (window.localStorage.getItem('locale')) {
          case "en-US":
            m = [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
            ][m-1];
            res = m + " " + y;
            break;
          default:
            res = y + "年" + " " + m + "月";
        }
        return res;
      }
    },
    watch:{
      // 生成当前视图的天数数组
      currentMonth:{
        deep:true,
        handler(){
          // 定义当月天数数据
          let arr = [];
          let counter = this.getTargetDays(this.currentMonth);
          // 获取第一天的时间戳
          let firstDay = new Date(JSON.parse(JSON.stringify(this.currentMonth)));
          firstDay.setDate(1);
          // 获取第一天是星期几（0~6）（日~六）
          let firstDayNum = firstDay.getDay();
          let sortFlag = null;
          switch (this.weekData[0]){
            case "日":
              sortFlag = 0;
              break;
            case "一":
              sortFlag = 1;
              break;
            case "二":
              sortFlag = 2;
              break;
            case "三":
              sortFlag = 3;
              break;
            case "四":
              sortFlag = 4;
              break;
            case "五":
              sortFlag = 5;
              break;
            case "六":
              sortFlag = 6;
              break;
          }
          // 计算上月补全天数
          let headPart = null;
          if(sortFlag <= firstDayNum){
            headPart = firstDayNum - sortFlag;
          }else {
            headPart = 7 - (sortFlag - firstDayNum);
          }
          // 填充前个月天数
          let lastTemp = new Date(JSON.parse(JSON.stringify(this.currentMonth)));
          lastTemp.setMonth(this.currentMonth.getMonth()-1);
          let lastTempSum = this.getTargetDays(lastTemp);
          for(let i = headPart; i > 0; i--){
            lastTemp.setDate(lastTempSum-i+1);
            arr.push({
              text:lastTempSum-i+1,
              date:new Date(JSON.parse(JSON.stringify(lastTemp)))
            })
          }

          // 填充当月天数
          let currentTemp = new Date(JSON.parse(JSON.stringify(this.currentMonth)));
          for(let i = 0; i<counter; i++){
            currentTemp.setDate(i+1);
            arr.push({
              text:i+1,
              date:new Date(JSON.parse(JSON.stringify(currentTemp)))
            })
          }

          // 计算下月补全天数
          let tailPart = arr.length % 7 === 0 ? 0 : (7 - (arr.length % 7));
          // 填充下个月天数
          let nextTemp = new Date(JSON.parse(JSON.stringify(this.currentMonth)));
          nextTemp.setMonth(this.currentMonth.getMonth()+1);
          for(let i = 0; i < tailPart; i++){
            nextTemp.setDate(i+1);
            arr.push({
              text:i+1,
              date:new Date(JSON.parse(JSON.stringify(nextTemp)))
            })
          }
          this.currentDays = arr;
        }
      },

      firstSelected:{
        deep:true,
        handler(val){
          this.$emit('firstSelected', val?val.date:null);
        }
      },

      secondSelected:{
        deep:true,
        handler(val){
          this.$emit('secondSelected', val?val.date:null);
        }
      }
    },
    methods:{
      /**
       * 清除选择的日期
       */
      clearSelected(){
        this.firstSelected = null;
        this.secondSelected = null;
      },

      /**
       * 选择日期
       * @param {Object} e 触发方法的对象信息
       * @param {Object} val val.date当前选中的时间戳
       */
      chooseDate(e,val){
        let _self = this;
        switch (_self.mode) {
          case "single":
            _self.firstSelected = val.date;
            break;
          case "section":
            if([null,undefined,""].includes(_self.firstSelected)){
              _self.firstSelected = val.date;
            }else if([null,undefined,""].includes(_self.secondSelected) && _self.firstSelected < val.date){
              _self.secondSelected = val.date;
            }else {
              _self.clearSelected();
            }
            break;
        }
      },

      /**
       * 获取当前时间戳对应月份的天数
       * @param  {String,Date} target 目标的月份，可以为时间戳或可被转为时间戳的字符串
       * @return {Number}  目标月份的天数
       */
        getTargetDays(target = new Date()){
            let currentDate = new Date(target);
            /* 获取当前月份(0~11) */
            let curMonth = currentDate.getMonth();
            // 往后推一个月
            currentDate.setMonth(curMonth + 1);
            currentDate.setDate(0);
            /* 返回当月的天数 */
            return currentDate.getDate()
        },


      /**
       * 改变当前视图的月份
       * @param {Object} e 触发方法的对象信息
       * @param {Object} val val.flag:“next”往后一个月，val.flag:"last"往前一个月
       */
      changeMonthView(e,val){
        let temp = new Date(JSON.parse(JSON.stringify(this.currentMonth)));
        switch (val.flag){
            case "next":
                temp.setMonth(temp.getMonth() + 1);
                this.currentMonth = temp;
                break;
            case "last":
                temp.setMonth(temp.getMonth() - 1);
                this.currentMonth = temp;
                break;
        }
      },

    },
    created(){
      // 获取当前时间
      this.currentMonth = new Date();
    },
    mounted(){

    }
  }
</script>

<style scoped lang="less" src="./calendar.less"></style>