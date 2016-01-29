(function(){
  
  //angular module
  var myApp = angular.module('myApp', ['angularTreeview', 'ui.sortable']);

  //test controller
  myApp.controller('myController', function($scope){

  	//test tree model 1
    $scope.roleList1 = [
        { "roleName" : "User", "roleId" : "role1", "children" : [
          { "roleName" : "subUser1", "roleId" : "role11", "children" : [] },
          { "roleName" : "subUser2", "roleId" : "role12", "children" : [
            { "roleName" : "subUser2-1", "roleId" : "role121", "children" : [
              { "roleName" : "subUser2-1-1", "roleId" : "role1211", "children" : [] },
              { "roleName" : "subUser2-1-2", "roleId" : "role1212", "children" : [] }
            ]}
          ]}
        ]},

        { "roleName" : "Admin", "roleId" : "role2", "id":"01", "children" : [] },

        { "roleName" : "Guest", "roleId" : "role3", "id":"02", "children" : [] }
      ];

  	//test tree model 2
    $scope.roleList2 = [
        { "roleName" : "User", "roleId" : "role1", "children" : [
          { "roleName" : "subUser1", "roleId" : "role11", "collapsed" : true, "children" : [] },
          { "roleName" : "subUser2", "roleId" : "role12", "collapsed" : true, "children" : [
            { "roleName" : "subUser2-1", "roleId" : "role121", "children" : [
              { "roleName" : "subUser2-1-1", "roleId" : "role1211", "children" : [] },
              { "roleName" : "subUser2-1-2", "roleId" : "role1212", "children" : [] }
            ]}
          ]}
        ]},

        { "roleName" : "Admin", "roleId" : "role2", "children" : [
          { "roleName" : "subAdmin1", "roleId" : "role11", "collapsed" : true, "children" : [] },
          { "roleName" : "subAdmin2", "roleId" : "role12", "children" : [
            { "roleName" : "subAdmin2-1", "roleId" : "role121", "children" : [
              { "roleName" : "subAdmin2-1-1", "roleId" : "role1211", "children" : [] },
              { "roleName" : "subAdmin2-1-2", "roleId" : "role1212", "children" : [] }
            ]}
          ]}
        ]},

        { "roleName" : "Guest", "roleId" : "role3", "children" : [
          { "roleName" : "subGuest1", "roleId" : "role11", "children" : [] },
          { "roleName" : "subGuest2", "roleId" : "role12", "collapsed" : true, "children" : [
            { "roleName" : "Banned Area", "roleId" : "role121", "children" : [
              { "roleName" : "subGuest2-1-1", "roleId" : "role1211", "Parent":"Banned Area" ,"children" : [] },
              { "roleName" : "subGuest2-1-2", "roleId" : "role1212", "Parent":"Banned Area", "children" : [] }
            ]}
          ]}
        ]}
      ];

      
      
    //roleList1 to treeview
    $scope.roleList = $scope.roleList2;
  
  });
  
})();


/*
    @license Angular Treeview version 0.1.6
    ⓒ 2013 AHN JAE-HA http://github.com/eu81273/angular.treeview
    License: MIT


    [TREE attribute]
    angular-treeview: the treeview directive
    tree-id : each tree's unique id.
    tree-model : the tree model on $scope.
    node-id : each node's id
    node-label : each node's label
    node-children: each node's children

    <div
        data-angular-treeview="true"
        data-tree-id="tree"
        data-tree-model="roleList"
        data-node-id="roleId"
        data-node-label="roleName"
        data-node-children="children" >
    </div>
*/

(function ( angular ) {
    'use strict';

    angular.module( 'angularTreeview', [] ).directive( 'treeModel', ['$compile', function( $compile ) {
        return {
            restrict: 'A',
            link: function ( scope, element, attrs ) {
                //tree id
                var treeId = attrs.treeId;
            
                //tree model
                var treeModel = attrs.treeModel;

                //node id
                var nodeId = attrs.nodeId || 'id';

                //node label
                var nodeLabel = attrs.nodeLabel || 'label';

                //children
                var nodeChildren = attrs.nodeChildren || 'children';

scope.sortableOptions = {
  connectWith: ".apps-container",
  update: function(event, ui) {			
          var index = ui.item.sortable.index;
					var dropindex = ui.item.sortable.dropindex;
					var dropTargetModel = ui.item.sortable.droptargetModel;
					var dragModel = ui.item.sortable.model;			
    debugger
    
  }
};
                //tree template
                var template =
                    '<ul ui-sortable="sortableOptions" class="apps-container" ng-model="'+ treeModel+'">' +
                        '<li data-ng-repeat="node in ' + treeModel + '">' +
                            '<i class="collapsed" data-ng-show="node.' + nodeChildren + '.length && node.collapsed" data-ng-click="' + treeId + '.selectNodeHead(node)"></i>' +
                            '<i class="expanded" data-ng-show="node.' + nodeChildren + '.length && !node.collapsed" data-ng-click="' + treeId + '.selectNodeHead(node)"></i>' +
                            '<i class="normal" data-ng-hide="node.' + nodeChildren + '.length"></i> ' +
                            '<span data-ng-class="node.selected" data-ng-click="' + treeId + '.selectNodeLabel(node)">{{node.' + nodeLabel + '}}</span>' +
                            '<div data-ng-hide="node.collapsed" data-tree-id="' + treeId + '" data-tree-model="node.' + nodeChildren + '" data-node-id=' + nodeId + ' data-node-label=' + nodeLabel + ' data-node-children=' + nodeChildren + '></div>' +
                        '</li>' +
                    '</ul>';


                //check tree id, tree model
                if( treeId && treeModel ) {

                    //root node
                    if( attrs.angularTreeview ) {
                    
                        //create tree object if not exists
                        scope[treeId] = scope[treeId] || {};

                        //if node head clicks,
                        scope[treeId].selectNodeHead = scope[treeId].selectNodeHead || function( selectedNode ){

                            //Collapse or Expand
                            selectedNode.collapsed = !selectedNode.collapsed;
                        };

                        //if node label clicks,
                        scope[treeId].selectNodeLabel = scope[treeId].selectNodeLabel || function( selectedNode ){

                            //remove highlight from previous node
                            if( scope[treeId].currentNode && scope[treeId].currentNode.selected ) {
                                scope[treeId].currentNode.selected = undefined;
                            }

                            //set highlight to selected node
                            selectedNode.selected = 'selected';

                            //set currentNode
                            scope[treeId].currentNode = selectedNode;
                        };
                    }

                    //Rendering template.
                    element.html('').append( $compile( template )( scope ) );
                }
            }
        };
    }]);
})( angular );
