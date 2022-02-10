# Habit tracking app  
Full stack habit tracking app based on **React**, **React-native** and **Django** frameworks

## Architecture 
* Project is based on a weabpp, an Android mobile app and a django-rest-framework based API.
* Application's db is stored on Google Cloud Firestore.
* API has been deployed to Google Cloud Platform App Engine. 
* Webapp has been deployed to Firebase Hosting.
\
![alt text](https://github.com/fabiaiz/habit-tracker/blob/master/images/architecture_full.png?raw=true)

## Mobile app architecture
\
![alt text](https://github.com/fabiaiz/habit-tracker/blob/master/images/architecture_app.png?raw=true)
## Web app architecture
\
![alt text](https://github.com/fabiaiz/habit-tracker/blob/master/images/architecture_webapp.png?raw=true)

## Mobile app interface
\
![alt text](https://github.com/fabiaiz/habit-tracker/blob/master/images/mobile_1.png?raw=true)
![alt text](https://github.com/fabiaiz/habit-tracker/blob/master/images/mobile_2.png?raw=true)
![alt text](https://github.com/fabiaiz/habit-tracker/blob/master/images/mobile_3.png?raw=true)

## Web app interface
\
![alt text](https://github.com/fabiaiz/habit-tracker/blob/master/images/webapp.png?raw=true)

## Code structure
* **backendapi** folder contains Django API code, you can run it with **python3 manage.py runserver** (you need to set your google-credentials.json as ENV variable).
* **habit-tracker-ejected** folder contains React-native application (it's tested only on Android but it should run also on IOS) you can run it on your device/emulator with **react-native run-android**.
* **habit-tracker-web** folder contains React web application, you can run it locally with **npm start**.

