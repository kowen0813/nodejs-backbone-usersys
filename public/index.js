/**
* SETUP
**/
var app = app || {};

/**
* MODELS
**/
app.Users = Backbone.Model.extend({
  url: function() {
    return '/1/user';
  },
  defaults: {
    errors: [],
    errfor: {},
    users: []
  }
});

app.UserInfo = Backbone.Model.extend({
  url: function() {
    return '/1/user/' + this.attributes.id;
  },
  id: '',
  defaults: {
    errors: [],
    errfor: {},
    user: {}
  }
});

/**
* VIEWS
**/
app.ListView = Backbone.View.extend({
	el: '#userList',
  template: _.template( $('#tmpl-user-list').html() ),
  events: {
    'click #btn-filter': 'click',
    'click [data-tag=user]': 'listUser'
  },
  initialize: function() {
    var self = this;

    this.model = new app.Users();
    this.listenTo(this.model, 'sync', this.render);
    this.listenTo(this.model, 'change', this.render);
    this.model.fetch({
      success: function() {
        var users = self.model.get('users');

        users.sort(function (a, b) {
          if (a.Age > b.Age) return 1;
          else if (a.Age < b.Age) return -1;
          return 0;
        });
      }
    });
  },
  render: function() {
    this.$el.html(this.template( this.model.attributes ));

    this.$el.find('[data-tag=user]').each(function () {
      var me = $(this);
      var age = '' + me.data('age');

      me.addClass('age-' + age.slice(0, 1) + '0');
    });
  },
  click: function(e) {
    var me = $(e.target);
    var filter = me.data('filter');

    this.$el.find('[data-tag=user]').each(function () {
      $(this).addClass('hide');
    });

    this.$el.find('.' + filter).each(function () {
      $(this).removeClass('hide');
    });
  },
  listUser: function(e) {
    var id = $(e.target).data('user-id');
    app.userView.model.set('id', id);
    app.userView.model.fetch();
  }
});

app.UserView = Backbone.View.extend({
  el: '#userInfo',
  template: _.template( $('#tmpl-user-info').html() ),
  events: {
  },
  initialize: function() {
    var self = this;

    this.model = new app.UserInfo();
    this.listenTo(this.model, 'sync', this.render);
    this.listenTo(this.model, 'change', this.render);
  },
  render: function() {
    this.$el.html(this.template( this.model.attributes ));
  }
});

/**
* BOOTUP
**/
$(document).ready(function() {
  app.listView = new app.ListView();
  app.userView = new app.UserView();
});