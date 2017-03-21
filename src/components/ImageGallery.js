//require('styles/App.scss');
require('styles/GalleryStyles.scss');
import React from 'react';
import ReactDOM from 'react-dom';
//获取图片相关数据
var imageDatas=require('json!../data/imageDatas.json');

//设置属性imageURL的值，这个值为图片的路径，由图片名信息转成
imageDatas=function getImageURL(imageDatasArr){
  for(var i=0;i<imageDatasArr.length;i++){
    var singleImageData=imageDatasArr[i];
    singleImageData.imageURL=require('../images/'+singleImageData.fileName);
    imageDatasArr[i]=singleImageData;
  }
  return imageDatasArr;
}(imageDatas);


//获取区间内的一个随机值
function getRangeRandom(low,high){
	return (Math.floor(Math.random()*(high-low)+low));
}

//获取0-30°之间的任意值
function get30DegRandom(){
	return( (Math.random()>0.5 ? '' : '-' )+ Math.floor(Math.random()*30)
	);
}

//每一张图片数据
var ImgFigure=React.createClass({


	/*
	 *imgFigure的点击处理函数
	 */
	handleClick: function(e){
		e.stopPropagation();
		e.preventDefault();
		if(this.props.arrange.isCenter){
			this.props.inverse();
		}
		else{
			this.props.center();
		}
	},

	render: function(){
		var styleObj={};

		//如果props属性中指定了这张图片的位置，则使用
		if(this.props.arrange.pos){
			styleObj=this.props.arrange.pos;
		}

		//如果图片的旋转角度有值且不为0，添加旋转角度
		/*css中使用方法为.test-rotate{ transform: rotate(30deg)}*/
		if(this.props.arrange.rotate){
			//styleObj['transform']='rotate('+this.props.arrange.rotate+'deg)'无法兼容所有浏览器
			//为了使其兼容所有浏览器，需要处理一下
			(['Moz','Ms','Webkit','']).forEach(function(value){
				styleObj[value+'transform']='rotate('+this.props.arrange.rotate+'deg)';
			}.bind(this));
		}

		if(this.props.arrange.isCenter){
			styleObj.zIndex=11;
		}

		//将className提取成js变量，修改ImgFigure的className
		var imgFigureClassName= 'img-figure';
		imgFigureClassName +=this.props.arrange.isInverse ? ' is-inverse' : ' ';
		

		return(
			<figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
				<img src={this.props.data.imageURL} alt={this.props.data.title}/>
				<figcaption>
					<h2 className="img-title">{this.props.data.title}</h2>
					<div className="img-back" onClick={this.handleClick} >
						<p>
							{this.props.data.desc}
						</p>
					</div>
				</figcaption>
			</figure>
		);
	}
});

//控制组件
var ControllerUnit=React.createClass({
	handleClick: function(e){
		e.preventDefault();
		e.stopPropagation();
		//如果点击的是当前正在选中态的按钮，则翻转图片，否则将对应图片居中
		if(this.props.arrange.isCenter){
			this.props.inverse();
		}
		else{
			this.props.center();
		}
	},
	render:function(){
		//根据对应的图片的状态，显示不同的按钮
		var controllerUnitClassName='controller-unit';

		//如果对应的是居中的图片，显示控制按钮的居中态
		if(this.props.arrange.isCenter){
			controllerUnitClassName += ' is-center';

			//如果同时对应的是翻转图片，显示控制按钮的翻转态
			if(this.props.arrange.isInverse)
				controllerUnitClassName += ' is-inverse';
		}


		return(
			<span className={controllerUnitClassName} onClick={this.handleClick}>
			</span>
		);
	}
});

