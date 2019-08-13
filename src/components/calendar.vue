<template>
    <div
        class="all"
        v-swipeleft="{fn:changeMonthView,mark:'last'}"
        v-swiperight="{fn:changeMonthView,mark:'next'}"
    >
        <div class="yearMonthDisplay">
            <div class="leftIcon" v-tap="{fn:changeMonthView,mark:'last'}">
                <i></i>
            </div>
            <span>
                {{currentMonth | yearMonthText}}
            </span>
            <div class="rightIcon" v-tap="{fn:changeMonthView,mark:'next'}">
                <i></i>
            </div>
        </div>
        <div class="weekDisplay">
            <div class="weekItem" v-for="item in weekData" :key="item">{{item}}</div>
        </div>

        <div class="animationBlock" :style="{height:40*lineCount+'px'}">
            <transition :name="animationMark" >
                <div class="daysDisplay"  :key="''+currentMonth.getMonth()">
                    <div
                            class="dayItem"
                            v-for="item in currentDays"
                            :key="''+currentMonth.getMonth()+item.date.toString()"
                            v-tap="{fn:chooseDate,date:item.date}"
                            :class="{
                selectedMiddle:item.date>firstSelected && item.date<secondSelected,
                selectedStart:(''+item.date.getFullYear()+item.date.getMonth()+item.date.getDate())===(firstSelected?(''+firstSelected.getFullYear()+firstSelected.getMonth()+firstSelected.getDate()):null) && ![null,undefined,''].includes(secondSelected),
                selectedEnd:(''+item.date.getFullYear()+item.date.getMonth()+item.date.getDate())===(secondSelected?(''+secondSelected.getFullYear()+secondSelected.getMonth()+secondSelected.getDate()):null),
                }"
                    >
                        <span
                                :class="{
                            notThisMonth:item.date.getMonth() !== currentMonth.getMonth(),
                            today:(''+item.date.getFullYear()+item.date.getMonth()+item.date.getDate())===(''+new Date().getFullYear()+new Date().getMonth()+new Date().getDate()),
                            highLight:(highLightArr.map(dateArrTrans).includes(''+item.date.getFullYear()+item.date.getMonth()+item.date.getDate())),
                            selected:(''+item.date.getFullYear()+item.date.getMonth()+item.date.getDate())===(firstSelected?(''+firstSelected.getFullYear()+firstSelected.getMonth()+firstSelected.getDate()):null) || (''+item.date.getFullYear()+item.date.getMonth()+item.date.getDate())===(secondSelected?(''+secondSelected.getFullYear()+secondSelected.getMonth()+secondSelected.getDate()):null),
                            disableClickStyle:(disableClick.map(dateArrTrans).includes(''+item.date.getFullYear()+item.date.getMonth()+item.date.getDate()))
                            }"
                        >
                          {{item.text}}
                        </span>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>

