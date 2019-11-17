export const loadStyleSheet = (path, callback) => {

    const head = document.getElementsByTagName('head')[0];
    const link = document.createElement('link');
    const timeout_id = setTimeout(function () {
        clearInterval(interval_id);
        clearTimeout(timeout_id);
        head.removeChild(link);
        callback.call(window, false, link);
    }, 15000);

    link.setAttribute('href', path);
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('type', 'text/css');

    let sheet, cssRules;

    // get the correct properties to check for depending on the browser
    if ('sheet' in link) {
        sheet = 'sheet';
        cssRules = 'cssRules';
    } else {
        sheet = 'styleSheet';
        cssRules = 'rules';
    }

    // start checking whether the style sheet has successfully loaded
    const interval_id = setInterval(function () {
        try {
            if (link[sheet] && link[sheet][cssRules].length) {
                // SUCCESS! our style sheet has loaded
                clearInterval(interval_id);
                clearTimeout(timeout_id);
                callback.call(window, true, link);
            }
        } catch (e) {
        }
    }, 10);

    // insert the link node into the DOM and start loading the style sheet
    head.appendChild(link);

    return link;
};

export const loadJS = (url, callback) => {
    var e = document.createElement("script");
    e.src = url;
    e.type = "text/javascript";
    e.addEventListener('load', callback);
    document.getElementsByTagName("head")[0].appendChild(e);
};
