"use strict";

const webc = {
    log: function(str) {
        console.log(str);
    },
    err: function(str) {
        throw new Error(str);
    }
};

const web = {
    returnObj: function(c, element) {
        if (c == 1267) {
            return {
                el: element,
                html: function(str) {
                    for (let i = 0; i < element.length; i++) {
                        element[i].innerHTML = str;
                    }
                },
                css: function(prop, val) {
                    if (typeof prop === "string") {
                        for (let i = 0; i < element.length; i++) {
                            element[i].style = `${prop}: ${val};`;
                        }
                    }
                    if (prop instanceof Object) {
                        let elStyle = "";
                        for (const i in prop) {
                            elStyle += `${i}: ${prop[i]};`;
                        }
                        for (let i = 0; i < element.length; i++) {
                            element[i].style = elStyle;
                        }
                    }
                },
                text: function(str) {
                    for (let i = 0; i < element.length; i++) {
                        element[i].textContent = str;
                    }
                },
                setId: function(id) {
                    for (const i in element) {
                        element[i].id = id;
                    }
                },
                setClass: function(cls) {
                    for (let i = 0; i < element.length; i++) {
                        element[i].className = cls;
                    }
                },
                addClass: function(cls) {
                    if (typeof cls !== "string" && !Array.isArray(cls)) {
                        throw new Error("Argument must be a string or an array");
                    }
                    if (typeof cls === "string") {
                        for (let i = 0; i < element.length; i++) {
                            element[i].className += ` ${cls}`;
                        }
                        return;
                    }
                    if (Array.isArray(cls)) {
                        let final = ``;
                        for (let i = 0; i < cls.length; i++) {
                            final += ` ${cls[i]}`;
                        }
                        for (let i = 0; i < element.length; i++) {
                            element[i].className += final;
                        }
                        return;
                    }
                },
                attr: function(attribute, val) {
                    if (typeof attribute === "string") {
                        if (typeof val !== "string") {
                            throw new Error("The second argument must be a string");
                        }
                        for (let i = 0; i < element.length; i++) {
                            element[i].setAttribute(attribute, val);
                        }
                        return;
                    }
                    if (attribute instanceof Object) {
                        for (const i in attribute) {
                            for (let j = 0; j < element.length; j++) {
                                element[j].setAttribute(i, attribute[i]);
                            }
                        }
                        return;
                    }
                    throw new Error("The first argument must be a string or an object");
                },
                click: function(code) {
                    for (let i = 0; i < element.length; i++) {
                        element[i].addEventListener("click", code);
                    }
                },
                dblclick: function(code) {
                    for (let i = 0; i < element.length; i++) {
                        element[i].addEventListener("dblclick", code);
                    }
                },
                keyup: function(code) {
                    for (let i = 0; i < element.length; i++) {
                        element[i].addEventListener("keyup", code);
                    }
                }
            };
        }
    },
    select: function(sel) {
        const errors = {
            invalid: "Invalid HTML selector",
            notStr: "Selector must be a string"
        };
        try {
            if (typeof sel !== "string") {
                throw errors.notStr;
            }
            const userSelected = document.querySelectorAll(sel);
            this.select.html = function(str) {
                for (let i = 0; i < userSelected.length; i++) {
                    userSelected[i].innerHTML = str;
                }
            };
            return this.returnObj(1267, userSelected);
        } catch (err) {
            const defaultErr = errors.invalid;
            if (err === errors.notStr) {
                throw new Error(err);
            } else {
                throw new Error(defaultErr);
            }
        }
    },
    print: function(str) {
        document.body.innerHTML += str;
    },
    create: function(el, to, id, cls, html, text, css) {
        const errors = {
            invalid: "Invalid tag name",
            notStr: "The first argument must be a string",
            toNotStr: "The second argument must be a string"
        };
        try {
            if (typeof el !== "string") {
                throw errors.notStr;
            }
            if (typeof to !== "string") {
                throw errors.toNotStr;
            }
            const elTo = document.querySelectorAll(to);
            for (let i = 0; i < elTo.length; i++) {
                const element = document.createElement(el);
                if (html) {
                    element.innerHTML = html;
                }
                if (text) {
                    element.textContent = text;
                }
                if (css) {
                    if (typeof css === "string") {
                        element.style = css;
                    }
                    if (css instanceof Object) {
                        let final = ``;
                        for (const i in css) {
                            final += `${i}: ${css[i]};`;
                        }
                        element.style = final;
                    }
                }
                if (id) {
                    element.id = id;
                }
                if (cls) {
                    if (typeof cls !== "string" && !Array.isArray(cls)) {
                        throw new Error("Class argument must be a string or an array");
                    }
                    if (typeof cls) {
                        element.className = cls;
                    }
                    if (Array.isArray(cls)) {
                        let final = ``;
                        for (let i = 0; i < cls.length; i++) {
                            final += ` ${cls[i]}`;
                        }
                        element.className = final;
                    }
                }
                elTo[i].appendChild(element);
            }
        } catch (err) {
            throw new Error(err);
        }
    },
    createTable: function(data, el, hasHeading, id, cls) {
        let final = ``;
        const errors = {
            dataNotObj: "The first argument must be an array or an object",
            noData: "The .data property is not found",
            invalid: "Invalid selector",
            notStr: "The second argument must be a string"
        };
        if (typeof el !== "string") {
            throw new Error(errors.notStr);
        }
        if (!Array.isArray(data) && (!(data instanceof Object) || typeof data !== "object")) {
            throw new Error(errors.dataNotObj);
        }
        function addIdAndClass() {
            if (id && !cls) {
                final += `<table id=${id}>`;
            }
            if (cls && !id) {
                final += `<table class=${cls}>`;
            }
            if (id && cls) {
                final += `<table id=${id} class=${cls}>`;
            }
            if (!id && !cls) {
                final += `<table>`;
            }
        }
        if (Array.isArray(data)) {
            const elTo = document.querySelectorAll(el);
            if (hasHeading) {
                addIdAndClass();
                final += `<thead><tr>`;
                for (let i = 0; i < data[0].length; i++) {
                    final += `<th>${data[0][i]}</th>`;
                }
                final += `</tr></thead><tbody>`;
            } else {
                addIdAndClass();
                final += `<tbody>`;
            }
            void function tbody() {
                let i;
                hasHeading ? i = 1 : i = 0;
                for (; i < data.length; i++) {
                    let tr = `<tr>`;
                    for (let j = 0; j < data[i].length; j++) {
                        tr += `<td>${data[i][j]}</td>`;
                    }
                    tr += `</tr>`;
                    final += tr;
                }
                final += `</tbody></table>`;
            }();
            for (let i = 0; i < elTo.length; i++) {
                elTo[i].innerHTML += final;
            }
            return;
        }
        if (!Array.isArray(data)) {
            if (data instanceof Object || typeof data === "object") {
                const elTo = document.querySelectorAll(el);
                if (data.data instanceof Object && !Array.isArray(data.data)) {
                    data.heading.unshift("");
                }
                if (data.heading) {
                    addIdAndClass();
                    final += `<thead><tr>`;
                    for (let i = 0; i < data.heading.length; i++) {
                        final += `<th>${data.heading[i]}</th>`;
                    }
                    final += `</tr></thead><tbody>`;
                } else {
                    addIdAndClass();
                    final += `<tbody>`;
                }
                void function tbody() {
                    if (!data.data) {
                        throw new Error(errors.noData);
                    }
                    if (Array.isArray(data.data)) {
                        for (let i = 0; i < data.data.length; i++) {
                            let tr = `<tr>`;
                            for (let j = 0; j < data.data[i].length; j++) {
                                tr += `<td>${data.data[i][j]}</td>`;
                            }
                            tr += `</tr>`;
                            final += tr;
                        }
                        final += `</tbody></table>`;
                    }
                    if (!Array.isArray(data.data) && typeof data.data === "object") {
                        for (const i in data.data) {
                            let tr = `<tr>`;
                            tr += `<td style="font-weight: bold;">${i}</td>`;
                            for (let j = 0; j < data.data[i].length; j++) {
                                tr += `<td>${data.data[i][j]}</td>`;
                            }
                            tr += `</tr>`;
                            final += tr;
                        }
                        final += `</tbody></table>`;
                    }
                }();
                for (let i = 0; i < elTo.length; i++) {
                    elTo[i].innerHTML += final;
                }
            }
        }
    },
    createList: function(li, el, type, id, cls) {
        if (!Array.isArray(li)) {
            throw new Error("The first argument must be an array");
        }
        if (typeof type !== "string") {
            throw new Error("The third argument must be a string");
        }
        if (Array.isArray(li)) {
            let list,
                final = ``;
            switch (type.toLowerCase()) {
                case "ul":
                    list = document.createElement("ul");
                    break;
                case "ol":
                    list = document.createElement("ol");
                    break;
                default:
                    throw new Error("The third argument must be 'ul' or 'ol'");
                    break;
            }
            if (id) {
                list.id = id;
            }
            if (cls) {
                list.className = cls;
            }
            for (let i = 0; i < li.length; i++) {
                list.innerHTML += `<li>${li[i]}</li>`;
            }
            const elTo = document.querySelectorAll(el);
            for (let i = 0; i < elTo.length; i++) {
                elTo[i].appendChild(list);
            }
        }
    },
    alert: function(txt) {
        if (typeof txt === "undefined" || !txt) {
            txt = "";
        }
        window.alert(txt);
    },
    repeat: function(code, secs, isMs) {
        let finalMs;
        isMs ? finalMs = secs : finalMs = secs * 1000;
        window.setInterval(code, finalMs);
    },
    page: {
        domain: document.domain,
        url: location.href,
        urlAnchor: location.hash,
        open: function(url, target) {
            window.open(url, target);
        },
        close: function() {
            window.close();
        },
    },
    viewport: {
        width: window.visualViewport.width,
        height: window.visualViewport.height,
        withScrollWidth: window.innerWidth,
        withScrollHeight: window.innerHeight
    },
    head: document.head,
    body: document.body
};

module.exports.skittr = webc;
module.exports.skittr = web;





