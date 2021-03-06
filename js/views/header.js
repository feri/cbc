
/**
 *
 */
App.HeaderView = Ember.View.extend(
{
  tagName: 'nav',
  id: 'glomebar',
  role: 'navigation',
  templateName: 'header',
  attributeBindings: ['role', 'id'],
  classNames: ['navbar', 'navbar-fixed-top', 'header'],


  leftBox: Ember.View.extend(
  {
    tagName: 'li',
    templateName: 'leftBox',
    classNames: ['leftbox', 'col-xs-2', 'col-sm-2'],

    didInsertElement: function()
    {
      var qrcode = this.get('controller').get('controllers.sync').get('qrcode');
      console.log('qr placeholder activated: ' + qrcode);
      Ember.$('#qrcode').qrcode({width: 100,height: 100, text: qrcode});
      console.log('qr placeholder activated: ' + qrcode);
    },

    click: function(e)
    {
      var elem = parseInt(Ember.$('.header .leftbox .menu.visible').attr('data-elem'));
      var prevElem = elem;

      switch (elem)
      {
        case 1:
          // redeem screen
          this.get('controller').get('controllers.user').send('reload');
          this.get('controller').get('controllers.sync').send('getSyncCode');
          var qrcode = this.get('controller').get('controllers.sync').get('qrcode');
          Ember.$('#qrcode').empty();
          Ember.$('#qrcode').qrcode({width: 100,height: 100, text: qrcode});
          ++elem;
          break;
        case 2:
          // pairing screen
          ++elem;
          break;
        case 3:
          // info screen
          this.get('controller').get('controllers.user').send('getEarnings');
          elem = 1;
          break;
      }

      Ember.$('.header .leftbox .menu[data-elem="' + prevElem + '"]').fadeOut('fast', function()
      {
        Ember.$('.header .leftbox .menu[data-elem="' + prevElem + '"]').toggleClass('visible');
        Ember.$('.header .leftbox .menu[data-elem="' + elem + '"]').fadeIn('fast', function()
        {
          Ember.$('.header .leftbox .menu[data-elem="' + elem + '"]').toggleClass('visible');
        });
      });

      Ember.$('.header .centerbox .menu[data-elem="' + prevElem + '"]').fadeToggle('medium', function()
      {
        Ember.$('.header .centerbox .menu[data-elem="' + elem + '"]').fadeToggle('medium').css('display', 'inline-block');
      });

      return false;
    }
  }),
  centerBox: Ember.View.extend(
  {
    info: true,
    tagName: 'li',
    templateName: 'centerBox',
    classNames: ['centerbox', 'col-xs-9', 'col-sm-9'],
    actions:
    {
      'ack': function()
      {
        Ember.$('.redeem .response').fadeOut('fast', function()
        {
          Ember.$('.redeem .money').fadeIn('slow');
        });
      }
    }
  }),
  rightBox: Ember.View.extend(
  {
    tagName: 'li',
    templateName: 'rightBox',
    classNames: ['rightbox', 'col-xs-1', 'col-sm-1'],

    click: function(e)
    {
      Ember.$('.content').toggleClass('openhdr');
      Ember.$('.header, .leftbox, .centerbox, .rightbox').toggleClass('open');

      if (Ember.$('.header').hasClass('open'))
      {
        this.get('controller').get('controllers.user').send('reload');
        var elem = Ember.$('.header .leftbox .menu.visible').attr('data-elem');
        if (elem == '1')
        {
          this.get('controller').get('controllers.sync').send('getSyncCode');
        }
        Ember.$('.header .centerbox .menu[data-elem="' + elem + '"], .header .centerbox .menu[data-elem="' + elem + '"] *').fadeIn('fast');
      }

      this.get('controller').get('controllers.user').send('getEarnings');

      return false;
    }
  })
});
