/**
 * Packery Item Element
**/

( function( window ) {

'use strict';

var Packery = window.Packery;

function Item( element ) {
  this.element = element;
  this.position = {
    x: 0,
    y: 0
  };

  // style initial style
  this.element.style.position = 'absolute';
}

Item.prototype.handleEvent = function( event ) {
  var method = event.type + 'Handler';
  if ( this[ method ] ) {
    this[ method ]( event );
  }
};

Item.prototype.css = function( style ) {
  var elemStyle = this.element.style;
  for ( var prop in style ) {
    elemStyle[ prop ] = style[ prop ];
  }
};

Item.prototype.transitionPosition = function( x, y ) {
  // save end position
  this.position.x = x;
  this.position.y = y;

  // get current x & y
  var elem = this.element;
  var curX = elem.style.left && parseInt( elem.style.left, 10 ) || 0;
  var curY = elem.style.top  && parseInt( elem.style.top,  10 ) || 0;

  var transX = x - curX;
  var transY = y - curY;

  this.transition({
    '-webkit-transform': 'translate( ' + transX + 'px, ' + transY + 'px)'
  }, this.setEndPosition );

};

Item.prototype.setEndPosition = function() {
  this.css({
    // set settled position
    left: this.position.x + 'px',
    top : this.position.y + 'px'
  });
};

Item.prototype.transition = function( style, onTransitionEnd ) {

  var transitionProperty = [];
  for ( var prop in style ) {
    transitionProperty.push( prop );
  }

  // enable transition
  this.css({
    webkitTransitionProperty: transitionProperty.join(','),
    webkitTransitionDuration: '1s'
  });

  // transition end callback
  if ( onTransitionEnd ) {
    this.onTransitionEnd = onTransitionEnd;
    this.element.addEventListener( 'webkitTransitionEnd', this, false );
  }

  // set transition styles
  this.css( style );

  this.isTransitioning = true;
};

Item.prototype.webkitTransitionEndHandler = function( event ) {
  if ( this.onTransitionEnd ) {
    this.onTransitionEnd();
    delete this.onTransitionEnd;
  }

  this.css({
    // disable transition
    webkitTransform: '',
    // remove transform
    webkitTransition: ''
  });

  this.element.removeEventListener( 'webkitTransitionEnd', this, false );

  this.isTransitioning = false;
};

Item.prototype.remove = function() {
  console.log('hiding');
  // start transition
  this.transition({
    '-webkit-transform': 'scale(0.001)',
    opacity: 0
  }, this.removeElem );

};


// remove element from DOM
Item.prototype.removeElem = function() {
  console.log('removing elem');
  this.element.parentNode.removeChild( this.element );
};

// --------------------------  -------------------------- //

// publicize
Packery.Item = Item;

})( window );

