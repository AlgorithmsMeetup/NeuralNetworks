'use strict';
var express = require('express');
var neuralNetRouter = express.Router();
var neuralNetLogic = require('./neuralNetLogic.js');

neuralNetRouter.get('/formatData', function(req, res) {
  console.log('heard a request to formatData');
  neuralNetLogic.formatData(req, res);
  res.send('Formatted the data');
});

neuralNetRouter.get('/startNet', function(req, res) {
  console.log('heard a request to startNet');
  neuralNetLogic.startNet(req, res);
  res.send('The network has been trained');

});

neuralNetRouter.get('/loadAndTestBrain', function(req, res) {
  console.log('heard a request to loadAndTestBrain');
  neuralNetLogic.loadAndTestBrain(req, res);
});

module.exports = neuralNetRouter;
