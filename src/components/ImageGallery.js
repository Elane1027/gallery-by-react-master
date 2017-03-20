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

//每一张图片数据
var ImgFigure=React.createClass({
	render: function(){
		var styleObj={};

		if(this.props.arrange.pos){
			styleObj=this.props.arrange.pos;
		}

		return(
			<figure className="img-figure" style={styleObj}>
				<img src={this.props.data.imageURL} alt={this.props.data.title}/>
				<figcaption>
					<h2 className="img-title">{this.props.data.title}</h2>
				</figcaption>
			</figure>
		);
	}
})

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

	// this.state = {
 //      imgsArrangeArr: [
 //        //{
 //        //  pos:{
 //        //    left:'0',
 //        //    top:'0'
 //        //  },
 //        //    rotate:0, //旋转角度
 //        //isInverse:false //正反面
 //        //isCenter:false 图片是否居中
 //        //}
 //      ]
 //    };



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

		//首先居中centerIndex的图片
		imgsArrangeCenterArr[0].pos=centerPos;

		//取出要布局上分区的图片的状态信息
		topImgSpliceIndex=Math.floor(Math.random()*(imgsArrangeArr.length-topImgNum));
		imgsArrangeTopArr=imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);

		//布局上分区图片
		imgsArrangeTopArr.forEach(function(value,index){
			imgsArrangeTopArr[index].pos={
				top: getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
				left: getRangeRandom(vPosRangeX[0],vPosRangeX[1])
			}
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

			imgsArrangeArr[i].pos={
				left: getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1]),
				top:getRangeRandom(hPosRangeY[0],hPosRangeY[1])
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

	//初始时返回一个图片位置对象数组,imgsArrangeArr存放状态信息
	getInitialState(){
		return {
			imgsArrangeArr:[
				{
					// pos:{
					// 	left: '0',
					// 	top: '0'
					// }
				}
			]
		}
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

		this.rearrange(0);
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
  					}
  				}
  			}

			imgFigures.push(<ImgFigure data={value} ref={'imgFigure'+index} arrange={this.state.imgsArrangeArr[index]}/>);
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