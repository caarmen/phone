import { assert } from 'chai';
import { processInput, TEXT_NEWLINE, KEYCODE_BACKSPACE, KEYCODE_ENTER } from '../src/js/textbuffer.js';

describe('Text buffer', function () {

    const scenarios = [
        {
            name: "should append text",
            originalText: "hello",
            keyCode: 56,
            key: "!",
            expectedNewText: "hello!",
        },
        {
            name: "should backspace over a letter",
            originalText: "hello",
            keyCode: KEYCODE_BACKSPACE,
            expectedNewText: "hell",
        },
        {
            name: "should backspace over a newline",
            originalText: `hello${TEXT_NEWLINE}`,
            keyCode: KEYCODE_BACKSPACE,
            expectedNewText: "hello",
        },
        {
            name: "should no-op when backspace over no text",
            originalText: "",
            keyCode: KEYCODE_BACKSPACE,
            expectedNewText: "",
        },
        {
            name: "should wrap when word is wrappable",
            originalText: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod temporum",
            keyCode: 83,
            key: "s",
            expectedNewText: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod${TEXT_NEWLINE}temporums`,
        },
        {
            name: "should not wrap when word is not wrappable",
            originalText: "01234567891123456789212345678931234567894123456789512345678961234567897123456789",
            keyCode: 83,
            key: "s",
            expectedNewText: `01234567891123456789212345678931234567894123456789512345678961234567897123456789${TEXT_NEWLINE}s`,
        },
        {
            name: "should remove old line when wrapping at end of line at end of buffer",
            originalText: `hello there${TEXT_NEWLINE}general tchat${TEXT_NEWLINE}now that's a name I've not heard since.... am stram gram pique et pique et colig`,
            keyCode: 82,
            key: "r",
            expectedNewText: `general tchat${TEXT_NEWLINE}now that's a name I've not heard since.... am stram gram pique et pique et${TEXT_NEWLINE}coligr`,
            maxLines: 3,
        },
        {
            name: "should remove old line when typing enter at end of buffer",
            originalText: `hello there${TEXT_NEWLINE}general tchat${TEXT_NEWLINE}now that's a name I've not heard since...`,
            keyCode: KEYCODE_ENTER,
            expectedNewText: `general tchat${TEXT_NEWLINE}now that's a name I've not heard since...${TEXT_NEWLINE}`,
            maxLines: 3,
        },
        {
            name: "should not wrap if current line is short and previous line is long",
            originalText: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod temporum${TEXT_NEWLINE}hello there`,
            keyCode: 56,
            key: "!",
            expectedNewText: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod temporum${TEXT_NEWLINE}hello there!`,
        },
    ];

    scenarios.forEach(scenario => {
        it(scenario.name, function () {
            const actualNewText = processInput(scenario.originalText, scenario.keyCode, scenario.key, scenario.maxLines);
            assert.equal(actualNewText, scenario.expectedNewText);
        });
    });
});

