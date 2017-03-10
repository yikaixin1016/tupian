// 定义app模块
define(function (require, exports, module) {
	// 引入集合
	var ImageCollection = require('imageCollection')
	// 引入视图文件
	var Layer = require('layer');
	var List = require('list');

	// 实例化集合
	var imageCollection = new ImageCollection()

	// 实例化视图类
	// 大图页视图实例化对象
	var layer = new Layer({
		el: $('#app'),
		// 大图页的图片要根据id在集合中获取模型实例化对象，因此要通用同一个集合
		collection: imageCollection
	})
	// 列表页视图实例化对象
	var list = new List({
		// 定义容器元素
		el: $('#app'),
		// 将集合与视图绑定起来
		collection: imageCollection
	})
	

	// 配置路由，分三步
	// 第一步 继承路由类
	var Router = Backbone.Router.extend({
		// 配置路由规则
		routes: {
			// 配置大图页路由
			'layer/:id': 'renderLayer',
			// 配置列表页路由
			'*other': 'renderList'
		},
		// 定义渲染大图页方法
		renderLayer: function (id) {
			// 渲染大图页
			layer.render(id);
			layer.$el.find('.layer').show();
		},
		// 定义渲染列表页方法
		renderList: function () {
			// 隐藏大图页
			layer.$el.find('.layer').hide();
			// 渲染列表页
			// list.render();
			// console.log(111)
		}
	})

	// 第二步 实例化路由
	var router = new Router();

	// 暴漏接口
	module.exports = function () {
		// 第三步 启动路由
		Backbone.history.start();
	}
})