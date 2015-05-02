Description:
============
wp-chattr: Wordpress chat using jQuery + Node.JS

Release:
========
v1.0.0
Alpha release, many bugs and security issues likely present.

Wordpress Setup
===============
Install as a usual wordpress plugin.
Settings found in Settings -> Chattr

Chat can be enabled on any post or page via the shortcode [chattr title="Welcome to chat"]

Server setup:
=============
cd server
npm install
node webchat

Known issues:
=============
No username security or authentication. Nick name collisions possible.
No error catching on server side
