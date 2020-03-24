### 部署

---



* NodeJs是基于V8解析引擎并执行的，所以不同于其他后端语言，需要先编译后才能在服务器运行
* NodeJs自身又包含服务器，所以当启动了NodeJs的程序，就会在使用当前机器的公网IP并监听端口运行服务器



#### PM2

* forever(没有pm2好用)

* 保障服务器不会挂掉

* 1. ```npm i -g pm2```
  2. ``` pm2 start ./xxx.js --name projectname```

* 其他命令

  * ```js
    pm2 examples // 查看常用示例
    pm2 [start||restart||stop||delete] all||name||id // 重启 
    pm2 show name||id // 查看信息
    pm2 list // 查看项目
    pm2 flush // 清空日志
    pm2 log name||id // 查看日志
    ```



#### nginx负载均衡

* 配置1:

  * ```python
    upstream localhost {
        ip_hash; # nginx内置的处理
        server localhost:8000 weight=1;
        server localhost:8001 weight=1;
    }
    location / {
    	proxy_pass http://localhost
    }
    ```



#### 查看环境变量

* art-template中有NODE_ENV==="production" 环境变量的配置
* __linux:__ /etc/profile文件中  export 环境变量=值
* 执行坏境变量更新命令  ```source /etc/profile```



#### 注意:视频中没有说明白的点的补充

* ip_hash 是解决通过IP地址来分配不同服务器的，对不同服务器以绑定的方式分解压力。
* 同时又能实现登录后，还访问其他服务器导致登录状态不一的解决方案
* 但是其并不是真正的session共享，真正的共享还是在数据库存储

