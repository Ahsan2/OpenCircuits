import "jest";

import {OPTION_KEY} from "../../../../../site/public/ts/utils/Constants";

import {CircuitDesigner} from "../../../../../site/public/ts/models/CircuitDesigner";
import {Camera} from "../../../../../site/public/ts/utils/Camera";
import {Input} from "../../../../../site/public/ts/utils/Input";
import {ToolManager} from "../../../../../site/public/ts/utils/tools/ToolManager";
import {PanTool} from "../../../../../site/public/ts/utils/tools/PanTool";

describe("Pan Tool", () => {
    let camera = new Camera(500, 500);
    let designer = new CircuitDesigner(0);
    let toolManager = new ToolManager(camera, designer);

    // Declare as type: any so that we can manipulate
    //  private methods to simulate user input
    let input: any = new Input(<any>{
        addEventListener:() => {},
        getBoundingClientRect:() => {return {left: 0, top: 0}}
    });

    input.addListener("keydown", (b?: number) => { toolManager.onKeyDown(input, b); });
    input.addListener("keyup",   (b?: number) => { toolManager.onKeyUp(input, b); });
    input.addListener("mousedown", (b?: number) => { toolManager.onMouseDown(input, b); });
    input.addListener("mousemove", () => { toolManager.onMouseMove(input); });
    input.addListener("mousedrag", (b?: number) => { toolManager.onMouseDrag(input, b); });
    input.addListener("mouseup",   (b?: number) => { toolManager.onMouseUp(input, b); });

    let center = camera.getCenter();

    it("Drag without option key", () => {
        let pos = camera.getPos();

        input.onMouseDown({clientX: center.x, clientY: center.y});
        input.onMouseMove({clientX: center.x- 5, clientY: center.y});
        input.onMouseMove({clientX: center.x-10, clientY: center.y});
        input.onMouseMove({clientX: center.x-15, clientY: center.y});
        input.onMouseUp({clientX: center.x-15, clientY: center.y});

        let pos2 = camera.getPos();

        // Expect no movement
        expect(pos2).toEqual(pos);
    });
    it("Drag with option key", () => {
        let pos = camera.getPos();

        input.onKeyDown({keyCode: OPTION_KEY})
        input.onMouseDown({clientX: center.x, clientY: center.y});
        input.onMouseMove({clientX: center.x- 5, clientY: center.y});
        input.onMouseMove({clientX: center.x-10, clientY: center.y});
        input.onMouseMove({clientX: center.x-15, clientY: center.y});
        input.onMouseUp({clientX: center.x-15, clientY: center.y});
        input.onKeyUp({keyCode: OPTION_KEY});

        let pos2 = camera.getPos();

        // Expect movement
        expect(pos2).not.toEqual(pos);
    });
    it("No drag with option key", () => {
        let pos = camera.getPos();

        input.onKeyDown({keyCode: OPTION_KEY})
        input.onMouseDown({clientX: center.x, clientY: center.y});
        input.onKeyUp({keyCode: OPTION_KEY});
        input.onMouseUp({clientX: center.x, clientY: center.y});

        let pos2 = camera.getPos();

        // Expect no movement
        expect(pos2).toEqual(pos);
    });
});
