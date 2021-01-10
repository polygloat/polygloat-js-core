jest.dontMock("./HighlightFunctionsInitializer");

import describeClassFromContainer from "@testFixtures/describeClassFromContainer";
import {getMockedInstance} from "@testFixtures/mocked";
import {Properties} from "../Properties";
import {ElementWithMeta} from "../types";

describe("HighlightFunctionsInitializer", () => {
    const getHighlightFunctionInitializer = describeClassFromContainer(import("./HighlightFunctionsInitializer"), "HighlightFunctionsInitializer");
    let highlightFunctionInitializer: ReturnType<typeof getHighlightFunctionInitializer>;
    let mockedElement: ElementWithMeta;
    const mockedColor = "rgb(0, 30, 50)"

    beforeEach(async () => {
        highlightFunctionInitializer = await getHighlightFunctionInitializer();
        mockedElement = document.createElement("div") as Element as ElementWithMeta;
        getMockedInstance(Properties).config.highlightColor = mockedColor;
        (mockedElement._polygloat as any)= {};
        highlightFunctionInitializer.initFunctions(mockedElement);
    });


    test("Will reset to correct initial color", async () => {
        mockedElement.style.backgroundColor = "#222222"
        mockedElement._polygloat.highlight();
        mockedElement._polygloat.unhighlight();
        expect(mockedElement.style.backgroundColor).toEqual("rgb(34, 34, 34)");
    });


    test("Will highlight", async () => {
        mockedElement._polygloat.highlight();
        expect(mockedElement.style.backgroundColor).toEqual(mockedColor);
    });
});