## 胡子大哈react小书

一年前弄过一次现在又忘了再重新过一遍，也许会有新收获

jsx语法  
转化过程
JSX -（babel编译）-> javaScript对象 -(reactDOM.render）-> dom元素  --> 插入页面
![Image](http://huzidaha.github.io/static/assets/img/posts/44B5EC06-EAEB-4BA2-B3DC-325703E4BA45.png)

jsx用来描述你的组件长什么样，长得像html但不是html


- 没有 state 的组件叫无状态组件（stateless component）
- 理解函数式组件就是一种只能接受 props 和提供 render 方法的类组件
- 标准做法是最好是后台数据返回的 id 作为列表元素的 key。
- 它高效依赖于所谓的 Virtual-DOM 策略。简单来说，能复用的话 React.js 就会尽量复用，没有必要的话绝对不碰 DOM。

- 组件之间的关系清晰起来。遵循“自顶而下，逐步求精”的原则，我们从组件的顶层开始，再一步步往下构建组件树。