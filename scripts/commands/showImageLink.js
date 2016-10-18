'use strict';

const scriptInfo = {
  name: 'showImageLink',
  file: 'showImageLink.js',
  desc: 'Announce a Image link for the user triggering the command',
  createdBy: 'Dave Richer'
};

module.exports = app => {
  const showImageLink = (to, from, text, message) => {
      if(!app.WebServer) {
        return;
      }
      let path = app.WebServer.namedRoutes.build('urls', {
          channel: to
      });
      app.say(to, `You can view all images from ${to} at ${ app.Config.express.address}${path}`);
  };
  app.Commands.set('images', {
      desc: 'Show users the link to images',
      access: app.Config.accessLevels.identified,
      call: showImageLink
  });

};