app.service('globalServices', function() {
    this.volumetericCalculation = function (x) {
        return $scope.productLength * $scope.productBreadth * $scope.productHeight / 5000;
    }
});