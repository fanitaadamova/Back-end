const listeners = {};

const publish = (eventName) => {
    listeners[eventName].forEach(listener => listener());
};

//eventListener e function
const subscribe = (eventName, eventListener) => {
    if (!listeners[eventName]) {
        listeners[eventName] = [];
    }
    listeners[eventName].push(eventListener);
};

const eventBus = {
    publish,
    subscribe
};

module.exports = eventBus;