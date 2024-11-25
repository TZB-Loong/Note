## eachrt 环形图 图例分页 标题,值在环形图中间显示

### 完整代码

```vue
<template>
  <div class="water-eval-container" id="cityGreenLand-charts" ref="chart"></div>
</template>
<script lang="ts" setup>
import echarts from '@/plugins/echarts/echarts'
import {  onMounted} from 'vue'

const getPie = () => {
  let option = {
    legend: {
      icon: 'circle',
      orient: 'horizontal',
      width: '85%',
      itemWidth: 8,
      itemHeight: 8,
      itemGap: 18,
      type: 'scroll', //分页类型
      y: 'center',
      textStyle: {
        color: '#999',
      },
      pageIconSize: 12, //这当然就是按钮的大小
      align: 'left',
      top: '84%',
    },
    series: [
      {
        name: '',
        type: 'pie',
        radius: ['50%', '60%'],
        center: ['50%', '45%'],
        avoidLabelOverlap: true,
        label: {
          show: false,
        },
        emphasis: {
          label: {
            show: true,
            formatter: `{a|{b}} \n \n {b|{d}%}`,
            rich: {
              a: {
                fontSize: 14,
                with: 80,
                color: '#B1B6C6',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              },
              b: {
                fontSize: 24,
                color: '#3D3D3D',
                fontWeight: 'bold',
              },
            },
          },
        },
        labelLine: {
          show: false,
        },
        data: [{name:'123',value:99},{name:'1234',value:19}],
        color: ['#D8614C', '#2569D8', '#1492E3', '#62D99D', '#EDB728', '#EDB728', '#D8614C'],
      },
    ],
  }

  return option
}

const init = () => {
  let myChart = echarts.init(chart.value)
  chartOption.value = getPie()
  myChart.setOption(chartOption.value)
  myChart.dispatchAction({ type: 'highlight', seriesIndex: 0, dataIndex: 0 })
  let index = 0
  myChart.on('mouseover', function (e) {
    if (e.dataIndex !== index) {
      myChart.dispatchAction({ type: 'downplay', seriesIndex: 0, dataIndex: index })
    }
  })
  myChart.on('mouseout', function (e) {
    index = e.dataIndex
    myChart.dispatchAction({ type: 'highlight', seriesIndex: 0, dataIndex: e.dataIndex })
  })
}

onMounted(() => {
  init()
})
```
