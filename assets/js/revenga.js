var Revenga = Revenga || {};

(function(fn) {
  fn.carrito = undefined;
  fn.productos = [];

  fn.paintMap = function() {
    contactMap = new GMaps({
      div: '#contactMap',
      lat: -34.8357249,
      lng: -56.1918285
    });

    contactMap.addMarker({
      lat: -34.8357249,
      lng: -56.1918285,
      title: 'Taller Revenga',
      click: function(e) {
        alert('Revenga Ltda.\n' +
          'Av de las Instrucciones 1489\n' +
          'Montevideo, Uruguay\n' +
          'Tel: (+598) 2354 2004\n' +
          'Cel: 099 620 522\n' +
          'info@revenga.com.uy\n');
      }
    });
  }

})(Revenga);
