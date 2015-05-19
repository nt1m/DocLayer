# scratchpad
A minimalist yet powerful document editor.

Scratchpad is a new kind of document editor. The goal of Scratchpad is to provided a distraction-free place to write, and to make it easy to create rich, highly interactive documents.

Features:

 - text formatting
 - research
 - find in page
 - components you can add to documents (images, charts, maps, embeds, videos). More of these to come!
 - dropbox integration


In the future:

 - more interactive components
 - a more powerful find in page (regex, find+replace)

# How to use

Create a new dropbox app at https://www.dropbox.com/developers/apps/. Set the permission type to "app folder".<br>
In the ```config.js``` file, replace DROPBOX_APP_KEY with the key of the app you just created, and set ```basepath``` to the location of the scratchpad folder on your server. Remember the protocol and the trailing slash. ("https://example.com/" is correct, "example.com" is not). <br>
You will need an ssl certificate in order to make requests to the Dropbox API, so you will need to get one if you don't have one already. <br>
Upload the app to a server, using the path you specified in config.js, and add the url of the scratchpad directory to the OAuth redirects list in the dropbox app console.

# Contributing

Look at the issues for things to work on, especially those labeled "bug".
