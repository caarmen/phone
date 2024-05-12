import { assert } from "chai";
import { processInput, TEXT_NEWLINE, KEY_BACKSPACE, KEY_ENTER } from "../src/js/domain/usecases/textbuffer.js";

describe("Text buffer", function () {

    const scenarios = [
        {
            name: "should append text",
            originalText: "hello",
            key: "!",
            expectedNewText: "hello!",
        },
        {
            name: "should backspace over a letter",
            originalText: "hello",
            key: KEY_BACKSPACE,
            expectedNewText: "hell",
        },
        {
            name: "should backspace over a newline",
            originalText: `hello${TEXT_NEWLINE}`,
            key: KEY_BACKSPACE,
            expectedNewText: "hello",
        },
        {
            name: "should no-op when backspace over no text",
            originalText: "",
            key: KEY_BACKSPACE,
            expectedNewText: "",
        },
        {
            name: "should wrap when word is wrappable",
            originalText: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod temporum",
            key: "s",
            expectedNewText: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod${TEXT_NEWLINE}temporums`,
        },
        {
            name: "should not wrap when word is not wrappable - one line",
            originalText: "01234567891123456789212345678931234567894123456789512345678961234567897123456789",
            key: "s",
            expectedNewText: `01234567891123456789212345678931234567894123456789512345678961234567897123456789${TEXT_NEWLINE}s`,
        },
        {
            name: "should not wrap when word is not wrappable - last line",
            originalText: `hello there ${TEXT_NEWLINE}01234567891123456789212345678931234567894123456789512345678961234567897123456789`,
            key: "s",
            expectedNewText: `hello there ${TEXT_NEWLINE}01234567891123456789212345678931234567894123456789512345678961234567897123456789${TEXT_NEWLINE}s`,
        },
        {
            name: "should remove old line when wrapping at end of line at end of buffer",
            originalText: `hello there${TEXT_NEWLINE}general tchat${TEXT_NEWLINE}now that's a name I've not heard since.... am stram gram pique et pique et colig`,
            key: "r",
            expectedNewText: `general tchat${TEXT_NEWLINE}now that's a name I've not heard since.... am stram gram pique et pique et${TEXT_NEWLINE}coligr`,
            maxLines: 3,
        },
        {
            name: "should remove old line when typing enter at end of buffer",
            originalText: `hello there${TEXT_NEWLINE}general tchat${TEXT_NEWLINE}now that's a name I've not heard since...`,
            key: KEY_ENTER,
            expectedNewText: `general tchat${TEXT_NEWLINE}now that's a name I've not heard since...${TEXT_NEWLINE}`,
            maxLines: 3,
        },
        {
            name: "should not wrap if current line is short and previous line is long",
            originalText: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod temporum${TEXT_NEWLINE}hello there`,
            key: "!",
            expectedNewText: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod temporum${TEXT_NEWLINE}hello there!`,
        },
        {
            name: "should replace linefeed character with newline token",
            originalText: "hello",
            key: "\n",
            expectedNewText: `hello${TEXT_NEWLINE}`,
        },
        {
            name: "should replace carriage return character with newline token",
            originalText: "hello",
            key: "\r",
            expectedNewText: `hello${TEXT_NEWLINE}`,
        },
    ];

    scenarios.forEach(scenario => {
        it(scenario.name, function () {
            const actualNewText = processInput(scenario.originalText, scenario.key, scenario.maxLines);
            assert.equal(actualNewText, scenario.expectedNewText);
        });
    });
});

