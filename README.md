<p align="center">
  <img alt="OS.js Logo" src="https://raw.githubusercontent.com/os-js/gfx/master/logo-big.png" />
</p>

[OS.js](https://www.os-js.org/) is an [open-source](https://raw.githubusercontent.com/os-js/OS.js/master/LICENSE) desktop implementation for your browser with a fully-fledged window manager, Application APIs, GUI toolkits and filesystem abstraction.

[![Build Status](https://travis-ci.org/os-js/osjs-database-auth.svg?branch=master)](https://travis-ci.org/os-js/osjs-database-auth)
[![Maintainability](https://api.codeclimate.com/v1/badges/074b81c78fd887a7def5/maintainability)](https://codeclimate.com/github/os-js/osjs-database-auth/maintainability)
[![Support](https://img.shields.io/badge/patreon-support-orange.svg)](https://www.patreon.com/user?u=2978551&ty=h&u=2978551)
[![Back](https://opencollective.com/osjs/tiers/backer/badge.svg?label=backer&color=brightgreen)](https://opencollective.com/osjs)
[![Sponsor](https://opencollective.com/osjs/tiers/sponsor/badge.svg?label=sponsor&color=brightgreen)](https://opencollective.com/osjs)
[![Donate](https://img.shields.io/badge/liberapay-donate-yellowgreen.svg)](https://liberapay.com/os-js/)
[![Donate](https://img.shields.io/badge/paypal-donate-yellow.svg)](https://paypal.me/andersevenrud)
[![Community](https://img.shields.io/badge/join-community-green.svg)](https://community.os-js.org/)

# OS.js v3 Database Auth Adapter

This is the Database Auth Adapter for OS.js v3. Built on [TypeORM](http://typeorm.io/).

To set this up, you need to do the following steps:

1. Set up your database
2. Install
3. Configure Server
4. Configure Client
5. Configure CLI
6. Manage Users

Please see the [OS.js Authentication Guide](https://manual.os-js.org/v3/guide/auth/) for general information.

**You can find a complete example using docker on [github](https://github.com/andersevenrud/osjsv3-db-auth-example)**

## Set up your database

Before you begin you need to chose a database and set this up on your host system.

This documentation uses **mysql** by default, but you can use [any SQL flavor](#notes) that TypeORM supports.

The database and credentials you set up in this step has to be reflected in the configurations below.

Assuming you have installed mysql (refer to you operating system documentation) and logged into the server:

```bash
# Create a new database called "osjsv3"
mysql> CREATE DATABASE osjsv3;

# Creates a new used called "osjsv3" with password "secret"
mysql> CREATE USER 'osjsv3'@'localhost' IDENTIFIED BY 'secret';

# Give permission for the user to access the database
mysql> GRANT ALL ON osjsv3.* TO 'osjsv3'@'localhost';
```

> *Note that the mysql users are not related to OS.js users.*

<!-- -->

> If you've already installed `@osjs/database-settings` module you can skip this step and use the same database and credentials.

## Installation

Install the required OS.js module and database driver:

```bash
npm install --save --production @osjs/database-auth
npm install --save mysql
```

### Configure Server

To connect the server with the database authentication module, you'll have to modify your Server bootstrap script.

In your **`src/server/index.js`** file:

```javascript
// In the top of the file load the library
const dbAuth = require('@osjs/database-auth');

// Locate this line in the file and add the following:
osjs.register(AuthServiceProvider, {
  args: {
    adapter: dbAuth.adapter,
    config: {
      connection: {
        // Change this to match your local database server
        type: 'mysql',
        host: 'localhost',
        username: 'osjsv3',
        password: 'secret',
        database: 'osjsv3',

        // See TypeORM documentation for more settings
      }
    }
  }
});
```

> **NOTE:** You have to restart the server after making these changes.

### Configure Client

By default OS.js is set up to log in with the `demo / demo` user for demonstration purposes.

In your **`src/client/config.js`** file:

```javascript
module.exports = {
  public: '/',

  // Either comment out this section, or remove it entirely
  /*
  auth: {
    login: {
      username: 'demo',
      password: 'demo'
    }
  }
  */
};
```

> **NOTE:** You have to rebuild using `npm run build` after making these changes.

### Configure CLI

To get CLI commands to manage users, you'll have to modify your CLI bootstrap script.

In your **`src/cli/index.js`** file:

```javascript
// In the top of the file load the library
const dbAuth = require('@osjs/database-auth');

// Create a database authentication instance
const dbCli = dbAuth.cli({
  // Change this to match your local database server
  type: 'mysql',
  host: 'localhost',
  username: 'osjsv3',
  password: 'secret',
  database: 'osjsv3',

  // See TypeORM documentation for more settings
});

// Then finally add 'dbCli' to the tasks array
module.exports = {
  discover: [],
  tasks: [dbCli]
};
```

### Manage Users

You can now manage users with ex. `npx osjs-cli <task>`

> The `npx` command comes with npm 5.2 or later, but if you for some reason don't have this you can [install it manually](https://www.npmjs.com/package/npx).
> Or alternatively use `node node_modules/.bin/osjs-cli <task>`

#### Available tasks:

* `user:list` - Lists users
* `user:add --username=STR` - Adds user (as admin)
* `user:add --username=STR --groups=GROUP1,GROUP2` - Adds user with groups
* `user:pwd --username=STR` - Changes user password
* `user:remove --username=STR` - Removes user

Example: `npx osjs-cli user:add --username=anders`.

## Notes

If you want to use **sqlite** run `npm install sqlite3` and change the connection options to:

```javascript
{
  connection: {
    type: 'sqlite',
    database: 'path/to/database.sql'
  }
}
```

For more information about configuration: https://typeorm.io/

If you don't want to repeat the connection information over multiple files, for example create `src/database-connection.js` with the contents:

```javascript
module.exports = {
  type: 'mysql',
  host: 'localhost',
  username: 'osjsv3',
  password: 'secret',
  database: 'osjsv3',
}
```

and then in your scripts:

```javascript
{
  connection: require('../database-connection.js')
}
```

## Contribution

* **Become a [Patreon](https://www.patreon.com/user?u=2978551&ty=h&u=2978551)**
* **Support on [Open Collective](https://opencollective.com/osjs)**
* [Contribution Guide](https://github.com/os-js/OS.js/blob/v3/CONTRIBUTING.md)

## Documentation

See the [Official Manuals](https://manual.os-js.org/v3/) for articles, tutorials and guides.

## Links

* [Official Chat](https://gitter.im/os-js/OS.js)
* [Community Forums and Announcements](https://community.os-js.org/)
* [Homepage](https://os-js.org/)
* [Twitter](https://twitter.com/osjsorg) ([author](https://twitter.com/andersevenrud))
* [Google+](https://plus.google.com/b/113399210633478618934/113399210633478618934)
* [Facebook](https://www.facebook.com/os.js.org)
* [Docker Hub](https://hub.docker.com/u/osjs/)
