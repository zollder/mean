

# MEAN stack +
- NodeJS
- Express
- Bootstrap
- Jade
- Mongoose
- MongoDB
- Docker

## Usage

#### Start and configure MongoDB docker container
```
sudo apt-get install mongodb-clients
```
docker pull mongo
```
docker run --name mongodb -d -p 27017:27017 mongo
```
mongo localhost
db.createUser({ user:'<username>', pwd:'<password>', roles:[{role:"userAdminAnyDatabase", db:"admin" }]});

#### Install node dependencies and start application
```
npm install
npm start
```
or
```
npm install -g nodemon
nodemon


## Developing

From the command line run:


## Testing
	
## Tools

## Heroku DB:
your_db_uri => mongodb://<dbuser>:<dbpassword>@<db-host>:<db-port>/<db-name>
heroku config:set MONGODB_URI=your_db_uri

## Live demo

[Open live demo](https://stark-garden-46120.herokuapp.com)


