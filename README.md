# Welcome to the WaveNote To-do App!

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Cloning the Repository
You can clone the repository by typing the the following command into the console in your preferred directory:
```
git clone https://github.com/orlandojpwastaken/to-do-app/tree/main
```

## Inital Setup
In the project directory, you first need to run :

### `npm install`

which will install all the dependencies required for the application to work.

## Firebase Setup

Before running the web application, please setup a Firebase project using the Firebase Console and link it to the web application. You can do this by following these steps:

1. Go to Firebase Console.
2. Click "Create a Project", enter a name, and complete the setup.
3. In the Project Settings, navigate to the General tab.
4. Under "Your apps", click "Web" ``</>`` to create a new web app.
5. Firebase will generate a configuration object containing your unique credentials. It will look like this:
```  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
```
6. Copy these values and store them securely in a ```.env``` file located in the root directory of your project. Use the following format:
```
REACT_APP_FIREBASE_API_KEY="YOUR_API_KEY"
REACT_APP_FIREBASE_AUTH_DOMAIN="YOUR_AUTH_DOMAIN"
REACT_APP_FIREBASE_PROJECT_ID="YOUR_PROJECT_ID"
REACT_APP_FIREBASE_STORAGE_BUCKET="YOUR_STORAGE_BUCKET"
REACT_APP_FIREBASE_MESSAGING_SENDER_ID="YOUR_MESSAGING_SENDER_ID"
REACT_APP_FIREBASE_APP_ID="YOUR_APP_ID"
```

This will successfully link the web application with your Firebase project. From here, you'd want to set up the necessary features which will be **Authentication** and a **Firestore Database**, which you can do by doing the following:

1. Enable Authentication and select the ```Email/Password``` option.
2. Enable Firestore Database and follow through with setup steps with preferred options.
3. Make a collection with the name ```users```

With this, Firebase should already be fully set up and the application is ready to run.

## Running the Web Application


After everything is set up, the application is ready to run and you can input the following command into your terminal to run the application:

```npm start```

The terminal will then return a local URL where the application is running that you can access by pressing on the link ```Local``` URl using ```ctrl+click```.
