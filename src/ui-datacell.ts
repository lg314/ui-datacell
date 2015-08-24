/// <reference path="../../_references.ts" />  

module Datacell {

    export class DatacellController {
        /*@ngInject*/
        constructor(private $scope: ng.IScope) {
            this.$scope["$datacelledit"] = false;
        };
        activeEditor = false;

        editable = true;

        cellStartEdit = () => {
            if (this.editable) {
                this.activeEditor = true;
                this.$scope["$datacelledit"] = true;
            }
        }

        cellEndEdit = () => {
            this.activeEditor = false;

            this.$scope["$datacelledit"] = false;
        }

        setEditable = (value: boolean) => {
            this.editable = value;
            if (this.activeEditor && !this.editable) {
                this.cellEndEdit();
            }
        };
    }

    export class Datacell implements ng.IDirective {
        /*@ngInject*/
        constructor(private $timeout: ng.ITimeoutService) { }
        restrict = 'A';
        scope = true;
        controller = DatacellController;
        compile: ng.IDirectiveCompileFn = (elem, attrs) => {
            var editableStr = attrs["datacell"];
            elem.attr('tabindex', -1);
            elem.addClass("datacell");
            return (scope: ng.IScope, elem: ng.IAugmentedJQuery, attrs, ctrl: DatacellController) => {

                if (editableStr) {
                    scope.$watch(editableStr, (value: boolean) => {
                        ctrl.setEditable(value);
                    });
                }

                var focused = false;
                var current = false;
                elem[0].addEventListener('focus', () => {
                    if (!focused) {
                        focused = true;
                        scope.$apply(ctrl.cellStartEdit);
                    }
                    else {
                        current = true;
                    }
                }, true);

                elem[0].addEventListener('blur', () => {
                    this.$timeout(() => {
                        if (!current) {
                            focused = false;
                            scope.$apply(ctrl.cellEndEdit);
                        }
                        else {
                            current = false;
                        }
                    });
                }, true);

                scope.$watch(() => {
                    return ctrl.activeEditor;
                }, (value) => {
                        if (value) {
                            elem.addClass("datacell-edit");
                            elem.removeClass("datacell-view");
                        }
                        else {
                            elem.removeClass("datacell-edit");
                            elem.addClass("datacell-view");
                        }
                    });

            }
        };

        public static factory(): ng.IDirectiveFactory {
            var fn = ($timeout) => {
                return new this($timeout);
            }
            fn.$inject = this.$inject;
            return fn;
        }
    }

    export class DatacellEditor implements ng.IDirective {
        /*@ngInject*/
        constructor(private $timeout: ng.ITimeoutService) { }

        restrict = 'A';
        require = "^datacell";
        link = (scope: ng.IScope, elem: ng.IAugmentedJQuery, attrs, ctrl: DatacellController) => {
            elem.attr('tabindex', -1);
            elem.addClass("datacell-editor");
            scope.$watch(() => {
                return ctrl.activeEditor;
            }, (value) => {
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
        public static factory(): ng.IDirectiveFactory {
            var fn = ($timeout) => {
                return new this($timeout);
            }
            fn.$inject = this.$inject;
            return fn;
        }
    }

    export class DatacellViewer implements ng.IDirective {
        restrict = 'A';
        require = "^datacell";
        link = (scope: ng.IScope, elem: ng.IAugmentedJQuery, attrs, ctrl: DatacellController) => {
            elem.addClass("datacell-viewer");
            scope.$watch(() => {
                return ctrl.activeEditor;
            }, (value) => {
                    if (value) {
                        elem.hide();
                    }
                    else {
                        elem.show();
                    }
                });
        }

        public static factory(): ng.IDirectiveFactory {
            var fn = () => {
                return new this();
            }
            fn.$inject = this.$inject;
            return fn;
        }

    }
}
angular.module("ui-datacell", [])
    .directive("datacell", Datacell.Datacell.factory())
    .directive("datacellEditor", Datacell.DatacellEditor.factory())
    .directive("datacellViewer", Datacell.DatacellViewer.factory());