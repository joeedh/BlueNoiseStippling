importScripts("require.js");


self.onmessage = function(e) {
  let data = e.data;
  
  data = new Float64Array(data);
  
  if (data.length == 4) { //okay message
    return;
  }
  
  postMessage(data);
  close();
}
