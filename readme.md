


# Overview



ExpressAuth is a simplicity inspired RESTful Express middleware to handle authentication features. It's still a work in progress so hang on for the published version!



# Usage



## Installation


To install it for use, use `npm`:

```bash
# npm install express-authy --save
```

Alternative with `yarn`:

```bash
# yarn add express-authy
```


## Basic w/ Default Options


You can use the `express-authy` library as follows:

```javascript
const express = require('express');
const ExpressAuthy = require('express-authy');
const server = express();
server.use(new ExpressAuthy());
server.listen(process.env.PORT);
```

This will set up `express-authy` at the root endpoint. With the default options,
the following endpoints will be created:

- `/access`
- `/forgot`
- `/login`
- `/logout`
- `/register`
- `/verify`



# Customizations



## Setting the Base Path


The following line of code creates the 6 endpoints, `/access`, `/forgot`, `/login`, `/logout`, `/register`, `/verify`:

```javascript
const ExpressAuthy = reuqire('express-authy');
// ...
server.use(new ExpressAuthy());
// ...
```

To change this to `/auth/:endpoints`, use:

```javascript
const ExpressAuthy = reuqire('express-authy');
// ...
server.use('/auth', new ExpressAuthy());
// ...
```


## Changing the Default Options


A `.get()` and `.set()` method of the `ExpressAuth` object allows you to alter and retrieve different options via a cursor. The method signatures are as follows:


### `.get( selector : {Array, String} )`


The `:selector` argument can be of an Array type or a String type and it points to the item in the options tree. For example, to get the required parameters of an endpoint, of which the structure is:

```javascript
// Defaults
{
  // ...
  param: {
    access: {
      // getting this
    }
  }
  // ...
}
```

We use:

```javascript
ExpressAuth.get(['param', 'access']);
```


### `.set( selector : {Array, String}, value : {Any} )`


The `:selector` property works in the same way as in `.get()`. The `:value` argument indicates the value to assign to the selected option. For example, to set the value of the option at `param.access.token` to the string `'token-id'`, we use:

```javascript
ExpressAuth.set(['param', 'access', 'token'], 'token-id');
```


## Options Tree


The options are defined with a tree structure. The `.get()` and `.set()` methods as described above are used to select the nested property as desired. For an example tree:

```json
{
  "a": {
    "b": {
      "c": "d",
      "e": {
        "f": 0
      }
    },
    "g": 1
  },
  "h": 2,
  "i": 3
}
```

Using `.get(['a', 'b', 'c'])` will return `"d"`.

Using `.get(['h'])` will return `2`.

Using `.set(['a', 'b', 'e', 'f'], 4)` will set the `0` to `4`.

Using `.set(['a'], 'a')` will result in the `"a"` branch being replaced with the string literal, `"a"`.


### Defaults


The defaults are defined as follows:

