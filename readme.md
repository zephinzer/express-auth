# ExpressAuth

ExpressAuth is a simplicity inspired RESTful Express middleware to handle authentication
features. It's still a work in progress so hang on for the published version!

To install it, use `npm`:

```bash
# npm install express-authy
```

Alternative with `yarn`:

```bash
# yarn add express-authy
```

You can then use the `express-auth` library as follows:

```javascript
const express = require('express');
const ExpressAuth = require('express-auth');
const server = express();
server.use(new ExpressAuth());
server.listen(process.env.PORT);
```

## Configuration

### Defaults

The following tree shows the default configurations with comments on their utility:

```javascript
var defaults = {
  keys: [
		'access',
		'login',
		'logout',
		'forgot',
		'register',
		'verify',
  ],
  method: {
		access: 'get',
		login: 'get',
		logout: 'get',
		forgot: 'get',
		register: 'get',
		verify: 'get',
  },
  model: {
    sequelize: {
      config: {
        extraColumns: {},
        get: function() => {configuration},
        path: './sequelize.json',
        model: function(sequelize : Sequelize) => SequelizeModel,
        names: {
          columnEmail: 'email',
          columnPassword: 'password',
          columnNonce: 'nonce_token',
          columnSession: 'session_token',
        },
        table: 'Accounts'
      },
      handle: {
        access: function(token),
        login: function(email, password),
        logout: function(id),
        register: function(email, password, [ otherInfo ]),
        verify: function(token),
        
      }
    }
  },
  handlers:
  params: {
    required: {
      access: {
        token: 'token',
      },
      login: {
        userIdentifier: 'user-id',
        password: 'password',
      },
      logout: {
        token: 'token',
      },
      register: {
        email: 'email',
        password: 'password',
        passwordConfirmation: 'password-confirmation',
      },
      verify: {
        nonce: 'token',
      },
      forgot: {
        email: 'email',
      }
    },
    /**
     * returns the required parameters for a given
     * endpointId which can be any of the String values
     * defined in defaults.keys
     */
    get: function(endpointId)
  },
  secret: {
    keys: {
      private: './config/key.priv',
      public: './config/key.pub'
    },
    password: 'password',
    /**
     * returns an object like: {
     *   decryptor : String,
     *   encryptor : String
     * }
     */
    asymmetric: function(),
    /**
     * returns an object like: {
     *   decryptor : String,
     *   encryptor : String
     * }
     */
    symmetric: function()
  },
  options: {
    modelStrategy: 'sequelize',
    secretStrategy: 'symmetric',
    tokenStrategy: 'jwt'
  },
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
      generate: function(payload),
      /**
       * returns the payload stored in the JSON web
       * token :token
       */
      validate: function(token)
    }
  }
};
```

### Customising ExpressAuth

We provide a `.get()` and `.set()` method from the `ExpressAuth` object.

For example, to alter the options slug.access, use:

```javascript
ExpressAuth.set(['slug', 'access'], 'access-changed');
```

Another example, to get the option in options.modelStrategy, use:

```javascript
ExpressAuth.get(['options', 'modelStrategy']);
```


## Under The Hood Notes

### Sequelize

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