import type { NextPage } from "next";
import { useState, useEffect, useLayoutEffect } from "react";
import { Brewery } from "../types";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import Sidebar from "../components/sidebar";
import Map from "../components/map";

const Home: NextPage = () => {
 const [open, setOpen] = useState(true);
 const [mobile, setMobile] = useState(false);
 const [center, setCenter] = useState<number[]>([0, 0]);
 const [places, setPlaces] = useState<Brewery[] | undefined>();

 // Set height for sidebar and map;
 useLayoutEffect(() => {
  const header = document.getElementsByTagName("header")?.item(0);
  if (header) {
   const container = document.getElementById("container") as any;
   if (container) {
    container.style.marginTop = `${header.offsetHeight}px`;
    container.style.height = `${window.innerHeight - header.offsetHeight}px`;
   }
  }
 }, []);

 // Open sidebar based on window's width
 useEffect(() => {
  if (window) {
   setOpen(window.innerWidth > 481);
   setMobile(window.innerWidth <= 481);
  }
 }, []);

 return (
  <>
   <header>
    <div>
     {open ? <AiOutlineClose onClick={() => setOpen(false)} /> : <AiOutlineMenu onClick={() => setOpen(true)} />}
     <span>BrewBuddy</span>
    </div>
   </header>
   <div id="container">
    <Sidebar
     center={center}
     setOpen={setOpen}
     initialMobile={mobile}
     open={open}
     places={places}
     setPlaces={setPlaces}
     setCenter={setCenter}
    />
    <div id="google-map">
     <Map places={places} center={center} />
    </div>
   </div>
  </>
 );
};

export default Home;
