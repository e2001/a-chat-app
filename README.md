# Chat App 


#### Installation and running 

1. Install the dependencies 
2. start server :  'node ./server/server.js'   
```sh
$ npm run 1-server
```
3. start angular app : 'ng serve'  
```sh
$ npm run 1
```

note : server and angular app communicate on port 5555

-----------------------------

#### chat app : how to use

chat app has 2 pages 
  - join room page 
  - chat page 

on the join-room page , you need to supply a chat name (like 'bob' ) and chat room name (like 'room 1')

users can join a room , all users in a room can see messages sent in that room.

for example : open two tabs and join the same room with different chat names 

-----------------------------
#### special features

1. the chat page is protected , a user must join a room first. 
2. users can join a room , all users in a room can see messages sent in that room.
3. chat history is loaded from local storage 
4. app shows alert when disconnected, and re sends 'join-room' once it reconnects 
    ( to test stop server while angular app is running, and then start the server again)

-----------------------------
### Design notes 
```sh

```
 
#### data-store and reactive observable pattern 
 
  - state "single source of truth" is kept in 2 data-store :  message.store.ts  room-info-store.ts  
  - reactive observable pattern  : components subscribe to changes in the data-store and react to it. 
  - MessageManagerService subscribes to socket-io events (and adds/sets data in  data-store) 
  - MessageManagerService is the main point of interaction ( see flow below )

----------

#### event flow    server -> client 

  - server sends socket-io events 
  - messages-socket.service is a wrapper to the socket-io npm library.
  - MessageManagerService subscribes to socket-io events ( via observable exposed by messages-socket.service)
  - MessageManagerService will orchestrate incoming messages , outgoing messages and storage 
  - MessageManagerService adds/sets data in data-store , saves to local storage   
  - components subscribe to data-store and show data 

----------

#### event flow    client -> server 

  - ChatPageComponent calls MessageManagerService methods ( like add message )
  - MessageManagerService calls messages-socket.service methods ( like add message )
  - messages-socket.service emits the events + data 

----------

####  page component and display components
 
  - the chat-page.component uses these child components : chat-sidebar , chat-massages, chat-footer
  - the chat-page.component ( smart component ) injected with services , subscribes to observables and passes data to display child components
  - display child components are presentational , have no logic or state, they simply show data passed to them
  - ( note : in case of deep nesting, an alternative approach can be to inject the data-stores into child components and have each child components subscribe to store observables )

chat-page.component 
1. chat-page.component is injected with the various services and stores 
2. chat-page.component links the observables from the various services and stores and passes the data to child components 
3. chat-page.component listen on events from child components , and calls method on the services

-----------------------------
####  data structure for massages
 
chat massages are kept in buckets 
the number of messages a bucket can have (default is 2) is set by calling the static ChatMessageBucket.setMessgeCapacity();
for this assignment the AppComponent sets this number in the constructor.

-----------------------------
####  lazy loading of history 

the design decision to partition messages into buckets was done in order to support lazy loading of history  
the idea is to stor each bucket in local storage , and then the buckets can be loaded as needed (lazy)

Note : I have not implemented loading history in a lazy way, but I have made the design preparations for it.


-----------------------------
####  local storage

ChatLocalStorageService service handles storage ( in browser local storage )
services use the ChatLocalStorageService to save and retrieve data from storage, yet are unaware of how it is done

Note : we can use the useClass to provide a storage service to be injected 

-----------------------------
####  data encryption 

1. data is encrypted between server and client 
2. data is stored encrypted.
3. data is not encrypted inside the angular app during run time, so developing and debugging is easier 
4. encrypted is done in a dedicated service called : CryptoService
5. CryptoService is used only in one location by MessageManagerService 
( MessageManagerService will orchestrate incoming messages outgoing messages and storage ) 

-----------------------------
####  console log

I have left some console log statements on server
and also one console log statement in the client 

-----------------------------

