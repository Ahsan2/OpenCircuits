import {Input} from "../Input";
import {MouseListener} from "../MouseListener";
import {KeyboardListener} from "../KeyboardListener";

import {Action} from "../actions/Action";

export abstract class Tool implements MouseListener, KeyboardListener {

    private disabled: boolean = false;

    /**
     * Checks if this tool should be activated and
     *  then activates it
     *
     * @param  currentTool The tool currently active
     * @param  event       The current event (onclick, keyup, etc.)
     * @param  input       The Input class
     * @param  button      The button/key that was pressed/released
     * @return             True if the tool should be activated
     *                     False otherwise
     */
    public abstract activate(currentTool: Tool, event: string, input: Input, button?: number): boolean;

    /**
     * Checks if this tool should be deactivated
     *
     * @param  event  The current event (onclick, keyup, etc.)
     * @param  input  The Input class
     * @param  button The button/key that was pressed/release
     * @return        True if the tool should be deactivated
     *                False otherwise
     */
    public abstract deactivate(event: string, input: Input, button?: number): boolean;

    public setDisabled(val: boolean): void {
        this.disabled = val;
    }

    public onMouseDown(_input: Input, _button: number): boolean {
        return false;
    }

    public onMouseMove(_input: Input): boolean {
        return false;
    }

    public onMouseDrag(_input: Input, _button: number): boolean {
        return false;
    }

    public onMouseUp(_input: Input, _button: number): boolean {
        return false;
    }

    public onClick(_input: Input, _button: number): boolean {
        return false;
    }

    public onKeyDown(_input: Input, _key: number): boolean {
        return false;
    }

    public onKeyUp(_input: Input, _key: number): boolean {
        return false;
    }

    public isDisabled(): boolean {
        return this.disabled;
    }

    public getAction(): Action {
        return undefined;
    }

}
