/*!
 * jCreate JavaScript Library
 * http://github.com/mercent/jcreate
 *
 * Copyright 2013 Mercent Corporation
 * Released under the MIT license
 * http://raw.github.com/mercent/jcreate/master/MIT-LICENSE.txt
 */
(function(window)
{
	// Local variables.
	var aliases,
		// Keep a local variable reference to the document object
		document = window.document,
		// Keep a local variable reference to the jQuery object.
		jQuery = window.jQuery,
		propHooks;

	// Local functions.
	var create = function(source)
		{
			/// <summary>Main jCreate method that creates DOM nodes from a source javascript object.</summary>
			// If source is null, return null.
			if(source == null)
				return null;
			// If source is a string, then return a text node.
			else if(typeof source == 'string')
				return document.createTextNode(source);
			// If source is an array, then return an HTML fragment
			// that contains the nodes created from the items of the array.
			else if(jQuery.isArray(source))
				return createFromArray(source, parent);
			// If source is a DOM node, then return it.
			// We infer it is a DOM node if it has a nodeType property.
			else if(source.nodeType)
				return source;
			// Otherwise, create the element from the source object.
			else
				return createFromObject(source);
		},
		createFromArray = function(array)
		{
			// TODO: should we use a stack to detect circular references?
			// If so, should we convert to using a loop instead of recursion?
			var length = array.length, fragment;

			// Create the fragment.
			fragment = document.createDocumentFragment();

			// Loop through the array.
			for(var i = 0, node; i < length; i++)
			{
				// Create a node for each item in the array
				// and append it to the fragment.
				node = create(array[i]);
				if(node)
					fragment.appendChild(node);
			}

			// Return the fragment.
			return fragment;
		},
		createFromObject = function(source)
		{
			var	// Get the tag name (using any of the aliases). By default use a 'div' tag.
				tagName = source.tag || source.tagName || source.nodeName || 'div',
				// Create the element.
				element = document.createElement(tagName),
				init = source.init;
			
			// Loop through the properties.
			for(var key in source)
			{
				// Skip any properties that don't belong to the instance.
				if(source.hasOwnProperty(key))
				{
					// Set the property.
					setProperty(element, key, source[key], source);
				}
			}

			// If there is an initializer, then call it.
			if(init)
				init.call(element, source);

			// We're finished creating the element, so return it.
			return element;
		},
		// No-op function for setters of properties that are handled
		// before or after the normal property loop (e.g. tag and init).
		noop = function(){},
		setProperty = function(element, key, value, source)
		{
			// Don't do anything if the value is null (or undefined).
			if(value == null)
				return;

			// If there is a setter for the property, then call it.
			var setter = propHooks[key];
			if(setter)
				setter.call(element, value, key, source);
			// Otherwise, just set the property value.
			else
				element[key] = value;
		};

	// The propHooks are functions (hooks) that handle setting properties that have special logic.
	// If a property is not listed below (or in the aliases) then the property value
	// will just be set directly on the DOM element.
	propHooks = 
	{
		attributes: function(attributes)
		{
			jQuery(this).attr(attributes);
		},
		content: function(value)
		{
			// Create a node (or fragment) from the content.
			// Note that the content can be a string, a DOM element,
			// a jCreate object or an array of these.
			var node = create(value);
			if(node)
				this.appendChild(node);
		},
		events: function(events)
		{
			jQuery(this).on(events);
		},
		// Init is a no-op here because it will be handled last.
		init: noop,
		style: function(value)
		{
			var style = this.style;
			// If the value is a string, then set the style.cssText property
			if(typeof value == 'string')
				style.cssText = value;
			// Otherwise, treat it as a style object "map" and call the .css jQuery method.
			else
				jQuery(this).css(value);
		},
		// Tag is a no-op here because it is handled before the element is created.
		tag: noop
	};

	// The aliases are alternative names for properties that have special logic.
	aliases = 
	{
		attr: propHooks.attributes,
		childNodes: propHooks.content,
		css: propHooks.style,
		nodeName: propHooks.tag,
		tagName: propHooks.tag
	}

	// Extend the property hooks with aliases.
	jQuery.extend(propHooks, aliases);

	jQuery.extend
	(
		// Extend the "create" function.
		// This is similar to how jQuery can be called as a function and treated as an object
		// (in javascript, functions are objects).
		create,
		// Below are the publicly exposed properties and functions.
		{
			create: create,
			propHooks: propHooks
		}
	);

	// "Export" the jCreate function/object so it is accessible outside the local scope.
	window.jCreate = create;
	
})(window);