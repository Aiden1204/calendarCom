<template>
    <div class="all">
        <div class="yearMonthDisplay">
            <div class="leftIcon" @click.stop="changeMonthView('last')">
                <i></i>
            </div>
            <span>
                {{currentMonth | yearMonthText}}
            </span>
            <div class="rightIcon" @click.stop="changeMonthView('next')">
                <i></i>
            </div>
        </div>
        <div class="weekDisplay">
            <div class="weekItem" v-for="item in weekData" :key="item">{{item}}</div>
        </div>
        <div class="daysDisplay">
            <div class="dayItem" v-for="(item,index) in currentDays" :key="index">
                <span>{{item}}</span>
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
      }
    },
    props:{
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
      // 当前视图的天数数组
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
          for(let i = 0; i < headPart; i++){
            arr.push("")
          }
          // 填充当月天数
          for(let i = 0; i<counter; i++){
            arr.push(i+1)
          }
          // 计算下月补全天数
          let tailPart = arr.length % 7 === 0 ? 0 : (7 - (arr.length % 7));
          // 填充下个月天数
          for(let i = 0; i < tailPart; i++){
            arr.push("")
          }
          this.currentDays = arr;
        }
      }
    },
    methods:{
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
       * @param {String} flag “next”往后一个月，"last"往前一个月
       */
      changeMonthView(flag){
        let temp = new Date(JSON.parse(JSON.stringify(this.currentMonth)))
        switch (flag){
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

<style scoped lang="less">
    .all {
        width: 100vw;
        background-color: #cccccc;
        .yearMonthDisplay {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .leftIcon {
                width: 10vw;
                height: 10vw;
                background-color: palegreen;
                display: flex;
                justify-content: center;
                align-items: center;
                padding-left: 5px;
                i {
                    display: block;
                    box-sizing: border-box;
                    width: 10px;
                    height: 10px;
                    border-top: 1px solid black;
                    border-left: 1px solid black;
                    transform: rotate(-0.125turn);
                }
            }
            .rightIcon {
                width: 10vw;
                height: 10vw;
                background-color: palegreen;
                display: flex;
                justify-content: center;
                align-items: center;
                padding-right: 5px;
                i {
                    display: block;
                    box-sizing: border-box;
                    width: 10px;
                    height: 10px;
                    border-top: 1px solid black;
                    border-right: 1px solid black;
                    transform: rotate(0.125turn);
                }
            }
        }
        .weekDisplay {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .weekItem{
                width: 100/7vw;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }
        .daysDisplay {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap:wrap;
            .dayItem {
                width: 100/7vw;
                display: flex;
                align-items: center;
                justify-content: center;
                >span {
                    text-align: center;
                    display: inline-block;
                    width: 20px;
                    height: 20px;
                    background-color: red;
                }
            }
        }
    }
</style>