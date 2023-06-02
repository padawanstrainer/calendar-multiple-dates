//GERMI TE GRABAS UN VIDEO CON ESTO? COPATE, GRACIAS, PELA WITH TRENZAS <3
const MINI_DOM = function( ){
  this.id = i => document.getElementById(i);
  this.query = sel => document.querySelector(sel); 
  this.queryAll = sel => document.querySelectorAll(sel);

  this.create = (tag, attrs = {}) => Object.assign(document.createElement(tag), attrs );
  this.append = (hijo, parent = document.body ) => Array.isArray(hijo) ? 
                  hijo.forEach( h => parent.appendChild(h)) :
                  parent.appendChild(hijo);
  //this.remove = (elemento)
}