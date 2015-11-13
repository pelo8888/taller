(function() {
  var app = angular.module('pelo', []);

  app.controller('RecomendedController', function($scope, $http) {
    this.products = recomended;

    $http.get('json/recomended.json')
      .then(function(res) {
        $scope.todos = res.data;
      });
  });




  var recomended = [{
    description: 'Lamparas - Halogena 12V 55W H7 X-Treme Power Vision',
    images: [
      'images/shop/products/300x450/halogen/pr1.jpg',
      'images/shop/products/300x450/halogen/pr1.jpg'
    ],
    price: 550.00,
    category: 'boy'
  }, {
    description: 'Espejo deportivo vitalone izq. base metal',
    images: [
      'images/shop/products/300x450/espejo/1.jpg',
      'images/shop/products/300x450/espejo/1.jpg'
    ],
    price: 387.00,
    category: 'boy'
  }, {
    description: 'Cera autobrillo gatillo 650CC Revigal',
    images: [
      'images/shop/products/300x450/limpieza/1.jpg'
    ],
    price: 118.00,
    category: 'boy'
  }, {
    description: 'Cubre Asientos - Negro Gris',
    images: [
      'images/shop/products/300x450/asiento/1.jpg'
    ],
    price: 781.9,
    category: 'boy'
  }, {
    description: 'Lamparas - Halogena 12v 55w H3 Crystal Vision Kit',
    images: [
      'images/shop/products/300x450/halogen/4.jpg'
    ],
    price: 660.00,
    category: 'boy'
  }, {
    description: 'Cubre Autos - Cubre Camionetas Anti Granizo XXL',
    images: [
      'images/shop/products/300x450/cubreauto/1.jpg'
    ],
    price: 3320.00,
    category: 'boy'
  }, {
    description: 'Tazas De Rueda - Rodado 13 Jgo. 4 Piezas',
    images: [
      'images/shop/products/300x450/taza/1.jpg'
    ],
    price: 613.00,
    category: 'boy'
  }];

})();
