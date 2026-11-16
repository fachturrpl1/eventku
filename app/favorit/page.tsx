import type { Metadata } from "next";
import DaftarFavorit from "@/components/DaftarFavorit";

export const metadata: Metadata = {
  title: "Favorit",
};

export default function Favorit() {
    return (
        <div className="">
            <h1 className="mb-4 text-2xl font-bold">Event Favorit</h1>
            <DaftarFavorit></DaftarFavorit>
        </div>
    );
}