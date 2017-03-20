require('normalize.css/normalize.css');
require('styles/App.scss');
require('styles/PicHeader.css');
require('styles/PicItem.css');
require('styles/TextGet.css');
import React from 'react';
import URL from 'url';
let yeomanImage = require('../images/yeoman.png');
let info = require('json!../data/infoDatas.json');

var PicHeader=React.createClass({
//增加一个方法getLogo(),得到logo图片
  getLogo(){
    return(
      <div className="picHeader-logo">
        <a href="http://news.ycombinator.com/">
          <img id="picHeader-image" src={yeomanImage}/>
        </a>
      </div>
    );
  },
//增加一个getTitle(),返回一个标题
  getTitle(){
    return(
      <div className="picHeader-title">
        <a className="picHeader-textLink" href="https://news.ycombinator.com/">Hack News</a>
      </div>
    );
  },
  //增加一个getNav(),返回一个导航栏
  getNav(){
    var navLinks=[
    {
      name:'comments',
      url: 'piccomments'
    },
    {
      name:'ask',
      url: 'ask'
    },
    {
      name:'submit',
      url: 'submit'
    }
    ];
    return(
      <div className='picHeader-nav'>
      {
        navLinks.map(function(navLink){
          return(
            <a key={navLinks.url} className='picHeader-navLink picHeader-textLink' href={'https://news.ycombinator.com/' + navLink.url} >
            {navLink.name}
            </a>
          );
        })
      }
      </div>
    );
  },
  //添加clickLogin(),点击时弹出登陆面板
  clickLogin(){
    //return(   <div><TextGet display="block"/></div>);
    alert('1111');
    this.props.loginStyle.display='block';
  },
//添加getLogin(),返回一个登陆按钮
  getLogin(){
    return (
      <div className="picHeader-login">
        <a className="picHeader-textLink" id="picHeader-loginText" onClick={this.clickLogin}>login</a>
      </div>
    );
  },
  render() {
      return (
          <div className="picHeader">
            {this.getLogo()}
            {this.getTitle()}
            {this.getNav()}
            {this.getLogin()}
          </div>
        );
  }
});

var PicItem=React.createClass({
  getDomain(){
    return URL.parse(this.props.item.url).hostname;
  },

  //增加一个getTitle(),返回包含了标题和地址的组件
  getTitle(){
    return(
      <div className="picItem-title">
        <a className="picItem-titleLink" href={this.props.item.url ? this.props.item.url : 'https://news.ycombinator.com/item?id=' + this.props.item.id}>{this.props.item.title}</a>
        <span className="picItem-domain">
          <a href={'https://news.ycombinator.com/from?site='+this.getDomain()}>{this.getDomain()}</a>
        </span>
      </div>
    );
  },

  //返回评论数
  getComment(){
    var commentText='discuss';
    if(this.props.item.kids&&this.props.item.kids.length)
      commentText=this.props.item.kids.length;
    return (
      <a>{commentText}</a>
    );
  },
  //返回分数，作者，评论数
  getSubtext(){
    return(
      <div className="picItem-subtext">
      {this.props.item.score}  points by {this.props.item.by} | {this.getComment()}
      </div>
    ) ;
  },
  getRank(){
    return (
      <div className="picItem-rank">
        {this.props.rank}
      </div>
    );
   },

  render() {
      return (
          <div className="picItem">
            {this.getRank()}
            <div className="picItem-itemText">
              {this.getTitle()}
              {this.getSubtext()}
            </div>
          </div>
        );
  }
});

//点击按钮login,弹出登陆框
var TextGet = React.createClass({
        // getInitialState: function(){
        //   return {display:"block"};
        // },
        handle: function(){
          var name = this.refs.myName.value;
          var password = this.refs.myPwd.value;
          ((infoArr) => {
            for (var i = 0, j = infoArr.length; i < j; i++) {
              let singleInfo = infoArr[i];
              if(singleInfo.userName == name&&singleInfo.password == password) {
                alert('登陆成功!');
                return true;
              }
            }
            alert('登陆失败！');
            return false;
          })(info);
        },
        render: function(){
           var loginStyle={
              display: 'none'
           };
          return (
               <div className="land" style={loginStyle}>
                用户名：<input type="text" ref="myName"/>
                <br/>
                密   码：<input className="pwd" type="password" ref="myPwd"/>
                <br/>
                <input type="button" className="sub" value="提交" onClick={this.handle}/>
              </div>
          );
        }
     });




class PicList extends React.Component {
  render() {
    var testData={
    by:    'bane',
      score:  55,
      kids:[1,3,415,15161,224141],
      title:  'This are many pictures!',
    url:   'https://news.ycombinator.com'
    };
  
    return (
      <div className="picList">
        <PicHeader/>
        <PicItem item={testData} rank ={1}/>
        <TextGet/>
      </div>
    );
  }
}

PicList.defaultProps = {
};
export default PicList;