// address_2: null;
// address_3: null;
// brewery_type: "micro";
// city: "Cordova";
// country: "United States";
// county_province: null;
// created_at: "2022-08-20T02:56:08.975Z";
// id: "meddlesome-brewing-company-cordova";
// latitude: "35.14057";
// longitude: "-89.802564";
// name: "Meddlesome Brewing Company";
// phone: "6185218036";
// postal_code: "38018-2736";
// state: "Tennessee";
// street: "7750 Trinity Rd Ste 114";
// updated_at: "2022-08-20T02:56:08.975Z";
// website_url: "http://www.meddlesomebrewing.com";

export type Brewery = {
 id: string;
 county_province: string;
 city: string;
 country: string;
 postal_code: string;
 name: string;
 phone: string;
 state: string;
 street: string;
 latitude: string;
 longitude: string;
 website_url: string;
};

export type Map = {
 places: Brewery[] | undefined;
 center: number[];
};

export type Sidebar = {
 open: boolean;
 places: Brewery[] | undefined;
 setPlaces: any;
 initialMobile: boolean;
 setOpen: any;
 setCenter: any;
 center: number[];
};

export type SearchBy = "state" | "city" | "type" | "name";
