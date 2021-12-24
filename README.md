# Xenia

Xenia is a self-hosted identity provider designed for small users communities. It aims to centralize your users information as well as define their access rights across your web applications.

## Motivation

Deploying personal projects on the web often requires some authentication layer to protect your data from unexpected visitors. It requires:

- creating login page and webservice
- creating users table and model (storing basic information, handling hashed passwords, ...)
- implementing a session token mechanism (as well as refresh token for better user experience)

Also, you might want to allow some of your family members or friends (but not anyone) to register. It requires:

- setting up dedicated page to register and webservice
- implementing an invitation codes mechanism (setting up table & model, checking validity, deleting after use, ...)

You may as well need some other features such as change or reset passwords, delete accounts...

As your portfolio grows, you need to code very same features for each of your projects. The purpose of Xenia is to reduce this boilerplate through OAuth2 and OpenID Connect.

## Setup overview

1. Setup a MongoDB instance (you can use [MongoDB Atlas](https://www.mongodb.com/atlas/database) which provides you with a free cloud instance)
1. Start your Xenia instance (See section "Running Xenia" below) and create a admin user
1. Register a new client (ie. webapp) from the admin panel and add access to your admin user
1. Configure your webapp to connect to your Xenia instance using OAuth2 and OpenID Connect (OIDC). This step may be a bit overwhelming so I created some plugins that do all the job for you.
1. That's it!

If you want to grant access to your app, just create a new invitation code with access rights from the admin panel.

## Limitations

### Clients type

Xenia is meant to be used with [confidential clients](https://datatracker.ietf.org/doc/html/rfc6749#section-2.1) only. In other words, Xenia is suited for the following use-cases:

- Single-Page Applications (eg. Vue, React, ...) with a back-end (eg. Express)
- Multi-page Applications (eg. Express with EJS)

### Community size

As mentioned earlier, Xenia is suited for small users community for the following reasons:

- Invitation codes are required to register to your Xenia instance. You will have to manually generate and share a new code for every new user.
- When creating a new client, you can either allow any registered users to access it or manually select the ones who are.

## Running Xenia

Xenia is shipped as a Docker image and can be run with the following command:

```bash
docker run -it -p 3000:3000 -e MONGODB_URI='[YOUR_MONGODB_URI]' -e JWT_KEY=[YOUR_JWT_KEY] chamboug/xenia:[VERSION_NUMBER]
```

- MONGODB_URI: More information [here](https://docs.mongodb.com/manual/reference/connection-string/). Don't forget to wrap it inside single quotes.
- JWT_KEY: Just like any other website, Xenia needs a secret key to sign session tokens. Just use some long and random string.
- VERSION_NUMBER: Get it from [Docker Hub](https://hub.docker.com/repository/docker/chamboug/xenia/tags).

## Plugins

I wrote some plugins that take care of all the authentication flow for you. Take a look at these projects:

- [Vue 3](https://github.com/chamboug/xenia-vue-plugin)
- [Express (for SPA)](https://github.com/chamboug/xenia-express-spa-plugin)

Plugins for your favorite language or framework are missing? Learn how to implement the OAuth2 and OIDC flow yourself using [this sequence diagram](docs/oauth2.md)!
