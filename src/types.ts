export interface PolygloatTextInputElement extends HTMLElement {
    __polygloat: TextInputElementData;
    selectionStart: number;
    value: string;
}

export interface PolygloatTextAreaElement extends PolygloatTextInputElement, HTMLTextAreaElement {
    addEventListener: any;
    removeEventListener: any;
}

export interface PolygloatInputElement extends PolygloatTextInputElement, HTMLInputElement {
    addEventListener: any;
    removeEventListener: any;
}

export interface TextInputElementData {
    oldValue: string;
    valueInputs: string[];
    touched: boolean;
    oldPlaceholder: string;
    placeholderInputs: string[];
}

export type Translations = { [key: string]: string | Translations };
export type TranslationParams = { [key: string]: string }

export type KeyAndParams = { key: string, params: TranslationParams }
export type TranslatedWithMetadata = { translated: string, key: string, params: TranslationParams }

export type NodeWithMeta = Node & {
    _polygloat: NodeMeta;
};

export type ElementWithMeta = Element & ElementCSSInlineStyle & {
    _polygloat: ElementMeta
}

export type ElementMeta = {
    nodes: Set<NodeWithMeta>,
    listeningForHighlighting?: boolean,
    removeAllEventListeners?: () => void;
    highlight?: () => void;
    unhighlight?: () => void;
    initialBackgroundColor?: string;
}

export type NodeMeta = { oldTextContent: string, keys: KeyAndParams[] };

export type Scope = "translations.edit" | "translations.view" | "keys.edit";

export type Mode = 'development' | 'production';