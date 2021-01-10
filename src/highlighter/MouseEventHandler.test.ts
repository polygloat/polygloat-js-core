jest.dontMock("./MouseEventHandler");
jest.dontMock("../Constants/ModifierKey");
jest.dontMock("../services/EventEmitter");
jest.dontMock("../services/Subscription");

import {ElementMeta, ElementWithMeta} from "../types";
import describeClassFromContainer from "@testFixtures/describeClassFromContainer";
import {MouseEventHandler} from "./MouseEventHandler";
import {getMockedInstance} from "@testFixtures/mocked";
import {Properties} from "../Properties";
import {ModifierKey} from "../Constants/ModifierKey";

describe("MouseEventHandler", () => {
    const getMouseEventHandler = describeClassFromContainer(import("./MouseEventHandler"), "MouseEventHandler");
    let mouseEventHandler: ReturnType<typeof getMouseEventHandler>;
    let mockedElement: ElementWithMeta;
    const key = "Alt";

    const mockedCallback = jest.fn();
    const mockedClick = new MouseEvent("click");
    const mockedMouseOver = new MouseEvent("mouseover");
    const mockedMouseOut = new MouseEvent("mouseout");
    const mockedKeydown = new KeyboardEvent("keydown", {key});
    const mockedKeyup = new KeyboardEvent("keyup", {key});
    let mockedHighlight = jest.fn();
    let mockedUnhighlight = jest.fn();

    beforeEach(async () => {
        mouseEventHandler = await getMouseEventHandler();
        mockedElement = document.createElement("div") as Element as ElementWithMeta;
        mockedElement._polygloat = {highlight: mockedHighlight, unhighlight: mockedUnhighlight} as any as ElementMeta;
        mouseEventHandler.handle(mockedElement, mockedCallback);
        getMockedInstance(Properties).config.highlightKeys = [ModifierKey[key]];

        mockedElement.dispatchEvent(mockedMouseOver);
        window.dispatchEvent(mockedKeydown);
    });

    describe("highlighting", () => {

        test("Will highlight", async () => {
            expect(mockedHighlight).toBeCalledTimes(1);
        });


        test("Will unhighlight", async () => {
            mockedElement.dispatchEvent(mockedMouseOut);
            expect(mockedUnhighlight).toBeCalled();
        });

        test("Will not highlight just on mouseover", async () => {
            mockedElement.dispatchEvent(mockedMouseOut);
            window.dispatchEvent(mockedKeyup);
            mockedHighlight = jest.fn();
            mockedElement.dispatchEvent(mockedMouseOver);
            expect(mockedHighlight).toBeCalledTimes(0);
        });

        test("Will not highlight just on keydown", async () => {
            window.dispatchEvent(mockedKeyup);
            mockedElement.dispatchEvent(mockedMouseOut);
            mockedHighlight = jest.fn();
            window.dispatchEvent(mockedKeydown)
            expect(mockedHighlight).toBeCalledTimes(0);
        });


        test("Will highlight when keydown first", async () => {
            window.dispatchEvent(mockedKeyup);
            mockedElement.dispatchEvent(mockedMouseOut);
            window.dispatchEvent(mockedKeydown);
            mockedElement.dispatchEvent(mockedMouseOver);
            expect(mockedHighlight).toBeCalled();
        });

        test("Will not handle single element multiple times", async () => {
            console.error = jest.fn();
            mouseEventHandler.handle(mockedElement, () => {});
            mouseEventHandler.handle(mockedElement, () => {});

            expect(console.error).toBeCalledTimes(2);
            mockedElement.dispatchEvent(mockedClick);
            expect(mockedCallback).toBeCalledTimes(1);
        });

        test("Will clear keys on window blur", async () => {
            window.dispatchEvent(new Event("blur"));
            mockedElement.dispatchEvent(mockedClick);
            expect(mockedCallback).not.toBeCalledTimes(1);
        });
    });

    describe("click", () => {
        test("Will call callback on click", async () => {
            mockedElement.dispatchEvent(mockedClick);
            expect(mockedCallback).toBeCalledTimes(1);
        });
    })

    describe("Remove all listeners callback", () => {
        test("will be assigned on init", () => {
            expect(typeof mockedElement._polygloat.removeAllEventListeners).toEqual("function");
        });

        test("will not handle click after it's call", () => {
            mockedElement._polygloat.removeAllEventListeners();
            mockedElement.dispatchEvent(mockedClick);
            expect(mockedCallback).toBeCalledTimes(0);
        })

        test("will not handle mouse over after it's call", () => {
            mockedElement._polygloat.removeAllEventListeners();
            mockedElement.dispatchEvent(mockedMouseOver);
            expect(mockedCallback).toBeCalledTimes(0);
        })

        test("will not handle mouse leave after it's call", () => {
            mockedElement._polygloat.removeAllEventListeners();
            mockedElement.dispatchEvent(mockedMouseOut);
            expect(mockedCallback).toBeCalledTimes(0);
        })
    })

});