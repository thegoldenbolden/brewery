import axios from "axios";
import { last } from "lodash";
import { FC, useEffect, useState, useCallback } from "react";
import { AiOutlineHome, AiOutlineLink, AiOutlinePhone, AiOutlineSearch } from "react-icons/ai";
import { IoBeerOutline } from "react-icons/io5";
import { Brewery, SearchBy, Sidebar } from "../types";
import Autocomplete from "./autocomplete";
export const url = "https://api.openbrewerydb.org/breweries?per_page=25";

const Sidebar: FC<Sidebar> = ({ setOpen, initialMobile, open, places, setPlaces, setCenter, center }) => {
 const [searchBy, setSearchBy] = useState<SearchBy>("city");
 const [fetchedAll, setFetchedAll] = useState(false);
 const [page, setPage] = useState(1);

 // Initially fetch breweries near user's location.
 useEffect(() => {
  const getPlacesData = async ([lat, lng]: number[], setPlaces: any, setCenter: any) => {
   try {
    if (lat || lng) {
     const { data } = await axios.get(`${url}&by_dist=${lat},${lng}`);
     setPlaces(data);
     console.log({ lat: lat, lng: lng });
     if (data.length > 0) {
      setCenter([Number(data[0].latitude), Number(data[0].longitude)]);
     } else {
      setCenter([Number(lat), Number(lng)]);
     }
    }
   } catch (err) {
    console.log(err);
   }
  };

  navigator.geolocation.getCurrentPosition(({ coords: { latitude, longitude } }) => {
   getPlacesData([latitude, longitude], setPlaces, setCenter);
  });
 }, []);

 const getBreweries = useCallback(async (more: boolean = false) => {
  if (searchBy == "name" || searchBy == "type") return;
  const input = document.body.querySelector('[name="search-brewery"]') as any;
  try {
   let data;
   console.log(!input, input.value?.length);
   if (!input || input.value?.length == 0) {
    const { data: result } = await axios.get(`${url}&page=${!more ? 1 : page}&by_dist=${center[0]},${center[1]}`);
    data = result;
    console.log(`${url}&page=${!more ? 1 : page}&by_dist=${center[0]},${center[1]}`);
   } else {
    const { data: result } = await axios.get(
     `${url}&page=${!more ? 1 : page}&by_${searchBy}=${input.value.replaceAll(" ", "_").toLowerCase()}`
    );
    data = result;
    console.log(`${url}&page=${!more ? 1 : page}&by_${searchBy}=${input.value.replaceAll(" ", "_").toLowerCase()}`);
   }

   setPlaces(more ? [...(places ?? []), ...data] : data);
   if (!more) {
    const sidebar = document.querySelector(".sidebar");
    sidebar?.scrollTo({ top: 0, behavior: "smooth" });
    setPage(1);
   }

   if (data.length < 25) {
    setFetchedAll(true);
   } else {
    setFetchedAll(false);
   }
  } catch (err) {
   console.log(err);
  }
 }, []);

 // Fetch new list of breweries.
 const handleSubmit = async (e: any) => {
  e.preventDefault();
  await getBreweries();
 };

 return (
  <div className={`sidebar${!open ? " closed" : ""}`}>
   <form className="form-container" onSubmit={handleSubmit}>
    <div>
     <label htmlFor="search-by">Name</label>
     <select id="search-by" value={searchBy} name="search-by" onChange={(e) => setSearchBy(e.target.value as SearchBy)}>
      <option value="name">Name</option>
      <option value="city">City</option>
      <option value="state">State</option>
      <option value="type">Type</option>
     </select>
    </div>
    {searchBy == "name" || searchBy == "type" ? (
     <Autocomplete setFetchedAll={setFetchedAll} type={searchBy} setPlaces={setPlaces} setCenter={setCenter} />
    ) : (
     <>
      <div className="input">
       <label htmlFor="search-brewery">Search</label>
       <AiOutlineSearch />
       <input
        autoComplete="off"
        aria-labelledby="search breweries"
        type="text"
        name="search-brewery"
        id="search-brewery"
        placeholder={`Search by ${searchBy}`}
       />
      </div>
     </>
    )}
   </form>
   <Cards setOpen={setOpen} initialMobile={initialMobile} places={places} setCenter={setCenter} />
   {fetchedAll ? (
    <button disabled={true}>No more breweries</button>
   ) : (
    <button
     onClick={() => {
      setPage((p) => (places && places.length >= 25 ? p + 1 : p <= 1 ? 1 : p));
      getBreweries(true);
     }}
    >
     Load More
     <span>{center[0]}</span>
     <span>{center[1]}</span>
    </button>
   )}
  </div>
 );
};

type Card = { places: Brewery[] | undefined; setCenter: any; setOpen: any; initialMobile: any };
function Cards({ places, setCenter, setOpen, initialMobile }: Card) {
 return (
  <>
   {places ? (
    places.map((place, i) => {
     return (
      <div id={place.id} key={place.id} className="card">
       <div className="name">
        {place.website_url ? (
         <a target="_blank" rel="noreferrer noopener" href={`${place.website_url}`}>
          <AiOutlineLink />
          {place.name}
         </a>
        ) : (
         <p>
          <IoBeerOutline />
          {place.name}
         </p>
        )}
       </div>
       <div className="middle">
        <AiOutlineHome />
        <div>
         <span>{place.street}</span>
         <span>
          {place.city}
          {place.state && `, ${place.state}`}
          {place.county_province && `, ${place.county_province}`}
         </span>
        </div>
       </div>
       <div className="footer">
        <span>
         <AiOutlinePhone />
         {place.phone ?? "--"}
        </span>
        <span>
         <button
          onClick={() => {
           if (initialMobile) {
            setOpen(false);
           }
           setCenter({ lat: Number(place.latitude), lng: Number(place.longitude) });
          }}
         >
          View on Map
         </button>
        </span>
       </div>
      </div>
     );
    })
   ) : (
    <div className="none">We couldn't find any breweries near you.</div>
   )}
  </>
 );
}

export default Sidebar;
