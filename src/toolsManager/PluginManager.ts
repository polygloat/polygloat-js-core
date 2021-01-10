import {Lifecycle, scoped} from "tsyringe";
import {Properties} from "../Properties";
import {Messages} from "./Messages";
import {PolygloatConfig} from "../PolygloatConfig";
import {EventService} from "../services/EventService";
import {ElementRegistrar} from "../services/ElementRegistrar";

@scoped(Lifecycle.ContainerScoped)
export class PluginManager {
    private handshakeSucceed = false;

    constructor(private messages: Messages, private properties: Properties, private eventService: EventService, private elementRegistrar: ElementRegistrar) {
    }

    run() {
        try {
            this.messages.startListening();
            this.handshake();
            this.initOnRegisterKeyEmit();
        } catch (e) {
            console.warn(e);
            console.warn("Can not start communication with browser plugin. Check waning above.")
        }
    }

    private readonly handshake = () => {
        const sharedConfiguration: Partial<Properties> & { config: Partial<PolygloatConfig> } = {
            ...this.properties,
            config: {...this.properties.config, targetElement: undefined, _targetElement: undefined} as any as PolygloatConfig
        };
        this.messages.send("POLYGLOAT_READY", sharedConfiguration);
        this.messages.listen("POLYGLOAT_PLUGIN_READY", () => {
            this.handshakeSucceed = true;
            this.messages.send("POLYGLOAT_READY", sharedConfiguration);
            this.initListeners();
        });
    };

    private initListeners() {
        this.messages.listenPopup("HIGHLIGHT_KEY", (key: string) => {
            for (const element of this.elementRegistrar.findAllByKey(key)) {
                element._polygloat.highlight();
            }
        });

        this.messages.listenPopup("UNHIGHLIGHT_KEY", (key: string) => {
            for (const element of this.elementRegistrar.findAllByKey(key)) {
                element._polygloat.unhighlight();
            }
        });
    }

    initOnRegisterKeyEmit() {
        this.eventService.ELEMENT_REGISTERED.subscribe(element => {
            element._polygloat.nodes.forEach(node => {
                node._polygloat.keys.forEach(key => this.messages.send("NEW_KEY", key));
            })
        })
    }

    stop() {
        this.messages.stopListening();
    }
}