//管理者模式，由ImageGallery掌控所有数据，和数据的切换
var ImageGallery=React.createClass({
//class ImageGallery extends React.Component{
	//存储位置的可取值范围
	Constant:{
		centerPos:{
			left: 0,top: 0
		},
		hPosRange:{  //左右分区取值范围
			leftSecX: [0,0],
			rightSecX: [0,0],
			y: [0,0]
		},
		vPosRange:{		//上分区取值范围
			x: [0,0],
			topY: [0,0]
		}
	},

/*
*翻转图片
*@param index 输入当前被执行inverse操作的图片对应的图片信息数组的index值
* @return { Function}这是一个闭包函数，其内return一个真正待被执行的函数
 */
 	inverse: function(index){
 		return function(){
 			var imgsArrangeArr=this.state.imgsArrangeArr;

 			imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;

 			this.setState({
 				imgsArrangeArr : imgsArrangeArr
 			});
 		}.bind(this);
 	},

	//重新布局所有图片，centerIndex指定居中排布的图片
	rearrange(centerIndex){
		var imgsArrangeArr=this.state.imgsArrangeArr,
		Constant=this.Constant,
		centerPos=Constant.centerPos,
		hPosRange=Constant.hPosRange,
		vPosRange=Constant.vPosRange,
		hPosRangeLeftSecX=hPosRange.leftSecX,
		hPosRangeRightSecX=hPosRange.rightSecX,
		hPosRangeY=hPosRange.y,
		vPosRangeTopY=vPosRange.topY,
		vPosRangeX=vPosRange.x,

		//存储布局在上分区的图片的信息
		imgsArrangeTopArr= [],
		topImgNum=Math.floor(Math.random()*2),   //取一个或者不取
		topImgSpliceIndex=0,   //标记位于上分区的图片从数组拿出的位置

		imgsArrangeCenterArr=imgsArrangeArr.splice(centerIndex,1)//存放居中图片的状态信息

		//首先居中centerIndex的图片,居中的图片不需要旋转
		imgsArrangeCenterArr[0]={
			pos:centerPos,
			rotate:0,
			isCenter: true
		}

		//取出要布局上分区的图片的状态信息
		topImgSpliceIndex=Math.floor(Math.random()*(imgsArrangeArr.length-topImgNum));
		imgsArrangeTopArr=imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);

		//布局上分区图片
		imgsArrangeTopArr.forEach(function(value,index){
			imgsArrangeTopArr[index]={
				pos:{
				top: getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
				left: getRangeRandom(vPosRangeX[0],vPosRangeX[1])
				},
				rotate: get30DegRandom(),
				isCenter:false
			};
		});

		//布局左右分区的图片
		for(var i=0,j=imgsArrangeArr.length,k=j/2;i<j;i++){
			var hPosRangeLORX=null;

			//前半部分布局左分区，后半部分布局右分区
			if(i<k){
				hPosRangeLORX=hPosRangeLeftSecX;
			}
			else{
				hPosRangeLORX=hPosRangeRightSecX;
			}

			imgsArrangeArr[i]={
				pos:{
					left: getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1]),
					top:getRangeRandom(hPosRangeY[0],hPosRangeY[1])
				},
				rotate: get30DegRandom(),
				isCenter: false
			};
		}

		//将图片位置信息重新放回,因splice会改变原数组，故将位置改变了的新信息放回
		if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
			imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0]);
		}

		imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);

		//状态改变，重新渲染
		this.setState({
			imgsArrangeArr: imgsArrangeArr
		});


	},

	/*
	 *利用rearrange函数，居中对应index的图片
	 *@param index,需要被居中的图片对应的图片信息数组的index值
	 *@return {Function}
	 */
	center: function(index){
		return function(){
			this.rearrange(index);
		}.bind(this);
	},


	//初始时返回一个图片位置对象数组,imgsArrangeArr存放状态信息
	getInitialState(){
		return {
			imgsArrangeArr:[
				{
					// pos:{
					// 	left: '0',
					// 	top: '0'
					// },
					// rotate: '0',   //旋转角度
					// isInverse: 'false' ,  //图片正反面
					// isCenter: 'false'   //图片是否居中
				}
			]
		};
	},

	//组件加载以后，为每张图片计算器位置的范围
	componentDidMount(){
		//舞台的大小
		var stageDOM=ReactDOM.findDOMNode(this.refs.stage),
			stageW =stageDOM.scrollWidth,
		    stageH= stageDOM.scrollHeight,
			halfStageW=Math.ceil(stageW/2),
			halfStageH=Math.ceil(stageH/2);

		//imageFigure的大小
		var imgFigureDOM=ReactDOM.findDOMNode(this.refs.imgFigure0),
			imgW=imgFigureDOM.scrollWidth,
			imgH=imgFigureDOM.scrollHeight,
			halfImgW=Math.ceil(imgW/2),
			halfImgH=Math.ceil(imgH/2);

		//计算各个分区图片位置点
		this.Constant.centerPos={
			left: halfStageW-halfImgW,
			top: halfStageH-halfImgH
		}

		this.Constant.hPosRange.leftSecX[0]=-halfImgW;
		this.Constant.hPosRange.leftSecX[1]=halfStageW - halfImgW * 3;
		this.Constant.hPosRange.rightSecX[0]=halfStageW + halfImgW;
		this.Constant.hPosRange.rightSecX[1]=stageW - halfImgW;
		this.Constant.hPosRange.y[0]=-halfImgH;
		this.Constant.hPosRange.y[1]=stageH - halfImgH;

		this.Constant.vPosRange.x[0]=halfStageW - imgW;
		this.Constant.vPosRange.x[1]=halfStageW;
		this.Constant.vPosRange.topY[0]=- halfImgH;
		this.Constant.vPosRange.topY[1]=halfStageH-halfImgH * 3;

		var num = Math.floor(Math.random() * 10);
     	this.rearrange(num);
	},

  render(){
  	//controllerUnits控制所有组件，imgFigures控制图片
  	var controllerUnits=[],
  		imgFigures=[];

  		imageDatas.forEach(function (value,index){
  			 if (!this.state.imgsArrangeArr[index]) {
  				this.state.imgsArrangeArr[index]={
  					pos:{
  						left: 0,
  						top: 0
  					},
  					rotate:0,
  					isInverse: false,
  					isCenter: false
  				};
  			}

			imgFigures.push(<ImgFigure data={value} key={index} ref={'imgFigure'+index}
				arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)}
				center={this.center(index)} />);
			controllerUnits.push(<ControllerUnit key={index} arrange={this.state.imgsArrangeArr[index]}
			inverse={this.inverse(index)} center={this.center(index)}/>);

  		}.bind(this));//将reactDOM对象传到function中，可以直接调用this

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
})

ImageGallery.defaultProps={
};
export default ImageGallery;