import React from "react";
import {Preload} from "@wrapper/ui";
import {Template, appEvent} from "@wrapper/ui";
import $dom from "./dom";

export default class BrowserPreload extends Template {
	constructor(props) {
		super(props);

		// Listen to screen change
		appEvent.on("screenChange", this.__setLoading.bind(this));
		appEvent.on("screenChanged", this.__setLoaded.bind(this));
	}

	getSelector() {
		return $dom(this.preloader);
	}

	/**
	 @private
	 @callback
	**/
	__setLoading({Id}) {
		const loader = this.getSelector();

		loader.addClass("enter").removeClass("enter-done");
	}

	/**
	 @private
	 @callback
	**/
	__setLoaded() {
		const loader = this.getSelector();
		
		loader.addClass("enter-done");
	}
}
BrowserPreload.defaultProps = {templateId: "/template/preload"};