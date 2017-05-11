import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('acercade');
  this.route('pilas');
  this.route('manual');
  this.route('api');
  this.route('experimentos');
});

export default Router;
