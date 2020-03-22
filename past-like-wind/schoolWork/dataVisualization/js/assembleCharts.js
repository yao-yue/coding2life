function getArguNameList(data){
	var name=[];
	var len=data.length;
	while(len--){
		name.push(data[len].arguName)
	}
	return name;
}
function getTimeList(data){
	var res=[];
	var len=data[0].data.length;
	while(len--){
		res.push(data[0].data[len].time);
	}
	return res;
}
/*getValueList的参数data是后台返回的data[i].data*/
function getValueList(data){
	var da=[];
	var dataLen=data.length;
	while(dataLen--){
		da.push(parseInt(data[dataLen].value));
	}
	return da;
}
function getValueArguNameList(data){
	var res=[];
	var dataLen=data.length;
	while(dataLen--){
		res.push({value:parseInt(data[dataLen].data[0].value),name:data[dataLen].arguName});
	};
	return res;
}
function getDataSetSource(data){
	var res=[];
	var item=[];
	var len=data[0].data.length;
	item.push('arguName');
	while(len--){
		item.push(data[0].data[len].time)
	}
	res.push(item);
	
	var dataLen=data.length;
	while(dataLen--){
		item=[];
		item.push(data[dataLen].arguName);
		len=data[0].data.length;
		while(len--){
			item.push(parseInt(data[dataLen].data[len].value))
		}
		res.push(item);
	}
	return res;
}
function getSeriesTypeList(data){
	var res=[];
	var len=data[0].data.length;
	while(len--){
		res.push({type:'bar'})
	}
	return res;
}
function getIndexValueList(data){
	var res=[];
	var len=data[0].data.length;
	for(var i =0;i<len;i++){
		res.push([i,parseInt(data[0].data[len-i-1].value)]);
	}
	return res;
}
var backgroundColor="rgba(0,0,0,0)";
function assembleChart(type,data){
	var option;
	if(type==0){
		option={
				backgroundColor:backgroundColor,
				title: {
					text: "",
				},
				toolbox:{
		    	show:true,
		    	feature:{
//		    		/*数据视图*/
//		    		dataView:{
//		    			show:true
//		    		},
//		    		/*还原*/
//		    		restore:{
//		    			show:true
//		    		},
//		    		/*区域缩放 区域缩放还原*/
//		    		dataZoom:{
//		    			show:true
//		    		},
//		    		/*保存为图片*/
//		    		saveAsImage:{
//		    			show:true
//		    		},
//		    		/*动态类型切换*/
//		    		nagicType:{
//		    			type:['line','bar']
//		    		}
		    	}},
				tooltip: {
					trigger: 'axis',
				},
				legend: {
					data: getArguNameList(data)
				},
				calculable: true,
				xAxis: [{
					type: 'category',
					boundaryGap: false,
					data: getTimeList(data)
				}],
				yAxis: [{
					type: 'value',
					axisLabel: {
						formatter: '{value}'
					}
				}],
				series: (function(){
					var res=[];
					var len=data.length;
					while(len--){
						res.push({
						name: data[len].arguName,
						type: 'line',
						data: getValueList(data[len].data),
						markPoint: {
							data: [{
									type: 'max',
									name: '最大值'
								},
								{
									type: 'min',
									name: '最小值'
								}
							]
						},
						markLine: {
							data: [{
								type: 'average',
								name: '平均值'
							}]
						}
					});
					}
					return res;
				})()
			}
	}else if(type==1){
		option={
				backgroundColor:backgroundColor,
				title: {
					x: 'center',
					text: ''
				},
				tooltip: {
					trigger: 'item'
				},
				calculable: true,
				grid: {
					borderWidth: 0,
					y: 80,
					y2: 60
				},
				xAxis: [{
					type: 'category',
					show: false,
					data: getArguNameList(data)
				}],
				yAxis: [{
					type: 'value',
					show: false
				}],
				series: [{
					name: 'xxxx',
					type: 'bar',
					itemStyle: {
						normal: {
							barBorderRadius: [7, 7, 7, 7],
//							color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
//                      offset: 0,
//                      color: 'rgba(0,200,200,0.8)'
//                  }, {
//                      offset: 1,
//                      color: 'rgba(48,170,255,0.5)'
//                  }]),
//                  shadowColor: 'rgba(0, 0, 0, 0.4)',
//                  shadowBlur: 20,
							color: function(params) {
								// build a color map as your need.
								var colorList = [
									'#91C7AE', '#63869E', '#FCCE10', '#E87C25', '#27727B',
									'#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
									'#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'
								];
								return colorList[params.dataIndex]
							},
							label: {
								show: true,
								position: 'top',
								formatter: '{b}\n{c}'
							}
						}
					},
					data: (function(){
						var res=[];
						var len=data.length;
						while(len--){
							res.push(parseInt(data[len].data[0].value))
						}
						return res;
					})()
				}]
			};
	}else if(type==2){
		option={
				backgroundColor:backgroundColor,
				tooltip: {
					trigger: 'axis',
					axisPointer: { // 坐标轴指示器，坐标轴触发有效
						type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
					}
				},
				legend: {
					data: getArguNameList(data)
				},
				calculable: true,
				xAxis: [{
					type: 'value'
				}],
				yAxis: [{
					type: 'category',
					axisTick: {
						show: false
					},
					data: getTimeList(data)
				}],
				series: (function(){
					var res=[];
					var len=data.length;
					while(len--){
						res.push({
						name: data[len].arguName,
						type: 'bar',
						itemStyle: {
							normal: {
								label: {
									show: true,
									position: 'inside',
//									color:'#ffffff'
								}
							}
						},
						data: getValueList(data[len].data)
					});
					}
					return res;
				})()
			};
	}else if(type==3){
		option={
				backgroundColor:backgroundColor,
				title: {
					x: 'center',
					text: data[0].arguName
				},
				tooltip: {
					formatter: "{a} <br/>{b} : {c}%",
				},
				series: [{
					name: data[0].arguName,
					type: 'gauge',
					min:0,
					max:500,
					splitNumber:5,
					center: ["50%", "55%"], //定义整个仪表位置
					detail: {
						fontSize: 30,
						offsetCenter: ['0', '75%'], //定义仪表盘数值位置
						formatter: '{value}',
					},
					data: [{
						value: parseInt(data[0].data[0].value)
					}]
				}]
			}
	}else if(type==4){
		option = {
			backgroundColor:backgroundColor,
		    tooltip : {
		        trigger: 'axis',
		        axisPointer: {
		            type: 'cross',
		            label: {
		                backgroundColor: '#6a7985'
		            }
		        }
		    },
		    legend: {
		        data:getArguNameList(data)
		    },
		    grid: {
		        left: '3%',
		        right: '4%',
		        bottom: '3%',
		        containLabel: true
		    },
		    xAxis : [
		        {
		            type : 'category',
		            boundaryGap : false,
		            data : getTimeList(data)
		        }
		    ],
		    yAxis : [
		        {
		            type : 'value'
		        }
		    ],
		    series : (function(){
					var res=[];
					var len=data.length;
					while(len--){
						res.push({
						name: data[len].arguName,
						type: 'line',
						stack: '总量',
		            	areaStyle: {},
						data: getValueList(data[len].data),
					});
					}
					return res;
				})()
		};
	}else if(type==5){
		
		option = {
			backgroundColor:backgroundColor,
    tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
        orient: 'horizontal',
        left: 'center',
        top:'bottom',
        data: getArguNameList(data)
    },
    series : [
        {
            type: 'pie',
            radius : '55%',
            center: ['50%', '45%'],
            data:getValueArguNameList(data),
//          [
//              {value:335, name:'直接访问'},
//              {value:310, name:'邮件营销'},
//              {value:234, name:'联盟广告'},
//              {value:135, name:'视频广告'},
//              {value:1548, name:'搜索引擎'}
//          ],
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }
    ]
};
	}else if(type==6){
		option = {
			backgroundColor:backgroundColor,
    tooltip: {
        trigger: 'item',
        formatter: "{b}: {c} ({d}%)"
    },
    legend: {
        orient: 'vertical',
        x: 'left',
        data:getArguNameList(data)
    },
    series: [
        {
            type:'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
                normal: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    show: true,
                    textStyle: {
                        fontSize: '30',
                        fontWeight: 'bold'
                    }
                }
            },
            labelLine: {
                normal: {
                    show: false
                }
            },
            data:getValueArguNameList(data)
        }
    ]
};
	}else if(type==7){
		option = {
			backgroundColor:backgroundColor,
    legend: {},
    tooltip: {},
    dataset: {
        source: getDataSetSource(data)
    },
    xAxis: {type: 'category'},
    yAxis: {},
    series: getSeriesTypeList(data)
};
	}else if(type==8){
		option = {
			backgroundColor:backgroundColor,
    tooltip : {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    legend: {
        data: getArguNameList(data)
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis:  {
        type: 'value'
    },
    yAxis: {
        type: 'category',
        data: getTimeList(data)
    },
    series:(function(){
					var res=[];
					var len=data.length;
					while(len--){
						res.push({
						name: data[len].arguName,
						type: 'bar',
						stack: '总量',
						label: {
			                normal: {
			                    show: true,
			                    position: 'insideRight'
			                }
			           	},
						data: getValueList(data[len].data)
					});
					}
					return res;
				})() 
//  [
//      {
//          name: '直接访问',
//          type: 'bar',
//          stack: '总量',
//          label: {
//              normal: {
//                  show: true,
//                  position: 'insideRight'
//              }
//          },
//          data: [320, 302, 301, 334, 390, 330, 320]
//      },
//      {
//          name: '邮件营销',
//          type: 'bar',
//          stack: '总量',
//          label: {
//              normal: {
//                  show: true,
//                  position: 'insideRight'
//              }
//          },
//          data: [120, 132, 101, 134, 90, 230, 210]
//      },
//      {
//          name: '联盟广告',
//          type: 'bar',
//          stack: '总量',
//          label: {
//              normal: {
//                  show: true,
//                  position: 'insideRight'
//              }
//          },
//          data: [220, 182, 191, 234, 290, 330, 310]
//      },
//      {
//          name: '视频广告',
//          type: 'bar',
//          stack: '总量',
//          label: {
//              normal: {
//                  show: true,
//                  position: 'insideRight'
//              }
//          },
//          data: [150, 212, 201, 154, 190, 330, 410]
//      },
//      {
//          name: '搜索引擎',
//          type: 'bar',
//          stack: '总量',
//          label: {
//              normal: {
//                  show: true,
//                  position: 'insideRight'
//              }
//          },
//          data: [820, 832, 901, 934, 1290, 1330, 1320]
//      }
//  ]
};
	}else if(type==9){
		var data9 = getIndexValueList(data);
		console.log(data9);
//		[
//  [1, 4862.4],
//  [2, 5294.7],
//  [3, 5934.5],
//  [4, 7171.0],
//  [5, 8964.4],
//  [6, 10202.2],
//  [7, 11962.5],
//  [8, 14928.3],
//  [9, 16909.2],
//  [10, 18547.9],
//  [11, 21617.8],
//  [12, 26638.1],
//  [13, 34634.4],
//  [14, 46759.4],
//  [15, 58478.1],
//  [16, 67884.6],
//  [17, 74462.6],
//  [18, 79395.7]
//];

// See https://github.com/ecomfe/echarts-stat
var myRegression = ecStat.regression('exponential', data9);

myRegression.points.sort(function(a, b) {
    return a[0] - b[0];
});

option = {
	backgroundColor:backgroundColor,
    title: {
        text: data[0].data[data[0].data.length-1].time + ' - '+data[0].data[0].time+' '+data[0].arguName+' 线性回归分析',
//      subtext: 'By ecStat.regression',
//      sublink: 'https://github.com/ecomfe/echarts-stat',
        left: 'center',
        textStyle:{
        	fontSize:16
        }
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'cross'
        }
    },
    xAxis: {
        type: 'value',
        splitLine: {
            lineStyle: {
                type: 'dashed'
            }
        },
        splitNumber: 10
    },
    yAxis: {
        type: 'value',
        splitLine: {
            lineStyle: {
                type: 'dashed'
            }
        }
    },
    series: [{
        name: 'scatter',
        type: 'scatter',
        label: {
            emphasis: {
                show: true,
                position: 'left',
                textStyle: {
                    color: '#dd6b66',
                    fontSize: 16
                }
            }
        },
        data: data9
    }, {
        name: 'line',
        type: 'line',
        showSymbol: false,
        smooth: true,
        data: myRegression.points,
        markPoint: {
            itemStyle: {
                normal: {
                    color: 'transparent'
                }
            },
            label: {
                normal: {
                    show: true,
                    position: 'left',
                    formatter: myRegression.expression,
                    textStyle: {/*表达式*/
                        color: '#fff',
                        fontSize: 14
                    }
                }
            },
            data: [{
                coord: myRegression.points[myRegression.points.length - 1]
            }]
        }
    }]
};
	}
	
	
	return option;
}
