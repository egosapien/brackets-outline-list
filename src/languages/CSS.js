/* global define */

define(function (require, exports, module) {
    "use strict";

    var EditorManager = brackets.getModule("editor/EditorManager");

    function _getTypeClass(name) {
        var classes = {
            "#": "id",
            ".": "class",
            "@": "at-rules",
            "[": "attribute"
        };
        return " outline-entry-css-" + (classes[name[0]] || "tag");
    }

    function _createListEntry(name, line, ch) {
        var $elements = [];
        var $name = $(document.createElement("span"));
        var typeClass = _getTypeClass(name);
        $name.text(name);
        $elements.push($name);
        return {
            name: name,
            line: line,
            ch: ch,
            classes: "outline-entry-css outline-entry-icon" + typeClass,
            $html: $elements
        };
    }

    /**
     * Create the entry list of functions language dependent.
     * @param   {Array} lines Array that contains the lines of text.
     * @returns {Array} List of outline entries.
     */
    function getOutlineList(lines) {
        var text = lines.join('\n');
        var regex =  /.(-?[\w !@#$%^&*()_+\-=\[\];':"\\|.<>\/?~]+)(?![^{]*\})/g;
        var result = [];
        var cm = EditorManager.getActiveEditor()._codeMirror;
        var match = regex.exec(text);
        while (match !== null) {
            var name = match[0].trim();
            var position = cm.posFromIndex(match.index);
            result.push(_createListEntry(name, position.line, lines[position.line].length));
            match = regex.exec(text);
        }
        return result;
    }

    function compare(a, b) {
        if (a.name > b.name) {
            return 1;
        }
        if (a.name < b.name) {
            return -1;
        }
        return 0;
    }

    module.exports = {
        getOutlineList: getOutlineList,
        compare: compare
    };
});
