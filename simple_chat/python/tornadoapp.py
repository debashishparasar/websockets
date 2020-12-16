import tornado.web
import tornado.httpserver
import tornado.ioloop
import tornado.websocket as ws
from tornado.options import define, options
import time
import monkeyclient

define('port', default=5002, help='Server port')

class web_socket_handler(ws.WebSocketHandler):
    @classmethod
    def route_urls(claz):
        return [(r'/',claz, {}),]
    
    def setup(self):
        self.last = time.time()
        self.stop = False
    
    def open(self):
        self.setup()
        print("New client connected")
        self.write_message("Seems you have found me :-)")
        
    def on_message(self, message):
        print("received message {}".format(message))
        self.write_message("{}".format(monkeyclient.get_response([message])))
        self.last = time.time()
    
    def on_close(self):
        print("Client connection closed!")
        #self.loop.stop()
    
    def check_origin(self, origin):
        return True

def start_server():
    app = tornado.web.Application(web_socket_handler.route_urls(), debug=True)
    server = tornado.httpserver.HTTPServer(app)
    server.listen(options.port)

    tornado.ioloop.IOLoop.instance().start()


if __name__ == '__main__':
    start_server()
