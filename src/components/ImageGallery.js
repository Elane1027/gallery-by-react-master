require('styles/GalleryStyles.scss');
import React from 'react';
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

class ImageGallery extends React.Component{
  render(){
    return (
       <section className="stage">
       		<section className="img-sec">
       		</section>
       		<nav className="img-nav">
       		</nav>
       </section>
    );
  }
}

ImageGallery.defaultProps={
};
export default ImageGallery;