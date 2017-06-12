require('normalize.css/normalize.css');
require('styles/main.scss');

import React from 'react';

let imageDatas = require('../data/imageDatas.json');
imageDatas = (function genImageUrl(imageDatasArr) {
	for (let i = 0, j = imageDatasArr.length; i < j; i ++) {
		let singleData = imageDatasArr[i];
		singleData.imageUrl = require("../images/" + singleData.filename);
		imageDatasArr[i] = singleData;
	}
	return imageDatasArr;
})(imageDatas);

class ImgFigure extends React.Component {
	render() {

		return (
			<figure className="img-figure">
				<img src={this.props.data.imageUrl} alt={this.props.data.title}/>
				<figcaption>
					<h2 className="img-title">{this.props.data.title}</h2>
				</figcaption>
			</figure>
			
		)
	}
}

class GalleryApp extends React.Component {
  render() {
  	var controllerUnits = [],
		imgFigures = [];
	imageDatas.forEach(function(value) {
		imgFigures.push(<ImgFigure data={value}/>);
	});
    return (
      <section className="stage">
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
