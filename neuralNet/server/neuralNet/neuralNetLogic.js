var path = require('path');
var fs = require('fs');
var brain = require('brain');

var TYPE_INPUT = 'input';
var TYPE_OUTPUT = 'output';

// Our Neural Network
var net = new brain.NeuralNetwork({
      hiddenLayers: [4]
});


module.exports = {
  startNet: function(req,res) {
    // grab all the data from the db
    var verbose = false;
    var data = module.exports.loadData();
    var formattedData = module.exports.formatData(data);

    var data = module.exports.splitData(formattedData);
    var trainingData = data['training'];
    var testingData = data['testing'];

    module.exports.logDataStructure(TYPE_INPUT, trainingData);

    module.exports.trainBrain(trainingData, testingData, verbose);
  },

  trainBrain: function(trainingData, testingData, verbose) {
    console.log('Training your very own Brain');

    console.log('Neural Network meta information', net);
    net.train(trainingData, {
      errorThresh: 0.05,  // error threshold to reach
      iterations: 50,   // maximum training iterations
      log: true,           // log progress periodically
      logPeriod: 10,       // number of iterations between logging
      learningRate: 0.6    // learning rate
    });

    console.log('Done training brain');
    // once we've trained the brain, write it to json to back it up
    module.exports.backUpNetwork()

    // now test the results and see how our machine did!
    module.exports.testBrain(testingData, verbose);
  },


  //Test our brain with a given set of testData
  //Logs the output of default rate at that prediction level
  testBrain: function(testData, verbose) {
    var output = net.run(testData);
      for(var i = 0; i < testData.length; i++) {
        testData[i]['prediction'] = net.run(testData[i]['input']);
    }
    module.exports.logDataStructure(TYPE_OUTPUT, testData);
    module.exports.logPredictions(testData, verbose);
  },


  logPredictions: function(data, verbose) {
    for (observation in data) {
      var defaulted = data[observation]['output']['defaulted'];
      if (defaulted == 0) {
        defaulted = 'did not default';
      } else {
        defaulted = 'defaulted';
      }
      var prediction = data[observation]['prediction']['defaulted'];

      if (verbose === true) {
        console.log('Person number ' + observation + ': ' + prediction + ' predicted probability of defaulting but actually ' + defaulted);
      }
    }

  },


  // split the data into a test set (20% of the data) and a training set (80% of the data)
  splitData: function(data) {
    var splitData = {
      'training': [],
      'testing': []
    };

    for(var i = 0; i < data.length; i++) {
      if(Math.random() > .8) {
        splitData['testing'].push(data[i]);
      } else {
        splitData['training'].push(data[i]);
      }
    }
    return splitData;
  },

  //Takes our raw data input, roughly normalizes it, and transforms it into numbers between 0 and 1 like our net expects
  //You can ignore this until extra credit
  formatData: function(data) {
    console.log('Formatting Data');

    var formattedResults = [];

    for (var i = 0; i < data.length; i++) {
      var item = data[i];

      var obs = {};
      obs.input = {};
      obs.output = {
        defaulted: item['SeriousDlqin2yrs']
      };

      //if the utilization rate is below 1, we divide it by 3 to make it smaller (taking the cube root would make it larger);
      if(item.creditUtilization < -999999) {
        obs.input.utilizationRate = item['RevolvingUtilizationOfUnsecuredLines'] /3;
      } else {
        //otherwise we take the cube root of it, and then divide by 37 (which is the max number we would have after cube rooting ).
        obs.input.utilizationRate = 0.2
      }

      obs.input.age = item.age/109;
      obs.input.thirtyDaysLate = item['NumberOfTime30-59DaysPastDueNotWorse'] / 98;
      obs.input.monthlyIncome = Math.sqrt(item['MonthlyIncome']) / 1735;
      obs.input.openCreditLines = Math.sqrt(item['NumberOfOpenCreditLinesAndLoans'])/8;
      obs.input.ninetyDaysLate = Math.sqrt(item['NumberOfTimes90DaysLate']) / 10;
      obs.input.realEstateLines = item['NumberRealEstateLoansOrLines'] / 54;
      obs.input.sixtyDaysLate = Math.sqrt(item['NumberOfTime60-89DaysPastDueNotWorse']) / 10;
      obs.input.numDependents = Math.sqrt(item['NumberOfDependents']) / 5;
      formattedResults.push(obs);
    }
    console.log('Finished formatting the data');
    return formattedResults;

  },

  loadData: function() {
    console.log('Loading Data');
    var rawData = require('../db/training.json');
    var formattedResults = [];
    var data = []

    var num_items = Object.keys(rawData['age']).length;

    for (var ix = 0; ix < num_items; ix++) {
      var new_obj = {};
      for (var key in rawData) {
        var value = rawData[key][ix];
        new_obj[key] = value;
      }
      data.push(new_obj);
    }
    return data;
  },

  logDataStructure: function(label, data) {
    console.log('-----------------------------------------------------------');
    console.log(label + ' Data Format:');
    console.log(data[0]);
    console.log('-----------------------------------------------------------');
  },

  //Writes the neural net to a file for backup
  //You can ignore this 
  writeBrain: function(json) {
    var fileName = 'hiddenLayers' + net.hiddenSizes + 'learningRate' + net.learningRate + new Date().getTime();
    fs.writeFile(fileName, JSON.stringify(json), function(err) {
      if(err) {
        console.error('sad, did not write to file');
      } else {
        console.log('wrote to file', fileName);
      }
    });
  },


  // loads a saved neural net and tests it on the dataset
  // testing it on the entire dataset as we are doing here is an anti-pattern; you would want to test it only on a holdout set of test data that the machine hasn't already been trained on
  loadAndTestBrain: function(req,res) {
    var data = module.exports.loadData();
    var formattedData = module.exports.formatData(data);
    var file_name = req['name'];

    var data = module.exports.splitData(formattedData);
    fs.readFile(file_name, 'utf8', function(err, data) {
      if(err) {
        console.error(err);
      } else {
        net.fromJSON(JSON.parse(data));
        res.send('Loaded the brain! Testing it now.')
        module.exports.testBrain(formattedData);
      }
    });
    module.exports.testBrain(formattedData);
  },


  backUpNetwork: function() {
    var jsonBackup = net.toJSON();
    module.exports.writeBrain(jsonBackup);
  }

};
