require('normalize.css/normalize.css');
require('styles/main.scss');

import React from 'react';
import ReactDOM from 'react-dom'

let imageDatas = require('../data/imageDatas.json');
imageDatas = (function genImageUrl(imageDatasArr) {
	for (let i = 0, j = imageDatasArr.length; i < j; i ++) {
		let singleData = imageDatasArr[i];
		singleData.imageUrl = require("../images/" + singleData.filename);
		imageDatasArr[i] = singleData;
	}
	return imageDatasArr;
})(imageDatas);

// 获取区间内一个随机数
function getRangeRandom(low, high) {
	return Math.ceil(Math.random() * (high - low) + low)
}

// 获取0-30度之间的任意正负角度
function get30DegRandom() {
	return ((Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30))
}


class ImgFigure extends React.Component {
	constructor(props) {
		super(props);
		this.reverseHandleClick = this.reverseHandleClick.bind(this);
	}
	
	reverseHandleClick(e) {
		if (this.props.arrage.isCenter) {
			this.props.reverse();
		} else {
			this.props.center(); 
		}
		
		e.stopPropagation();
		e.preventDefault();
	}
	render() {
		let styleObj = {};
		let imgClassName = 'img-figure';
		imgClassName += this.props.arrage.isReverse ? ' is-reverse' : '';
		
		if (this.props.arrage.pos) {
			styleObj = this.props.arrage.pos;
		}
		
		if (this.props.arrage.rotate) {
			
			['Moz', 'Webkit', 'ms', ''].forEach(function(value) {
				if (value == '') {
					styleObj[value + 'transform'] = 'rotate(' + this.props.arrage.rotate + 'deg)';
				} else {
					styleObj[value + 'Transform'] = 'rotate(' + this.props.arrage.rotate + 'deg)';
				}
				
			}.bind(this))
		}

		if (this.props.arrage.isCenter) {
			styleObj.zIndex = 11;
		}

		return (
			<figure className={imgClassName} style={styleObj} onClick={this.reverseHandleClick}>
				<img src={this.props.data.imageUrl} alt={this.props.data.title} />
				<figcaption>
					<h2 className="img-title">{this.props.data.title}</h2>
					<div className="img-back" onClick={this.reverseHandleClick}>
						<p>{this.props.data.desc}</p>
					</div>
				</figcaption>
			</figure>
		)
	}
}

class GalleryApp extends React.Component {
	
	constructor(props) {
		super(props);
		this.constant = {
			centerPos: {    // 中心图片位置
				left: 0,
				right: 0
			},
			hPosRange: {    // 左右分区的取值范围
				leftSecX: [0, 0],	// 中心图片左边分区的图片的水平坐标范围
				rightSecX: [0, 0],	// 中心图片右边分区的图片的水平坐标范围
				y: [0, 0]  // 中心图片左右分区的图片的纵坐标范围
			},
			vPosRange: {    // 上分区的取值分范围
				x: [0, 0],    // 上分区的水平坐标范围
				topY: [0, 0]    // 上分区的纵坐标范围
			}
		};

		this.state = {
			imgsArrangeArr: [
				// {
				// 	pos: {
				// 		top: '0',
				// 		left: '0'
				// 	},
				//  rotate: 0,  // 旋转角度
				//  isReverse: false,  // 是否翻转
				//  isCenter: false  //  是否居中
				// }
			]
		}
	}
	/*
	* 翻转图片
	* @param index 当前执行翻转的图片的对应的index值
	* return {Function} 闭包函数，内部return一个真正执行的函数
	*/
	reverse(index) {
		return function() {
			let imgsArrangeArr = this.state.imgsArrangeArr;
			imgsArrangeArr[index].isReverse = !imgsArrangeArr[index].isReverse;
			this.setState({
				imgsArrangeArr: imgsArrangeArr
			})
		}.bind(this)
	}
	/*
	* 居中图片
	* @param index 需要被居中的图片的index
	* @return {function}
	*/
	center(index) {
		return function() {
			this.rearArange(index);
		}.bind(this);
	}
	/*
	* 重新布局所有图片
	* @param centerIndex 指定居中排布哪张图片
	*/
	rearArange(centerIndex) {

		let imgsArrangeArr = this.state.imgsArrangeArr,
			constant = this.constant,
			centerPos = constant.centerPos,
			hPosRange = constant.hPosRange,
			vPosRange = constant.vPosRange,
			hPosRangeLeftSecX = hPosRange.leftSecX,
			hPosRangeRightSecX = hPosRange.rightSecX,
			hPosRangeY = hPosRange.y,
			vPosRangeTopY =  vPosRange.topY,
			vPosRangeX = vPosRange.x,
			
			// 上分区的图片状态
			imgsArrageTopArr = [],
			topImgNum = Math.ceil(Math.random() * 2), // 随机放置一个或两个图片
			topImgSpliceIndex = 0,
			imgsArrageCenterArr = imgsArrangeArr.splice(centerIndex, 1);  // 从imgsArrageArr中拿出中心图片的信息
			
		// 居中centerIndex这张图片
		imgsArrageCenterArr[0] = {
			pos: centerPos,
			rotate: 0,
			isCenter: true
		}

		topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
		imgsArrageTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

		// 布局位于上分区的图片
		imgsArrageTopArr.forEach(function(value, index) {
			imgsArrageTopArr[index] = {
				pos: {
					top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
					left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
				},
				rotate: get30DegRandom(),
				isCenter: false
			}
			
		})

		// 布局左右两分区的图片
		for (let i = 0, len = imgsArrangeArr.length, j = len / 2; i < len; i ++) {
			let hPosRangeLorRX = null;

			if (i < j) {
				hPosRangeLorRX = hPosRangeLeftSecX;
			} else {
				hPosRangeLorRX = hPosRangeRightSecX;
			}

			imgsArrangeArr[i] = {
				pos: {
					top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
					left: getRangeRandom(hPosRangeLorRX[0], hPosRangeLorRX[1])
				},
				rotate: get30DegRandom(),
				isCenter: false
			}
		}

		if (imgsArrageTopArr && imgsArrageTopArr[0]) {
			imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrageTopArr[0]);
		}

