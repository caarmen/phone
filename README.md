# Retro chat app

This project is a chat application which allows users to see each other typing in real time (character-by-character).

It is inspired by [Unix talk](https://en.wikipedia.org/wiki/Talk_(software)) and the OpenVMS Phone utility.

**Green theme**
<img src="docs/green.png">

**Amber theme**
<img src="docs/amber.png">

## Running

It's possible to run the application:
* From the docker image hosted on the ghcr.io.
* From the sources in this project.
* In development mode, running redis from Docker and the phone server and client directly on the local machine.

The details of these options are provided just below.

### Running from the hosted docker image

You'll need the [docker/compose-prebuilt.yml](docker/compose-prebuilt.yml) file. You can either clone this project or copy the contents of just that file to your machine.

Then run `docker-compose` specifying this file:

```
docker-compose --file docker/compose-prebuilt.yml up
```

Open the application in your web browser: http://localhost:8000/client/index.html

### Running from sources

```
docker-compose --file docker/compose-build.yaml up --build
```

Open the application in your web browser: http://localhost:8000/client/index.html


### Running for development
Run only redis from Docker:
```
docker compose --file docker/compose-build.yaml up redis
```

#### Server
* Go into the `server` folder.
* Activate your python virtual environment.
* Configure environment variables:
  - Copy `.env.template` to `.env`
  - Set `REDIS_DSN="redis://localhost:6379/"`
  - Set `CORS_ALLOWED_ORIGINS` to contain the host of your local webapp. To access it from your machine, set `CORS_ALLOWED_ORIGINS=["http://localhost:5173"]`. 
* Run the server: `python -m phone.main`.

#### Client
* Go into the `client` folder.
* Run the client: `yarn dev --host 0.0.0.0`
* Open the app at http://localhost:5173/client

Any changes to the client code will be hot reloaded (no need to restart or build the client).

#### Access the webapp from another machine (CORS config)
To access the webapp from another machine:

From the `client` folder, run `yarn build`. This will copy a static distribution of the app to `client/dist`.
This folder is served as static resources, by the server.
You will also need to add your machine's IP address to the `CORS_ALLOWED_ORIGINS`.

For example, if your machine is at 192.168.1.12:

`server/.env`:
```
CORS_ALLOWED_ORIGINS=["http://localhost:5173", "http://192.168.1.12:8000"]
```

Restart the server (`python -m phone.main`) and access the application at http://192.168.1.12:8000/client/index.html.
