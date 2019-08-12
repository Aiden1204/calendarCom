# c_com_test
使用Vue编写的移动端日历组件

## 安装
```
npm install c_com_test
```

## 引入组件
``` javascript
import cal from 'c_com_test'
Vue.use(cal);
```

## 国际化
组件可根据localStorage中的locale字段自动切换语言。默认中文。  
需要默认语言可在组件use前修改locale字段。
```javascript
if(localStorage.getItem('locale')===""){
  localStorage.setItem("locale","zh-CN");
}
Vue.use(cal);
```
###### 目前支持：
- 中文: zh-CN
- 英语: en-US

## 定制主题
此组件使用Less，只需覆盖内部样式变量即可完成自定义主题。
#### 目前支持：
- @allBg:#F8F8F8; //整体背景色
- @todayColor:#409eff; //今天文字颜色
- @notThisMonthColor:#9B9B9B;//不是当前月的日期颜色
- @selectedColor: #FFFFFF; //选择的日期的文字颜色
- @selectedBg: #5DADFF; //选择日期的背景色
- @selectedAreaBg: #B9D9FA; //选择区间的背景色
#### 定制方法
###### step 1
新建一个calReset.less，名字不重要。  
在此文件中写入
```less
@import '~c_com_test/src/components/calendar.less'; //此组件的安装目录
// Color variables 重写变量值
@allBg: blue!important;
```
###### step 2
全局覆盖main.js
```javascript
import '../public/calReset.less';
```
在其它组件内部局部覆盖
```
<style scoped lang="less" src="./calendar.less"></style>
```

## API
```
      <calendar
              ref="calCom"
              :weekSortMark="weekSortMark"
              :mode="mode"
              @firstSelected="firstSelectedFun"
              @secondSelected="secondSelectedFun"
      ></calendar>
```
#### Props
|  参数   | 说明  | 类型  | 默认值  |
|  ----  | ----  | ----  | ----  |
| mode  | 选择模式，单选single，多选section | String | single |
| weekSortMark  | 星期的排序标识,表示第一个显示星期几，需与选择的语言对应。目前可传"日", "一", "二", "三", "四", "五", "六"。或"Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat" | String | 取当前语言的星期天，中文"日"，英语"Sun" |

#### Events
|  事件名   | 说明  | 回调参数  |
|  ----  | ----  | ----  |
| firstSelected  | 单选模式选择的日期改变。或多选模式选择的起始日期改变。 | 选中的新的日期值，Date类型 |
| secondSelected | 多选模式选择的结束日期改变。 | 选中的新的日期值，Date类型 |

#### Functions
可使用$refs调用的组件内部方法

|  方法名   | 说明  | 参数  | 
|  ----  | ----  | ----  |
| changeMonthView  | 将视图切至指定年月,传入一个带有mark属性的对象，mark的值为"next"、"last"或任意可转为Date的字符串 | {mark:"2019-12-01"} |
###### example
```javascript
      this.$refs.calCom.changeMonthView({
        mark:"2020-12-01"
      })
```
|  方法名   | 说明  | 参数  | 
|  ----  | ----  | ----  |
| chooseDay  | 选中日期。第一个参数为Date对象或可转为Date对象的字符串。第二个参数为指定开始日期或结束日期的标识，可选值"firstSelected"、"secondSelected"，结束日期在单选模式下无效。 | "2019-08-01","firstSelected" |
###### example
```javascript
      this.$refs.calCom.chooseDay("2019-08-03","firstSelected");
      this.$refs.calCom.chooseDay("2019-08-09","secondSelected");
```