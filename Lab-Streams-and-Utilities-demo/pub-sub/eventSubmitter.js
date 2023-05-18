const EventEmitter = require('events');

const eventEmitter = new EventEmitter();

eventEmitter.on('user-add', () => {
    console.log('New user is added');
});

eventEmitter.on('user-add', (username, age) => {
    console.log(`New user is added 2: ${username} ${age} years old`);
});

eventEmitter.on('user-remove', () => {
    console.log('User is removed');
});

eventEmitter.emit('user-add', 'Pesho', 20);
eventEmitter.emit('user-remove');