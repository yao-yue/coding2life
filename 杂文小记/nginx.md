## nginx
> [优秀参考文章](https://juejin.im/post/5c85a64d6fb9a04a0e2e038c)

### nginx 反向代理  
正向代理： VPN，能够根据正向代理访问到客户端无法访问到的服务器资源。正向代理是为客户端服务的。
反向代理： 反向代理是为服务端提供服务的。客户端不知道到底是哪一台服务器在给他提供服务，就像一个迎宾小姐，可以帮助服务器接收来自客户端的请求，帮助服务器做请求转发，负载均衡，请求过滤之类


### 请求过滤
状态码过滤   
URL名称过滤  根据url名称过滤，精确匹配URL，不匹配的全部重定向到主页
请求类型过滤

### 配置gzip压缩
启用gzip同时需要客户端和服务端的支持，如果客户端支持gzip的解析，那么只要服务端能够返回gzip的文件就可以启用gzip了,我们可以通过nginx的配置来让服务端支持gzip

### nginx 负载均衡
```
upstream balanceServer {
    least_conn;   //最小连接数策略，优先分配给压力小的服务器
    fair;         //最快响应时间分配方案
    ip_hash;      //来自同一个ip的请求永远只分配一台服务器，有效解决动态网页种的session共享问题
    server ip:port;
    server ip:port;
    server ip:port;
    server ip:port;
}
 server {
        server_name  fe.server.com;
        listen 80;
        location /api {
            proxy_pass http://balanceServer; //在upstream上配置
        }
    }
```