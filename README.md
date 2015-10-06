# express-blog
blog backed by express

这是我个人练习所写的项目，后端express+MySQL，前端gulp+less+ejs+原生js。

包依赖查阅package.json或Gulpfile的require部分。

express的模板默认存在根目录的views文件夹里，我删除了这个文件夹，改用gulp将之挪至public/views/。

开发工作区在/dev/里，有images、scripts、less和templates四个文件夹，测试时命令行运行gulp，自动生成public文件夹。

测试服务器是express自带的服务器，所以测试时要运行的命令是"gulp & DEBUG=* npm start"。

That's all.
