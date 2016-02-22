# A Conjurer's Introduction to Machine Learning in JavaScript

PreCourse Steps:
* **Look at the Kaggle Compeition: https://www.kaggle.com/c/GiveMeSomeCredit**
* **Run the node.js server**
  2. If you're not familiar with Node.js, fork and clone my repo
    1. Go to https://github.com/AglorithmsMeetup/learningMachines and click Fork in the upper right. 
    2. `cd ~/Desktop` changes directory to the Desktop. Feel free to use whichever directory you want.
    3. `git clone https://github.com/YOUR_USERNAME_HERE/learningMachines` creates a folder on your Desktop that is a clone of your fork
    1. `cd learningmachines` changes the directory into that folder
    2. `subl .` to open up the folder in sublime, assuming you have the subl command installed
    3. Install nodemon globally npm install -g nodemon
    4. Back in the terminal: `cd neuralNet`, and then `cd server`
    5. `npm install`. If this gives you an error, try `sudo npm install`
    6. `nodemon --max-old-space-size=3000 server.js`. This line does three things: it starts your node server based on the path you give it from the current directory (server.js). It starts nodemon on it, which means it will restart whenever you make a change to any file in the server directory. It allocates 3000 MB of memory to node, so that it doesn't crash if node runs over the 1.76 GB typically allocated to Node.js. You can adjust this number based on your system's capabilities and the problem you're solving.
    6. You can now make api calls to this server, either through your browser (http://localhost:5000/neuralNet/startNet), or through curl on your command line `curl localhost:5000/neuralNet/startNet`
    7. You now have a running node server on your computer, with all the right dependencies installed!
* **The key files in our node server are in the neuralNet folder.**
  1. neuralNetLogic.js is where we have all the actual JS logic built out. 

* **Your turn!**
Here are the things I expect you to do
  1. Start the net
  2. Understand how the network is being trained and tested
  3. Modify the network parameters
  4. Add in new data to train the net. Rewrite what's currently in formatData with new data points, or 'features' as they're called in data science, that are combinations of the raw data we already have. Examples would include exact ratios that the net currently can't access because we've already transformed the data into a number between 0 and 1.

* **Extra Credit**
  1. Handle cases that have missing data ("0") differently than cases that have full data

* **Fantasy Mode**
  1. Parallelize the training of multiple nets at the same time. Training each net is synchronous, so parallelizing won't help you train a single net any faster. But you could try creating multiple versions that have different parameters (number of nodes, hidden layers, learning rate, etc.) and train those in parallel with each other. 
