import ActionTypes from "../actions/ActionTypes";
import Common from '../constants/common';
import uuid from 'react-uuid';
import { cloneDeep, filter, indexOf } from 'lodash';
import { updateCurrentShape } from "../utils/canvasUtils";

// const shapeListData = [
//   {
//       "id": "4c76fab-dfb2-5528-d5d-5a6f3caf86",
//       "type": "Line",
//       "stroke": "rgba(106, 184, 197, 0.8)",
//       "strokeWidth": 2,
//       "fill": "rgba(75, 153, 177, 0.49)",
//       "completed": false,
//       "points": "M 257.38331604003906 178.19998168945312 L 217.38331604003906 229.19998168945312 L 274.38331604003906 325.1999816894531 L 355.38331604003906 379.1999816894531 L 310.38331604003906 286.1999816894531 Z",
//       "pointData": [
//           {
//               "x": 257.38331604003906,
//               "y": 178.19998168945312
//           },
//           {
//               "x": 217.38331604003906,
//               "y": 229.19998168945312
//           },
//           {
//               "x": 274.38331604003906,
//               "y": 325.1999816894531
//           },
//           {
//               "x": 355.38331604003906,
//               "y": 379.1999816894531
//           },
//           {
//               "x": 310.38331604003906,
//               "y": 286.1999816894531
//           }
//       ]
//   },
//   {
//       "id": "6f44-2db6-db8f-0134-8fdbe06c1a10",
//       "type": "Line",
//       "stroke": "rgba(106, 184, 197, 0.8)",
//       "strokeWidth": 2,
//       "fill": "rgba(75, 153, 177, 0.49)",
//       "completed": false,
//       "points": "M 128.38331604003906 312.1999816894531 L 350.38331604003906 295.1999816894531 L 390.38331604003906 310.1999816894531 L 354.38331604003906 324.1999816894531 L 131.38331604003906 342.1999816894531 L 126.38331604003906 325.1999816894531 L 310.38331604003906 315.1999816894531 L 306.38331604003906 310.1999816894531 Z",
//       "pointData": [
//           {
//               "x": 128.38331604003906,
//               "y": 312.1999816894531
//           },
//           {
//               "x": 350.38331604003906,
//               "y": 295.1999816894531
//           },
//           {
//               "x": 390.38331604003906,
//               "y": 310.1999816894531
//           },
//           {
//               "x": 354.38331604003906,
//               "y": 324.1999816894531
//           },
//           {
//               "x": 131.38331604003906,
//               "y": 342.1999816894531
//           },
//           {
//               "x": 126.38331604003906,
//               "y": 325.1999816894531
//           },
//           {
//               "x": 310.38331604003906,
//               "y": 315.1999816894531
//           },
//           {
//               "x": 306.38331604003906,
//               "y": 310.1999816894531
//           }
//       ]
//   },
//   {
//       "id": "3b3c328-2bf-db76-8653-ee2d3eebee23",
//       "type": "Line",
//       "stroke": "rgba(106, 184, 197, 0.8)",
//       "strokeWidth": 2,
//       "fill": "rgba(75, 153, 177, 0.49)",
//       "completed": false,
//       "points": "M 119.38331604003906 290.1999816894531 L 111.38331604003906 327.1999816894531 L 119.38331604003906 367.1999816894531 L 129.38331604003906 366.1999816894531 L 121.38331604003906 326.1999816894531 L 129.38331604003906 293.1999816894531 Z",
//       "pointData": [
//           {
//               "x": 119.38331604003906,
//               "y": 290.1999816894531
//           },
//           {
//               "x": 111.38331604003906,
//               "y": 327.1999816894531
//           },
//           {
//               "x": 119.38331604003906,
//               "y": 367.1999816894531
//           },
//           {
//               "x": 129.38331604003906,
//               "y": 366.1999816894531
//           },
//           {
//               "x": 121.38331604003906,
//               "y": 326.1999816894531
//           },
//           {
//               "x": 129.38331604003906,
//               "y": 293.1999816894531
//           }
//       ]
//   },
//   {
//       "id": "13c3f2-1cb2-cf73-64-c76eef7fc8d",
//       "type": "Line",
//       "stroke": "rgba(106, 184, 197, 0.8)",
//       "strokeWidth": 2,
//       "fill": "rgba(75, 153, 177, 0.49)",
//       "completed": false,
//       "points": "M 58.38331604003906 322.1999816894531 L 34.38331604003906 324.1999816894531 L 30.383316040039062 335.1999816894531 L 44.38331604003906 341.1999816894531 L 66.38331604003906 342.1999816894531 L 53.38331604003906 332.1999816894531 Z",
//       "pointData": [
//           {
//               "x": 58.38331604003906,
//               "y": 322.1999816894531
//           },
//           {
//               "x": 34.38331604003906,
//               "y": 324.1999816894531
//           },
//           {
//               "x": 30.383316040039062,
//               "y": 335.1999816894531
//           },
//           {
//               "x": 44.38331604003906,
//               "y": 341.1999816894531
//           },
//           {
//               "x": 66.38331604003906,
//               "y": 342.1999816894531
//           },
//           {
//               "x": 53.38331604003906,
//               "y": 332.1999816894531
//           }
//       ]
//   },
//   {
//       "id": "d33cd-4e6f-b5ce-5605-dc2d8ef4b340",
//       "type": "Line",
//       "stroke": "rgba(106, 184, 197, 0.8)",
//       "strokeWidth": 2,
//       "fill": "rgba(75, 153, 177, 0.49)",
//       "completed": false,
//       "points": "M 63.38331604003906 337.1999816894531 L 73.38331604003906 346.1999816894531 L 106.38331604003906 344.1999816894531 L 108.38331604003906 332.1999816894531 Z",
//       "pointData": [
//           {
//               "x": 63.38331604003906,
//               "y": 337.1999816894531
//           },
//           {
//               "x": 73.38331604003906,
//               "y": 346.1999816894531
//           },
//           {
//               "x": 106.38331604003906,
//               "y": 344.1999816894531
//           },
//           {
//               "x": 108.38331604003906,
//               "y": 332.1999816894531
//           }
//       ]
//   },
//   {
//       "id": "a01307c-1b02-d56b-e322-1bb56b63bd1",
//       "type": "Line",
//       "stroke": "rgba(106, 184, 197, 0.8)",
//       "strokeWidth": 2,
//       "fill": "rgba(75, 153, 177, 0.49)",
//       "completed": false,
//       "points": "M 100.38331604003906 315.1999816894531 L 111.38331604003906 330.1999816894531 L 98.38331604003906 332.1999816894531 Z",
//       "pointData": [
//           {
//               "x": 100.38331604003906,
//               "y": 315.1999816894531
//           },
//           {
//               "x": 111.38331604003906,
//               "y": 330.1999816894531
//           },
//           {
//               "x": 98.38331604003906,
//               "y": 332.1999816894531
//           }
//       ]
//   },
//   {
//       "id": "4381ff-5e16-a50d-0687-2a66f6314f87",
//       "type": "Line",
//       "stroke": "rgba(106, 184, 197, 0.8)",
//       "strokeWidth": 2,
//       "fill": "rgba(75, 153, 177, 0.49)",
//       "completed": false,
//       "points": "M 62.38331604003906 311.1999816894531 L 92.38331604003906 310.1999816894531 L 93.38331604003906 337.1999816894531 L 56.38331604003906 336.1999816894531 Z",
//       "pointData": [
//           {
//               "x": 62.38331604003906,
//               "y": 311.1999816894531
//           },
//           {
//               "x": 92.38331604003906,
//               "y": 310.1999816894531
//           },
//           {
//               "x": 93.38331604003906,
//               "y": 337.1999816894531
//           },
//           {
//               "x": 56.38331604003906,
//               "y": 336.1999816894531
//           }
//       ]
//   },
//   {
//       "id": "03d70d8-2a5-ee14-c3a0-315b7c38ffd",
//       "type": "Line",
//       "stroke": "rgba(106, 184, 197, 0.8)",
//       "strokeWidth": 2,
//       "fill": "rgba(75, 153, 177, 0.49)",
//       "completed": false,
//       "points": "M 87.38331604003906 246.19998168945312 L 111.38331604003906 239.19998168945312 L 121.38331604003906 256.1999816894531 L 100.38331604003906 312.1999816894531 L 94.38331604003906 303.1999816894531 L 78.38331604003906 304.1999816894531 Z",
//       "pointData": [
//           {
//               "x": 87.38331604003906,
//               "y": 246.19998168945312
//           },
//           {
//               "x": 111.38331604003906,
//               "y": 239.19998168945312
//           },
//           {
//               "x": 121.38331604003906,
//               "y": 256.1999816894531
//           },
//           {
//               "x": 100.38331604003906,
//               "y": 312.1999816894531
//           },
//           {
//               "x": 94.38331604003906,
//               "y": 303.1999816894531
//           },
//           {
//               "x": 78.38331604003906,
//               "y": 304.1999816894531
//           }
//       ]
//   },
//   {
//       "id": "10baa3c-a3d-6142-24af-026be1b",
//       "type": "Line",
//       "stroke": "rgba(106, 184, 197, 0.8)",
//       "strokeWidth": 2,
//       "fill": "rgba(75, 153, 177, 0.49)",
//       "completed": false,
//       "points": "M 234.38331604003906 172.19998168945312 L 253.38331604003906 188.19998168945312 L 262.38331604003906 236.19998168945312 L 243.38331604003906 241.19998168945312 Z",
//       "pointData": [
//           {
//               "x": 234.38331604003906,
//               "y": 172.19998168945312
//           },
//           {
//               "x": 253.38331604003906,
//               "y": 188.19998168945312
//           },
//           {
//               "x": 262.38331604003906,
//               "y": 236.19998168945312
//           },
//           {
//               "x": 243.38331604003906,
//               "y": 241.19998168945312
//           }
//       ]
//   },
//   {
//       "id": "5671be-b43-3a62-ec2-f2a488fa6ca4",
//       "type": "Line",
//       "stroke": "rgba(106, 184, 197, 0.8)",
//       "strokeWidth": 2,
//       "fill": "rgba(75, 153, 177, 0.49)",
//       "completed": false,
//       "points": "M 113.38331604003906 182.19998168945312 L 98.38331604003906 218.19998168945312 L 102.38331604003906 247.19998168945312 L 121.38331604003906 243.19998168945312 L 136.38331604003906 200.19998168945312 L 126.38331604003906 177.19998168945312 Z",
//       "pointData": [
//           {
//               "x": 113.38331604003906,
//               "y": 182.19998168945312
//           },
//           {
//               "x": 98.38331604003906,
//               "y": 218.19998168945312
//           },
//           {
//               "x": 102.38331604003906,
//               "y": 247.19998168945312
//           },
//           {
//               "x": 121.38331604003906,
//               "y": 243.19998168945312
//           },
//           {
//               "x": 136.38331604003906,
//               "y": 200.19998168945312
//           },
//           {
//               "x": 126.38331604003906,
//               "y": 177.19998168945312
//           }
//       ]
//   },
//   {
//       "id": "3fc458f-5a80-1ce2-de41-360eb7c245",
//       "type": "Line",
//       "stroke": "rgba(106, 184, 197, 0.8)",
//       "strokeWidth": 2,
//       "fill": "rgba(75, 153, 177, 0.49)",
//       "completed": false,
//       "points": "M 199.38331604003906 295.1999816894531 L 236.38331604003906 336.1999816894531 L 275.38331604003906 350.1999816894531 L 261.38331604003906 315.1999816894531 L 258.38331604003906 311.1999816894531 L 225.38331604003906 278.1999816894531 Z",
//       "pointData": [
//           {
//               "x": 199.38331604003906,
//               "y": 295.1999816894531
//           },
//           {
//               "x": 236.38331604003906,
//               "y": 336.1999816894531
//           },
//           {
//               "x": 275.38331604003906,
//               "y": 350.1999816894531
//           },
//           {
//               "x": 261.38331604003906,
//               "y": 315.1999816894531
//           },
//           {
//               "x": 258.38331604003906,
//               "y": 311.1999816894531
//           },
//           {
//               "x": 225.38331604003906,
//               "y": 278.1999816894531
//           }
//       ]
//   },
//   {
//       "id": "1fac764-b416-3a5b-3e2-82a68d63dbee",
//       "type": "Line",
//       "stroke": "rgba(106, 184, 197, 0.8)",
//       "strokeWidth": 2,
//       "fill": "rgba(75, 153, 177, 0.49)",
//       "completed": false,
//       "points": "M 146.38331604003906 325.1999816894531 L 163.38331604003906 354.1999816894531 L 181.38331604003906 327.1999816894531 Z",
//       "pointData": [
//           {
//               "x": 146.38331604003906,
//               "y": 325.1999816894531
//           },
//           {
//               "x": 163.38331604003906,
//               "y": 354.1999816894531
//           },
//           {
//               "x": 181.38331604003906,
//               "y": 327.1999816894531
//           }
//       ]
//   },
//   {
//       "id": "bcfd6a5-4303-4a0e-0dcc-4704fd6e8d70",
//       "type": "Line",
//       "stroke": "rgba(106, 184, 197, 0.8)",
//       "strokeWidth": 2,
//       "fill": "rgba(75, 153, 177, 0.49)",
//       "completed": false,
//       "points": "M 136.38331604003906 270.1999816894531 L 125.38331604003906 298.1999816894531 L 138.38331604003906 324.1999816894531 L 149.38331604003906 318.1999816894531 L 153.38331604003906 278.1999816894531 Z",
//       "pointData": [
//           {
//               "x": 136.38331604003906,
//               "y": 270.1999816894531
//           },
//           {
//               "x": 125.38331604003906,
//               "y": 298.1999816894531
//           },
//           {
//               "x": 138.38331604003906,
//               "y": 324.1999816894531
//           },
//           {
//               "x": 149.38331604003906,
//               "y": 318.1999816894531
//           },
//           {
//               "x": 153.38331604003906,
//               "y": 278.1999816894531
//           }
//       ]
//   },
//   {
//       "id": "021ac2e-d168-a620-3fe5-db4876662ac1",
//       "type": "Line",
//       "stroke": "rgba(106, 184, 197, 0.8)",
//       "strokeWidth": 2,
//       "fill": "rgba(75, 153, 177, 0.49)",
//       "completed": false,
//       "points": "M 205.38331604003906 278.1999816894531 L 242.38331604003906 309.1999816894531 L 265.38331604003906 307.1999816894531 L 240.38331604003906 262.1999816894531 L 223.38331604003906 262.1999816894531 Z",
//       "pointData": [
//           {
//               "x": 205.38331604003906,
//               "y": 278.1999816894531
//           },
//           {
//               "x": 242.38331604003906,
//               "y": 309.1999816894531
//           },
//           {
//               "x": 265.38331604003906,
//               "y": 307.1999816894531
//           },
//           {
//               "x": 240.38331604003906,
//               "y": 262.1999816894531
//           },
//           {
//               "x": 223.38331604003906,
//               "y": 262.1999816894531
//           }
//       ]
//   },
//   {
//       "id": "afe315-f5-ac1e-26d4-112c31303f0",
//       "type": "Line",
//       "stroke": "rgba(106, 184, 197, 0.8)",
//       "strokeWidth": 2,
//       "fill": "rgba(75, 153, 177, 0.49)",
//       "completed": false,
//       "points": "M 147.38331604003906 275.1999816894531 L 153.38331604003906 322.1999816894531 L 168.38331604003906 332.1999816894531 L 193.38331604003906 320.1999816894531 L 204.38331604003906 277.1999816894531 Z",
//       "pointData": [
//           {
//               "x": 147.38331604003906,
//               "y": 275.1999816894531
//           },
//           {
//               "x": 153.38331604003906,
//               "y": 322.1999816894531
//           },
//           {
//               "x": 168.38331604003906,
//               "y": 332.1999816894531
//           },
//           {
//               "x": 193.38331604003906,
//               "y": 320.1999816894531
//           },
//           {
//               "x": 204.38331604003906,
//               "y": 277.1999816894531
//           }
//       ]
//   },
//   {
//       "id": "d183c7f-ca5d-6b60-4f8-b787fe3d3213",
//       "type": "Line",
//       "stroke": "rgba(106, 184, 197, 0.8)",
//       "strokeWidth": 2,
//       "fill": "rgba(75, 153, 177, 0.49)",
//       "completed": false,
//       "points": "M 222.38331604003906 231.19998168945312 L 238.38331604003906 253.19998168945312 L 196.38331604003906 282.1999816894531 L 144.38331604003906 275.1999816894531 L 128.38331604003906 262.1999816894531 L 142.38331604003906 251.19998168945312 L 160.38331604003906 260.1999816894531 L 207.38331604003906 257.1999816894531 Z",
//       "pointData": [
//           {
//               "x": 222.38331604003906,
//               "y": 231.19998168945312
//           },
//           {
//               "x": 238.38331604003906,
//               "y": 253.19998168945312
//           },
//           {
//               "x": 196.38331604003906,
//               "y": 282.1999816894531
//           },
//           {
//               "x": 144.38331604003906,
//               "y": 275.1999816894531
//           },
//           {
//               "x": 128.38331604003906,
//               "y": 262.1999816894531
//           },
//           {
//               "x": 142.38331604003906,
//               "y": 251.19998168945312
//           },
//           {
//               "x": 160.38331604003906,
//               "y": 260.1999816894531
//           },
//           {
//               "x": 207.38331604003906,
//               "y": 257.1999816894531
//           }
//       ]
//   },
//   {
//       "id": "24777a7-7ebb-83b3-22df-218c12ac8b8f",
//       "type": "Line",
//       "stroke": "rgba(106, 184, 197, 0.8)",
//       "strokeWidth": 2,
//       "fill": "rgba(75, 153, 177, 0.49)",
//       "completed": false,
//       "points": "M 216.38331604003906 149.19998168945312 L 216.38331604003906 180.19998168945312 L 246.38331604003906 181.19998168945312 L 232.38331604003906 154.19998168945312 Z",
//       "pointData": [
//           {
//               "x": 216.38331604003906,
//               "y": 149.19998168945312
//           },
//           {
//               "x": 216.38331604003906,
//               "y": 180.19998168945312
//           },
//           {
//               "x": 246.38331604003906,
//               "y": 181.19998168945312
//           },
//           {
//               "x": 232.38331604003906,
//               "y": 154.19998168945312
//           }
//       ]
//   },
//   {
//       "id": "345ed2-82b3-338-0fff-810ef4aa508",
//       "type": "Line",
//       "stroke": "rgba(106, 184, 197, 0.8)",
//       "strokeWidth": 2,
//       "fill": "rgba(75, 153, 177, 0.49)",
//       "completed": false,
//       "points": "M 111.38331604003906 163.19998168945312 L 110.38331604003906 196.19998168945312 L 150.38331604003906 181.19998168945312 L 146.38331604003906 147.19998168945312 Z",
//       "pointData": [
//           {
//               "x": 111.38331604003906,
//               "y": 163.19998168945312
//           },
//           {
//               "x": 110.38331604003906,
//               "y": 196.19998168945312
//           },
//           {
//               "x": 150.38331604003906,
//               "y": 181.19998168945312
//           },
//           {
//               "x": 146.38331604003906,
//               "y": 147.19998168945312
//           }
//       ]
//   },
//   {
//       "id": "f3b3cdb-ebc1-ad2b-ec7-ecb88f5bb16",
//       "type": "Line",
//       "stroke": "rgba(106, 184, 197, 0.8)",
//       "strokeWidth": 2,
//       "fill": "rgba(75, 153, 177, 0.49)",
//       "completed": false,
//       "points": "M 158.38331604003906 163.19998168945312 L 200.38331604003906 181.19998168945312 L 210.38331604003906 155.19998168945312 L 238.38331604003906 194.19998168945312 L 206.38331604003906 257.1999816894531 L 161.38331604003906 260.1999816894531 L 138.38331604003906 245.19998168945312 L 158.38331604003906 215.19998168945312 L 143.38331604003906 181.19998168945312 Z",
//       "pointData": [
//           {
//               "x": 158.38331604003906,
//               "y": 163.19998168945312
//           },
//           {
//               "x": 200.38331604003906,
//               "y": 181.19998168945312
//           },
//           {
//               "x": 210.38331604003906,
//               "y": 155.19998168945312
//           },
//           {
//               "x": 238.38331604003906,
//               "y": 194.19998168945312
//           },
//           {
//               "x": 206.38331604003906,
//               "y": 257.1999816894531
//           },
//           {
//               "x": 161.38331604003906,
//               "y": 260.1999816894531
//           },
//           {
//               "x": 138.38331604003906,
//               "y": 245.19998168945312
//           },
//           {
//               "x": 158.38331604003906,
//               "y": 215.19998168945312
//           },
//           {
//               "x": 143.38331604003906,
//               "y": 181.19998168945312
//           }
//       ]
//   },
//   {
//       "id": "35121b-b1ba-6da8-2a25-7c4231bc04be",
//       "type": "Line",
//       "stroke": "rgba(106, 184, 197, 0.8)",
//       "strokeWidth": 2,
//       "fill": "rgba(75, 153, 177, 0.49)",
//       "completed": false,
//       "points": "M 146.38331604003906 145.19998168945312 L 190.38331604003906 166.19998168945312 L 217.38331604003906 145.19998168945312 L 183.38331604003906 78.19998168945312 Z",
//       "pointData": [
//           {
//               "x": 146.38331604003906,
//               "y": 145.19998168945312
//           },
//           {
//               "x": 190.38331604003906,
//               "y": 166.19998168945312
//           },
//           {
//               "x": 217.38331604003906,
//               "y": 145.19998168945312
//           },
//           {
//               "x": 183.38331604003906,
//               "y": 78.19998168945312
//           }
//       ]
//   }
// ]

