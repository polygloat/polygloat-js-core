import {ElementMeta, ElementWithMeta} from "../types";
import {ModifierKey} from "../Constants/ModifierKey";
import {Lifecycle, scoped} from "tsyringe";
import {Properties} from "../Properties";
import {EventEmitterImpl} from "../services/EventEmitter";

@scoped(Lifecycle.ContainerScoped)
export class MouseEventHandler {
    constructor(private properties: Properties) {
        this.initKeyListener();
    }

    private keysDown = new Set<ModifierKey>();
    private mouseOn: Set<ElementWithMeta> = new Set();
    private highlighted: ElementWithMeta;
    private mouseOnChanged = new EventEmitterImpl<ElementWithMeta>();
    private keysChanged: EventEmitterImpl<boolean> = new EventEmitterImpl<boolean>();


    handle(element: ElementWithMeta & ElementCSSInlineStyle, onclick: (clickEvent: MouseEvent) => void) {
        if (element._polygloat.listeningForHighlighting) {
            console.error("Element is already listening mouse events! This is probably bug in polygloat");
            return;
        }
        element._polygloat.listeningForHighlighting = true;

        this.initEventListeners(element, onclick);

        this.mouseOnChanged.subscribe(() => {
            if (this.highlighted !== this.getMouseOn()) {
                this.onConditionsChanged();
            }
        });

        this.keysChanged.subscribe(() => {
            this.onConditionsChanged();
        });
    }

    private initEventListeners(element: Element & ElementCSSInlineStyle & { _polygloat: ElementMeta }, onclick: (clickEvent: MouseEvent) => void) {
        const onMouseOver = () => this.onMouseOver(element);
        const onMouseOut = () => this.onMouseOut(element);
        const onClick = (e: MouseEvent) => {
            if (this.areKeysDown()) {
                e.stopPropagation();
                e.preventDefault();
                onclick(e);
            }
        };
        element.addEventListener("mouseover", onMouseOver);
        element.addEventListener("click", onClick);

        const onMouseDownOrUp = (e: MouseEvent) => {
            if (this.areKeysDown()) {
                e.stopPropagation();
                e.preventDefault();
            }
        };

        element.addEventListener("mousedown", onMouseDownOrUp);
        element.addEventListener("mouseup", onMouseDownOrUp);
        element.addEventListener("mouseout", onMouseOut);

        element._polygloat.removeAllEventListeners = () => {
            element.removeEventListener("mousedown", onMouseDownOrUp);
            element.removeEventListener("mouseup", onMouseDownOrUp);
            element.removeEventListener("mouseover", onMouseOver);
            element.removeEventListener("click", onClick);
            element.removeEventListener("mouseout", onMouseOut);
        }
    }

    private onConditionsChanged() {
        this.unhighlight();
        if (this.areKeysDown() && this.getMouseOn()) {
            this.highlight();
        }
    }

    private highlight() {
        this.getMouseOn()._polygloat.highlight();
        this.highlighted = this.getMouseOn();
    }

    private unhighlight() {
        if (this.highlighted) {
            this.highlighted._polygloat.unhighlight();
            this.highlighted = null;
        }
    }

    private onMouseOut(element) {
        this.mouseOn.delete(element)
        this.mouseOnChanged.emit(this.getMouseOn());
    }

    private onMouseOver(element: ElementWithMeta & ElementCSSInlineStyle) {
        this.mouseOn.delete(element); //to get in to last place
        this.mouseOn.add(element);
        this.mouseOnChanged.emit(this.getMouseOn());
    }

    private getMouseOn() {
        const mouseOnArray = Array.from(this.mouseOn);
        return mouseOnArray.length ? mouseOnArray[0] : undefined;
    }

    private initKeyListener() {
        window.addEventListener('blur', () => {
            this.keysDown = new Set();
            this.keysChanged.emit(this.areKeysDown());
        });

        window.addEventListener('keydown', (e) => {
            const modifierKey = ModifierKey[e.key];
            if (modifierKey !== undefined) {
                this.keysDown.add(modifierKey);
                this.keysChanged.emit(this.areKeysDown());
            }
        });
        window.addEventListener('keyup', (e) => {
            this.keysDown.delete(ModifierKey[e.key]);
            this.keysChanged.emit(this.areKeysDown());
        });
    }


    private areKeysDown() {
        for (const key of this.properties.config.highlightKeys) {
            if (!this.keysDown.has(key)) {
                return false;
            }
        }
        return true;
    }
}