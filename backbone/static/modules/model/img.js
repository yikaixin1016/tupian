// 定义图片模型
define(function (require, exports, module) {
	// 求图片真实的宽度
	var w = ($(window).width() - 6 * 3) / 2;

	// 创建图片模型要创建一个模型类
	var ImageModel = Backbone.Model.extend({
		// 可以定义构造函数
		initialize: function (obj) {
			// 适配模型数据，要为图片模型添加真实的宽高
			// 求h（图片的高度）
			h = w / obj.width * obj.height;
			// 适配模型
			// 添加宽度
			this.attributes.viewWidth = w;
			// 添加高度
			this.attributes.viewHeight = h;
		}
	});


	// 测试创建的图片模型
	// var ImageCollection = Backbone.Collection.extend({
	// 	// 定义模型类
	// 	model: ImageModel
	// });

	// // 添加一个模型
	// var obj = {
	// 	"title": "精彩建筑摄影作品",
	// 	"url": "img/01.jpg",
	// 	"type": 1,
	// 	"width": 640,
	// 	"height": 400
	// }
	// // 实例一个集合
	// var ic = new ImageCollection();
	// ic.add(obj)
	// console.log(ic)

	// 将模型类作为接口暴漏出来
	module.exports = ImageModel;
})