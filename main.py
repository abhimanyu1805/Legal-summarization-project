import website
from website import sockets,  functions, poker 

app, db, socketio = website.create_app()
socketio.run(app, allow_unsafe_werkzeug=True)

