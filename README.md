# fe3.slave.center
Slave.Center the Game - JS front-end

This is the web-client for Slave.Center online game.

Built using Backbone.JS framework and Bootstrap.
This web application is Mobile-first and is optimized for mobile browsers.

INSTALL
As long as the application has no server side JS it may be distributed as is with a common 
web-server of your choice. The usage of any Cache is totally supported. No special setting 
are required and you are free to use any best practices for static documents distribution.

The only available setting of the application is the URL for API to interact with. 
By default it uses the main Slave Center API at https://api.slave.center

NOTE
In order for the application to operate the API must be set correctly. I will describe some
details in this document not to search for them for a long time when API is set up on
some new machine.

The API uses its own OAuth2 server to generate tokens. The main URLs are:
http://api.slave.center/o/applications/
http://api.slave.center/o/authorize
http://api.slave.center/o/token
http://api.slave.center/o/revoke_token

The back-end Application should be registered in the OAuth server as 'sm_00_api'.
The server uses Public tokens and Password authorization for clients.

(c) ngr 2014-2015
