import React from "react";
import PropTypes from 'prop-types';
import './iframe.css';
class Iframe extends React.Component {
	frame = React.createRef();
	domain = 'http://localhost:8080';
	iframeContentPath = 'http://localhost:8080/plugins/servlet/devoptics/load.html';
	componentDidMount() {
		window.addEventListener("message", this.onReceiveMessage);
		this.frame.current.addEventListener('load', this.onLoad);
	}
	componentWillUnmount() {
		window.removeEventListener("message", this.onReceiveMessage, false);
	}
	componentWillReceiveProps(nextProps){
		if(nextProps.postMessageData && nextProps.postMessageData !== this.props.postMessageData){
			this.sendMessage(nextProps.postMessageData);
		}
	}
	onReceiveMessage = e => {
		this.props.handleReceiveMessage(e);
	}
	sendMessage = (postMessageData) => {
		this.frame.current.contentWindow.postMessage(postMessageData, this.domain);
	}
	onLoad = e => {
		const frame = this.frame.current.contentWindow;
		const value = {
			baseUrl: this.domain,
		};
		frame.postMessage({type: 'putSettings', value }, this.domain)
		frame.postMessage({type: 'doIsLoggedInCheck'}, this.domain)
	}
	render() {
		return (
			<iframe title="jira-frame" ref={this.frame} src={this.iframeContentPath} />
		);
	}
}

Iframe.propTypes = {
	handleReceiveMessage: PropTypes.func,
	postMessageData: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
};

export default Iframe;