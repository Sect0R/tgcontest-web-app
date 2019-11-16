import TdClient from 'tdweb/dist/tdweb';
import {Config} from "../config";
import {Database} from './database.class';
import {Events} from './events.class';

export class telegramApi {
    constructor() {
        this.database = new Database();

        this.database.exists((exists) => {
            // this.clientUpdate({ '@type': 'clientUpdateDatabaseExists', exists });

            this.client = new TdClient(Config.tdweb);
            this.client.onUpdate = update => {
                if (update['@type'] === 'updateFile') {
                    console.log('receive updateFile file_id=' + update.file.id, update);
                } else {
                    console.log('receive update', update);
                }

                Events.emit('update', update);
            };
        })
    }


}
