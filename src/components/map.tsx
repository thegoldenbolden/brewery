import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { FC, Fragment, useCallback, useState } from "react";
import { Map } from "../types";

const Map: FC<Map> = ({ places, center }) => {
 const [map, setMap] = useState(null);
 const { isLoaded, loadError } = useJsApiLoader({
  id: "google-map-script",
  googleMapsApiKey: "", // Google Maps Javascript Api Key,
 });

 if (loadError) {
  return <div>There was an error loading the map.</div>;
 }

 const onLoad = useCallback(
  (map: any) => {
   if (center) {
    const bounds = new window.google.maps.LatLngBounds({ lat: center[0], lng: center[1] });
    map.fitBounds(bounds);
    setMap(map);
   }
  },
  [center]
 );

 const onUnmount = useCallback((map: any) => {
  setMap(null);
 }, []);

 return (
  <>
   {isLoaded ? (
    <GoogleMap
     options={{ gestureHandling: "greedy" }}
     mapContainerClassName="map"
     center={{ lat: center[0], lng: center[1] }}
     zoom={10}
     onLoad={onLoad}
     onUnmount={onUnmount}
    >
     {places?.map((place, i) => {
      const lat = Number(place.latitude);
      const lng = Number(place.longitude);
      return (
       <Fragment key={i}>
        <Marker
         label={place.name[0]}
         title={place.name}
         onClick={() => {
          const sidebar = document.querySelector(".sidebar") as any;
          const id = document.getElementById(`${place.id}`) as any;
          const form = document.getElementsByTagName("form")?.item(0);
          if (id && sidebar && form) {
           const top =
            id?.offsetTop > sidebar?.scrollHeight - sidebar?.offsetHeight ? id?.offsetTop : id?.offsetTop - 8 - form.offsetHeight;
           sidebar?.scrollTo({ top, behavior: "smooth" });
          }
         }}
         position={{ lat, lng }}
        ></Marker>
       </Fragment>
      );
     })}
    </GoogleMap>
   ) : (
    <div>Loading map...</div>
   )}
  </>
 );
};

export default Map;