const shapeListData = []

const formatData = (shapes) => {
  return shapes.map((shape) => {
    const newShape = {}
    const keys = Object.keys(shape);
    keys.map((key) => {
      newShape[key] = shape[key];
    })
    return newShape;
  })
}

const formattedData = formatData(shapeListData)

const DEFAULT_STATE = {
  canvasData: {
    canvasWidth: 500,
    canvasHeight: 600,
    backgroundColor: 'rgba(50,50,55,1)',
    canvasScale: 1,
    shapeList: formattedData,
    createdCollectionList: [],
    selectedShapeId: '',
    selectedShape: {},
    selectShape: false,
    colorPalette: [
      {color: "#4771e8", uuid: "50ecc8b-23f5-dc2f-e06d-15e01b437a0"},
      {color: "#af56d8", uuid: "4dc6017-71d3-1b5-0067-4017bbe66efd"},
      {color: "#5b2175", uuid: "55fa65b-b05-e446-d0f-77757824e5"},
      {color: "#cd5b5b", uuid: "b24323-3bc0-1671-c67e-53823dac62"}
    ]
  },
  currentShapeType: Common.square,
  currentShape: {
    square: {
      id: '',
      type: Common.square,
      fill: 'rgba(106, 184, 197, 0.8)',
      stroke: 'rgba(0,0,0)',
      strokeWidth: 0,
      posX: 0,
      posY: 0,
      width: 60,
      height: 60,
      rotation: 0,
    },
    circle: {
      id: '',
      type: Common.circle,
      fill: 'rgba(106, 184, 197, 0.8)',
      stroke: 'rgba(0,0,0)',
      strokeWidth: 0,
      posX: 0,
      posY: 0,
      radius: 30,
    },
    line: {
      id: '',
      type: Common.line,
      stroke: 'rgba(106, 184, 197, 0.8)',
      strokeWidth: 2,
      fill: 'rgba(0,0,0,0)',
      completed: false,
      points: 'M 100 100',
      pointData: []
    },
  },
  collectionCanvasData: {
    canvasWidth: 400,
    canvasHeight: 400,
    backgroundColor: 'rgb(180,180,180)',
    canvasScale: 1,
    shapeColor: '#000000',
    shapeList: [],
    collectionList: [],
    shapeType: Common.square,
    selectedShapeId: '',
    selectShape: false,
    shapeWidth: 20,
    shapeHeight: 20,
    shapeRadius: 10,
    shapeOpacity: 1,
    colorPalette: [
      {color: "#4771e8", uuid: "50ecc8b-23f5-dc2f-e06d-15e01b437a0"},
      {color: "#af56d8", uuid: "4dc6017-71d3-1b5-0067-4017bbe66efd"},
      {color: "#5b2175", uuid: "55fa65b-b05-e446-d0f-77757824e5"},
      {color: "#cd5b5b", uuid: "b24323-3bc0-1671-c67e-53823dac62"}
    ]
  }
};


