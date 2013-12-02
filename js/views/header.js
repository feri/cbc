
/**
 *
 */
App.HeaderView = Ember.View.extend(
{
  tagName: 'div',
  role: 'navigation',
  templateName: 'header',
  attributeBindings: ['role'],
  classNames: ['navbar', 'navbar-fixed-top', 'header'],

  leftBox: Ember.View.extend(
  {
    tagName: 'li',
    templateName: 'leftBox',
    classNames: ['leftbox', 'col-sm-2'],

    click: function(e)
    {
      var elem = parseInt(Ember.$('.header .leftbox .menu.visible').attr('data-elem'));
      var prevElem = elem;

      switch (elem)
      {
        case 1:
          // pairing screen
        case 2:
          // info screen
          ++elem;
          break;
        case 3:
          // redeem screen
          elem = 1;
          this.get('controller').get('controllers.sync').send('getSyncCode');
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
    classNames: ['centerbox', 'col-sm-9'],
  }),
  rightBox: Ember.View.extend(
  {
    tagName: 'li',
    templateName: 'rightBox',
    classNames: ['rightbox', 'col-sm-1'],
    click: function(e)
    {
      Ember.$('.content').toggleClass('openhdr');
      Ember.$('.header, .leftbox, .centerbox, .rightbox').toggleClass('open');

      if (Ember.$('.header').hasClass('open'))
      {
        var elem = Ember.$('.header .leftbox .menu.visible').attr('data-elem');
        if (elem == '1')
        {
          this.get('controller').get('controllers.sync').send('getSyncCode');
        }
        Ember.$('.header .centerbox .menu[data-elem="' + elem + '"], .header .centerbox .menu[data-elem="' + elem + '"] *').fadeIn('fast').css('display', 'inline-block');
      }

      return false;
    }
  })
});
