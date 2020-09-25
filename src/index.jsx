import React from 'react';
import ReactDOM from 'react-dom';
import {createBrowserHistory} from 'history';
import $dom from "./dom";
import Screen from "@wrapper/ui/lib/screen";
import Config, {adminUrl} from "@wrapper/ui/lib/gql-state/config";
import Body from "./body";
import BrowserPreload from "./preload";
import "./templates";

const browserHistory = createBrowserHistory();

// Set refresher on screen
Screen.refreshBrowser = url => window.location.assign(url);

// Record every visited page
browserHistory.listen(function reloadHistory(location, action) {
    if ('POP' !== action) {
        return;
    }

    const pathname = filterPathName(location.pathname);

    Screen.load(pathname);
});

Screen.subscribe(updateBrowserUrl);
Screen.subscribe(updateDocument);

function Loader() {
    return [
        <Body key="screen-body"/>,
        <BrowserPreload key="screen-loader"/>
    ];
}

export function loadScreen() {
    const doc = document.getElementById("doc-root");

    ReactDOM.render(<Loader/>, doc);

    // Load screen
    let pathname = filterPathName(window.location.pathname);

    Screen.load(pathname);
}

export function loadErrorScreen() {
    const doc = document.getElementById("doc-root");

    ReactDOM.render(<Loader/>, doc);
    Screen.load("/404");
}

function filterPathName(pathname) {
    if (Screen.isAdmin()) {
        const endPoint = Config.get("adminEndPoint"),
            pattern = new RegExp(`^${endPoint}`);
        
        pathname = pathname.replace(pattern, "");
        pathname = pathname || "/";
    }

    return pathname;
}

function updateBrowserUrl({url, client}) {
    if (Screen.isAdmin()) {
        const endPoint = Config.get("adminEndPoint"),
            pattern = new RegExp(`^${endPoint}`);

        if (!url.match(pattern)) {
            url = adminUrl(url);
        }
    }

    browserHistory.push(url);
}

function updateDocument({title,description, client, typeNow}) {
    if (title) {
        window.document.title = title;
    }

    const _class = [client, typeNow],
        body = $dom("body");

    body.attr("class", _class.join(" "));
}