const canvasReducer = (state = DEFAULT_STATE, action = {}) => {
  const {type, payload} = action,
    result = payload || {};
  let updatedShape = {};
  let replacedShape = {};
  switch(type){
    // Changes to canvas
    case ActionTypes.UPDATE_CANVAS_DATA:
      return {
        ...state,
        newCanvasData: payload
      }
    case ActionTypes.CLEAR_CANVAS_DATA: 
      return {
        ...state,
        canvasData: DEFAULT_STATE.canvasData
      }
    case ActionTypes.LOAD_CANVAS_LIST:
      return {
        ...state,
        canvasList: payload
      }

      
    //Changes to canvas data
    case ActionTypes.CREATE_COLLECTION:
      const createdCollections = cloneDeep(state.canvasData.createdCollectionList)
      createdCollections.unshift(payload.newCollection)
      return {
        ...state,
        canvasData: {
          ...state.canvasData,
          createdCollectionList: createdCollections
        }
      }
    case ActionTypes.SET_CANVAS_SIZE:
      return {
        ...state,
        canvasData: {
          ...state.canvasData,
          canvasWidth: payload.canvasWidth,
          canvasHeight: payload.canvasHeight 
        }
      }
    case ActionTypes.ADD_SHAPE_TO_CANVAS:
      const newShapeList = cloneDeep(state.canvasData.shapeList)
      newShapeList.unshift(payload.newShape)
      return {
        ...state,
        canvasData: {
          ...state.canvasData,
          shapeList: newShapeList
        }
      }
    case ActionTypes.ADD_SHAPE_TO_COLLECTION:
      const newCollectionList = cloneDeep(state.collectionCanvasData.collectionList);
      newCollectionList.unshift(payload.newShape)
      return {
        ...state,
        collectionCanvasData: {
          ...state.canvasData,
          collectionList: newCollectionList
        }
      }
    case ActionTypes.UPDATE_LINE:
      replacedShape = cloneDeep(payload.newLine);
      return {
        ...state,
        currentShape: {
          ...state.currentShape,
          line: replacedShape
        }
      }
    case ActionTypes.CHANGE_CANVAS_SCALE:
      return {
        ...state,
        canvasData: {
          ...state.canvasData,
          canvasScale: payload.canvasScale, 
        }
      }
    case ActionTypes.CHANGE_BACKGROUND_COLOR:
      return {
        ...state,
        canvasData: {
          ...state.canvasData,
          backgroundColor: payload.backgroundColor
        }
      }
    case ActionTypes.ADD_TO_PALETTE:
      return {
        ...state,
        canvasData: {
          ...state.canvasData,
          colorPalette: [{color: payload, uuid: uuid()}, ...state.colorPalette]
        }
      }
    case ActionTypes.REPLACE_PALETTE:
      return {
        ...state,
        canvasData: {
          ...state.canvasData,
          colorPalette: payload
        }
      }
    case ActionTypes.SELECT_SHAPE:
      const selectedShapeData = state.canvasData.shapeList.find((shape) => shape.id === payload)
      return {
        ...state,
        canvasData: {
          ...state.canvasData,
          selectedShapeId: payload,
          selectedShape: selectedShapeData
        }
      }
    case ActionTypes.REMOVE_SHAPE:
      const listAfterRemove = filter(state.canvasData.shapeList, (shape) => {
        if(shape.id !== payload){
          return shape;
        } 
      })
      return {
        ...state,
        canvasData: {
          ...state.canvasData,
          shapeList: listAfterRemove,
        }
      }

    //Current shape data
    case ActionTypes.CHANGE_SHAPE_WIDTH: 
      updatedShape = updateCurrentShape(
        state.currentShape, 
        state.currentShapeType,
        'width',
        payload.width
      )
      return {
        ...state,
        currentShape: updatedShape
      }
    case ActionTypes.CHANGE_SHAPE_HEIGHT: 
      updatedShape = updateCurrentShape(
        state.currentShape, 
        state.currentShapeType,
        'height',
        payload.height
      )
      return {
        ...state,
        currentShape: updatedShape
      }
    case ActionTypes.CHANGE_SHAPE_ROTATION: 
      updatedShape = updateCurrentShape(
        state.currentShape, 
        state.currentShapeType,
        'rotation',
        payload.rotation
      )
      return {
        ...state,
        currentShape: updatedShape
      }
    case ActionTypes.CHANGE_SHAPE_RADIUS:
      updatedShape = updateCurrentShape(
        state.currentShape, 
        state.currentShapeType,
        'radius',
        payload.radius
      )
      return {
        ...state,
        currentShape: updatedShape
      }
    case ActionTypes.CHANGE_SHAPE_TYPE: 
      return {
        ...state,
        currentShapeType: payload.type
    }
    case ActionTypes.CHANGE_SHAPE_FILL:
      updatedShape = updateCurrentShape(
        state.currentShape, 
        state.currentShapeType,
        'fill',
        payload.fill
      )
      return {
        ...state,
        currentShape: updatedShape
      }
    case ActionTypes.CHANGE_SHAPE_STROKE:
      updatedShape = updateCurrentShape(
        state.currentShape, 
        state.currentShapeType,
        'stroke',
        payload.stroke
      )
      return {
        ...state,
        currentShape: updatedShape
      }
    case ActionTypes.CHANGE_SHAPE_STROKE_WIDTH:
      updatedShape = updateCurrentShape(
        state.currentShape,
        state.currentShapeType,
        'strokeWidth',
        payload.width
      )
      return {
        ...state,
        currentShape: updatedShape
      }
    case ActionTypes.CHANGE_SHAPE_OPACITY:
      updatedShape = updateCurrentShape(
        state.currentShape, 
        state.currentShapeType,
        'opacity',
        payload.opacity
      )
      return {
        ...state,
        currentShape: updatedShape
      }
    default:
      return state;
  }
};

export default canvasReducer;