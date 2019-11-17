import {Utils} from "./utils";

export class tlClient {

    setTgMeAuthorized(canRedirect) {
        if (location.protocol !== 'http:' && location.protocol !== 'https:') {
            return false;
        }

        Storage.get('tgme_sync').then(function (curValue) {
            const ts = Utils.tsNow(true);

            if (canRedirect &&
                curValue &&
                curValue.canRedirect === canRedirect &&
                curValue.ts + 86400 > ts) {
                return false;
            }

            Storage.set({tgme_sync: {canRedirect: canRedirect, ts: ts}});

            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = '//telegram.me/_websync_?authed=' + (canRedirect ? '1' : '0');
            script.onerror = function () {
                script.remove();
            };
            document.body.appendChild(script);
        });
    }
}