```javascript
var defaults = {
  /**
   * this defines the names of the keys used in the application
   * to refer to the different available actions
   */
  keys: [
    access: 'access',
    login: 'login',
    logout: 'logout',
    forgot: 'forgot',
    register: 'register',
    verify: 'verify',
  ],
  /**
   * this defines the http methods of the endpoints, use lowercase
   */
  method: {
    [defaults.keys.access]: 'get',
    [defaults.keys.login]: 'get',
    [defaults.keys.logout]: 'get',
    [defaults.keys.forgot]: 'get',
    [defaults.keys.register]: 'get',
    [defaults.keys.verify]: 'get',
  },
  /**
   * this defines the different model handlers available. models
   * encapsulate the logic behind CRUD operations on the user
   * accounts
   */
  model: {
    sequelize: {
      config: {
        /**
         * if your account table has extra columns that must be
         * filled to allow an insertion, use this to specify the
         * columns
         */
        extraColumns: {},
        /**
         * retrieves the sequelize configuration file as specified
         * in the :path property of this object
         */
        get: function() => {configuration},
        /**
         * returns a Sequelize model corresponding to the account
         * table
         */
        model: function(sequelize : Sequelize) => SequelizeModel,
        /**
         * specifies the column names for the email, password, nonce
         * and session fields
         */
        names: {
          columnEmail: 'email',
          columnPassword: 'password',
          columnNonce: 'nonce_token',
          columnSession: 'session_token',
        },
        /**
         * determines where to find the sequelize configuration as
         * used in the get() method of this object
         */
        path: './sequelize.json',
        /**
         * name of the table containing the accounts
         */
        table: 'Accounts',
        /**
         * length of token used for nonce generation
         */
        nonceTokenLength: defaults.options.nonceTokenLength
      },
      /**
       * these are the model handlers and are called by the Express
       * request handlers to make persistent changes
       */
      handle: {
        /**
         * verifies :token against tokens stored in the database,
         * resolves the promise with the identified account if the
         * token is valid, rejects the promise with a false boolean
         * otherwise
         */
        [defaults.keys.access]: function(token) : Promise,
        /**
         * selects a user identified with the email :email and
         * validates the user's password using :password. if both
         * :email and :password is specified, adds a session token.
         * if only :email is specified, sets the nonce token. in both 
         * cases, the promise is resolved with the user's account
         * on success. if user is not found or the password is invalid,
         * rejects the promise with a false boolean.
         */
        [defaults.keys.login]: function(email, password) : Promise,
        /**
         * removes the nonce and session token of the user. resolves with
         * a boolean true on successful removal of tokens, rejects with
         * a boolean false otherwise 
         */
        [defaults.keys.logout]: function(id) : Promise,
        /**
         * inserts a user account with the email :email and password
         * :password. resolves with the newly created account on success,
         * rejects with an error object otherwise. if :otherInfo is specified,
         * also inserts the specified key-values. :otherInfo should be a
         * key-value dictionary such that { [columnName]: value } is valid
         */
        [defaults.keys.register]: function(email, password, [ otherInfo ]) : Promise,
        /**
         * verifies if :token is associated with a user account. resolves
         * with the user account if it's found, rejects with a boolean
         * false otherwise
         */
        [defaults.keys.verify]: function(token) : Promise,
        /**
         * sets a new nonce for the email 
         */
        [defaults.keys.forgot]: function(email) : Promise,
      }
    }
  },
  handlers: {
    /**
     * if any of these are set to a function, the
     * handlers will call these with the intended
     * returned object
     */
    after: {
      [defaults.keys.access]: null,
      [defaults.keys.login]: null,
      [defaults.keys.logout]: null,
      [defaults.keys.register]: null,
      [defaults.keys.verify]: null,
      [defaults.keys.forgot]: null
    },
    /**
     * Express handler for the /access endpoint
     */
    [defaults.keys.access]: function(req, res, next) : void,
    /**
     * Express handler for the /login endpoint
     */
    [defaults.keys.login]: function(req, res, next) : void
    /**
     * Express handler for the /logout endpoint
     */
    [defaults.keys.logout]: function(req, res, next) : void
    /**
     * Express handler for the /register endpoint
     */
    [defaults.keys.register]: function(req, res, next) : void
    /**
     * Express handler for the /verify endpoint
     */
    [defaults.keys.verify]: function(req, res, next) : void
    /**
     * Express handler for the /forgot endpoint
     */
    forgot: function(req, res, next) : void
  },
  params: {
    required: {
      /**
       * defines the parameter name for the /access endpoint
       */
      [defaults.keys.access]: {
        token: 'token',
      },
      /**
       * defines the parameter names for the /login endpoint
       */
      [defaults.keys.login]: {
        userIdentifier: 'user-id',
        password: 'password',
      },
      /**
       * defines the parameter name for the /logout endpoint
       */
      [defaults.keys.logout]: {
        token: 'token',
      },
      /**
       * defines the parameter names for the /register endpoint
       */
      [defaults.keys.register]: {
        email: 'email',
        password: 'password',
        passwordConfirmation: 'password-confirmation',
      },
      /**
       * defines the parameter names for the /verify endpoint
       */
      [defaults.keys.verify]: {
        nonce: 'token',
      },
      /**
       * defines the parameter names for the /forgot endpoint
       */
      [defaults.keys.forgot]: {
        email: 'email',
      }
    },
    /**
     * returns the required parameters for a given
     * endpointId which can be any of the String values
     * defined in defaults.keys
     */
    get: function(endpointId) : Object
  },
  secret: {
    /**
     * relative locations to the private and public key files
     */
    keys: {
      private: './config/key.priv',
      public: './config/key.pub'
    },
    /**
     * this value is returned when calling symmetric()
     */
    password: 'password',
    /**
     * returns an object like: {
     *   decryptor : String,
     *   encryptor : String
     * } which is the file content from the
     * defaults.secret.keys.private and
     * defaults.secret.keys.public file
     */
    asymmetric: function(),
    /**
     * returns an object like: {
     *   decryptor : String,
     *   encryptor : String
     * } which is equal to defaults.secret.password
     */
    symmetric: function()
  },
  options: {
    /**
     * defines which model to use, which should
     * correspond to a key in defaults.model
     */
    modelStrategy: 'sequelize',
    /**
     * defines what type of encryption to use which
     * should be a key in defaults.secret
     */
    secretStrategy: 'symmetric',
    /**
     * defines what type of token to use which should
     * be a key in defaults.token
     */
    tokenStrategy: 'jwt',
    /**
     * determines the length of nonces used
     */
    nonceTokenLength: 32
  },
  /**
   * defines the endpoints as called by a front-end
   */
  slug: {
		access: 'access',
		login: 'login',
		logout: 'logout',
		forgot: 'forgot',
		register: 'register',
		verify: 'verify',
  },
  token: {
    jwt: {
      /**
       * returns a JSON web token given the payload
       * argument :payload
       */
      generate: function(payload : Object) : String,
      /**
       * returns the payload stored in the JSON web
       * token :token
       */
      validate: function(token : String) : Object
    }
  }
};
```



# Under The Hood Notes



## Sequelize


ExpressAuth currently only uses Sequelize to manage database operations so we can
target more platforms.



# Contributing



Fork this repo, create your stuff and issue a pull request(:


## Getting Started


Clone the repo locally.

To install dependencies, use yarn install:

```bash
# yarn install
```

To initialize the test environment, you can run the following command:

```bash
# npm run dev:setup
```

This will set up the SQLite3 database, create a public/private key pair for the tests to use, and create and run database migrations.


## Running Tests


You will need to run the above command to set up the test environment before the tests will work as expected!


### Code Quality


You can run the code quality tests using:

```bash
# npm run eslint
```


### Unit Tests


You can run the Mocha unit tests using:

```bash
# npm test
```

You can also run it continuously in the background watching for file changes with:

```bash
# npm test:watch
```

To test a single file, you can run:

```bash
# npm run test:this -- /path/to/file
```

To test and watch a single file, you can run:

```bash
# npm run test:watch:this -- /path/to/file
```


### Coverage


Coverage files will be generated in `/coverage`.

More notes on contributing coming soon!

# Changelog

## v0 (pre-release)

### 0.1.1

- code refactor
- documentation updates

### 0.1.0

- initial commit