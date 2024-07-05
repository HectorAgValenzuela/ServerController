const socket = io();

    socket.on('output', function(data) {
      const consoleOutput = document.getElementById('console-output');
      consoleOutput.innerHTML += data.replace(/\n/g, '<br>');
      consoleOutput.scrollTop = consoleOutput.scrollHeight;
    });

    document.getElementById('encender-form').addEventListener('submit', function(e) {
      e.preventDefault();
      fetch('/encender', { method: 'POST' })
        .then(response => response.text())
        .then(data => {
          console.log('Servidor encendido:', data);
        })
        .catch(error => console.error('Error al encender el servidor:', error));
    });

    document.getElementById('apagar-form').addEventListener('submit', function(e) {
      e.preventDefault();
      fetch('/apagar', { method: 'POST' })
        .then(response => response.text())
        .then(data => {
          console.log('Servidor apagado:', data);
        })
        .catch(error => console.error('Error al apagar el servidor:', error));
    });

    document.getElementById('reiniciar-form').addEventListener('submit', function(e) {
      e.preventDefault();
      fetch('/reiniciar', { method: 'POST' })
        .then(response => response.text())
        .then(data => {
          console.log('Servidor reiniciado:', data);
        })
        .catch(error => console.error('Error al reiniciar el servidor:', error));
    });