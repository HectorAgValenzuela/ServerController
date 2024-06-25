Hi, this is a project for a webpage that can turn on and turn off your minecraft server hosted in a remote machine. I used an VM Instance of Oracle (the free tier is very good), an then hosted a minecraft server, you can do this with the [resources](https://www.bing.com/ck/a?!&&p=13214a3a26bb9e0dJmltdHM9MTcxOTI3MzYwMCZpZ3VpZD0xOGI2NjNlMC0zODUzLTY3NTktMmZhNC03N2I1MzkzMDY2MmEmaW5zaWQ9NTIxMQ&ptn=3&ver=2&hsh=3&fclid=18b663e0-3853-6759-2fa4-77b53930662a&psq=minecraft+server+download&u=a1aHR0cHM6Ly93d3cubWluZWNyYWZ0Lm5ldC9lbi11cy9kb3dubG9hZC9zZXJ2ZXI&ntb=1) that Mojang gives to you and this excellent [tutorial](https://youtu.be/0kFjEUDJexI?si=6ICYGS2t0M5KBN0F).
# Getting Started
As long you remote machine have Ubuntu (or another Linux distribution) you can make use of these commands. Feel free of change the commands to be compatible with any other OS.  
To make your server work with this app you have to create an `.env` file where you create the following variables:

* `host`- This is the IP of your remote machine. In Oracle you can find it in the Instance Details of of your VM
* `portServer`- This is the port you have to connect in your local machine. 
* `usernameHost`- This is the username you use to log into your remote machine
* `privateKey`- This is the private key that your instance gives to you to connect, is your pass code. 
* `PORT`- The port where the app its gonna be launched, if not specified is 3000
* `serverDirectory`- This is the name of your directory in your remote machine. This directory has to be in the ubuntu folder so the script can access to it.

To start the app you just have to run the following command in the root folder of the app.
```
npm start
```

Now you can access to your localhost and interact with the page (not the best frontend that I have ever done, but works). 

# What the codes does
What this codes does is: It connect to the remote machine, goes to the minecraft server directory with 
```
cd {{ serverDirectory }}
```
and then starts the server with the following command.
```
sudo screen java -Xmx1024M -Xms1024M -jar server.jar nogui
```
where `server.jar` is the name of your server. To turn off  the server it just execute the command 
```
sudo killall screen
```
As you can see, the starting command creates an screen that will be running in the background until you stop it, so be aware of that.
