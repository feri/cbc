/**
 * Master Glome App
 */
var GlomeApp = Ember.Application.extend(
{
  // configuration
  apiHost: 'http://catalogue.glome.me',
  apiKey: '4bb413fff13dabc7fcb5088287dcc98f',
  // do not change
  loginPost: '/api/users/login.json',
  logoutGet: '/api/users/logout.json',
  productsIndex: '/api/products.json',
  generateGlomeIdPost: '/api/applications/generate_glomeid.json',
  // show personalized content
  personalizedContent: true,
  // contact info
  contact:
  {
    email: 'contact@glome.me',
    subject: 'Interested in Glome Wallet for Android'
  },
  // insert the reason of the maintenance, false otherwise
  maintenance: false //'You may experience slow loading and response times due to our scheduled maintenance. We are sorry for the inconvenience.'
});

/**
 * Current App
 */
var App = GlomeApp.create(
{
  LOG_TRANSITIONS: true, // basic logging of successful transitions
  LOG_TRANSITIONS_INTERNAL: true, // detailed logging of all routing steps
  LOG_ACTIVE_GENERATION: true,
});

/**
 *
 */
App.Serializer = DS.RESTSerializer.extend(
{
  normalizePayload: function(type, payload)
  {
    return payload;
  },
  extractSingle: function(store, type, payload, id, requestType)
  {
    var o = {};
    switch (type)
    {
      case App.User:
        o['user'] = payload;
        break;
      case App.Product:
        o['product'] = payload;
        break;
      case App.Category:
        o['categories'] = payload;
        break;
      case App.Pairing:
        o['pairing'] = payload;
        break;
      case App.Action:
        // recorded actions have no ids
        id = 0;
        o['action'] = payload;
        break;
      case App.Program:
        o['program'] = payload;
        break;
      case App.Sync:
        if (payload.length == 0)
        {
          payload = [];
        }
        id = null;
        o['sync'] = payload;
        break;
      default:
        alert('Unhandled type in extractSingle: ' + type);
    };
    return this._super(store, type, o, id, requestType);
  },
  extractArray: function(store, primaryType, payload)
  {
    var o = {};
    switch (primaryType)
    {
      case App.User:
        o['users'] = payload;
        break;
      case App.Product:
        o['products'] = payload;
        break;
      case App.Category:
        o['categories'] = payload;
        break;
      case App.Pairing:
        o['pairing'] = payload;
        break;
      case App.Action:
        id = 0;
        o['action'] = payload;
        break;
      case App.Program:
        o['program'] = payload;
        break;
      case App.Sync:
        o['sync'] = payload;
        break;
      default:
        alert('Unhandled type in extractArray: ' + primaryType);
    };
    return this._super(store, primaryType, o);
  }
});


/**
 *
 */
App.Adapter = DS.RESTAdapter.extend(
{
  host: App.apiHost,
  namespace: 'api',
  corsWithCredentials: true,
  // all REST calls should end with .json
  buildURL: function(type, id)
  {
    var url = ''
    url = this._super(type, id) + '.json';
    console.log('return URL for type: ' + type + ', id: ' + id + '. URL is: ' + url);
    return url;
  },
  // the server does not return JSON API compatible results (missing root)
  findAll: function(store, type, sinceToken)
  {
    //console.log('find all called for ' + type);
    return this._super(store, type, sinceToken).then(function(data)
    {
      var items = [];
      data.forEach(function (item)
      {
        items.push(item);
      });

      return items;
    });
  },
  // the server does not return JSON API compatible results (missing root)
  findQuery: function(store, type, query)
  {
    var res = null;

    //~ console.log('findQuery called for ' + type.typeKey + ', query: ');
    //~ console.log(query);
    switch (type.typeKey)
    {
      case 'sync':
        res = this.ajax(this.buildURL(type.typeKey, query['glomeid']), 'GET', { data: query });
        break;
      case 'product':
        if (query['keywords'])
        {
          res = this.ajax(this.buildURL(type.typeKey, 'search'), 'GET', { data: query });
        }
        else
        {
          res = this._super(store, type, query);
        }
        break;
      default:
        res = this._super(store, type, query);
    }

    return res.then(function(data)
    {
      //console.log(data);
      var items = [];

      if (data.length)
      {
        data.forEach(function (item)
        {
          //console.log(item);
          if(item)
          {
            items.push(item);
          }
        });
      }
      return items;
    });
  }
});

/**
 *
 */
App.Store = DS.Store.extend(
{
  adapter: App.Adapter
});

/**
 *
 */
DS.RawTransform = DS.Transform.extend(
{
  deserialize: function(deserialized)
  {
    return deserialized;
  },

  serialize: function(serialized)
  {
    return serialized;
  }
});

/**
 *
 */
App.register('transform:raw', DS.RawTransform);

/**
 * Log errors within promises
 */
Ember.RSVP.configure('onerror', function(error)
{
  Ember.Logger.assert(false, error);
});
