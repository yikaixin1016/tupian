// 图片集合模块
define(function (require, exports, module) {
	// 创建图片的集合，我们需要图片的模型，所以依赖图片模型模块
	var ImageModel = require('imageModel');
	// 创建集合类
	var ImageCollection = Backbone.Collection.extend({
		model: ImageModel,
		imageId: 0,
		// 定义一个拉去数据的方法
		fetchData: function () {
			// 保存集合实例化对象
			var me = this;
			// 发异步请求获取数据并保存在集合中
			$.get('data/imageList.json', function (res) {
				// 如果正确返回了，我们要保存数据
				if (res && res.errno === 0) {
					// 将数据顺序打乱
					res.data.sort(function () {
						return Math.random() > .5 ? 1 : -1;
					})
					// 为每一张图片添加一个id属性，大图页的路由要映射图片的id
					for (var i = 0; i < res.data.length; i++) {
						// 添加id属性
						res.data[i].id = ++me.imageId
					}
					// 保存数据，我们需要集合实例化对象
					me.add(res.data)
					// console.log(ic.toJSON())
				}
			})
		}
	})

	// 测试
	// var ic = new ImageCollection();
	// ic.fetchData()

	// 暴漏接口
	module.exports = ImageCollection;	
})