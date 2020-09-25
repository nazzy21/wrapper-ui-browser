import React from "react";
import {Screen, Template, appEvent} from "@wrapper/ui";

export default class Body extends Template {
	constructor(props) {
		super(props);

		// Change content when the screen change
		Screen.subscribe(this.__screenChange.bind(this));
	}

	subscribe() {
		if (this.timer) {
			clearInterval(this.timer);
		}

		if (!this.state.Id) {
			return;
		}

		// If there are no queries, set a few seconds before triggering the screen changed.
		if (!Screen.hasQueries()) {
			this.timer = setInterval(this.__screenChanged.bind(this), 1000);

			return;
		}

		Screen.query().then(this.__screenChanged.bind(this));
	}

	/**
	 @private
	 @callback
	**/
	__screenChange({Id, client, pageNow}) {
		this.updateState({Id, client, pageNow});
	}

	/**
	 @private
	 @callback
	**/
	__screenChanged() {
		if (this.timer) {
			clearInterval(this.timer);
		}
		
		appEvent.trigger("screenChanged");
	}

	render() {
		if (this.hasError()) {
			return null;
		}

		const template = Screen.getTemplate(this.state.pageNow, "/index");

		if (!template) {
			return null;
		}

		return this.iterateChildren(template, {});
	}
}