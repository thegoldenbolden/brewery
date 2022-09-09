import { FC, useMemo, useState } from "react";
import debounce from "lodash.debounce";
import axios from "axios";
import { Brewery } from "../types";
import { url } from "./sidebar";
import { AiOutlineSearch } from "react-icons/ai";
const types = ["Micro", "Nano", "Regional", "Brewpub", "Planning", "Contract", "Closed"];

const getResults = async (search: string) => {
 try {
  const { data } = await axios.get(`https://api.openbrewerydb.org/breweries/autocomplete?query=${search}`);
  return data.slice(0, 5);
 } catch (err) {
  return undefined;
 }
};

const Autocomplete: FC<any> = ({ setFetchedAll, type, setPlaces, setCenter }) => {
 const [loading, setLoading] = useState<boolean | null>(null);
 const [showResults, setShowResults] = useState(false);
 const [results, setResults] = useState<Brewery[] | string[] | undefined>();

 // Get results waiting one second after a key is pressed.
 const debouncedSearch = useMemo(
  () =>
   debounce(async (criteria) => {
    if (type == "name") {
     setResults(await getResults(criteria));
    } else {
     setResults(types);
    }
   }, 1000),
  []
 );

 async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
  setLoading(true);
  setShowResults(true);
  debouncedSearch(e.target.value);
  setLoading(false);
 }

 const handleClick = async (brewery: Brewery | string) => {
  try {
   let data;
   setShowResults(false);

   if ((brewery as Brewery).name?.length == 0 || (brewery as string)?.length == 0) {
    setPlaces([]);
    return;
   }

   if (type == "name") {
    const { data: res } = await axios.get(`https://api.openbrewerydb.org/breweries/search?query=${(brewery as Brewery).name}`);
    const { data: near } = await axios.get(`${url}&by_dist=${res[0].latitude},${res[0].longitude}`);
    data = near;
   } else {
    console.log(`${url}&by_type=${(brewery as string).toLowerCase()}`);
    const { data: type } = await axios.get(`${url}&by_type=${(brewery as string).toLowerCase()}`);
    data = type;
   }

   setPlaces(data);
   if (data.length > 0) {
    setCenter([Number(data[0].latitude), Number(data[0].longitude)]);
    const sidebar = document.querySelector(".sidebar");
    sidebar?.scrollTo({ top: 0, behavior: "smooth" });
   }

   if (data.length < 25) {
    setFetchedAll(true);
   } else {
    setFetchedAll(false);
   }
  } catch (err) {
   console.log(err);
  }
 };

 return (
  <div onMouseLeave={() => setShowResults(false)} className="autocomplete">
   <div className="input">
    <label htmlFor="autocomplete-search">Search autocomlete</label>
    <AiOutlineSearch />
    <input
     autoComplete="off"
     autoFocus={true}
     type="text"
     name="search-brewery"
     id="autocomplete-search"
     placeholder={type == "name" ? "Find a brewery" : "Search by type"}
     onChange={handleChange}
    />
   </div>
   <div className="ac-results">
    {!showResults ? null : loading ? (
     <button>Loading...</button>
    ) : results ? (
     results.map((r) => {
      return <button onClick={(e) => handleClick(r)}>{(r as any).name ?? r}</button>;
     })
    ) : loading == false ? (
     <button>No results found...</button>
    ) : null}
   </div>
  </div>
 );
};

export default Autocomplete;
