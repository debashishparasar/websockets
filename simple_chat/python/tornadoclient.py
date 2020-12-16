from websocket import create_connection

def communicate():
    print(">> Initiating connection...")
    ws = create_connection("ws://localhost:5002/")
    result =  ws.recv()
    print(">> Received '%s'" % result)
    while True:
       message = input(">> Your message $ ")
       ws.send(message)
       print(">> Sent message")
       result =  ws.recv()
       print(">> Received '%s'" % result)
if __name__ == '__main__':
    communicate()
