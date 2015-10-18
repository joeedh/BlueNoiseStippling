#a simple web server to replace the buggy one in python's standard library

import os, os.path, sys, time, socket, traceback, stat
from math import *

INDEXFILE = "/bluenoise6.html"
PORT = 8080

mimetypes = {
  ".js"   : "application/x-javascript",
  ".html" : "text/html",
  ".json" : "application/x-javascript",
  ".glsl" : "text/plain",
  ".png"  : "image/png",
  ".jpg"  : "image/jpeg",
  ".obj"  : "text/plain"
};

def get_mime(path):
  path = path.strip().lower()
  
  for k in mimetypes:
    if path.endswith(k):
      return mimetypes[k]
      
  return "application/x-octet-stream"
  
class SocketFile:
  def __init__(self, con):
    self.sock = con
    self.writebuf = b""
    self.readbuf = b""
    con.setblocking(False)
  
  def __next__(self):
    bsize = 2048
    wsize = 1024*8
    
    try:
      buf = self.sock.recv(2048)
      self.readbuf += buf
    except BlockingIOError:
      pass
    
    try:
      buf = self.writebuf
      if len(buf) > wsize:
        buf = buf[:wsize]
      
      self.sock.send(buf)
      
      self.writebuf = self.writebuf[len(buf):]
    except BlockingIOError:
      pass
      
  def write(self, buf):
    self.writebuf += buf
    
  def read(self, max=2048):
    buf = self.readbuf
    if len(buf) > max:
      buf = buf[:max]
      self.readbuf = self.readbuf[max:]
    else:
      self.readbuf = b""
      
    return buf
    
def Connection(con, addr, cls):
  con.setblocking(False)
  file = SocketFile(con)
  
  while 1:
    sbuf = b""
    yield
    
    while 1:
      file.__next__()
      
      buf = file.read()
      yield 1
      
      if (len(buf) == 0): continue;
      sbuf += buf
      
      if b"\r\n\r\n" in sbuf:
        break;
    
    lines = [l.strip() for l in sbuf.split(b"\r\n")]
    
    method = lines[0];
    headers = {}
    
    path = method[method.find(b" ")+1:method.find(b" HTTP")].strip()
    method = method[:method.find(b" ")]
    
    print(str(method + b" " + path, "latin-1"))
    
    for l in lines[1:]:
      key = l[:l.find(b":")].strip()
      val = l[l.find(b":")+1:].strip()
      #print(key, val)
      headers[str(key, "latin-1")] = str(val, "latin-1")
    
    h = cls()
    h.path = str(path, "latin-1")
    h.method = str(method, "latin-1")
    h.headers = headers
    h.rfile = file
    h.wfile = file
    
    getattr(h, "do_"+str(method, "latin-1").strip())()
    
    #print("\n")
    yield
    
class Server:
  def __init__(self, addr, cls):
    self.connections = []
    self.addr = addr
    self.cls = cls
    self.socket = socket.socket()
  
  def start(self):
    self.socket.bind(self.addr)
    self.socket.listen(10)
    sock = self.socket 
    sock.setblocking(False)
    
    while 1:
      dellist = []
      
      try:
        ret = sock.accept()
        #print(ret[1])
        
        con = Connection(ret[0], ret[1], self.cls)
        self.connections.append(con)
      except BlockingIOError:
        pass
        
      for con in self.connections:
        try:
          for i in range(45):
            con.__next__()
        except StopIteration:
          print("  connection closed")
          dellist.append(con)
        except:
          traceback.print_exc()
          dellist.append(con);
          
      for con in dellist:
        self.connections.remove(con)
        
      time.sleep(1.0/420.0)
      pass

def bs(s):
  if type(s) == bytes:
    return s
  return bytes(str(s), "latin-1")
  
class Handler:
  def __init__(self):
    self.path = ""
    self.headers = {}
    self.wfile = None
    self.rfile = None
  
    self.send_headers = []
    self.body = b""
    self.code = 200
    
  def send_response(self, code):
    self.body = bs(self.body)
    
    buf = b"HTTP/1.1 " + bs(code) + b" None\r\n"
    
    had_content = False 
    
    headers = [
      [b"Connection", b"keep-alive"]
    ] + self.send_headers
    
    for h in headers:
      if h[0] == b"Content-length":
        had_content = True
        
      buf += bs(h[0]) + b":" + b" " + bs(h[1]) + b"\r\n"
    
    if not had_content:
      buf += b"Content-length: " + bs(len(self.body)) + b"\r\n"
    
    buf += b"\r\n"
    buf += self.body
    
    self.wfile.write(buf)
    
  def add_header(self, key, val):
    self.send_headers.append([bs(key), bs(val)])
  
  def set_body(self, body):
    self.body = body
  
  def send_error(self, error):
    body = b"Error: " + bs(error)
    
    self.add_header("MimeType", "text/plain")
    self.set_body(body)
    self.send_response(error)
  
  def do_GET(self):
    path = self.path.strip()
    dir = os.getcwd()
    
    if path == "/" or path == "":
      path = INDEXFILE
    
    abspath = os.path.abspath(os.path.normpath(dir+os.path.sep+path))
    if not abspath.startswith(dir):
      self.send_error(404)
      return
    
    if not os.path.exists(abspath):
      self.send_error(404)
      return
      
    st = os.stat(abspath)
    if stat.S_ISDIR(st.st_mode):
      self.send_error(405)
      return
      
    file = open(abspath, "rb")
    buf = file.read()
    file.close()
    
    self.set_body(buf)
    
    self.add_header("MimeType", get_mime(path))
    self.send_response(200)
    
server = Server(("", PORT), Handler)
print("serving at port", PORT)

server.start()
