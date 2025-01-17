import "jest";

import {V} from "../../../../../site/public/ts/utils/math/Vector";

import {Camera} from "../../../../../site/public/ts/utils/Camera";
import {ToolManager} from "../../../../../site/public/ts/utils/tools/ToolManager";

import {CircuitDesigner} from "../../../../../site/public/ts/models/CircuitDesigner";
import {Switch} from "../../../../../site/public/ts/models/ioobjects/inputs/Switch";
import {LED} from "../../../../../site/public/ts/models/ioobjects/outputs/LED";
import {WirePort} from "../../../../../site/public/ts/models/ioobjects/other/WirePort";

import {FakeInput} from "../FakeInput";
import {InitializeInput} from "./Helpers";

describe("Wiring Tool", () => {
    const camera = new Camera(500, 500);
    const designer = new CircuitDesigner(0);
    const toolManager = new ToolManager(camera, designer);
    const input = new FakeInput(camera.getCenter());

    InitializeInput(input, toolManager);

    afterEach(() => {
        // Clear circuit
        designer.reset();
    });

    test("Connect Switch -> LED then Split and Snap then Unsnap and move Down", () => {
        const sw = new Switch();
        const led = new LED();
        sw.setPos(V(-60, 0));
        led.setPos(V(400, -100));
        designer.addObjects([sw, led]);

        // Connect Switch -> LED
        input.drag(sw.getOutputPort(0).getWorldTargetPos(),
                   led.getInputPort(0).getWorldTargetPos());

        // Split into Snap position
        const wire = sw.getOutputs()[0];
        input.press(wire.getShape().getPos(0.5))
                .moveTo(V(200, 0));

        const port = sw.getOutputs()[0].getOutputComponent();
        expect(port).toBeInstanceOf(WirePort);
        expect(port.getInputs()[0].isStraight()).toBe(true);
        expect(port.getOutputs()[0].isStraight()).toBe(true);
        expect(port.getPos()).toEqual(V(200, 0));

        // Move down
        input.move(V(0, 50))
                .release();

        expect(port.getInputs()[0].isStraight()).toBe(false);
        expect(port.getOutputs()[0].isStraight()).toBe(false);
        expect(port.getPos()).toEqual(V(200, 50));
    });

    test("Connect Switch -> LED then Split Twice into Snapped Rectangle", () => {
        const sw = new Switch();
        const led = new LED();
        sw.setPos(V(-60, 0));
        led.setPos(V(400, -100));
        designer.addObjects([sw, led]);

        // Connect Switch -> LED
        input.drag(sw.getOutputPort(0).getWorldTargetPos(),
                   led.getInputPort(0).getWorldTargetPos());

        // Split twice
        input.press(sw.getOutputs()[0].getShape().getPos(0.5))
                .moveTo(V(0, 100))
                .release();
        input.press(led.getInputs()[0].getShape().getPos(0.5))
                .moveTo(V(400, 100))
                .release();

        const port1 = sw.getOutputs()[0].getOutputComponent();
        expect(port1).toBeInstanceOf(WirePort);
        expect(port1.getInputs()[0].isStraight()).toBe(true);
        expect(port1.getOutputs()[0].isStraight()).toBe(true);
        expect(port1.getPos()).toEqual(V(0, 100));

        const port2 = led.getInputs()[0].getInputComponent();
        expect(port2).toBeInstanceOf(WirePort);
        expect(port2.getInputs()[0].isStraight()).toBe(true);
        expect(port2.getOutputs()[0].isStraight()).toBe(true);
        expect(port2.getPos()).toEqual(V(400, 100))
    });

});
