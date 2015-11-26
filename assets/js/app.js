(function() {
  var app = angular.module('taller', ['ngCookies']);

  app.controller('RecomendedController', function($scope, $http, $cookies) {
    $scope.recomendados = [];

    $http
      .get('json/recomendados.json')
      .success(function(data) {
        $scope.recomendados = data;
      })
      .error(function(res) {
        console.error('Error:' + res);
      });

    $scope.addToCart = function(model) {

      Revenga.carrito = Revenga.carrito || [];

      if (!Revenga.carrito.find(function(e) {
        if (e.id === model.id) {
          e.count++;
          return true;
        }
      })) {
        Revenga.carrito.push(model);
      }

      $cookies.putObject('carrito', Revenga.carrito);

      toastr.options.positionClass = "toast-bottom-right";
      toastr.success('Este producto ha sido agregado a tu carrito de compras.', 'Carrito actualizado');
    };

  });


  app.controller('QuickCartController', function($scope, $cookies) {

    if (!Revenga.carrito) {
      Revenga.carrito = $cookies.getObject('carrito');
    }

    $scope.carrito = Revenga.carrito || [];

    $scope.getTotal = function() {
      var total = 0;
      for (var i = 0; i < $scope.carrito.length; i++) {
        var product = $scope.carrito[i];
        total += (product.price * product.count);
      }
      return total;
    };

    $scope.getLength = function() {
      return $scope.carrito.length;
    }

  });

})();