		imgsArrangeArr.splice(centerIndex, 0, imgsArrageCenterArr[0]);

		this.setState({
			imgsArrangeArr: imgsArrangeArr
		})
	}
	
	
	// 组件加载后，为每一张图片计算位置范围
	componentDidMount() {
		
		// 拿到整个图片容器的大小
		let stageDOM = ReactDOM.findDOMNode(this.refs.stage),
			stageW = stageDOM.scrollWidth,
			stageH = stageDOM.scrollHeight,
			halfStageW = Math.ceil(stageW / 2),
			halfStageH = Math.ceil(stageH / 2);
		// 拿到图片的大小
		let imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
			imgW = imgFigureDOM.scrollWidth,
			imgH = imgFigureDOM.scrollHeight,
			halfImgW = Math.ceil(imgW / 2),
			halfImgH = Math.ceil(imgH / 2);
		this.constant.centerPos = {
			left: halfStageW - halfImgW,
			top: halfStageH - halfImgH
		}
		this.constant.hPosRange.leftSecX[0] = - halfImgW;
		this.constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
		this.constant.hPosRange.y[0] = - halfImgH;
		this.constant.hPosRange.y[1] = stageH - halfImgH;
		this.constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
		this.constant.hPosRange.rightSecX[1] = stageW - halfImgW;

		this.constant.vPosRange.topY[0] = - halfImgH;
		this.constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
		this.constant.vPosRange.x[0] = halfStageW - imgW;
		this.constant.vPosRange.x[1] = halfStageW;

		this.rearArange(0);


	}
  	render() {
	  	var controllerUnits = [],
			imgFigures = [];
		
		imageDatas.forEach(function(value, index) {

			if (!this.state.imgsArrangeArr[index]) {
				this.state.imgsArrangeArr[index] = {
					pos: {
						top: '0',
						left: '0'
					},
					rotate: 0,
					isReverse: false,    
					isCenter: false
				}

			}
			imgFigures.push(<ImgFigure data={value} ref={'imgFigure' + index} 
				arrage={this.state.imgsArrangeArr[index]} reverse={this.reverse(index)} center={this.center(index )}/>);
		
		}.bind(this));  // 把react.component对象传入函数中，以便访问this.state
		
	    return (
	      <section className="stage" ref="stage">
	      	<section className="img-sec">
	      		{imgFigures}
	      	</section>
	      	<nav className="controller-nav">
	      		{controllerUnits}
	      	</nav>
	      </section>

	    );
  	}
}

GalleryApp.defaultProps = {
};

export default GalleryApp;
