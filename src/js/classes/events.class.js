export class Events {

    emit(event, data) {
        window.dispatchEvent(new CustomEvent(event, {data: data}));
    }
}
