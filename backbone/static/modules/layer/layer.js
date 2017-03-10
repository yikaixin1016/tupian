// 创建layer视图
define(function (require, exports, module) {
	// 引入样式文件
	require('modules/layer/layer.css')
	// 获取窗口的高度
	var h = $(window).height();
	// 通过视图模块，创建大图页视图
	var Layer = Backbone.View.extend({
		// 当前图片的id
		imageId: 0,
		// 定义容器，存储每一个显示图片的id
		imageList: [],
		events: {
			// 给图片绑定点击事件
			'tap .layer-container img': 'toggleTitle',
			// 给图片绑定滑动事件
			// 向左滑，显示后一张图片
			'swipeLeft .layer-container img': 'showNextImage',
			// 向右滑，显示前一张图片
			'swipeRight .layer-container img': 'showPreImage',
			// 点击返回按钮
			'tap .layer .go-back': 'goBack'
		},
		// 定义模板
		tpl: _.template($('#tpl_layer').html()),
		// 渲染视图方法
		render: function (modelId) {
			// 获取数据
			var model = this.collection.get(modelId)
			// 如果模型不存在，我们要跳转到列表页
			if (!model) {
				// 跳转
				location.href = '';
				return ;
			}
			// 如果模型存在，我们要存储id
			this.imageId = model.get('id');
			// 缓存这张图片的id
			this.imageList.push(this.imageId);
			// 定义数据
			var data = {
				url: model.get('url'),
				title: model.get('title'),
				style: 'line-height: ' + h + 'px;'
			}
			// 获取模板
			var tpl = this.tpl;
			// 格式化模板
			var html = tpl(data)
			// 渲染视图
			this.$el.find('.layer').html(html)
		},
		/**
		 * 返回逻辑
		 **/
		goBack: function () {
			// location.href=""
			// history.go(-1)
			// Backbone.history.location.replace('')
			// 获取图片id容器中最前面的一张图片
			// 从历史记录中删除这张图片
			this.imageList.pop();
		
			// 如果imageList存在，我们就渲染
			if (this.imageList.length) {
				// 获取显示图片的id
				var id = this.imageList[this.imageList.length - 1];
				// 根据id获取模型
				var model = this.collection.get(id);
				this.updateView(model);
			} else {
				// 返回列表页
				this.$el.find('.layer').hide();
			}

		},
		/**
		 * 切换图片的显隐
		 **/
		toggleTitle: function () {
			// 切换header 的hide类
			this.$el.find('.layer .header').toggleClass('hide')
		},
		/**
		 * 显示后一张图片
		 **/
		showNextImage: function () {
			// 根据当前图片的id，获取下一张图片的id
			this.imageId++;
			// 根据id获取模型
			var model = this.collection.get(this.imageId);
			// 如果获取不到模型说明是最后一张了，提示
			if (!model) {
				alert('已经是最后一张了！');
				// 并且将imageId重置成当前id
				this.imageId--;
			} else {
				// 更新页面
				this.updateView(model)
				// 缓存图片的id
				this.imageList.push(this.imageId)
			}
		},
		/**
		 * 向右滑。显示上一张图片
		 **/
		showPreImage: function () {
			// 获取上一张图片的id
			this.imageId--;
			// 根据id获取模型
			var model = this.collection.get(this.imageId);
			// 如果获取不到说明是第一张了，提示
			if (!model) {
				alert('已经是第一张了！');
				// 将id重置回来
				this.imageId++;
			} else {
				// 更新页面
				this.updateView(model);
				// 缓存图片的id
				this.imageList.push(this.imageId)
			}
		},
		/**
		 * 更新页面
		 * @model 	更新的图片模型实例化对象
		 **/
		updateView: function (model) {
			// 我们更新图片的链接以及title效果更好
			// 更新图片
			this.$el.find('.layer-container img').attr('src', model.get('url'));
			// 更新title
			this.$el.find('.layer .header h1').html(model.get('title'))
		}
	});

	// 将类作为接口暴漏出来
	module.exports = Layer;
})