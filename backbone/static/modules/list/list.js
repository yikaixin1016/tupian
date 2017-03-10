// 定义列表页视图
define(function (require, exports, module) {
	// 引入css模块
	require('modules/list/list.css')
	// 定义类
	var List = Backbone.View.extend({
		// 绑定事件
		events: {
			// 给搜一搜按钮绑定事件
			'tap .search span': 'showSearchView',
			// 为所有分类按钮绑定点击事件
			'tap .type li': 'showTypeView',
			// 返回顶部事件
			'tap .go-top': 'goTop'
		},
		tpl: _.template('<a href="#layer/<%=id%>"><img style="<%=style%>" src="<%=url%>" alt="" /></a>'),
		// 定义两个变量保存盒子的高度，以后哪个盒子高度低，网哪个盒子中添加新的图片
		leftHeight: 0,
		rightHeight: 0,
		initialize: function () {
			// 备份this
			var me = this;

			// 初始化DOM
			this.initDOM();

			// 订阅事件
			// 我们要监听集合的变化，如果添加了新的模型，我们要渲染它
			// this.collection.on('add', function () {})
			this.listenTo(this.collection, 'add', function (model, collection, options) {
				// 作用域就是视图实例化对象，使用视图方法更方便
				// console.log(model)
				// 通过render方法渲染模型
				this.render(model)
			})
			// 定义滚动事件
			$(window).on('scroll', function () {
				// 判断条件
				// body高度  $('body').height()
				// scrollTop高度 $(window).scrollTop()
				// 窗口的高度  $(window).height()
				if ($('body').height() < $(window).scrollTop() + $(window).height() + 200) {
					// 加载图片
					// 本质上就是请求数据
					me.getData();
				}

				// 返回顶部的交互
				me.showHideGoTop();
			})
			// 拉去数据
			this.getData()
		},
		/**
		 * 返回顶部
		 */
		goTop: function () {
			window.scrollTo(0, 0)
		},
		/**
		 * 显示隐藏返回顶部按钮
		 */
		showHideGoTop: function () {
			if ($(window).scrollTop() > 300) {
				// 显示返回顶部
				this.$el.find('.go-top').show()
			} else {
				// 隐藏返回顶部
				this.$el.find('.go-top').hide()
			}
		},
		/**
		 * 拉去数据
		 **/
		getData: function () {
			// 通过集合拉去
			this.collection.fetchData();
		},
		/**
		 * 初始化dom方法
		 */
		initDOM: function () {
			// 以后可能会使用哪些元素，我们先存储起来
			this.leftContainer = this.$el.find('.left-container')
			this.rightContainer = this.$el.find('.right-container')
		},
		// 渲染方法
		render: function (model) {
			// 获取模型高度
			var height = model.get('viewHeight');
			// 第一步 获取数据
			var data = {
				id: model.get('id'),
				url: model.get('url'),
				// width: 161px; height: 200px;
				style: 'width: ' + model.get('viewWidth') + ';height: ' + height + ';'
			};
			
			// 第二步 获取模板
			var tpl = this.tpl;

			// 第三步 格式化模板
			var html = tpl(data)

			// 第四步 渲染页面
			// 如果左边的高度大于右边的高度，向右边添加，否则向左边添加
			if (this.leftHeight > this.rightHeight) {
				// 向右边添加
				this.renderRight(html, height);
			} else {
				// 向左边添加
				this.renderLeft(html, height);
			}
		},
		/**
		 * 向右边添加
		 * @html 	模板字符串
		 * @height 	图片高度
		 **/
		renderRight: function (html, height) {
			// 向右边的容器中插入这段模板代码
			this.rightContainer.append(html);
			// 修改高度
			this.rightHeight += height + 6;
		},
		/**
		 * 向左边添加
		 * @html 	模板字符串
		 * @height 	图片高度
		 **/
		renderLeft: function (html, height) {
			// 向左边容器中插入这段模板代码
			this.leftContainer.append(html);
			// 修改高度
			this.leftHeight += height + 6;
		},
		/**
		 * 获取搜索框的内容值
		 **/
		getSearchValue: function () {
			return this.$el.find('.search input').val()
		},
		/**
		 * 检测输入内容的合法性
		 * @val 	表单input的内容
		 ***/
		checkInputValue: function (val) {
			// 判断输入的内容是空的，或者空白符
			if (/^\s*$/.test(val)) {
				// 提示用户
				alert('请输入搜索内容！');
				return false;
			}
			return true;
		},
		/**
		 * 根据关键字搜索集合中符合条件的模型实例化对象
		 * @val 	搜索的关键字
		 * @type 	搜索的类型
		 **/
		searchCollectionByKey: function (val, type) {
			// 搜索集合
			return this.collection.filter(function (model, index, models) {
				if (type === 'type') {
					return model.get('type') == val;
				}
				// 判断条件
				return model.get('title').indexOf(val) > -1;
			})
		},
		/**
		 * 清除页面容器的内容
		 **/
		clearView: function () {
			// 清除左右容器
			this.leftContainer.html('');
			this.rightContainer.html('');
			// 清空高度
			this.leftHeight = 0;
			this.rightHeight = 0;
		},
		/**
		 * 更新视图
		 * @arr 	将要被渲染模型实例化对象数组
		 **/
		resetView: function (arr) {
			// 遍历arr
			for (var i = 0; i < arr.length; i++) {
				// arr[i]表示第i个模型实例化对象
				this.render(arr[i])
			}
		},
		/**
		 * 点击搜一搜按钮的回调函数
		 **/
		showSearchView: function () {
			// 获取input元素的内容值
			var value = this.getSearchValue();
			// 检测输入的合法性
			if (!this.checkInputValue(value)) {
				// 停止执行业务逻辑
				return;
			}
			// 输入的是合法的,
			// 去除首尾空白符 
			value = value.replace(/^\s+|\s+$/g, '');
			// 搜索符合条件的模型实例化对象
			var result = this.searchCollectionByKey(value);
			// 清除页面内容
			this.clearView();
			// 重新渲染页面
			this.resetView(result);
		},
		/**
		 * 获取li元素的id数据信息
		 * @dom 	目标元素
		 **/
		getDOMId: function (dom) {
			// return $(dom).data('id');
			return $(dom).attr('data-id');
		},
		/**
		 * 点击li分类按钮时的回调函数
		 **/ 
		showTypeView: function (e) {
			// 触发事件的目标元素e.target
			var id = this.getDOMId(e.target);
			// 根据id过滤实例化对象
			var result = this.searchCollectionByKey(id, 'type');
			// console.log(result)
			// 清空内容
			this.clearView();
			// 重新渲染页面
			this.resetView(result);
		}
	})

	// 将接口暴漏出来
	module.exports = List;
})