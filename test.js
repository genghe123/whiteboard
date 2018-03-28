'use strict';
var express = require('express');
var eventEmitter = require('events').EventEmitter;
var event = new eventEmitter();

event.on('some_event', function () {
    console.log('some_event emitted');
});
setTimeout(function () {
    event.emit('some_event');
}, 3000);
