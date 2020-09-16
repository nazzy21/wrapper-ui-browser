/**
 A simple DOM node selector.

 @param {string|object} selector
 @returns {object}
**/
export default function $dom(selector) {
	return new Dom(selector);
}

function Dom(selector) {
	if (!window || !window.document) {
		throw new Error("Cannot user $dom on non-browser!");
	}

	this.elem = "object" === typeof selector ? [selector] : document.querySelectorAll(selector);

	return this;
}

/**
 * Get a dom element.
 *
 * @param {int} index
 * @returns {object}
 **/
Dom.prototype.get = function(index = 0) {
	return this.elem[index] ?? null;
}

/**
 Sets or get the node's html.

 @param {string|object} html
**/
Dom.prototype.html = function(html = null) {
	if (!html) {
		return this.first().innerHTML;
	}

	for(const elem of this.elem) {
		elem.innerHTML = html;
	}
}

/**
 Sets or get an attribute value.

 @param {string} name
 	The name of the attribute to set or get the value to.
 @param {*} value
 	The value to set unto the attribute.
**/
Dom.prototype.attr = function(name, value = null) {

	if (!value) {
		// Get the attribute value of the first element only
		const elem = this.first();

		if (!elem) {
			return null; // Don't bother
		}

		return elem.getAttribute(name);
	}

	for(const elem of this.elem) {
		elem.setAttribute(name, value);
	}
}

/**
 Adds a class name into an element.

 @param {string} className
 	The class name to add into. If the element already contains a class, the new class appends
 	to the existing class.
**/
Dom.prototype.addClass = function(className) {
	let _class = this.attr("class");
	_class = _class ? _class.split(" ") : [];

	_class.push(className);

	this.attr("class", _class.join(" "));
}

/**
 Removes the given class name from the element.

 @param {string} className
**/
Dom.prototype.removeClass = function(className) {
	let _class = this.attr("class");
	
	if (!_class) {
		return;
	}

	_class = _class.split(" ").filter( name => name !== className );

	this.attr("class", _class.split(" "));
}

/**
 Returns the style value of the given style name otherwise returns the style object
 of the element.

 @param {string} name
**/
Dom.prototype.css = function(name = null) {
	let style = this.attr("style");

	return name ? style[name] : style;
}

Dom.prototype.first = function() {
	return this.elem[0] ?? null;
}

Dom.prototype.last = function() {
	const elem = [].concat(this.elem);

	return elem.pop();
}