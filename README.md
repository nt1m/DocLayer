# DocLayer
A minimalist yet powerful document editor.

DocLayer is a new kind of document editor. The goal of DocLayer is to provided a distraction-free place to write, and to make it easy to create rich, highly interactive documents.

Features:

 - text formatting
 - research
 - find in page
 - sharing
 - components you can add to documents (images, charts, maps, embeds, drawings).
 - dropbox integration


# How to use

Create a new dropbox app at https://www.dropbox.com/developers/apps/. Set the permission type to "app folder".<br>
In the ```config.js``` file, replace DROPBOX_APP_KEY with the key of the app you just created, and set ```basepath``` to the location of the docLayer folder on your server. Remember the protocol and the trailing slash. ("https://example.com/" is correct, "example.com" is not). <br>
You will need an ssl certificate in order to make requests to the Dropbox API, so you will need to get one if you don't have one already. <br>
Register your domain at [Factmint] (https://factmint.com/charts). <br>
Upload the app to a server, using the path you specified in config.js, and add the url of the docLayer directory to the OAuth redirects list in the dropbox app console.
