/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type AutocompleteProfessionalQueryVariables = {
    searchText?: string | null;
};
export type AutocompleteProfessionalQueryResponse = {
    readonly filterMentalHealthProfessionals: {
        readonly nodes: ReadonlyArray<{
            readonly id: string;
            readonly rowId: string;
            readonly fullName: string;
        }>;
    };
};
export type AutocompleteProfessionalQuery = {
    readonly response: AutocompleteProfessionalQueryResponse;
    readonly variables: AutocompleteProfessionalQueryVariables;
};



/*
query AutocompleteProfessionalQuery(
  $searchText: String
) {
  filterMentalHealthProfessionals(searchText: $searchText, disabled: false) {
    nodes {
      id
      rowId
      fullName
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "searchText"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Literal",
        "name": "disabled",
        "value": false
      },
      {
        "kind": "Variable",
        "name": "searchText",
        "variableName": "searchText"
      }
    ],
    "concreteType": "MentalHealthProfessionalsConnection",
    "kind": "LinkedField",
    "name": "filterMentalHealthProfessionals",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "MentalHealthProfessional",
        "kind": "LinkedField",
        "name": "nodes",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "rowId",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "fullName",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "AutocompleteProfessionalQuery",
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "AutocompleteProfessionalQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "347bf275e02f1096d3ff57dab8841fc5",
    "id": null,
    "metadata": {},
    "name": "AutocompleteProfessionalQuery",
    "operationKind": "query",
    "text": "query AutocompleteProfessionalQuery(\n  $searchText: String\n) {\n  filterMentalHealthProfessionals(searchText: $searchText, disabled: false) {\n    nodes {\n      id\n      rowId\n      fullName\n    }\n  }\n}\n"
  }
};
})();
(node as any).hash = '1305720a7b12a7038192d04ea10d804e';
export default node;
