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

- 类似于 <input />、<select />、<textarea> 这些元素的 value 值被 React.js 所控制、渲染的组件，在 React.js 当中被称为受控组件（Controlled Component）

- 子组件给父组件通信  
    父组件给子组件传递一个函数，子组件调用这个函数把数据传递给父组件

- 如果把 comments 交给父组件 CommentApp ，那么 CommentList 和 CommentList2 都可以通过 props 获取到 comments，React.js 把这种行为叫做“状态提升”。某个状态被多个组件依赖或者影响的时候，就把该状态提升到这些组件的最近公共父组件中去管理，用 props 传递数据或者函数来管理这种依赖或着影响的行为。
- 如何更好的管理这种被多个组件所依赖或影响的状态？rudux
- React.js 将组件渲染，并且构造 DOM 元素然后塞入页面的过程称为组件的挂载（这个定义请好好记住

- 初始化工作放在constructor里面去做，异步放在willmount上做，清理放在willunmount上做
挂载阶段的组件生命周期 和更新阶段的组件生命周期
还有虚拟dom算法
- React.js 当中提供了 ref 属性来帮助我们获取已经挂载的元素的 DOM 节点
- props.children  嵌套的结构在组件内部都可以通过 props.children 获取到
- 帮助我们验证 props 的参数类型 propTypes
- 组件命名方法
组件的私有方法都用 _ 开头，所有事件监听的方法都用 handle 开头。把事件监听方法传给组件的时候，属性名用 on 开头

- redux
- 给 createStore 传入初始的数据 appState，和一个描述数据变化的函数 stateChanger，然后生成一个 store

- 一个函数的返回结果只依赖于它的参数，并且在执行过程里面没有副作用，我们就把这个函数叫做**纯函数**,产生了副作用，因为它修改了外部传进来的对象，现在它是不纯的。
- 纯函数很严格，也就是说你几乎除了计算数据以外什么都不能干