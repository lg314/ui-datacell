/// <reference path="../../_references.ts" />  
var Datacell;
(function (Datacell_1) {
    var DatacellController = (function () {
        /*@ngInject*/
        function DatacellController($scope) {
            var _this = this;
            this.$scope = $scope;
            this.activeEditor = false;
            this.editable = true;
            this.cellStartEdit = function () {
                if (_this.editable) {
                    _this.activeEditor = true;
                    _this.$scope["$datacelledit"] = true;
                }
            };
            this.cellEndEdit = function () {
                _this.activeEditor = false;
                _this.$scope["$datacelledit"] = false;
            };
            this.setEditable = function (value) {
                _this.editable = value;
                if (_this.activeEditor && !_this.editable) {
                    _this.cellEndEdit();
                }
            };
            this.$scope["$datacelledit"] = false;
        }
        DatacellController.$inject = ['$scope'];
        ;
        return DatacellController;
    })();
    Datacell_1.DatacellController = DatacellController;
    var Datacell = (function () {
        /*@ngInject*/
        function Datacell($timeout) {
            var _this = this;
            this.$timeout = $timeout;
            this.restrict = 'A';
            this.scope = true;
            this.controller = DatacellController;
            this.compile = function (elem, attrs) {
                var editableStr = attrs["datacell"];
                elem.attr('tabindex', -1);
                elem.addClass("datacell");
                return function (scope, elem, attrs, ctrl) {
                    if (editableStr) {
                        scope.$watch(editableStr, function (value) {
                            ctrl.setEditable(value);
                        });
                    }
                    var focused = false;
                    var current = false;
                    elem[0].addEventListener('focus', function () {
                        if (!focused) {
                            focused = true;
                            scope.$apply(ctrl.cellStartEdit);
                        }
                        else {
                            current = true;
                        }
                    }, true);
                    elem[0].addEventListener('blur', function () {
                        _this.$timeout(function () {
                            if (!current) {
                                focused = false;
                                scope.$apply(ctrl.cellEndEdit);
                            }
                            else {
                                current = false;
                            }
                        });
                    }, true);
                    scope.$watch(function () {
                        return ctrl.activeEditor;
                    }, function (value) {
                        if (value) {
                            elem.addClass("datacell-edit");
                            elem.removeClass("datacell-view");
                        }
                        else {
                            elem.removeClass("datacell-edit");
                            elem.addClass("datacell-view");
                        }
                    });
                };
            };
        }
        Datacell.$inject = ['$timeout'];
        Datacell.factory = function () {
            var _this = this;
            var fn = function ($timeout) {
                return new _this($timeout);
            };
            fn.$inject = this.$inject;
            return fn;
        };
        return Datacell;
    })();
    Datacell_1.Datacell = Datacell;
    var DatacellEditor = (function () {
        /*@ngInject*/
        function DatacellEditor($timeout) {
            this.$timeout = $timeout;
            this.restrict = 'A';
            this.require = "^datacell";
            this.link = function (scope, elem, attrs, ctrl) {
                elem.attr('tabindex', -1);
                elem.addClass("datacell-editor");
                scope.$watch(function () {
                    return ctrl.activeEditor;
                }, function (value) {
                    if (value) {
                        elem.show();
                        elem.focus();
                        elem.select();
                    }
                    else {
                        elem.hide();
                    }
                });
            };
        }
        DatacellEditor.$inject = ['$timeout'];
        DatacellEditor.factory = function () {
            var _this = this;
            var fn = function ($timeout) {
                return new _this($timeout);
            };
            fn.$inject = this.$inject;
            return fn;
        };
        return DatacellEditor;
    })();
    Datacell_1.DatacellEditor = DatacellEditor;
    var DatacellViewer = (function () {
        function DatacellViewer() {
            this.restrict = 'A';
            this.require = "^datacell";
            this.link = function (scope, elem, attrs, ctrl) {
                elem.addClass("datacell-viewer");
                scope.$watch(function () {
                    return ctrl.activeEditor;
                }, function (value) {
                    if (value) {
                        elem.hide();
                    }
                    else {
                        elem.show();
                    }
                });
            };
        }
        DatacellViewer.factory = function () {
            var _this = this;
            var fn = function () {
                return new _this();
            };
            fn.$inject = this.$inject;
            return fn;
        };
        return DatacellViewer;
    })();
    Datacell_1.DatacellViewer = DatacellViewer;
})(Datacell || (Datacell = {}));
angular.module("ui-datacell", [])
    .directive("datacell", Datacell.Datacell.factory())
    .directive("datacellEditor", Datacell.DatacellEditor.factory())
    .directive("datacellViewer", Datacell.DatacellViewer.factory());
//# sourceMappingURL=ui-datacell.js.map