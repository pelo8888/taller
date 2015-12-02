(function() {
  var app = angular.module('taller', ['ngCookies']);

  app.controller('QuickCartController', function($scope, $cookies) {

    if (!Revenga.carrito) {
      Revenga.carrito = $cookies.getObject('carrito');
    }

    Revenga.carrito = Revenga.carrito || [];
    $scope.carrito = Revenga.carrito;

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

  app.controller('MyCartController', function($scope, $http, $cookies) {
    Revenga.carrito = Revenga.carrito || [];
    $scope.mycart = Revenga.carrito;

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

    $scope.removeToCart = function(model) {
      var index = Revenga.carrito.indexOf(model);
      if (confirm("Estas seguro de que quieres eliminar este producto? " + model.description)) {
        Revenga.carrito.splice(index, 1);
        $cookies.putObject('carrito', Revenga.carrito);
        toastr.options.positionClass = "toast-bottom-right";
        toastr.success('Este producto ha sido eliminado de tu carrito de compras.', 'Carrito actualizado');
      }
    };

    $scope.updateCookies = function() {
      $cookies.putObject('carrito', Revenga.carrito);
      toastr.options.positionClass = "toast-bottom-right";
      toastr.success('Haz actualizado los productos en tu carrito.', 'Carrito actualizado');
    };

    $scope.updateQuantity = function(model, cant) {
      model.count = cant;
    };

    $scope.cleanCart = function(mycart) {
      if (confirm("Estas seguro de eliminar todo?")) {
        Revenga.carrito = [];
        $scope.mycart = [];
        $cookies.putObject('carrito', Revenga.carrito);
      }
    };

  });

  app.controller('confirmController', function($scope, $http, $cookies) {
    if (!Revenga.carrito) {
      Revenga.carrito = $cookies.getObject('carrito');
    }

    Revenga.carrito = Revenga.carrito || [];
    $scope.carrito = Revenga.carrito;

    $scope.getTotal = function() {
      var total = 0;
      for (var i = 0; i < $scope.carrito.length; i++) {
        var product = $scope.carrito[i];
        total += (product.price * product.count);
      }
      return total;
    };

    $scope.show = function() {
      return (Revenga.carrito.length > 0);
    };
  });

})();
