/** 位置情報 */
export interface ILocation {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

/** 現在位置 */
export interface IHere {
  latitude: number;
  longitude: number;
  timestamp: number;
}

/** 位置マーカー */
export interface IMarker {
  key?: string;
  latitude: number;
  longitude: number;
  radius: number;
  color: string;
  unit: 'km' | 'm';
}

/** 線 */
export interface ILine {
  latitude: number;
  longitude: number;
}

export interface ISimpleLocation {
  lat: number;
  lng: number;
}

export interface IPlacePhoto {
  width: number;
  height: number;
  html_attributions: Array<string>;
  photo_reference: string;
}

export interface IPlaceUnity {
  id: string;
  place_id: string;
  // ISpotFull
  name: string;
  formatted_address: string;
  category: string;
  opening_hours: string;
  formatted_phone_number: string;
  website: string;
  images: string[];
  latitude: number;
  longitude: number;
  spot_type: 'GOOGLE' | 'HOTPEPPER' | 'ONEDATE';
  // ISpotFull
  icon: string;
  user_ratings_total: number;
}

export interface IPlace {
  geometry: {
    location: ISimpleLocation;
    viewport: {
      northeast: ISimpleLocation;
      southwest: ISimpleLocation;
    };
  };
  icon: string;
  id: string;
  name: string;
  opening_hours: IPlaceOpenHour;
  photos: Array<IPlacePhoto>;
  place_id: string;
  types: Array<string>;
  vicinity: string;
  user_ratings_total: number;
  website: string;
  formatted_address: string;
  formatted_phone_number: string;
  hpImage: string;
  genreCode: string;
  photolink: string;
  origin: 'GOOGLE' | 'HOTPEPPER';
}

export interface IHPShop {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  logo_image: string;
  genre: IHPGenre;
  photo: {
    pc: {
      l: string;
      m: string;
      s: string;
    };
    mobile: {
      l: string;
      s: string;
    };
  };
  open: string;
  genreCode: string;
  place_id: string;
  icon: string;
  geometry: {
    location: ISimpleLocation;
  };
  photolink: string;
  origin: 'GOOGLE' | 'HOTPEPPER';
  urls: {
    pc: string;
  };
}

export interface IPlaceOpenHour {
  open_now: boolean;
  periods: IPlaceDayHour[];
  weekday_text: string[];
}

export interface IPlaceDayHour {
  open: {
    day: number;
    time: string;
  };
  close?: {
    day: number;
    time: string;
  };
}

export interface IPlaceDetail {
  opening_hours: {
    open_now: boolean;
    periods: IPlaceDayHour[];
    weekday_text: string[];
  };
}

export interface IGoogleResult {
  html_attributions: string;
  next_page_token?: string;
  results?: IPlace[];
  result?: IPlace;
  status: string;
}

export interface IGoogleMatrixResult {
  status: string;
  origin_addresses: string[];
  destination_addresses: string[];
  rows: IGoogleMatrixRow[];
}

export interface IGoogleDistanceVector {
  value: number;
  text: string;
}

export interface IGoogleMatrixRow {
  elements: IGoogleDistanceElement[];
}

export interface IGoogleDistanceElement {
  status: string;
  duration: IGoogleDistanceVector;
  distance: IGoogleDistanceVector;
}

export interface IGoogleDirection {
  status: string;
  geocoded_waypoints: {
    geocoder_status: string;
    place_id: string;
    types: string[];
  }[];
  routes: {
    summary: string;
    legs: {
      steps: {
        travel_mode: string;
        start_location: ISimpleLocation;
        end_location: ISimpleLocation;
        polyline: {
          points: string;
        };
        duration: IGoogleDistanceVector;
        distance: IGoogleDistanceVector;
        html_instructions: string;
      }[];
      duration: IGoogleDistanceVector;
      distance: IGoogleDistanceVector;
    }[];
    overview_polyline: {
      points: string;
    };
    waypoint_order: number[];
    bounds: {
      southwest: ISimpleLocation;
      northeast: ISimpleLocation;
    };
  }[];
}

export interface IGooglePrediection {
  description: string;
  distance_meters: number;
  place_id: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
  origin: 'GOOGLE' | 'HOTPEPPER' | 'ONEDATE';
}

export interface IGoogleAutoCompleteResult {
  status: string;
  predictions: IGooglePrediection[];
}

export interface IHotPepperResult {
  results: {
    results_available: number;
    results_returned: number;
    results_start: number;
    shop: {
      id: string;
      photo: {
        mobile: {
          l: string;
          s: string;
        };
        pc: {
          l: string;
          m: string;
          s: string;
        };
      };
    }[];
  };
}