<script>
  export default {
    name: "calendar",
    data(){
      return {
        lineCount:0, //动态计算组件行数，用来计算高度
        animationMark:"", //动画效果
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
          return "single"
          // return "section"
        }
      },

      // 星期的排序标识
      weekSortMark: {
        type: String,
        default() {
          return this.$t('weekText[0]')
        }
      },

      // 高亮的日期
      highLightArr: {
        type: Array,
        default() {
          return []
        }
      },

      // 不可点击的日期
      disableClick: {
        type: Array,
        default() {
          return []
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
            // eslint-disable-next-line no-console
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
      // 排序变化时重新计算视图
      weekSortMark(){
        this.clearSelected();
        this.changeMonthView({
          mark:new Date()
        });
      },

      // 切换选择模式时清空原来的选项
      mode(){
        this.clearSelected();
      },

      // 生成当前视图的天数数组
      currentMonth:{
        deep:true,
        handler(){
          // 定义当月天数数据
          let arr = [];
          let counter = this.getTargetDays(this.currentMonth);
          // 获取第一天的时间戳
          let firstDay =this.transDate(this.currentMonth);
          firstDay.setDate(1);
          // 获取第一天是星期几（0~6）（日~六）
          let firstDayNum = firstDay.getDay();
          let sortFlag = null;
          switch (this.weekData[0]){
            // case "日":
            // case "Sun":
            case this.$t('weekText[0]'):
              sortFlag = 0;
              break;
            // case "一":
            // case "Mon":
            case this.$t('weekText[1]'):
              sortFlag = 1;
              break;
            // case "二":
            // case "Tues":
            case this.$t('weekText[2]'):
              sortFlag = 2;
              break;
            // case "三":
            // case "Wed":
            case this.$t('weekText[3]'):
              sortFlag = 3;
              break;
            // case "四":
            // case "Thur":
            case this.$t('weekText[4]'):
              sortFlag = 4;
              break;
            // case "五":
            // case "Fri":
            case this.$t('weekText[5]'):
              sortFlag = 5;
              break;
            // case "六":
            // case "Sat":
            case this.$t('weekText[6]'):
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
          let lastTemp = this.transDate(this.currentMonth);
          lastTemp.setMonth(this.currentMonth.getMonth()-1);
          let lastTempSum = this.getTargetDays(lastTemp);
          for(let i = headPart; i > 0; i--){
            lastTemp.setDate(lastTempSum-i+1);
            arr.push({
              text:lastTempSum-i+1,
              date:this.transDate(lastTemp)
            })
          }

          // 填充当月天数
          let currentTemp = this.transDate(this.currentMonth);
          for(let i = 0; i<counter; i++){
            currentTemp.setDate(i+1);
            arr.push({
              text:i+1,
              date:this.transDate(currentTemp)
            })
          }

          // 计算下月补全天数
          let tailPart = arr.length % 7 === 0 ? 0 : (7 - (arr.length % 7));
          // 填充下个月天数
          let nextTemp = this.transDate(this.currentMonth);
          nextTemp.setMonth(this.currentMonth.getMonth()+1);
          for(let i = 0; i < tailPart; i++){
            nextTemp.setDate(i+1);
            arr.push({
              text:i+1,
              date:this.transDate(nextTemp)
            })
          }
          this.lineCount = arr.length / 7;
          this.currentDays = arr;
        }
      },

      firstSelected:{
        deep:true,
        handler(val){
          this.$emit('firstSelected', val?val:null);
        }
      },

      secondSelected:{
        deep:true,
        handler(val){
          this.$emit('secondSelected', val?val:null);
        }
      }
    },
    methods:{
      /**
       * 转换为时间对象并返回一个深拷贝的时间对象
       * @param {Object,String} date 时间对象或可以转化为实践对象的字符串
       * @return {Date}
       */
      transDate(date){
        let userAgent = navigator.userAgent;
        if([null,undefined,""].includes(date)){
          return new Date()
        }
        if(Object.prototype.toString.call(date).slice(8,-1) === "Date"){
          return new Date(JSON.parse(JSON.stringify(date)));
        }
        if(Object.prototype.toString.call(date).slice(8,-1) === "String"){
          // Safari不支持YYYY-MM-DD的格式，需要进行转换
          if(userAgent.indexOf("Safari") > -1){
            return new Date(JSON.parse(JSON.stringify(date)).replace(/-/g, "/"));
          } else {
            return new Date(JSON.parse(JSON.stringify(date)));
          }
        }
        return new Date();
      },

      /**
       * 将时间对象转为字符串YYYYMMDD
       * @param {Date} date
       * @return {String}
       */
      dateArrTrans(date){
        let res = this.transDate(date);
        res = ''+res.getFullYear()+res.getMonth()+res.getDate();
        return res;
      },

      /**
       * 设置第一个或第二个日期
       * @param {Object,String} date 时间对象或可以转化为实践对象的字符串
       * @param {String}        mark firstSelected,secondSelected
       */
      chooseDay(date,mark){
        let temp = this.transDate(date);
        if(this.disableClick.map(this.dateArrTrans).includes(''+temp.getFullYear()+temp.getMonth()+temp.getDate())){
          return
        }
        switch (mark){
          case "firstSelected":
            this.firstSelected = temp;
            break;
          case "secondSelected":
            if(this.mode === "single"){
              return
            }
            this.secondSelected = temp;
            break;
        }
      },

      /**
       * 清除选择的日期
       */
      clearSelected(){
        this.firstSelected = null;
        this.secondSelected = null;
      },

      /**
       * 点击选择日期
       * @param {Object} val val.date当前选中的时间戳
       * @param {Object} e 触发方法的对象信息
       */
      // eslint-disable-next-line no-unused-vars
      chooseDate(val,e={}){
        let _self = this;
        if(this.disableClick.map(this.dateArrTrans).includes(''+val.date.getFullYear()+val.date.getMonth()+val.date.getDate())){
          return
        }
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
            let currentDate = this.transDate(target);
            /* 获取当前月份(0~11) */
            let curMonth = currentDate.getMonth();
            // 往后推一个月
            currentDate.setMonth(curMonth + 1);
            currentDate.setDate(0);
            /* 返回当月的天数 */
            return currentDate.getDate()
        },


      /**
       * 改变当前视图的月份,会匹配对应的动画效果
       * @param {Object} val val.mark:“next”往后一个月，val.mark:"last"往前一个月,val.mark也可以为时间戳或可转为时间戳的字符串
       * @param {Object} e 触发方法的对象信息
       */
      // eslint-disable-next-line no-unused-vars
      changeMonthView(val={mark:new Date()},e={}){
        let temp = this.transDate(this.currentMonth);
        switch (val.mark){
          case "next":
            this.animationMark = "turn-left";
            temp.setMonth(temp.getMonth() + 1);
            this.currentMonth = temp;
            break;
          case "last":
            this.animationMark = "turn-right";
            temp.setMonth(temp.getMonth() - 1);
            this.currentMonth = temp;
            break;
          default:
            if(this.transDate(val.mark) > temp){
              this.animationMark = "turn-left";
            } else if(this.transDate(val.mark) < temp){
              this.animationMark = "turn-right";
            } else {
              this.animationMark = "";
            }
            this.currentMonth = this.transDate(val.mark);
        }
      },

    },
    created(){
      // 获取并跳转当前年月
      this.changeMonthView({
        mark:new Date()
      });
    },
    mounted(){

    }
  }
</script>

<style scoped lang="less" src="./calendar.less"></style>