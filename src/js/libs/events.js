export const Events = {

    on(event, callback) {
        window.addEventListener(event, callback, false);
    },

    emit(event, data) {
        window.dispatchEvent(new CustomEvent(event, {data: data}));
    }
};
