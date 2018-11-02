"use strict";

var Camera = require("../utils/Camera");
var Renderer = require("../utils/rendering/Renderer");
var Grid = require("../utils/rendering/Grid");
var WireRenderer = require("../utils/rendering/ioobjects/WireRenderer");
var ComponentRenderer = require("../utils/rendering/ioobjects/ComponentRenderer");

var CircuitDesigner = require("../models/CircuitDesigner");
var IOObject = require("../models/ioobjects/IOObject");
var Wire = require("../models/ioobjects/Wire");
var Component = require("../models/ioobjects/Component");

class MainDesignerView {

    constructor() {
        var canvas = document.getElementById("canvas");
        if (!(canvas instanceof HTMLCanvasElement)) throw new Error("Canvas element not found!");
        this.canvas = canvas;
        this.renderer = new Renderer(this.canvas);
        this.camera = new Camera(this.canvas.width, this.canvas.height);

        window.addEventListener('resize', e => this.resize(), false);
        this.resize();
    }
    render(designer, selections) {
        this.renderer.clear();

        Grid.render(this.renderer, this.camera);

        var wires = designer.getWires();
        for (var wire of wires) {
            var selected = selections.includes(wire);
            WireRenderer.render(this.renderer, this.camera, wire, selected);
        }

        var objects = designer.getObjects();
        for (var object of objects) {
            var selected = selections.includes(object);
            ComponentRenderer.render(this.renderer, this.camera, object, selected);
        }
    }
    resize() {
        this.renderer.resize();
        this.camera.resize(this.canvas.width, this.canvas.height);
    }
}

module.exports = MainDesignerView;