/** デートスポット候補 */
export interface ICandidateSpot {
  spotName: string;
  address: string;
  rating: string;
  // description: string;
  imageUrl: string;
  latitude: number;
  longitude: number;
  id: string;
  heart: boolean;
  like: boolean;
  check: boolean;
  openinghour: string;
}
