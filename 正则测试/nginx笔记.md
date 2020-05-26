1.  启动  停止 重载  

进入sbin 
>   ./nginx 
    ./nginx -s stop 
    ./nginx -s reload

2. **配置目录  conf**
三部分
- 全局（整体运行配置work_process）、
- event 配置用户与网络链接部分
- http   http\server


3. 开放端口
firewall-cmd --add-port=80/tcp --permanent
firewall-cmd --reload
查看已经开放的端口号
firewall-cmd --list-all


4. 开启tomcat
bin 目录   ./startup.sh


5. windows host文件中配置域名映射ip


6. 反向代理
server {
    lsiten  80;
    server_name 182.92.184.154；     也即监听外部请求的地址： 即在浏览器中访问的地址182.92.184.154：80 
                                                            会转发到location 中代理的地址

    location / {
        proxy_pass http://127.0.0.1:8080;   转发的地址
    }
}

7. 找进程杀进程
ps -ef | grep tomcat
kill -9 2982

8. 简单反向代理配置案例
server {
    listen 9001;
    servername 192.168.17.129;

    location ~ /edu/ {
        proxy_pass http://127.0.0.1:8080;
    }
    location ~ /vod/ {
        proxy_pass http://127.0.0.1:8001;
    }
}
不要忘记开放端口号

9. location 一些配置的说明
location [ = | ~ | ~* | ^~] uri {  
}
= 用于不含正则表达式的uri前，要求请求字符串与uri严格匹配
~ 用于表示包含，区分大小写  ~*不区分

如果uri包含正则表达式，则必须要有~或~*标识

10. nginx 负载均衡
访问一个地址，可以随机到多个服务器中处理。把请求代理到不同的服务器去服务

11. 动静分离简单来说就是把动态请求和静态请求分开，可以理解为nginx处理静态页面，Tomcat处理动态页面。
- 一种是纯粹把静态文件独立成单独的域名，放在独立的服务器上，也是目前主流推崇的方案，另一种方法是动态和静态文件混合在一起，通过nginx来分开。
- 通过location指定不同的后缀名实现不同的请求转发，通过expires参数设置，可以使浏览器缓存过时间，减少与服务器之间的请求和流量。资源在此时间内无需去服务端验证。

12. 静态资源配置
```
//根目录 root/www | image
location /www/ {
    root /data/;
    index index.html index.htm;
}

location /image/ {
    root /data/;
    autoindex on;  #列出当前文件夹中的内容
}
```

13. 高可用
nginx宕机了 服务还能维持
两个nginx，一个主代理一个是备份。主从模式。虚拟ip。
在两台服务器上安装keeplived 

14. nginx的原理 
master&worker
worker争抢client.
一个master和多个worker有什么好处
可以使用nginx -s reload热部署
每个worker是一个独立的进程

- 设置多少个workder才是合适的。和服务器的cpu数量相等
连接数。
**问题1： 发送一个请求，占用worker的几个连接数？**
2个或4个

**问题二： nginx有一个master，有四个worker,每个worker支持的最大连接数1024，支持的最大并发数是多少？**
> 普通的静态访问最大并发数是：worker_connection * worker_processes /2
> 如果是HTTP作为反向代理，那么就是  / 4

