"use client"; 

import { useRouter } from "next/navigation"; 

import PLogin from "./login/page"; 
export default function HomePage() { 
  return ( 
    <div> 
       <PLogin /> 
    </div> 
  ); 

}