import {Lifecycle} from "tsyringe";

import {scoped} from "tsyringe";
import {Properties} from "../Properties";
import {ElementWithMeta} from "../types";

@scoped(Lifecycle.ContainerScoped)
export class HighlightFunctionsInitializer {
    constructor(private properties: Properties) {
    }

    initFunctions(element: ElementWithMeta){
        this.initHighlightFunction(element);
        this.initUnhighlightFunction(element)
    }

    private initHighlightFunction(element: ElementWithMeta) {
        element._polygloat.highlight = () => {
            element._polygloat.initialBackgroundColor = element.style.backgroundColor;
            element.style.backgroundColor = this.properties.config.highlightColor;
        }
    }

    private initUnhighlightFunction(element: ElementWithMeta) {
        element._polygloat.unhighlight = () => {
            element.style.backgroundColor = element._polygloat.initialBackgroundColor;
        }
    }
}
