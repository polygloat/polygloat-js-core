import { CoreService } from './services/CoreService';
import { TolgeeConfig } from './TolgeeConfig';
import { Properties } from './Properties';
import { container as rootContainer } from 'tsyringe';
import { EventService } from './services/EventService';
import { TranslationParams } from './types';
import { Observer } from './Observer';
import { TranslationService } from './services/TranslationService';
import { TextService } from './services/TextService';
import { CoreHandler } from './handlers/CoreHandler';
import { ElementRegistrar } from './services/ElementRegistrar';
import { NodeHelper } from './helpers/NodeHelper';
import { EventEmitterImpl } from './services/EventEmitter';

export class Tolgee {
  private readonly container = rootContainer.createChildContainer();
  public properties: Properties = this.container.resolve(Properties);
  private _coreService: CoreService = this.container.resolve(CoreService);
  private eventService: EventService = this.container.resolve(EventService);
  private observer: Observer = this.container.resolve(Observer);
  private translationService: TranslationService =
    this.container.resolve(TranslationService);
  private textService: TextService = this.container.resolve(TextService);
  private coreHandler: CoreHandler = this.container.resolve(CoreHandler);
  private elementRegistrar: ElementRegistrar =
    this.container.resolve(ElementRegistrar);

  constructor(config: TolgeeConfig) {
    this.container = rootContainer.createChildContainer();
    this.properties.config = new TolgeeConfig(config);
  }

  public get lang() {
    return this.properties.currentLanguage;
  }

  public set lang(value) {
    this.properties.currentLanguage = value;
    (this.eventService.LANGUAGE_CHANGED as EventEmitterImpl<any>).emit(value);
  }

  public get coreService() {
    return this._coreService;
  }

  public async run(): Promise<void> {
    if (this.properties.config.mode === 'development') {
      await this.loadScopes();
    }

    await this.translationService.loadTranslations();
    await this.refresh();

    if (this.properties.config.watch) {
      this.observer.observe();
    }
  }

  public async refresh() {
    return this.coreHandler.handleSubtree(this.properties.config.targetElement);
  }

  public get defaultLanguage() {
    return this.properties.config.defaultLanguage;
  }

  translate = async (
    key: string,
    params: TranslationParams = {},
    noWrap = false
  ): Promise<string> => {
    if (this.properties.config.mode === 'development' && !noWrap) {
      await this.loadScopes();
      await this.translationService.loadTranslations();
      return this.textService.wrap(key, params);
    }
    return this.textService.translate(key, params);
  };

  instant = (
    key: string,
    params: TranslationParams = {},
    noWrap = false,
    orEmpty?: boolean
  ): string => {
    if (this.properties.config.mode === 'development' && !noWrap) {
      return this.textService.wrap(key, params);
    }
    return this.textService.instant(key, params, undefined, orEmpty);
  };

  public stop = () => {
    this.observer.stopObserving();
    this.elementRegistrar.cleanAll();
    NodeHelper.unmarkElementAsTargetElement(
      this.properties.config.targetElement
    );
  };

  public get onLangChange() {
    return this.eventService.LANGUAGE_CHANGED;
  }

  public get onLangLoaded() {
    return this.eventService.LANGUAGE_LOADED;
  }

  private async loadScopes() {
    if (this.properties.scopes === undefined) {
      this.properties.scopes = await this.coreService.getScopes();
    }
  }
}

export default Tolgee;
